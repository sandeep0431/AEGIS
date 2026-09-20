import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from src.router import route_request

PORT = 5000

class LocalDevHandler(BaseHTTPRequestHandler):
    def _send_response(self, result):
        self.send_response(result["statusCode"])
        for k, v in result["headers"].items():
            self.send_header(k, v)
        self.end_headers()
        body_bytes = json.dumps(result["body"]).encode("utf-8")
        self.wfile.write(body_bytes)

    def do_OPTIONS(self):
        result = route_request(self.path, "OPTIONS")
        self._send_response(result)

    def do_GET(self):
        result = route_request(self.path, "GET")
        self._send_response(result)

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body_data = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            body_json = json.loads(body_data.decode("utf-8"))
        except Exception:
            body_json = {}

        result = route_request(self.path, "POST", body_json)
        self._send_response(result)

def run_server():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, LocalDevHandler)
    print(f"[SERVER] Digital Safety Local Dev Server running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
