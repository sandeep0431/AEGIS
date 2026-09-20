# INSTRUCTIONS.md

# Master Build Instructions --- AI-Powered Digital Safety Platform

## READ THIS FIRST

Build the project as a **real working cybersecurity product**, not a
static UI demo.

The product has exactly these five core capabilities:

1.  URL Checker
2.  Suspicious Message Checker
3.  Groq Security Assistant
4.  HIBP Exposure Check
5.  Simple Security Score

Do not add a sixth major feature.

The supplied DESIGN.md is the visual source of truth.

------------------------------------------------------------------------

# 1. NON-NEGOTIABLE REQUIREMENTS

## Backend

Use:

``` text
AWS API Gateway HTTP API
        ↓
AWS Lambda
        ↓
Python ML inference
```

Optional:

``` text
DynamoDB
```

only for minimal history/score storage if actually needed.

Use:

``` text
CloudWatch
IAM
```

for monitoring and permissions.

------------------------------------------------------------------------

# 2. AWS-FIRST BUT FREE-TIER-CONSCIOUS

The architecture must demonstrate meaningful AWS usage without
unnecessarily introducing expensive services.

Required AWS components:

``` text
API Gateway
Lambda
CloudWatch
IAM
Amplify Hosting
```

Optional:

``` text
DynamoDB
```

Avoid for the MVP:

``` text
EC2
RDS
SageMaker
ECS/Fargate
NAT Gateway
OpenSearch
Bedrock
AWS WAF
ElastiCache
```

unless a later requirement specifically demands them.

The goal is a small serverless architecture suitable for a student
hackathon.

AWS free-tier/free-plan limits and credits vary by account and can
change. Verify the current limits in the AWS console before deployment.

------------------------------------------------------------------------

# 3. FRONTEND

Recommended:

``` text
React + TypeScript
Framer / Framer-compatible components
Tailwind CSS where appropriate
Motion
Lucide React
```

The visual design must follow:

``` text
Black
+
Orange
+
Deep Red
+
Large Typography
+
Large Negative Space
+
Organic Gradient Forms
```

Do not turn it into:

``` text
Neon cyberpunk
Matrix theme
Purple AI dashboard
Generic SaaS template
```

------------------------------------------------------------------------

# 4. PROJECT STRUCTURE

``` text
digital-safety-platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── handler.py
│   │   ├── router.py
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── model_artifacts/
│   ├── requirements.txt
│   ├── template.yaml
│   └── .env.example
│
├── DESIGN.md
├── BACKEND_BUILD.md
├── FRONTEND_BUILD.md
├── WORKFLOW.md
└── INSTRUCTIONS.md
```

------------------------------------------------------------------------

# 5. EXISTING ML MODELS

The project already has completed model artifacts.

Use the actual project artifacts, including the existing URL phishing
model and message model/vectorizer/feature metadata.

Known artifact categories include:

``` text
phishing model
feature_names
message_model_metadata
message_feature_names
message_vectorizer
```

Do not retrain the models during application runtime.

Do not silently replace them with a generic pretrained model.

------------------------------------------------------------------------

# 6. URL DETECTION

Pipeline:

``` text
URL
 ↓
Validation
 ↓
Feature Extraction
 ↓
Existing URL Model
 ↓
Risk Calculation
 ↓
Evidence
 ↓
Recommendation
```

The endpoint must be:

``` text
POST /scan/url
```

------------------------------------------------------------------------

# 7. MESSAGE DETECTION

Pipeline:

``` text
Message
 ↓
Preprocessing
 ↓
TF-IDF
 ↓
Security Features
 ↓
Existing Logistic Regression Model
 ↓
Risk Calculation
 ↓
Evidence
 ↓
Recommendation
```

Endpoint:

``` text
POST /scan/message
```

------------------------------------------------------------------------

# 8. GROQ ASSISTANT

Endpoint:

``` text
POST /assistant
```

The browser must never call Groq directly.

Correct:

``` text
Frontend
→ API Gateway
→ Lambda
→ Groq
```

Store:

``` text
GROQ_API_KEY
```

only on the backend.

The assistant must be grounded in actual detection results.

Example:

``` text
Risk: HIGH
Score: 87
Signals:
- suspicious URL structure
- domain anomaly
```

Then ask Groq to explain those signals.

Do not ask Groq to invent whether the URL is malicious.

------------------------------------------------------------------------

# 9. HIBP

Endpoint:

``` text
POST /exposure/check
```

Flow:

``` text
Frontend
→ API Gateway
→ Lambda
→ HIBP
```

Keep HIBP credentials backend-only.

Important:

Do not describe paid HIBP breach endpoints as universally free.

If the available account/API plan does not permit the requested lookup,
return an honest unavailable state.

------------------------------------------------------------------------

# 10. SECURITY SCORE

Endpoint:

``` text
POST /score
```

or calculate the display from authoritative backend results.

The score must have a documented formula.

Example:

``` text
URL component       40%
Message component   30%
Exposure component  30%
```

The exact weights can be configured in one backend file.

Do not hard-code scoring logic across multiple frontend components.

------------------------------------------------------------------------

# 11. API CONTRACT

All successful responses:

``` json
{
  "success": true,
  "data": {}
}
```

All failures:

``` json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message"
  }
}
```

------------------------------------------------------------------------

# 12. SECURITY

Never expose:

``` text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
GROQ_API_KEY
HIBP_API_KEY
```

in:

``` text
React code
Vite public variables
Framer client code
GitHub
browser network payloads
```

Frontend may contain:

``` text
VITE_API_BASE_URL
```

because this is only the public API URL.

------------------------------------------------------------------------

# 13. ENVIRONMENT VARIABLES

Backend:

``` text
GROQ_API_KEY=
GROQ_MODEL=
HIBP_API_KEY=
ALLOWED_ORIGIN=
DYNAMODB_TABLE=
```

Frontend:

``` text
VITE_API_BASE_URL=
```

Never commit real values.

Commit:

``` text
.env.example
```

not:

``` text
.env
```

------------------------------------------------------------------------

# 14. LOCAL DEVELOPMENT

Before AWS deployment, run the backend locally.

Test:

``` text
GET /health
POST /scan/url
POST /scan/message
POST /assistant
POST /exposure/check
POST /score
```

Create automated tests for:

-   valid URL
-   invalid URL
-   suspicious URL
-   safe URL
-   phishing message
-   normal message
-   invalid email
-   Groq failure
-   HIBP failure
-   malformed request

------------------------------------------------------------------------

# 15. AWS DEPLOYMENT

Recommended sequence:

``` text
1. Create AWS account/free plan or use existing eligible account
2. Select one AWS Region
3. Create Lambda
4. Package Python dependencies + model artifacts
5. Create API Gateway HTTP API
6. Connect routes to Lambda
7. Configure CORS
8. Configure Lambda environment variables
9. Configure IAM
10. Test endpoints
11. Check CloudWatch logs
12. Deploy frontend using Amplify
13. Set VITE_API_BASE_URL
14. Test production flow
```

Keep frontend and backend in the same AWS Region where practical.

------------------------------------------------------------------------

# 16. LAMBDA PACKAGING

First attempt:

``` text
Lambda ZIP + dependencies + model artifacts
```

If dependency packaging becomes too large:

``` text
Lambda Layer
```

If still necessary:

``` text
Lambda container image
+
Amazon ECR
```

Do not choose containers first just because they are available.

Use the smallest deployment method that reliably supports the existing
models.

------------------------------------------------------------------------

# 17. MODEL LOADING

Load models outside the Lambda handler:

``` python
URL_MODEL = load_url_model()
MESSAGE_MODEL = load_message_model()
VECTORISER = load_vectorizer()
```

Then:

``` python
def lambda_handler(event, context):
    # route request
```

This allows warm Lambda environments to reuse the loaded models.

------------------------------------------------------------------------

# 18. CLOUDWATCH

Log:

``` text
request route
status
latency
risk category
external service status
```

Do not log:

``` text
raw messages
emails
passwords
API keys
tokens
full sensitive URLs
```

Set log retention intentionally rather than leaving unlimited logs by
default.

------------------------------------------------------------------------

# 19. IAM

Lambda permissions should be minimal.

For logs:

``` text
logs:CreateLogGroup
logs:CreateLogStream
logs:PutLogEvents
```

If DynamoDB is used:

``` text
dynamodb:GetItem
dynamodb:PutItem
dynamodb:Query
```

only on the required table.

Never give Lambda:

``` text
AdministratorAccess
```

------------------------------------------------------------------------

# 20. DYNAMODB

Only enable if scan history/security-score history is actually required.

Table:

``` text
DigitalSafetyHistory
```

Store:

``` text
session_id
timestamp
scan_type
risk_level
risk_score
```

Avoid storing raw content.

------------------------------------------------------------------------

# 21. FRONTEND USER EXPERIENCE

Primary journey:

``` text
Landing
 ↓
Scan Now
 ↓
Choose URL / Message
 ↓
Submit
 ↓
Loading
 ↓
Risk Result
 ↓
Why was this flagged?
 ↓
Recommended Action
 ↓
Ask Security Assistant
 ↓
Check Exposure
 ↓
Security Score
```

This should be the central product story.

------------------------------------------------------------------------

# 22. ERROR UX

Never show technical errors to users.

Instead:

``` text
Something went wrong.
Please try again.
```

or:

``` text
This security service is temporarily unavailable.
```

Keep technical details in CloudWatch.

------------------------------------------------------------------------

# 23. NO FAKE DATA

During development, mock data may be used only for UI development.

Before final submission:

-   remove mock production results
-   connect all core flows to the real backend
-   verify model predictions
-   verify Groq
-   verify HIBP
-   verify AWS API

Never present simulated output as live security detection.

------------------------------------------------------------------------

# 24. FINAL HACKATHON DEMO

Recommended order:

``` text
1. Explain the problem in 20–30 seconds.
2. Show the landing page.
3. Scan a known suspicious URL.
4. Show the model result.
5. Expand evidence.
6. Scan a phishing message.
7. Ask the AI assistant for an explanation.
8. Run an exposure check.
9. Show the security score.
10. Show the AWS architecture.
11. Explain serverless deployment and free-tier-conscious design.
```

Keep the demo focused on user value.

------------------------------------------------------------------------

# 25. AWS ARCHITECTURE TO SHOW TO JUDGES

Use this diagram:

``` text
                 USER
                  |
                  v
          React / Framer UI
                  |
               HTTPS
                  |
                  v
       Amazon API Gateway
            HTTP API
                  |
                  v
            AWS Lambda
        Python ML Inference
                  |
       +----------+----------+
       |          |          |
       v          v          v
   URL Model  Message Model  Groq
       |          |          |
       +----------+----------+
                  |
                  v
             HIBP API
                  |
                  v
           Security Score
                  |
                  v
            DynamoDB
             (optional)

        CloudWatch + IAM
```

------------------------------------------------------------------------

# 26. COST-CONSCIOUS RULES

Do not enable:

``` text
NAT Gateway
Provisioned Lambda concurrency
Large always-on compute
RDS
SageMaker endpoints
Always-on containers
Unnecessary data pipelines
```

Use:

``` text
Lambda
API Gateway HTTP API
Amplify Hosting
CloudWatch
DynamoDB only when needed
```

This is intentionally designed around serverless usage and the
applicable AWS Free Tier/free-plan allowances.

------------------------------------------------------------------------

# 27. QUALITY GATES

The project is not complete until:

### Gate 1 --- ML

``` text
URL model works
Message model works
```

### Gate 2 --- API

``` text
All endpoints return valid JSON
```

### Gate 3 --- AWS

``` text
API Gateway → Lambda works
CloudWatch logs work
IAM is restricted
```

### Gate 4 --- External APIs

``` text
Groq works
HIBP works or honest unavailable state works
```

### Gate 5 --- Frontend

``` text
Desktop works
Mobile works
Loading states work
Errors work
```

### Gate 6 --- Security

``` text
No secrets in frontend
No secrets in Git
No sensitive data in logs
```

### Gate 7 --- Demo

``` text
Complete user journey works from deployed frontend
```

------------------------------------------------------------------------

# 28. DO NOT DO

Do not:

-   add unrelated AI features
-   add a chatbot-only experience
-   make Groq the phishing classifier
-   expose API keys
-   use fake security results
-   store raw messages unnecessarily
-   use EC2 just to say "AWS"
-   add expensive AWS services for presentation
-   add unnecessary authentication for the MVP
-   build a giant admin dashboard
-   create excessive cybersecurity visual effects
-   replace the existing ML models without justification

------------------------------------------------------------------------

# 29. FINAL ACCEPTANCE CRITERIA

The final project should demonstrate:

``` text
REAL ML
+
REAL SECURITY API INTEGRATION
+
REAL AWS SERVERLESS BACKEND
+
REAL AI GUIDANCE
+
REAL EXPOSURE CHECK
+
EXPLAINABLE SECURITY RESULTS
+
PREMIUM RESPONSIVE FRONTEND
```

The final experience should answer one simple question:

> "Can this platform help an ordinary user make a safer digital decision
> before a threat causes harm?"

If the answer is yes and the five core workflows work end-to-end, the
MVP is ready for the hackathon.
