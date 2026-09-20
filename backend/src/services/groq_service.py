import requests
from ..config import GROQ_API_KEY, GROQ_MODEL

FALLBACK_MODELS = ["qwen/qwen3.8-27b", "groq/compound-mini", "openai/gpt-oss-20b"]

class GroqService:
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.model = GROQ_MODEL
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    def ask(self, question: str, context: dict = None) -> dict:
        if not question or not isinstance(question, str):
            return {
                "answer": "Please ask a valid security question.",
                "grounded": False
            }

        # Build context details if available
        context_str = "No active scan context."
        if context and isinstance(context, dict) and context.get("risk_level"):
            scan_type = context.get("type", "unknown")
            risk_level = context.get("risk_level", "unknown")
            risk_score = context.get("risk_score", "N/A")
            signals = context.get("signals", [])
            context_str = (
                f"Scan Type: {scan_type}\n"
                f"Assessed Risk Level: {risk_level} (Score: {risk_score}/100)\n"
                f"Detected Evidence Signals: {', '.join(signals) if signals else 'None'}"
            )

        system_prompt = (
            "You are Nova, an empathetic, highly knowledgeable Digital Safety & Cybersecurity Assistant.\n"
            "You help users understand online threats, suspicious links, phishing messages, account security, privacy settings, and incident response.\n"
            "GUIDELINES:\n"
            "1. Answer ANY question about digital safety, cybersecurity, scam prevention, or device security clearly and practically.\n"
            "2. If the user asks about an active scan or risk score, explain the signals based on the provided detection context below without fabricating indicators.\n"
            "3. If the user asks a general question (e.g., 'what is phishing?', 'what should I do if I clicked a scam link?', 'how do I protect my passwords?'), answer directly, helpfully, and comprehensively.\n"
            "4. Keep explanations clear, friendly, and accessible for everyday users, offering 2-3 actionable safety tips when relevant.\n\n"
            f"DETECTION CONTEXT (reference only if relevant to the question):\n{context_str}"
        )

        if not self.api_key:
            # Fallback explanation if API key is not configured locally
            return {
                "answer": (
                    f"**Security Guidance for your query:**\n\n"
                    "**Key Recommendations:**\n"
                    "1. Avoid clicking suspicious links or downloading unverified attachments.\n"
                    "2. Verify unexpected requests through official communication channels (e.g. calling customer support directly).\n"
                    "3. Never share passwords, OTP codes, or personal banking credentials via message or email."
                ),
                "grounded": True,
                "note": "Groq API key not configured; using offline safety advice engine."
            }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        # Try configured model, and fall back if the model does not exist on Groq
        models_to_try = [self.model] + [m for m in FALLBACK_MODELS if m != self.model]

        last_error = None
        for model_name in models_to_try:
            payload = {
                "model": model_name,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                "max_tokens": 500,
                "temperature": 0.4
            }

            try:
                resp = requests.post(self.api_url, json=payload, headers=headers, timeout=10)
                if resp.status_code == 200:
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    return {
                        "answer": content,
                        "grounded": True,
                        "model": model_name
                    }
                elif resp.status_code == 404:
                    # Model not found or deprecated, try next fallback
                    last_error = f"Model {model_name} not found on Groq (404)"
                    continue
                else:
                    last_error = f"API returned status {resp.status_code}: {resp.text}"
            except Exception as e:
                last_error = str(e)

        return {
            "answer": "Unable to contact security assistant service right now. Please try again later.",
            "grounded": False,
            "error": last_error
        }
