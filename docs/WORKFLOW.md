# WORKFLOW.md

# AI-Powered Digital Safety Platform --- End-to-End Workflow

## 1. Product Flow

``` text
USER
  |
  v
Landing Page
  |
  v
Choose Security Check
  |
  +------------------+
  |                  |
  v                  v
URL Check        Message Check
  |                  |
  v                  v
API Gateway HTTP API
  |
  v
AWS Lambda
  |
  +---------------------+
  |                     |
  v                     v
URL Random Forest   Message TF-IDF +
                    Logistic Regression
  |                     |
  +----------+----------+
             |
             v
      Unified Risk Engine
             |
       +-----+------+
       |            |
       v            v
   Risk Result   Recommendation
       |
       v
Frontend Result
       |
       +-------------------+
       |                   |
       v                   v
Groq Assistant       Security Score
       |
       v
User Action
```

------------------------------------------------------------------------

# 2. URL Scan Workflow

``` text
1. User pastes URL
2. Frontend validates basic format
3. Frontend sends POST /scan/url
4. API Gateway receives request
5. Lambda validates request
6. URL is normalized
7. URL security features are extracted
8. Existing Random Forest model runs
9. Risk score is generated
10. Evidence/signals are assembled
11. Recommendation is generated
12. Lambda returns JSON
13. Frontend renders result
14. User can ask Groq assistant about the result
```

------------------------------------------------------------------------

# 3. Message Scan Workflow

``` text
1. User pastes message
2. Frontend checks input length
3. POST /scan/message
4. API Gateway
5. Lambda
6. Text preprocessing
7. TF-IDF transformation
8. Security features extracted
9. Logistic Regression prediction
10. Risk engine
11. Signals assembled
12. Recommendation
13. Response returned
14. Frontend displays result
```

------------------------------------------------------------------------

# 4. Groq Assistant Workflow

The assistant is an explanation/education layer.

``` text
User question
      |
      v
Frontend
      |
      v
API Gateway
      |
      v
Lambda
      |
      +--> Existing scan context
      |
      +--> User question
      |
      v
Grounded prompt
      |
      v
Groq
      |
      v
Answer validation/sanitization
      |
      v
Frontend
```

### Important

Groq must not be the primary phishing classifier.

The project already has dedicated ML detection models.

Groq explains:

-   what the result means
-   why a signal matters
-   what the user should do
-   how to build safer habits

------------------------------------------------------------------------

# 5. HIBP Workflow

``` text
User enters email
       |
       v
Frontend validation
       |
       v
POST /exposure/check
       |
       v
API Gateway
       |
       v
Lambda
       |
       v
HIBP API
       |
       v
Normalize response
       |
       v
Exposure summary
       |
       v
Frontend
```

Never expose HIBP credentials to the browser.

Only return the minimum useful information.

------------------------------------------------------------------------

# 6. Security Score Workflow

The score should combine actual security signals.

Example conceptual structure:

``` text
URL Safety
Message Safety
Exposure Status
        |
        v
Score Engine
        |
        v
0–100 score
        |
        v
Label
```

Suggested labels:

``` text
90–100  Excellent
75–89   Good
50–74   Needs Attention
25–49   High Risk
0–24    Critical Attention
```

These labels are product UX categories, not an industry standard.

------------------------------------------------------------------------

# 7. Complete User Journey

``` text
OPEN WEBSITE
      |
      v
SEE HERO
      |
      v
CLICK "SCAN NOW"
      |
      v
SECURITY CHECK
      |
      +-------------------+
      |                   |
      v                   v
CHECK URL          CHECK MESSAGE
      |                   |
      +---------+---------+
                |
                v
          SECURITY RESULT
                |
       +--------+--------+
       |                 |
       v                 v
VIEW EXPLANATION     ASK ASSISTANT
       |
       v
CHECK EXPOSURE
       |
       v
VIEW SECURITY SCORE
       |
       v
TAKE RECOMMENDED ACTION
```

------------------------------------------------------------------------

# 8. AWS Request Flow

``` text
Browser
   |
 HTTPS
   |
   v
API Gateway HTTP API
   |
   v
Lambda
   |
   +--> ML Models
   |
   +--> Groq
   |
   +--> HIBP
   |
   +--> DynamoDB (optional)
   |
   v
CloudWatch Logs
```

------------------------------------------------------------------------

# 9. AWS Deployment Workflow

``` text
LOCAL DEVELOPMENT
       |
       v
Test ML inference
       |
       v
Build Lambda package
       |
       v
Deploy Lambda
       |
       v
Create API Gateway HTTP API
       |
       v
Configure CORS
       |
       v
Test API
       |
       v
Connect Framer/React frontend
       |
       v
Deploy frontend using Amplify
       |
       v
End-to-end testing
```

------------------------------------------------------------------------

# 10. Model Loading Workflow

Do not load model files repeatedly for every invocation when the Lambda
environment can reuse them.

``` text
Lambda cold start
      |
      v
Load model artifacts
      |
      v
Keep them in memory
      |
      v
Handle request
      |
      v
Reuse loaded model
```

This reduces latency and unnecessary work.

------------------------------------------------------------------------

# 11. Failure Workflow

## ML failure

``` text
Model error
   ↓
CloudWatch log
   ↓
HTTP 500/503
   ↓
Frontend retry state
```

Do not fabricate a result.

## Groq failure

``` text
Groq unavailable
   ↓
Return scan result normally
   ↓
Assistant unavailable message
```

The core detector must continue to work without Groq.

## HIBP failure

``` text
HIBP unavailable
   ↓
Exposure check unavailable
   ↓
Do not mark user as safe
```

Display:

``` text
Unable to verify exposure right now.
```

------------------------------------------------------------------------

# 12. Privacy Workflow

``` text
Input
  ↓
Validate
  ↓
Process
  ↓
Return result
  ↓
Discard raw input unless explicitly required
```

Do not log raw:

-   URLs containing sensitive query parameters
-   messages
-   email addresses
-   passwords
-   credentials

------------------------------------------------------------------------

# 13. Development Workflow

Build in this order:

``` text
PHASE 1
Existing ML models verified
        ↓
PHASE 2
Local FastAPI/Lambda-compatible API
        ↓
PHASE 3
URL endpoint
        ↓
PHASE 4
Message endpoint
        ↓
PHASE 5
Groq endpoint
        ↓
PHASE 6
HIBP endpoint
        ↓
PHASE 7
Score engine
        ↓
PHASE 8
AWS Lambda
        ↓
PHASE 9
API Gateway
        ↓
PHASE 10
Frontend integration
        ↓
PHASE 11
Amplify deployment
        ↓
PHASE 12
End-to-end testing
```

------------------------------------------------------------------------

# 14. Hackathon Demo Workflow

Recommended 4--6 minute demo:

``` text
1. Open landing page
2. Explain problem
3. Paste clearly suspicious URL
4. Show model risk result
5. Expand "Why was this flagged?"
6. Paste phishing/scam message
7. Show message model result
8. Ask Groq assistant why it is suspicious
9. Run exposure check
10. Show security score
11. Briefly show AWS architecture
12. Explain serverless/free-tier-conscious deployment
```

Do not spend the majority of the demo on AWS console screens.

The product should remain the focus.

------------------------------------------------------------------------

# 15. Offline/Failure Demo Backup

Before presentation:

-   Keep a known test URL.
-   Keep a known test phishing message.
-   Keep screenshots/video of successful results.
-   Verify the AWS API is live.
-   Verify Groq key.
-   Verify HIBP availability.
-   Verify frontend environment variables.

Do not fake live results; screenshots are only a backup if the
network/service fails during presentation.
