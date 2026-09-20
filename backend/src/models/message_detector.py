import os
import re
# pyrefly: ignore [missing-import]
import joblib
import pandas as pd
# pyrefly: ignore [missing-import]
from scipy.sparse import hstack
from ..config import MODEL_DIR
from ..utils.impersonation import check_message_impersonation

URGENCY_WORDS = ["urgent", "immediately", "action required", "alert", "asap", "suspend", "suspended", "warning", "expire", "expiration", "unauthorized", "locked"]
CREDENTIAL_WORDS = ["password", "login", "pin", "ssn", "verify account", "credentials", "security code", "passcode"]
ACCOUNT_WORDS = ["account", "bank", "profile", "billing", "wallet", "card", "paypal", "netflix", "amazon", "apple"]
REWARD_WORDS = ["won", "winner", "congratulations", "prize", "gift card", "reward", "free", "cash", "bonus", "claimed"]
THREAT_WORDS = ["police", "legal", "court", "warrant", "fine", "arrest", "lawsuit", "penalty"]

def extract_message_security_features(text: str) -> dict:
    t_lower = text.lower()
    words = text.split()
    word_count = len(words)
    msg_len = len(text)

    urls = re.findall(r"https?://[^\s]+|www\.[^\s]+", text, re.IGNORECASE)
    url_count = len(urls)

    emails = re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    email_count = len(emails)

    ips = re.findall(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", text)
    ip_count = len(ips)

    digit_count = sum(c.isdigit() for c in text)
    uppercase_count = sum(c.isupper() for c in text)
    exclamation_count = text.count("!")
    question_count = text.count("?")

    urgency_word_count = sum(1 for w in URGENCY_WORDS if w in t_lower)
    credential_word_count = sum(1 for w in CREDENTIAL_WORDS if w in t_lower)
    account_word_count = sum(1 for w in ACCOUNT_WORDS if w in t_lower)
    reward_word_count = sum(1 for w in REWARD_WORDS if w in t_lower)
    threat_word_count = sum(1 for w in THREAT_WORDS if w in t_lower)

    contains_otp = int(bool(re.search(r"\b(otp|one time password|code|verification code)\b", t_lower)))
    contains_click = int("click" in t_lower or "tap" in t_lower or "link" in t_lower)
    contains_verify = int("verify" in t_lower or "verification" in t_lower)
    contains_account_action = int(bool(re.search(r"\b(update account|confirm account|verify account|suspend account)\b", t_lower)))
    uppercase_ratio = uppercase_count / msg_len if msg_len > 0 else 0.0

    return {
        "message_length": msg_len,
        "word_count": word_count,
        "url_count": url_count,
        "contains_url": int(url_count > 0),
        "email_count": email_count,
        "contains_email": int(email_count > 0),
        "ip_count": ip_count,
        "contains_ip": int(ip_count > 0),
        "digit_count": digit_count,
        "uppercase_count": uppercase_count,
        "exclamation_count": exclamation_count,
        "question_count": question_count,
        "urgency_word_count": urgency_word_count,
        "credential_word_count": credential_word_count,
        "account_word_count": account_word_count,
        "reward_word_count": reward_word_count,
        "threat_word_count": threat_word_count,
        "contains_otp": contains_otp,
        "contains_click": contains_click,
        "contains_verify": contains_verify,
        "contains_account_action": contains_account_action,
        "uppercase_ratio": uppercase_ratio
    }

class MessageDetector:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.feature_names = None
        self._load_model()

    def _load_model(self):
        model_path = MODEL_DIR / "phishing_message_model.pkl"
        vec_path = MODEL_DIR / "message_vectorizer.pkl"
        fn_path = MODEL_DIR / "message_feature_names.pkl"

        if os.path.exists(model_path) and os.path.exists(vec_path):
            self.model = joblib.load(model_path)
            self.vectorizer = joblib.load(vec_path)

        if os.path.exists(fn_path):
            self.feature_names = joblib.load(fn_path)

    def analyze(self, message: str) -> dict:
        sec_feats = extract_message_security_features(message)
        signals = []

        if sec_feats["urgency_word_count"] > 0:
            signals.append("High urgency or pressure tactics detected")
        if sec_feats["credential_word_count"] > 0:
            signals.append("Sensitive credential or password solicitation pattern")
        if sec_feats["contains_account_action"] > 0 or sec_feats["contains_verify"]:
            signals.append("Account verification / suspension call to action")
        if sec_feats["contains_url"]:
            signals.append("Embedded link detected in unverified message")
        if sec_feats["contains_otp"]:
            signals.append("OTP or security code reference pattern")
        if sec_feats["reward_word_count"] > 0:
            signals.append("Prize, reward, or lottery scam indicator")
        if sec_feats["uppercase_ratio"] > 0.3 and len(message) > 20:
            signals.append("Excessive uppercase lettering for emotional influence")

        if self.model is not None and self.vectorizer is not None:
            tfidf_vec = self.vectorizer.transform([message])
            df_sec = pd.DataFrame([sec_feats])
            if self.feature_names:
                df_sec = df_sec[self.feature_names]
            
            # Combine TF-IDF features with security feature array if model expects combined input
            try:
                combined_X = hstack([tfidf_vec, df_sec.values])
                probs = self.model.predict_proba(combined_X)[0]
            except Exception:
                try:
                    probs = self.model.predict_proba(tfidf_vec)[0]
                except Exception:
                    probs = self.model.predict_proba(df_sec.values)[0]

            scam_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
            risk_score = int(round(scam_prob * 100))
        else:
            # Heuristic fallback
            risk_score = 80 if len(signals) >= 2 else 15

        if risk_score >= 90:
            risk_level = "critical"
            is_suspicious = True
            rec = "DO NOT click any links or reply with personal data. Highly likely phishing."
        elif risk_score >= 70:
            risk_level = "high"
            is_suspicious = True
            rec = "Verify the sender via an official channel before taking action."
        elif risk_score >= 50:
            risk_level = "medium"
            is_suspicious = True
            rec = "Exercise caution. Do not share credentials or sensitive details."
        elif risk_score >= 25:
            risk_level = "low"
            is_suspicious = False
            rec = "Low risk indicators found. Confirm authenticity if unexpected."
        else:
            risk_level = "safe"
            is_suspicious = False
            rec = "No suspicious message patterns detected."

        if not signals:
            signals.append("Normal conversational message structure")

        imp_result = check_message_impersonation(message)

        return {
            "type": "message",
            "message_snippet": message[:100] + ("..." if len(message) > 100 else ""),
            "risk_level": risk_level,
            "risk_score": risk_score,
            "is_suspicious": is_suspicious,
            "signals": signals,
            "recommendation": rec,
            "confidence": round(abs(risk_score - 50) / 50.0, 2),
            "impersonation": imp_result
        }
