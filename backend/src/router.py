import time
from .utils.validation import validate_url_input, validate_message_input, validate_password_hash_input
from .utils.response import success_response, error_response
from .utils.privacy import sanitize_log_event
from .models.url_detector import URLDetector
from .models.message_detector import MessageDetector
from .services.groq_service import GroqService
from .services.hibp_service import HIBPService
from .services.password_service import check_pwned_password, PasswordServiceError
from .services.score_service import compute_security_score

# Preload models warm in memory
URL_DETECTOR = URLDetector()
MESSAGE_DETECTOR = MessageDetector()
GROQ_SERVICE = GroqService()
HIBP_SERVICE = HIBPService()

def route_request(path: str, method: str, body: dict = None) -> dict:
    method = method.upper()
    
    if method == "OPTIONS":
        return success_response({"message": "CORS preflight OK"})

    if path == "/health" and method == "GET":
        return success_response({
            "status": "ok",
            "service": "digital-safety-api",
            "version": "1.0.0"
        })

    if path == "/scan/url" and method == "POST":
        start_t = time.time()
        url = body.get("url") if body else None
        try:
            valid_url = validate_url_input(url)
            result = URL_DETECTOR.analyze(valid_url)
            latency = int((time.time() - start_t) * 1000)
            log_payload = sanitize_log_event("url_scan", "success", result["risk_level"], latency)
            print(f"CLOUDWATCH_LOG: {log_payload}")
            return success_response(result)
        except ValueError as e:
            return error_response("INVALID_INPUT", str(e), 400)
        except Exception as e:
            return error_response("DETECTION_ERROR", "The URL security check could not be completed.", 500)

    if path == "/scan/message" and method == "POST":
        start_t = time.time()
        msg = body.get("message") if body else None
        try:
            valid_msg = validate_message_input(msg)
            result = MESSAGE_DETECTOR.analyze(valid_msg)
            latency = int((time.time() - start_t) * 1000)
            log_payload = sanitize_log_event("message_scan", "success", result["risk_level"], latency)
            print(f"CLOUDWATCH_LOG: {log_payload}")
            return success_response(result)
        except ValueError as e:
            return error_response("INVALID_INPUT", str(e), 400)
        except Exception as e:
            return error_response("DETECTION_ERROR", "The message security check could not be completed.", 500)

    if path == "/assistant" and method == "POST":
        start_t = time.time()
        question = body.get("question") if body else None
        context = body.get("context") if body else None
        try:
            if not question:
                return error_response("INVALID_INPUT", "Question is required.", 400)
            result = GROQ_SERVICE.ask(question, context)
            latency = int((time.time() - start_t) * 1000)
            log_payload = sanitize_log_event("groq_assistant", "success", "none", latency)
            print(f"CLOUDWATCH_LOG: {log_payload}")
            return success_response(result)
        except Exception as e:
            return error_response("ASSISTANT_ERROR", "The security assistant is temporarily unavailable.", 500)

    if path == "/password-check" and method == "POST":
        start_t = time.time()
        if body and "password" in body:
            return error_response("INVALID_INPUT", "Plaintext passwords are strictly prohibited. Send only k-anonymity hash prefix and suffix.", 400)
        
        prefix = body.get("prefix") if body else None
        suffix = body.get("suffix") if body else None
        
        try:
            valid_prefix, valid_suffix = validate_password_hash_input(prefix, suffix)
            result = check_pwned_password(valid_prefix, valid_suffix)
            latency = int((time.time() - start_t) * 1000)
            log_payload = sanitize_log_event("password_check", "success", "none", latency)
            print(f"CLOUDWATCH_LOG: {log_payload}")
            return success_response(result)
        except ValueError as e:
            return error_response("INVALID_INPUT", str(e), 400)
        except PasswordServiceError as e:
            return error_response(e.code, e.message, e.status_code)
        except Exception as e:
            return error_response("SERVICE_UNAVAILABLE", "Password exposure service is temporarily unavailable.", 502)

    # Maintained for legacy compatibility
    if path == "/exposure/check" and method == "POST":
        return error_response("FEATURE_DEPRECATED", "Email breach lookup is deprecated. Use POST /password-check for privacy-preserving credential safety.", 410)

    if path == "/score" and method == "POST":
        try:
            url_risk = int(body.get("url_risk", 0)) if body else 0
            message_risk = int(body.get("message_risk", 0)) if body else 0
            credential_checked = bool(body.get("credential_checked", False)) if body else False
            credential_compromised = bool(body.get("credential_compromised", False)) if body else False
            exposure_found = body.get("exposure_found") if body and "exposure_found" in body else None
            
            result = compute_security_score(
                url_risk=url_risk,
                message_risk=message_risk,
                credential_checked=credential_checked,
                credential_compromised=credential_compromised,
                exposure_found=exposure_found
            )
            return success_response(result)
        except Exception as e:
            return error_response("SCORE_ERROR", "Could not calculate security score.", 500)

    return error_response("NOT_FOUND", f"Route {method} {path} not found.", 404)
