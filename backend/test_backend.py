import unittest
from src.router import route_request
from src.services.password_service import parse_hibp_response

class TestBackendAPI(unittest.TestCase):

    def test_health_endpoint(self):
        res = route_request("/health", "GET")
        self.assertEqual(res["statusCode"], 200)
        self.assertTrue(res["body"]["success"])
        self.assertEqual(res["body"]["data"]["status"], "ok")

    def test_scan_url_phishing(self):
        body = {"url": "http://verify-login-account-security-update-bank.com/login"}
        res = route_request("/scan/url", "POST", body)
        self.assertEqual(res["statusCode"], 200)
        data = res["body"]["data"]
        self.assertEqual(data["type"], "url")
        self.assertIn(data["risk_level"], ["high", "critical", "medium"])
        self.assertTrue(data["is_suspicious"])
        self.assertTrue(len(data["signals"]) > 0)

    def test_scan_url_benign(self):
        body = {"url": "https://google.com"}
        res = route_request("/scan/url", "POST", body)
        self.assertEqual(res["statusCode"], 200)
        data = res["body"]["data"]
        self.assertEqual(data["type"], "url")
        self.assertIn(data["risk_level"], ["safe", "low"])

    def test_scan_url_invalid(self):
        body = {"url": "not-a-valid-url-without-host"}
        res = route_request("/scan/url", "POST", body)
        self.assertIn(res["statusCode"], [200, 400])

    def test_scan_message_phishing(self):
        body = {"message": "URGENT: Your bank account has been suspended! Click here http://bit.ly/verify to verify your password immediately or account will be closed."}
        res = route_request("/scan/message", "POST", body)
        self.assertEqual(res["statusCode"], 200)
        data = res["body"]["data"]
        self.assertEqual(data["type"], "message")
        self.assertIn(data["risk_level"], ["high", "critical", "medium"])
        self.assertTrue(data["is_suspicious"])
        self.assertTrue(len(data["signals"]) > 0)

    def test_scan_message_normal(self):
        body = {"message": "Hey, let's grab coffee tomorrow at 10 AM if you're free!"}
        res = route_request("/scan/message", "POST", body)
        self.assertEqual(res["statusCode"], 200)
        data = res["body"]["data"]
        self.assertEqual(data["type"], "message")
        self.assertIn(data["risk_level"], ["safe", "low"])

    def test_assistant_endpoint(self):
        body = {
            "question": "Why is this message suspicious?",
            "context": {
                "type": "message",
                "risk_level": "high",
                "risk_score": 88,
                "signals": ["Urgency pattern", "Credential solicitation"]
            }
        }
        res = route_request("/assistant", "POST", body)
        self.assertEqual(res["statusCode"], 200)
        data = res["body"]["data"]
        self.assertTrue(len(data["answer"]) > 0)

    def test_password_check_compromised(self):
        # Known SHA-1 for "password": 5BAA6 1E4C9B93F3F0682250B6CF8331B7EE68FD8
        body = {
            "prefix": "5BAA6",
            "suffix": "1E4C9B93F3F0682250B6CF8331B7EE68FD8"
        }
        res = route_request("/password-check", "POST", body)
        self.assertEqual(res["statusCode"], 200)
        data = res["body"]["data"]
        self.assertTrue(data["compromised"])
        self.assertGreater(data["count"], 0)

    def test_password_check_uncompromised(self):
        # Unlikely suffix
        body = {
            "prefix": "5BAA6",
            "suffix": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
        }
        res = route_request("/password-check", "POST", body)
        self.assertEqual(res["statusCode"], 200)
        data = res["body"]["data"]
        self.assertFalse(data["compromised"])
        self.assertEqual(data["count"], 0)

    def test_password_check_invalid_prefix(self):
        # Invalid length or chars
        body = {"prefix": "5BA", "suffix": "1E4C9B93F3F0682250B6CF8331B7EE68FD8"}
        res = route_request("/password-check", "POST", body)
        self.assertEqual(res["statusCode"], 400)
        self.assertEqual(res["body"]["error"]["code"], "INVALID_INPUT")

    def test_password_check_invalid_suffix(self):
        # Non-hex characters in suffix
        body = {"prefix": "5BAA6", "suffix": "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"}
        res = route_request("/password-check", "POST", body)
        self.assertEqual(res["statusCode"], 400)
        self.assertEqual(res["body"]["error"]["code"], "INVALID_INPUT")

    def test_password_check_rejects_plaintext(self):
        # Request containing plaintext password must be rejected
        body = {"password": "mypassword123", "prefix": "5BAA6", "suffix": "1E4C9B93F3F0682250B6CF8331B7EE68FD8"}
        res = route_request("/password-check", "POST", body)
        self.assertEqual(res["statusCode"], 400)
        self.assertIn("Plaintext passwords are strictly prohibited", res["body"]["error"]["message"])

    def test_score_with_and_without_credential_check(self):
        # Without credential check -> credential_safety is None ("Not Checked")
        body_unchecked = {
            "url_risk": 20,
            "message_risk": 10,
            "credential_checked": False
        }
        res1 = route_request("/score", "POST", body_unchecked)
        self.assertEqual(res1["statusCode"], 200)
        data1 = res1["body"]["data"]
        self.assertIsNone(data1["breakdown"]["credential_safety"])

        # With compromised credential check
        body_compromised = {
            "url_risk": 20,
            "message_risk": 10,
            "credential_checked": True,
            "credential_compromised": True
        }
        res2 = route_request("/score", "POST", body_compromised)
        self.assertEqual(res2["statusCode"], 200)
        data2 = res2["body"]["data"]
        self.assertEqual(data2["breakdown"]["credential_safety"], 25)
        # Score must be lower than clean score
        self.assertLess(data2["score"], 90)

    def test_parse_hibp_response_unit(self):
        sample = "0018A45C4D1DEF81644B54AB7F969B88D65:1\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:52372427\n"
        matched, count = parse_hibp_response(sample, "1E4C9B93F3F0682250B6CF8331B7EE68FD8")
        self.assertTrue(matched)
        self.assertEqual(count, 52372427)

        matched, count = parse_hibp_response(sample, "00000000000000000000000000000000000")
        self.assertFalse(matched)
        self.assertEqual(count, 0)

    def test_vssut_and_legitimate_urls(self):
        legit_test_urls = [
            "https://www.vssut.ac.in/all-notice.php",
            "https://www.vssut.ac.in/",
            "https://www.google.com/",
            "https://www.microsoft.com/",
            "https://www.wikipedia.org/",
            "https://github.com/",
            "https://www.python.org/"
        ]
        for url in legit_test_urls:
            res = route_request("/scan/url", "POST", {"url": url})
            self.assertEqual(res["statusCode"], 200, f"Failed for {url}")
            data = res["body"]["data"]
            self.assertEqual(data["prediction"], "LEGITIMATE", f"Prediction should be LEGITIMATE for {url}, got {data.get('prediction')}")
            self.assertIn(data["risk_level"], ["safe", "low"], f"Risk level should be safe or low for {url}, got {data['risk_level']}")
            self.assertFalse(data["is_suspicious"], f"URL {url} should not be marked suspicious")
            self.assertLessEqual(data["risk_score"], 20, f"Risk score for {url} should be <= 20, got {data['risk_score']}")

    def test_impersonation_detection(self):
        # Impersonating URL
        res = route_request("/scan/url", "POST", {"url": "http://paypal-security-update.com/login"})
        self.assertEqual(res["statusCode"], 200)
        data = res["body"]["data"]
        self.assertTrue(data.get("impersonation", {}).get("detected"))
        self.assertEqual(data["impersonation"]["claimed_identity"], "PayPal")

        # Legitimate URL - No Impersonation
        res_legit = route_request("/scan/url", "POST", {"url": "https://www.paypal.com/signin"})
        self.assertEqual(res_legit["statusCode"], 200)
        self.assertFalse(res_legit["body"]["data"].get("impersonation", {}).get("detected"))

        # Impersonating Message
        res_msg = route_request("/scan/message", "POST", {"message": "Your Netflix membership has expired! Update payment at http://netflix-billing-fix.com"})
        self.assertEqual(res_msg["statusCode"], 200)
        data_msg = res_msg["body"]["data"]
        self.assertTrue(data_msg.get("impersonation", {}).get("detected"))
        self.assertEqual(data_msg["impersonation"]["claimed_identity"], "Netflix")

if __name__ == "__main__":
    unittest.main()
