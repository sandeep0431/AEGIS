import re
from urllib.parse import urlparse

MAX_URL_LENGTH = 2048
MAX_MESSAGE_LENGTH = 10000

def validate_url_input(url: str) -> str:
    if not url or not isinstance(url, str):
        raise ValueError("URL must be a non-empty string.")
    
    cleaned_url = url.strip()
    if len(cleaned_url) > MAX_URL_LENGTH:
        raise ValueError(f"URL exceeds maximum allowed length of {MAX_URL_LENGTH} characters.")
    
    # Prepend http:// for parsing if scheme missing
    test_url = cleaned_url
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", test_url):
        test_url = "http://" + test_url
        
    parsed = urlparse(test_url)
    if not parsed.hostname:
        raise ValueError("Invalid URL: missing domain or host component.")
        
    return cleaned_url

def validate_message_input(message: str) -> str:
    if not message or not isinstance(message, str):
        raise ValueError("Message must be a non-empty string.")
        
    cleaned_msg = message.strip()
    if len(cleaned_msg) == 0:
        raise ValueError("Message cannot be empty or whitespace only.")
        
    if len(cleaned_msg) > MAX_MESSAGE_LENGTH:
        raise ValueError(f"Message exceeds maximum allowed length of {MAX_MESSAGE_LENGTH} characters.")
        
    return cleaned_msg

def validate_password_hash_input(prefix: str, suffix: str) -> tuple[str, str]:
    if not prefix or not isinstance(prefix, str):
        raise ValueError("Prefix must be a 5-character hexadecimal string.")
    if not suffix or not isinstance(suffix, str):
        raise ValueError("Suffix must be a 35-character hexadecimal string.")
        
    cleaned_prefix = prefix.strip().upper()
    cleaned_suffix = suffix.strip().upper()
    
    if len(cleaned_prefix) != 5 or not re.match(r"^[0-9A-F]{5}$", cleaned_prefix):
        raise ValueError("Invalid prefix: must be exactly 5 hexadecimal characters.")
        
    if len(cleaned_suffix) != 35 or not re.match(r"^[0-9A-F]{35}$", cleaned_suffix):
        raise ValueError("Invalid suffix: must be exactly 35 hexadecimal characters.")
        
    return cleaned_prefix, cleaned_suffix
