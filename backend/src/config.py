import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model_artifacts"

# Load .env safely (works both with python-dotenv and with zero-dependency fallback)
env_file = BASE_DIR / ".env"
try:
    from dotenv import load_dotenv
    if env_file.exists():
        load_dotenv(dotenv_path=env_file, override=True)
    else:
        load_dotenv(override=True)
except ImportError:
    # Zero-dependency fallback: parse .env directly if python-dotenv is not installed
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip("'\"")
                    if k and k not in os.environ:
                        os.environ[k] = v

# Environment Variables
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
HIBP_API_KEY = os.environ.get("HIBP_API_KEY", "")
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")

# Security Scoring Weights
SCORE_WEIGHTS = {
    "url": 0.40,
    "message": 0.30,
    "exposure": 0.30
}
