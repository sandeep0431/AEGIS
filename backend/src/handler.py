import json
from .router import route_request

def lambda_handler(event, context):
    """
    AWS Lambda entry point for API Gateway HTTP API.
    """
    try:
        request_context = event.get("requestContext", {})
        http_info = request_context.get("http", {})
        path = event.get("rawPath") or http_info.get("path") or "/"
        method = http_info.get("method") or event.get("httpMethod") or "GET"

        body = {}
        if event.get("body"):
            try:
                body = json.loads(event["body"])
            except Exception:
                body = {}

        result = route_request(path, method, body)
        return {
            "statusCode": result["statusCode"],
            "headers": result["headers"],
            "body": json.dumps(result["body"])
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected server error occurred."
                }
            })
        }
