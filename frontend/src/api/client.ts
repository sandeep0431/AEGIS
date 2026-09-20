// VITE_API_BASE_URL must be set in .env (dev) or .env.production (prod).
// A missing value causes an explicit runtime error rather than silently
// calling localhost, which would make misconfiguration invisible.
const _rawApiUrl = import.meta.env.VITE_API_BASE_URL;
if (!_rawApiUrl) {
  throw new Error(
    "[client] VITE_API_BASE_URL is not set. " +
    "Create frontend/.env.production with the production API URL, " +
    "or frontend/.env for local development."
  );
}
const API_BASE_URL: string = _rawApiUrl.replace(/\/$/, "");

export interface ImpersonationInfo {
  detected: boolean;
  claimed_identity?: string;
  message?: string;
}

export interface ScanResult {
  type: "url" | "message";
  url?: string;
  message_snippet?: string;
  risk_level: "safe" | "low" | "medium" | "high" | "critical";
  risk_score: number;
  is_suspicious: boolean;
  signals: string[];
  recommendation: string;
  confidence: number;
  prediction?: "PHISHING" | "LEGITIMATE" | string;       // "PHISHING" | "LEGITIMATE" from backend classifier
  impersonation?: ImpersonationInfo;
}

export interface AssistantResponse {
  answer: string;
  grounded: boolean;
  note?: string;
  error?: string;
}

export interface PasswordCheckResult {
  compromised: boolean;
  count: number;
}

export interface SafetyScoreResult {
  score: number;
  label: string;
  summary: string;
  breakdown: {
    url_safety: number;
    message_safety: number;
    credential_safety?: number | null;
    exposure_safety?: number;
  };
}

async function request<T>(endpoint: string, method: string = "GET", body?: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (!json.success) {
      throw new Error(json.error?.message || "Security API request failed");
    }

    return json.data as T;
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export async function checkHealth() {
  return request<{ status: string; service: string }>("/health");
}

export async function scanUrl(url: string): Promise<ScanResult> {
  return request<ScanResult>("/scan/url", "POST", { url });
}

export async function scanMessage(message: string): Promise<ScanResult> {
  return request<ScanResult>("/scan/message", "POST", { message });
}

export async function askAssistant(question: string, context?: any): Promise<AssistantResponse> {
  return request<AssistantResponse>("/assistant", "POST", { question, context });
}

export async function checkPasswordExposure(prefix: string, suffix: string): Promise<PasswordCheckResult> {
  return request<PasswordCheckResult>("/password-check", "POST", { prefix, suffix });
}

export async function getSecurityScore(
  url_risk: number = 0,
  message_risk: number = 0,
  credential_checked: boolean = false,
  credential_compromised: boolean = false
): Promise<SafetyScoreResult> {
  return request<SafetyScoreResult>("/score", "POST", {
    url_risk,
    message_risk,
    credential_checked,
    credential_compromised
  });
}
