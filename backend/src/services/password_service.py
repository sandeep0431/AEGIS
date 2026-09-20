import requests

HIBP_RANGE_URL = "https://api.pwnedpasswords.com/range/{prefix}"
USER_AGENT = "CyberSafetyPlatform/1.0"

class PasswordServiceError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 502):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)

def parse_hibp_response(response_text: str, target_suffix: str) -> tuple[bool, int]:
    """
    Parses the multiline response from HIBP Pwned Passwords API.
    Each line is format: SUFFIX:COUNT
    """
    target_suffix = target_suffix.upper()
    for line in response_text.splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        parts = line.split(":", 1)
        suffix = parts[0].strip().upper()
        try:
            count = int(parts[1].strip())
        except ValueError:
            count = 0
            
        if suffix == target_suffix:
            return True, count
            
    return False, 0

def check_pwned_password(prefix: str, suffix: str) -> dict:
    """
    Queries HIBP Pwned Passwords API using k-anonymity prefix.
    Only the 5-character prefix is sent over the network.
    """
    url = HIBP_RANGE_URL.format(prefix=prefix)
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/plain"
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=8)
        
        if resp.status_code == 200:
            compromised, count = parse_hibp_response(resp.text, suffix)
            return {
                "compromised": compromised,
                "count": count
            }
        elif resp.status_code == 403:
            raise PasswordServiceError(
                "HIBP_REJECTED",
                "HIBP request was rejected. Check User-Agent configuration.",
                status_code=502
            )
        elif resp.status_code == 429:
            raise PasswordServiceError(
                "RATE_LIMITED",
                "HIBP service is temporarily busy. Please try again in a moment.",
                status_code=429
            )
        else:
            raise PasswordServiceError(
                "SERVICE_UNAVAILABLE",
                "Password exposure service is temporarily unavailable.",
                status_code=502
            )
    except requests.exceptions.Timeout:
        raise PasswordServiceError(
            "TIMEOUT",
            "Password exposure service request timed out.",
            status_code=504
        )
    except requests.exceptions.RequestException:
        raise PasswordServiceError(
            "NETWORK_ERROR",
            "Password exposure service could not be reached.",
            status_code=502
        )
