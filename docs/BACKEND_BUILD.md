# BACKEND_BUILD.md

# AI-Powered Digital Safety Platform --- AWS Serverless Backend

## 1. Objective

Build a lightweight, serverless cybersecurity backend using AWS services
that are appropriate for a student/hackathon prototype and keep
recurring usage as close to the AWS Free Tier/free-plan limits as
practical.

Core product features only:

1.  URL Checker
2.  Suspicious Message Checker
3.  Groq Security Assistant
4.  Free HIBP Password Safety Check (k-anonymity)
5.  Digital Safety Score

Do NOT add a sixth major product feature or unnecessary backend
services.

------------------------------------------------------------------------

## 2. Target Architecture

``` text
React / Framer Frontend
        |
        | HTTPS JSON
        v
Amazon API Gateway HTTP API
        |
        v
AWS Lambda
        |
        +------------------------+
        |                        |
        v                        v
URL Model                 Message Model
Random Forest             TF-IDF + Logistic Regression
        |                        |
        +-----------+------------+
                    |
                    v
             Unified Risk Engine
                    |
          +---------+---------+
          |                   |
          v                   v
       Groq API           HIBP API
          |                   |
          +---------+---------+
                    |
                    v
             Security Score
                    |
                    v
             DynamoDB (optional
             history only)

AWS CloudWatch
       |
       +--> logs / errors / metrics
```

Frontend hosting can use AWS Amplify Hosting.

------------------------------------------------------------------------

## 3. AWS Services

### Required

  AWS Service                   Purpose
  ----------------------------- ----------------------------------------
  Amazon API Gateway HTTP API   Public HTTPS API
  AWS Lambda                    Serverless backend and model inference
  Amazon CloudWatch             Logs, errors and monitoring
  AWS IAM                       Least-privilege permissions
  AWS Amplify Hosting           Frontend deployment

### Optional

  Service           Purpose
  ----------------- ------------------------------------------------------
  Amazon DynamoDB   Lightweight scan/history storage
  Amazon S3         Only if model artifacts/assets need external storage

Do not introduce EC2, RDS, SageMaker, ECS/Fargate, OpenSearch, Bedrock,
or WAF for the MVP. They add complexity/cost and are not required for
the hackathon prototype.

------------------------------------------------------------------------

## 4. Free-Tier Design Rules

AWS pricing/free-tier terms can change. Verify the current
account-specific limits before deployment.

The architecture is intentionally serverless and low-volume.

Current official AWS pages indicate: - Lambda includes a monthly free
tier of 1 million requests and 400,000 GB-seconds. - API Gateway HTTP
APIs include 1 million API calls/month under the applicable free-tier
terms. - DynamoDB has a free tier with provisioned capacity and storage
allowances. - Amplify Hosting has free allowances for eligible
accounts/usage. - CloudWatch provides a free allowance for
logs/monitoring.

These limits are usage/account/plan dependent. Do not treat them as a
guarantee of a zero bill.

### Cost-control rules

-   Use one API Gateway HTTP API.
-   Use one primary Lambda function initially.
-   Keep Lambda memory modest.
-   Do not enable provisioned concurrency.
-   Do not use NAT Gateway.
-   Do not deploy a VPC unless required.
-   Keep CloudWatch log retention limited.
-   Do not enable expensive WAF/advanced monitoring for the MVP.
-   Store only minimal DynamoDB records.
-   Never log complete user messages, emails, credentials, or sensitive
    tokens.
-   Never log API keys.
-   Avoid storing raw submitted URLs/messages unless explicitly
    required.

------------------------------------------------------------------------

## 5. Backend Runtime

Recommended:

``` text
Python 3.12 Lambda
```

Suggested structure:

``` text
backend/
├── src/
│   ├── handler.py
│   ├── router.py
│   ├── models/
│   │   ├── url_detector.py
│   │   └── message_detector.py
│   ├── services/
│   │   ├── groq_service.py
│   │   ├── hibp_service.py
│   │   └── score_service.py
│   ├── utils/
│   │   ├── validation.py
│   │   ├── response.py
│   │   └── privacy.py
│   └── config.py
├── model_artifacts/
│   ├── phishing_model.pkl
│   ├── feature_names.pkl
│   ├── message_model_metadata.pkl
│   ├── message_feature_names.pkl
│   └── message_vectorizer.pkl
├── requirements.txt
├── template.yaml
└── README.md
```

Use the actual model filenames available in the project. Do not rename
artifacts without updating the loader.

------------------------------------------------------------------------

# 6. Model Integration

## URL Model

Existing URL phishing model:

``` text
Input URL
   ↓
Feature extraction
   ↓
Existing trained Random Forest model
   ↓
Risk probability / class
   ↓
Risk level + evidence
```

The backend must use the already-trained model rather than retraining on
every request.

### URL response

``` json
{
  "type": "url",
  "risk_level": "high",
  "risk_score": 87,
  "is_suspicious": true,
  "signals": [
    "Suspicious URL structure",
    "Domain-related anomaly"
  ],
  "recommendation": "Do not enter credentials or payment information."
}
```

Do not invent signals. Signals must come from actual model/features or
deterministic security rules implemented by the project.

------------------------------------------------------------------------

# 7. Message Model

Existing message classifier:

``` text
Message
   ↓
Cleaning / preprocessing
   ↓
TF-IDF vectorizer
   ↓
Security feature extraction
   ↓
Logistic Regression model
   ↓
Classification
   ↓
Risk result
```

Load the vectorizer/model once per Lambda execution environment where
possible.

Do not retrain inside Lambda.

### Message response

``` json
{
  "type": "message",
  "risk_level": "high",
  "risk_score": 91,
  "is_suspicious": true,
  "signals": [
    "Urgency pattern",
    "Credential-request pattern"
  ],
  "recommendation": "Verify the request through an official channel."
}
```

Again, signals must be evidence-based.

------------------------------------------------------------------------

# 8. Unified Risk Engine

Create one common internal schema.

``` python
{
    "risk_level": "safe | low | medium | high | critical",
    "risk_score": 0-100,
    "is_suspicious": True/False,
    "signals": [],
    "recommendation": "",
    "confidence": 0.0-1.0
}
```

### Suggested mapping

``` text
0–24     Safe
25–49    Low
50–69    Medium
70–89    High
90–100   Critical
```

This mapping is a product convention, not a security standard.

Do not present the score as a guaranteed probability of compromise.

------------------------------------------------------------------------

# 9. API Endpoints

Use API Gateway HTTP API.

## GET /health

Response:

``` json
{
  "status": "ok",
  "service": "digital-safety-api"
}
```

------------------------------------------------------------------------

## POST /scan/url

Request:

``` json
{
  "url": "https://example.com"
}
```

Flow:

``` text
Validate
→ normalize
→ extract features
→ URL model
→ risk engine
→ response
```

------------------------------------------------------------------------

## POST /scan/message

Request:

``` json
{
  "message": "Suspicious message text..."
}
```

Flow:

``` text
Validate
→ preprocess
→ vectorize
→ message model
→ risk engine
→ response
```

------------------------------------------------------------------------

## POST /assistant

Request:

``` json
{
  "question": "Why does this message look suspicious?",
  "context": {
    "type": "message",
    "risk_level": "high",
    "signals": [
      "Urgency pattern"
    ]
  }
}
```

Flow:

``` text
Validate
→ sanitize context
→ construct grounded prompt
→ Groq API
→ response
```

The assistant explains model evidence. It must not override a model
result without evidence.

------------------------------------------------------------------------

## POST /password-check

Free Have I Been Pwned (HIBP) Pwned Passwords Check using SHA-1 k-anonymity.

- **Free HIBP Pwned Passwords API**: No API key required.
- **SHA-1 k-anonymity**: The client hashes the password locally via Web Crypto API (`crypto.subtle.digest("SHA-1", ...)`).
- **First 5 hash characters sent to HIBP**: Only the 5-character uppercase prefix is sent to `https://api.pwnedpasswords.com/range/{prefix}` with `User-Agent: CyberSafetyPlatform/1.0`.
- **Full password never sent**: Plaintext passwords are never sent to Lambda, API Gateway, DynamoDB, or HIBP. Any request containing a `password` field is rejected immediately (HTTP 400).
- **Comparison**: Backend compares the 35-character suffix against returned hash suffixes and returns compromise status and breach count.
- **Zero Persistence**: No passwords, hashes, prefixes, or suffixes are saved to DynamoDB or logged to CloudWatch.

Request:

``` json
{
  "prefix": "5BAA6",
  "suffix": "1E4C9B93F3F0682250B6CF8331B7EE68FD8"
}
```

Response (Compromised):

``` json
{
  "success": true,
  "data": {
    "compromised": true,
    "count": 52372427
  }
}
```

Response (Clean / Not Found):

``` json
{
  "success": true,
  "data": {
    "compromised": false,
    "count": 0
  }
}
```

Error Handling:
- 403 from HIBP: `HIBP request was rejected. Check User-Agent configuration.`
- 429 from HIBP: `HIBP service is temporarily unavailable. Please try again.`
- Timeout: `Password exposure service is temporarily unavailable.`

------------------------------------------------------------------------

## POST /score

Request:

``` json
{
  "url_risk": 20,
  "message_risk": 10,
  "exposure_level": "none"
}
```

Response:

``` json
{
  "score": 84,
  "label": "Good",
  "breakdown": {
    "url_safety": 90,
    "message_safety": 95,
    "exposure": 70
  }
}
```

The frontend can also calculate a display-only score from already
returned backend values. The authoritative score logic should live in
the backend so the formula cannot be changed by the browser.

------------------------------------------------------------------------

# 10. Groq Integration

Groq must only be called from Lambda.

Never put:

``` text
GROQ_API_KEY
```

in React/Vite public environment variables.

Correct:

``` text
Browser
   ↓
API Gateway
   ↓
Lambda
   ↓
Groq
```

Incorrect:

``` text
Browser
   ↓
Groq API directly
```

Use a Lambda environment variable:

``` text
GROQ_API_KEY
GROQ_MODEL
```

The exact Groq model should be configurable rather than hard-coded
throughout the application.

------------------------------------------------------------------------

# 11. HIBP Integration

Use Lambda as the proxy.

``` text
Frontend
   ↓
API Gateway
   ↓
Lambda
   ↓
HIBP
```

Environment variable:

``` text
HIBP_API_KEY
```

Only use the endpoint permitted by the available HIBP account/API plan.

Do not claim that every HIBP breach endpoint is free.

------------------------------------------------------------------------

# 12. DynamoDB

DynamoDB is optional.

Use it only if the project needs:

-   Anonymous scan history
-   Aggregated usage statistics
-   Security-score history

Do not store raw sensitive inputs by default.

Suggested table:

``` text
DigitalSafetyHistory
```

Partition key:

``` text
session_id
```

Sort key:

``` text
timestamp
```

Example item:

``` json
{
  "session_id": "anonymous-session-id",
  "timestamp": "2026-09-17T10:30:00Z",
  "scan_type": "url",
  "risk_level": "high",
  "risk_score": 87
}
```

Do not store:

``` text
raw_message
password
credential
HIBP API response
GROQ API key
```

unless there is an explicit, justified requirement.

------------------------------------------------------------------------

# 13. Privacy

### Never log

-   Passwords
-   API keys
-   Full authentication tokens
-   Full submitted messages
-   Sensitive personal identifiers
-   Full breach records

### Prefer logs like

``` text
scan_type=url
risk_level=high
latency_ms=182
status=success
```

------------------------------------------------------------------------

# 14. CORS

API Gateway should allow only the deployed frontend origin.

Development:

``` text
http://localhost:5173
```

Production:

``` text
https://YOUR-FRONTEND-DOMAIN
```

Do not use:

``` text
Access-Control-Allow-Origin: *
```

in the final production deployment unless there is a specific reason.

------------------------------------------------------------------------

# 15. Validation

Implement:

### URL

-   Must have valid scheme
-   Normalize safely
-   Reject oversized input
-   Limit length
-   Avoid dangerous parsing assumptions

### Message

-   Maximum request size
-   Reject empty messages
-   Normalize Unicode where appropriate
-   Avoid arbitrary code execution

### Email

-   Basic format validation
-   Maximum length
-   Do not expose it in logs

------------------------------------------------------------------------

# 16. Error Contract

All endpoints should return a consistent format.

``` json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "The security check could not be completed."
  }
}
```

Do not expose:

-   Python stack traces
-   API keys
-   internal paths
-   AWS request internals
-   model filesystem paths

------------------------------------------------------------------------

# 17. Lambda Performance

Important:

-   Load models outside the handler.
-   Reuse HTTP connections where possible.
-   Avoid downloading models during every invocation.
-   Avoid large temporary files.
-   Keep response payloads small.
-   Set reasonable timeouts for Groq/HIBP.
-   Use deterministic preprocessing.
-   Do not perform model training in Lambda.

Example pattern:

``` python
url_model = load_url_model()
message_model = load_message_model()
message_vectorizer = load_vectorizer()

def lambda_handler(event, context):
    ...
```

------------------------------------------------------------------------

# 18. Observability

Use CloudWatch for:

-   Lambda errors
-   API failures
-   latency
-   invocation count
-   model inference failures
-   external API failures

Use structured logs.

Example:

``` json
{
  "event": "url_scan",
  "status": "success",
  "risk_level": "high",
  "latency_ms": 173
}
```

Do not log raw user content.

------------------------------------------------------------------------

# 19. IAM

Use least privilege.

Lambda should only have:

``` text
logs:CreateLogGroup
logs:CreateLogStream
logs:PutLogEvents
```

If DynamoDB is enabled:

``` text
dynamodb:GetItem
dynamodb:PutItem
dynamodb:Query
```

only on the required table.

Do not attach:

``` text
AdministratorAccess
```

to Lambda.

------------------------------------------------------------------------

# 20. Deployment Strategy

Recommended:

``` text
GitHub
   ↓
AWS Amplify
   ↓
React frontend

API Gateway
   ↓
Lambda
   ↓
Models + external security APIs
```

For the hackathon MVP, manual deployment is acceptable. CI/CD can be
added after the first successful deployment.

------------------------------------------------------------------------

# 21. Backend Completion Checklist

-   [ ] Lambda created
-   [ ] Python runtime configured
-   [ ] Model artifacts packaged
-   [ ] URL model inference works
-   [ ] Message model inference works
-   [ ] Groq backend call works
-   [ ] HIBP backend call works
-   [ ] Security score endpoint works
-   [ ] API Gateway HTTP API connected
-   [ ] CORS configured
-   [ ] Environment variables configured
-   [ ] CloudWatch logs working
-   [ ] IAM permissions minimized
-   [ ] Sensitive data removed from logs
-   [ ] Error responses standardized
-   [ ] Production endpoint tested
