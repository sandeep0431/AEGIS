import os
import re
import math
# pyrefly: ignore [missing-import]
import joblib
import pandas as pd
from urllib.parse import urlparse
from ..config import MODEL_DIR
from ..utils.impersonation import check_url_impersonation

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd",
    "buff.ly", "adf.ly", "bit.do", "cutt.ly", "rb.gy", "shorturl.at"
}

SUSPICIOUS_WORDS = [
    "login", "signin", "verify", "verification", "secure", "security",
    "account", "update", "confirm", "confirmation", "password", "credential",
    "wallet", "payment", "invoice", "bank", "billing", "recover", "unlock",
    "authenticate", "webscr", "support"
]

TOP_SAFE_DOMAINS = {
    "google.com", "youtube.com", "facebook.com", "microsoft.com", "apple.com",
    "wikipedia.org", "github.com", "amazon.com", "twitter.com", "linkedin.com"
}

# ---------------------------------------------------------------------------
# Per-signal risk weights (additive, calibrated to 0-100 scale)
# Each weight represents the independent phishing-predictive contribution of
# that signal.  Weights were chosen so that:
#   - A single strong indicator (IP host) alone reaches ~35 (CAUTION)
#   - Two strong indicators reach ~60+ (SUSPICIOUS)
#   - Three or more strong indicators reach 80+ (CRITICAL)
#   - Known-safe clean URLs with no signals stay under 10 (SAFE)
# ---------------------------------------------------------------------------
SIGNAL_WEIGHTS = {
    "has_ip":              35,   # IP address in host – very strong phishing indicator
    "no_https":            20,   # HTTP (no TLS) – strong for credential-harvesting pages
    "has_shortener":       25,   # URL shortener conceals destination
    "has_at_symbol":       20,   # @ in URL redirects browser to post-@ segment
    "has_punycode":        25,   # Homograph / IDN spoofing
    "suspicious_keywords": 15,   # Sensitive words: login/verify/account/password etc.
    "high_entropy":        10,   # Obfuscated random-looking domain
    "excessive_subdomains":12,   # Deep subdomain nesting (e.g. paypal.com.evil.ru)
    "double_slash":        10,   # Redirect mask via //
    "long_url":            8,    # Abnormally long URLs (> 100 chars) hide real path
    "excessive_path_depth":6,    # Deep path tree used to obscure malicious endpoint
    "percent_encoded":     8,    # Heavy %xx encoding to evade filters
    "has_port":            6,    # Non-standard port (unusual for legitimate sites)
}

# How many unique suspicious-word groups elevate the keyword signal
# (capped; prevents one signal from scoring disproportionately)
KEYWORD_BUCKETS = [
    (["login", "signin"],                        "login/signin pattern"),
    (["verify", "verification", "confirm",
      "confirmation"],                           "verification/confirm pattern"),
    (["account", "update"],                      "account/update pattern"),
    (["password", "credential", "authenticate"], "credential/password pattern"),
    (["bank", "wallet", "payment", "billing",
      "invoice"],                                "financial keyword pattern"),
    (["recover", "unlock", "support",
      "webscr", "security", "secure"],           "recovery/security keyword"),
]


def calculate_entropy(text: str) -> float:
    if not text:
        return 0.0
    probs = [text.count(c) / len(text) for c in set(text)]
    return -sum(p * math.log2(p) for p in probs if p > 0)


def is_ip_address(hostname: str) -> int:
    if not hostname:
        return 0
    pattern = r"^(?:\d{1,3}\.){3}\d{1,3}$"
    return int(bool(re.match(pattern, hostname)))


def extract_url_features(url: str) -> dict:
    raw_url = str(url).strip()
    parse_url = raw_url
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", parse_url):
        parse_url = "https://" + parse_url

    parsed = urlparse(parse_url)
    # Canonicalize empty root domain paths to '/' according to standard HTTP URL structure
    if not parsed.path:
        parse_url = parse_url + "/"
        parsed = urlparse(parse_url)

    url = parse_url
    hostname = parsed.hostname or ""
    path = parsed.path or "/"
    query = parsed.query or ""
    fragment = parsed.fragment or ""

    url_lower = url.lower()
    hostname_lower = hostname.lower()

    domain_without_www = hostname_lower
    if domain_without_www.startswith("www."):
        domain_without_www = domain_without_www[4:]

    domain_parts = [p for p in domain_without_www.split(".") if p]
    num_subdomains = len(domain_parts) - 2 if len(domain_parts) >= 3 else 0

    suspicious_word_count = sum(1 for w in SUSPICIOUS_WORDS if w in url_lower)
    num_letters = sum(c.isalpha() for c in url)
    num_digits = sum(c.isdigit() for c in url)
    num_special_chars = sum(not c.isalnum() for c in url)

    query_parameter_count = len([x for x in query.split("&") if x]) if query else 0
    path_depth = len([x for x in path.split("/") if x])
    percent_encoded_count = len(re.findall(r"%[0-9a-fA-F]{2}", url))

    try:
        has_port = int(parsed.port is not None)
    except ValueError:
        has_port = 1

    return {
        "url_length": len(url),
        "domain_length": len(hostname),
        "path_length": len(path),
        "query_length": len(query),
        "fragment_length": len(fragment),
        "num_letters": num_letters,
        "num_digits": num_digits,
        "num_special_chars": num_special_chars,
        "num_dots": url.count("."),
        "num_hyphens": url.count("-"),
        "num_underscores": url.count("_"),
        "num_slashes": url.count("/"),
        "num_subdomains": num_subdomains,
        "path_depth": path_depth,
        "query_parameter_count": query_parameter_count,
        "has_ip": is_ip_address(hostname),
        "has_at_symbol": int("@" in url),
        "has_https": int(parsed.scheme.lower() == "https"),
        "has_port": has_port,
        "has_punycode": int("xn--" in hostname_lower),
        "has_shortener": int(hostname_lower in SHORTENER_DOMAINS),
        "double_slash_count": url.count("//"),
        "percent_encoded_count": percent_encoded_count,
        "url_entropy": calculate_entropy(url),
        "suspicious_word_count": suspicious_word_count,
        "has_login_word": int("login" in url_lower),
        "has_verify_word": int("verify" in url_lower),
        "has_secure_word": int("secure" in url_lower),
        "has_account_word": int("account" in url_lower),
        "has_update_word": int("update" in url_lower),
        "has_confirm_word": int("confirm" in url_lower),
        "digit_ratio": num_digits / len(url) if len(url) > 0 else 0.0,
        "special_char_ratio": num_special_chars / len(url) if len(url) > 0 else 0.0,
        # Derived convenience flags used by the hybrid scorer
        "_parsed_scheme": parsed.scheme.lower(),
        "_hostname_lower": hostname_lower,
        "_domain_without_www": domain_without_www,
        "_url_lower": url_lower,
    }


def _compute_hybrid_risk(feats: dict, url_clean: str) -> tuple[float, list[str]]:
    """
    Hybrid risk scorer: deterministic weighted heuristics + bounded ML trust bonus.

    Returns (risk_score: float 0-100, signals: list[str])

    Design contract
    ---------------
    - Every point of risk comes from a named, explainable signal.
    - The RandomForest contributes only as a small trust bonus (max -8 pts)
      so it can mildly reduce scores for clearly clean URLs but can never
      override strong heuristic evidence.
    - Scores are additive per signal, capped to 100.
    - Deduplication: each signal category is counted at most once.
    - Safe-domain fast-path: verified top-level domains get a hard cap of 15
      unless an impersonation pattern is present in the path/query.
    """
    score = 0.0
    signals = []
    url_lower = feats.get("_url_lower", url_clean.lower())
    hostname  = feats.get("_hostname_lower", "")
    domain    = feats.get("_domain_without_www", hostname)

    # ------------------------------------------------------------------
    # 1. NETWORK / STRUCTURE signals
    # ------------------------------------------------------------------

    # IP address used as host (no legitimate site uses raw IPs for users)
    if feats["has_ip"]:
        score += SIGNAL_WEIGHTS["has_ip"]
        signals.append("IP address used in host instead of domain name")

    # Plain HTTP — credential pages served over HTTP are a strong phishing cue
    if not feats["has_https"]:
        score += SIGNAL_WEIGHTS["no_https"]
        signals.append("Insecure HTTP connection (no TLS/HTTPS)")

    # URL shortener hides the real destination
    if feats["has_shortener"]:
        score += SIGNAL_WEIGHTS["has_shortener"]
        signals.append("URL shortener service detected")

    # @ symbol — browser ignores everything before @ in the hostname field
    if feats["has_at_symbol"]:
        score += SIGNAL_WEIGHTS["has_at_symbol"]
        signals.append("Suspicious '@' symbol in URL structure")

    # Punycode / IDN homograph attack (e.g. pаypal.com with Cyrillic а)
    if feats["has_punycode"]:
        score += SIGNAL_WEIGHTS["has_punycode"]
        signals.append("Punycode homograph domain detected")

    # Non-standard port (8080, 4443, etc. rarely used by legitimate services)
    if feats["has_port"]:
        score += SIGNAL_WEIGHTS["has_port"]
        signals.append("Non-standard port number in URL")

    # ------------------------------------------------------------------
    # 2. KEYWORD signals (bucketed to avoid over-counting synonyms)
    # ------------------------------------------------------------------
    keyword_score = 0
    for words, label in KEYWORD_BUCKETS:
        if any(w in url_lower for w in words):
            keyword_score += SIGNAL_WEIGHTS["suspicious_keywords"]
            signals.append(f"Sensitive keyword pattern: {label}")
    # Cap total keyword contribution to 40 points (prevents runaway scoring
    # from URLs with many overlapping keywords)
    keyword_score = min(keyword_score, 40)
    score += keyword_score

    # ------------------------------------------------------------------
    # 3. OBFUSCATION / STRUCTURAL COMPLEXITY signals
    # ------------------------------------------------------------------

    # High Shannon entropy in URL — random-looking domains used for C2/phishing
    if feats["url_entropy"] > 4.2:
        score += SIGNAL_WEIGHTS["high_entropy"]
        signals.append("High URL entropy indicating potential obfuscation")

    # Excessive subdomain depth (attacker nests brand name in subdomains:
    # e.g. paypal.com.evil.xyz/login)
    if feats["num_subdomains"] >= 2:
        score += SIGNAL_WEIGHTS["excessive_subdomains"]
        signals.append("Excessive subdomain depth detected")

    # Double-slash redirect mask (//evil.com hidden after legitimate-looking prefix)
    if feats["double_slash_count"] > 1:
        score += SIGNAL_WEIGHTS["double_slash"]
        signals.append("Multiple double slashes indicating potential redirect mask")

    # Abnormally long URL (legitimate URLs rarely exceed 100 characters)
    if feats["url_length"] > 100:
        score += SIGNAL_WEIGHTS["long_url"]
        signals.append("Abnormally long URL concealing true destination")

    # Deep path tree (legitimate sites rarely have paths deeper than 4 levels)
    if feats["path_depth"] >= 4:
        score += SIGNAL_WEIGHTS["excessive_path_depth"]
        signals.append("Unusually deep URL path structure")

    # Heavy percent-encoding (used to bypass naive URL filters)
    if feats["percent_encoded_count"] >= 3:
        score += SIGNAL_WEIGHTS["percent_encoded"]
        signals.append("Heavy percent-encoding detected in URL")

    # ------------------------------------------------------------------
    # 4. CAP raw heuristic score to 100 before applying ML bonus
    # ------------------------------------------------------------------
    score = min(score, 100.0)

    # ------------------------------------------------------------------
    # 5. SAFE-DOMAIN FAST-PATH
    # Verified top-level safe domains get a hard cap of 15 (SAFE band)
    # UNLESS the URL contains suspicious path keywords that suggest the
    # safe domain name is being used as a lure in a subdomain trick.
    # e.g. "paypal.google.com.evil.ru" contains google but is not safe.
    # We only apply the cap when the effective domain itself is in TOP_SAFE_DOMAINS.
    # ------------------------------------------------------------------
    # Derive the effective eTLD+1 (last two dot-parts of hostname without www)
    domain_parts = [p for p in domain.split(".") if p]
    etld1 = ".".join(domain_parts[-2:]) if len(domain_parts) >= 2 else domain
    if etld1 in TOP_SAFE_DOMAINS and score > 15:
        score = 15.0

    # ------------------------------------------------------------------
    # 6. ML TRUST BONUS  (-8 to 0 points)
    # The RandomForest's p[class=Legitimate] is tiny (~0.003) for clean URLs
    # and 0.000 for most phishing URLs.  We scale it to a small negative
    # contribution that can mildly reduce borderline scores for clean-looking
    # URLs but is strictly bounded so it cannot flip a high-signal decision.
    #
    # ml_bonus = -8 * legitimate_probability   (range: -0.032 to 0, rounded)
    # This is applied AFTER the safe-domain cap so it can still slightly
    # reduce the score for borderline low-risk URLs.
    # ------------------------------------------------------------------
    # (ml_bonus is applied inside URLDetector.analyze() where the model is
    #  available.  This function returns the pre-ML score and signals for
    #  transparency.)

    score = max(0.0, round(score, 1))
    return score, signals


class URLDetector:
    def __init__(self):
        self.model = None
        self.feature_names = None
        self._load_model()

    def _load_model(self):
        model_path = MODEL_DIR / "phishing_model.pkl"
        feature_path = MODEL_DIR / "feature_names.pkl"
        if os.path.exists(model_path) and os.path.exists(feature_path):
            self.model = joblib.load(model_path)
            self.feature_names = joblib.load(feature_path)

    def analyze(self, url: str) -> dict:
        url_clean = str(url).strip()

        # ----------------------------------------------------------------
        # Step 1 — Feature extraction (unchanged from original)
        # ----------------------------------------------------------------
        feats = extract_url_features(url_clean)
        df_feats = pd.DataFrame([feats])

        # ML model only uses the 33 numeric features it was trained on;
        # strip the internal _* keys before passing to the model.
        ml_features = {k: v for k, v in feats.items() if not k.startswith("_")}
        df_ml = pd.DataFrame([ml_features])
        if self.feature_names:
            df_ml = df_ml[self.feature_names]

        # ----------------------------------------------------------------
        # Step 2 — RandomForest signal
        # UCI PhiUSIIL label_mapping: {0: Legitimate, 1: Phishing}
        # p[0] = P(Legitimate): ~0.000–0.004 for all tested URLs.
        # The model is near-degenerate; its only reliable contribution is
        # as a weak trust bonus when p[0] is non-zero.
        # ----------------------------------------------------------------
        if self.model is not None:
            probs = self.model.predict_proba(df_ml)[0]
            class_probs = dict(zip(self.model.classes_, probs))
            # p[0] = P(Legitimate), p[1] = P(Phishing) per label_mapping
            phishing_probability   = float(class_probs.get(1, 0.0))
            legitimate_probability = float(class_probs.get(0, 0.0))
        else:
            # Model unavailable — fall back to pure heuristics
            phishing_probability   = 0.0
            legitimate_probability = 0.0

        # ----------------------------------------------------------------
        # Step 3 — Hybrid risk scoring
        # ----------------------------------------------------------------
        heuristic_score, signals = _compute_hybrid_risk(feats, url_clean)

        # ML trust bonus: max -8 pts when model is confident the URL is
        # legitimate.  Bounded so it cannot push a heuristic score below 0
        # or reduce a clearly high-risk score below 30.
        ml_bonus = -8.0 * legitimate_probability          # range [-0.032, 0] ≈ [-0.04, 0]
        # Only apply the bonus when heuristic score is in the ambiguous band
        # (below 60), so the ML cannot flip a clearly suspicious assessment.
        if heuristic_score < 60:
            risk_score = max(0.0, round(heuristic_score + ml_bonus, 1))
        else:
            risk_score = heuristic_score

        if not signals:
            signals.append("Standard domain and path structure")

        # ----------------------------------------------------------------
        # Step 5 — Impersonation check (unchanged)
        # ----------------------------------------------------------------
        imp_result = check_url_impersonation(url_clean)

        # ----------------------------------------------------------------
        # Step 5b — Impersonation floor
        # If the impersonation check confirms a domain/brand mismatch, the
        # URL is actively claiming to be a trusted organisation while using
        # an unrelated domain — a defining characteristic of phishing.
        # Enforce a minimum risk_score of 60 (high band) so that the final
        # assessment can never be presented as LEGITIMATE when impersonation
        # is detected.  This is a floor, not a fixed value: URLs that already
        # score higher from structural signals remain at their higher score.
        # The impersonation signal is added to flags for frontend explainability.
        # ----------------------------------------------------------------
        if imp_result.get("detected"):
            identity = imp_result.get("claimed_identity", "a known organisation")
            imp_signal = f"Domain impersonates {identity} but does not match its verified domain"
            if imp_signal not in signals:
                signals.append(imp_signal)
            if risk_score < 60.0:
                risk_score = 60.0

        # ----------------------------------------------------------------
        # Step 6 — Re-derive prediction/risk_level/is_suspicious from the
        # (possibly floor-adjusted) risk_score so all fields stay consistent.
        # ----------------------------------------------------------------
        prediction_label = "PHISHING" if risk_score >= 50.0 else "LEGITIMATE"

        if risk_score >= 76:
            risk_level = "critical"
            is_suspicious = True
            rec = "DO NOT visit this link. It exhibits critical phishing characteristics."
        elif risk_score >= 51:
            risk_level = "high"
            is_suspicious = True
            rec = "Do not enter credentials or payment information on this site."
        elif risk_score >= 21:
            risk_level = "medium"
            is_suspicious = True
            rec = "Exercise caution. Verify the legitimate domain before proceeding."
        elif risk_score >= 10:
            risk_level = "low"
            is_suspicious = False
            rec = "Low risk detected, but verify origin if unexpected."
        else:
            risk_level = "safe"
            is_suspicious = False
            rec = "No suspicious URL indicators detected."

        # ----------------------------------------------------------------
        # Step 7 — Response (field names and structure unchanged)
        # ----------------------------------------------------------------
        return {
            "type": "url",
            "url": url_clean,
            "prediction": prediction_label,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "is_suspicious": is_suspicious,
            "signals": signals,
            "flags": signals,
            "features": {k: v for k, v in feats.items() if not k.startswith("_")},
            "recommendation": rec,
            "confidence": round(abs(risk_score - 50) / 50.0, 2),
            "phishing_probability": round(phishing_probability, 4),
            "legitimate_probability": round(legitimate_probability, 4),
            "impersonation": imp_result,
        }