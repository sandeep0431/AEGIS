import re

def sanitize_log_event(event_type: str, status: str, risk_level: str = "none", latency_ms: int = 0) -> dict:
    """
    Creates privacy-safe CloudWatch log payload excluding raw user messages,
    emails, passwords, API keys, or sensitive query tokens.
    """
    return {
        "event_type": event_type,
        "status": status,
        "risk_level": risk_level,
        "latency_ms": latency_ms
    }

def mask_email(email: str) -> str:
    if "@" not in email:
        return "***"
    parts = email.split("@")
    name = parts[0]
    domain = parts[1]
    masked_name = name[0] + "***" + name[-1] if len(name) > 2 else name[0] + "***"
    return f"{masked_name}@{domain}"
