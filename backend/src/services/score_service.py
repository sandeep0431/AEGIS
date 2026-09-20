from typing import Optional
from ..config import SCORE_WEIGHTS

def compute_security_score(
    url_risk: int = 0,
    message_risk: int = 0,
    credential_checked: bool = False,
    credential_compromised: bool = False,
    # Backward compatibility with exposure_found parameter
    exposure_found: Optional[bool] = None
) -> dict:
    """
    Computes overall Digital Safety Score (0-100) from authoritative backend results.
    Note: Risk inputs are 0-100 (where higher = higher threat risk).
    Safety scores are (100 - risk_score).
    """
    url_safety = max(0, min(100, 100 - url_risk))
    message_safety = max(0, min(100, 100 - message_risk))

    # Handle backward compatibility with exposure_found
    if exposure_found is not None:
        credential_checked = True
        credential_compromised = exposure_found

    if credential_checked:
        credential_safety = 25 if credential_compromised else 100
        w_url = SCORE_WEIGHTS.get("url", 0.40)
        w_msg = SCORE_WEIGHTS.get("message", 0.30)
        w_cred = SCORE_WEIGHTS.get("exposure", 0.30)

        overall_score = int(round(
            (url_safety * w_url) +
            (message_safety * w_msg) +
            (credential_safety * w_cred)
        ))
    else:
        credential_safety = None
        # Normalize weights between URL (55%) and Message (45%) when credential not yet checked
        overall_score = int(round(
            (url_safety * 0.55) +
            (message_safety * 0.45)
        ))

    if overall_score >= 90:
        label = "Excellent"
        summary = "Your digital safety posture is strong. Continue practicing safe link and credential hygiene."
    elif overall_score >= 75:
        label = "Good"
        summary = "Good security posture overall. Stay vigilant when entering credentials or clicking links."
    elif overall_score >= 50:
        label = "Needs Attention"
        summary = "Moderate security risk detected. Review flagged items and check your password exposure."
    elif overall_score >= 25:
        label = "High Risk"
        summary = "Significant threat risk detected in recent scans. Take recommended protective actions immediately."
    else:
        label = "Critical"
        summary = "Critical digital safety concerns identified. Immediate intervention recommended."

    return {
        "score": overall_score,
        "label": label,
        "summary": summary,
        "breakdown": {
            "url_safety": url_safety,
            "message_safety": message_safety,
            "credential_safety": credential_safety,
            # Kept for backward compatibility
            "exposure_safety": credential_safety if credential_safety is not None else 100
        },
        "weights": {
            "url_weight": "40%",
            "message_weight": "30%",
            "credential_weight": "30%"
        }
    }
