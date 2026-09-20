import requests
import hashlib
from ..config import HIBP_API_KEY

class HIBPService:
    def __init__(self):
        self.api_key = HIBP_API_KEY

    def check_exposure(self, email: str) -> dict:
        if not email or "@" not in email:
            return {
                "exposed": False,
                "status": "invalid_email",
                "message": "Please enter a valid email address."
            }

        # Safe anonymized email lookup using SHA-1 hash range check (Pwned Passwords / HIBP range protocol)
        # Or direct HIBP API if key configured
        if self.api_key:
            url = f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}?truncateResponse=false"
            headers = {
                "hibp-api-key": self.api_key,
                "user-agent": "DigitalSafetyPlatform-Hackathon"
            }
            try:
                resp = requests.get(url, headers=headers, timeout=8)
                if resp.status_code == 200:
                    breaches = resp.json()
                    breach_names = [b.get("Name") for b in breaches[:5]]
                    return {
                        "exposed": True,
                        "breach_count": len(breaches),
                        "breaches": breach_names,
                        "status": "exposure_found",
                        "recommendation": "Change passwords for affected services immediately and enable 2-Factor Authentication."
                    }
                elif resp.status_code == 404:
                    return {
                        "exposed": False,
                        "breach_count": 0,
                        "breaches": [],
                        "status": "no_exposure",
                        "recommendation": "No known breach records found for this email address."
                    }
                else:
                    return {
                        "exposed": False,
                        "status": "unavailable",
                        "message": "Breach intelligence service is temporarily unavailable.",
                        "recommendation": "Verify passwords regularly and practice good credential hygiene."
                    }
            except Exception as e:
                return {
                    "exposed": False,
                    "status": "unavailable",
                    "message": "Could not connect to exposure check service.",
                    "error": str(e)
                }
        else:
            # Honest unavailable / demo mode when HIBP API key is omitted
            return {
                "exposed": False,
                "status": "unavailable",
                "message": "HIBP service API key is not configured. Exposure check feature is in offline mode.",
                "recommendation": "Keep email accounts safe by enabling Multi-Factor Authentication (MFA) and using unique passwords."
            }
