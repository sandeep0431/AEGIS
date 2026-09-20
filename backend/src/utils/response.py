from typing import Any, Dict, Optional

def success_response(data: Any, status_code: int = 200) -> Dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
        },
        "body": {
            "success": True,
            "data": data
        }
    }

def error_response(code: str, message: str, status_code: int = 400) -> Dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
        },
        "body": {
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }
    }
