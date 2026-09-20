import re
from urllib.parse import urlparse

KNOWN_BRAND_DOMAINS = [
    {"key": "paypal", "name": "PayPal", "domains": ["paypal.com"]},
    {"key": "netflix", "name": "Netflix", "domains": ["netflix.com"]},
    {"key": "amazon", "name": "Amazon", "domains": ["amazon.com", "amazon.in", "amazon.co.uk"]},
    {"key": "apple", "name": "Apple", "domains": ["apple.com", "icloud.com"]},
    {"key": "google", "name": "Google", "domains": ["google.com", "accounts.google.com"]},
    {"key": "microsoft", "name": "Microsoft", "domains": ["microsoft.com", "live.com", "outlook.com"]},
    {"key": "sbi", "name": "State Bank of India (SBI)", "domains": ["onlinesbi.sbi", "sbi.co.in"]},
    {"key": "hdfc", "name": "HDFC Bank", "domains": ["hdfcbank.com"]},
    {"key": "icici", "name": "ICICI Bank", "domains": ["icicibank.com"]},
    {"key": "chase", "name": "Chase Bank", "domains": ["chase.com"]},
    {"key": "wellsfargo", "name": "Wells Fargo", "domains": ["wellsfargo.com"]},
    {"key": "paytm", "name": "Paytm", "domains": ["paytm.com"]},
    {"key": "phonepe", "name": "PhonePe", "domains": ["phonepe.com"]},
    {"key": "facebook", "name": "Facebook", "domains": ["facebook.com", "fb.com"]},
    {"key": "instagram", "name": "Instagram", "domains": ["instagram.com"]},
    {"key": "whatsapp", "name": "WhatsApp", "domains": ["whatsapp.com"]}
]

def check_url_impersonation(url: str) -> dict:
    if not url:
        return {"detected": False}
    
    parsed = urlparse(url if "://" in url else f"https://{url}")
    hostname = (parsed.hostname or "").lower()
    if hostname.startswith("www."):
        hostname = hostname[4:]
    
    path_and_query = (parsed.path + " " + parsed.query).lower()
    
    for brand in KNOWN_BRAND_DOMAINS:
        key = brand["key"]
        has_brand_in_host = key in hostname
        has_brand_in_path = bool(re.search(rf"\b{re.escape(key)}\b", path_and_query))
        
        if has_brand_in_host or has_brand_in_path:
            is_legit = any(
                hostname == d or hostname.endswith("." + d)
                for d in brand["domains"]
            )
            if not is_legit:
                return {
                    "detected": True,
                    "claimed_identity": brand["name"],
                    "message": f"Claims to represent {brand['name']}, but the linked domain doesn't match the organization's known domain."
                }
    return {"detected": False}

def check_message_impersonation(message: str) -> dict:
    if not message:
        return {"detected": False}
        
    msg_lower = message.lower()
    urls = re.findall(r"https?://[^\s]+|www\.[^\s]+", message, re.IGNORECASE)
    
    for brand in KNOWN_BRAND_DOMAINS:
        key = brand["key"]
        name_lower = brand["name"].lower()
        
        if re.search(rf"\b{re.escape(key)}\b", msg_lower) or (key != name_lower and name_lower in msg_lower):
            if urls:
                for url in urls:
                    parsed = urlparse(url if "://" in url else f"https://{url}")
                    hostname = (parsed.hostname or "").lower()
                    if hostname.startswith("www."):
                        hostname = hostname[4:]
                    is_legit = any(
                        hostname == d or hostname.endswith("." + d)
                        for d in brand["domains"]
                    )
                    if not is_legit:
                        return {
                            "detected": True,
                            "claimed_identity": brand["name"],
                            "message": f"Claims to represent {brand['name']}, but the linked domain doesn't match the organization's known domain."
                        }
                        
    return {"detected": False}
