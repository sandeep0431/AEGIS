# FRONTEND_BUILD.md

# AI-Powered Digital Safety Platform --- Framer/React Frontend

## 1. Objective

Build the frontend as a premium black/orange cybersecurity product
inspired by the supplied reference design.

Core features:

1.  URL Checker
2.  Suspicious Message Checker
3.  Groq Security Assistant
4.  HIBP Exposure Check
5.  Simple Security Score

Do not add a sixth major feature.

The frontend must feel like a serious security product rather than a
generic AI dashboard.

------------------------------------------------------------------------

# 2. Stack

Recommended:

``` text
Framer / React
TypeScript
Tailwind CSS where applicable
Motion / Framer Motion
Lucide React
Fetch API
```

The frontend must never contain:

``` text
GROQ_API_KEY
HIBP_API_KEY
AWS secret keys
```

------------------------------------------------------------------------

# 3. Page Structure

``` text
App
│
├── Navbar
├── Hero
├── SecurityCheck
│   ├── UrlChecker
│   └── MessageChecker
├── SecurityScore
├── ExposureChecker
├── SafetyAssistant
├── Features
├── HowItWorks
├── FAQ
├── FinalCTA
└── Footer
```

------------------------------------------------------------------------

# 4. Hero

Use the supplied black/orange reference as the composition model.

Headline:

> Know the risk before you take the click.

Supporting copy:

> Check suspicious links and messages, understand your digital exposure,
> and get clear security guidance when it matters.

Buttons:

``` text
[ Scan Now ]
[ Explore Security ]
```

Visual:

-   black background
-   giant curved orange gradient at top
-   orange/red abstract visual at bottom
-   subtle logo/trust strip
-   large typography
-   generous negative space

------------------------------------------------------------------------

# 5. Navigation

Desktop:

``` text
Brand
Scan
Security
Exposure
Learn
About
Check Now
```

Mobile:

``` text
Brand
Menu
```

CTA:

``` text
Check Now
```

Scroll behavior:

-   transparent over hero
-   subtle background after scrolling
-   no large sticky header

------------------------------------------------------------------------

# 6. Security Check

This is the primary functional component.

Tabs:

``` text
URL CHECK
MESSAGE CHECK
```

Do not build two unrelated pages.

Keep both modes in one unified security-check experience.

------------------------------------------------------------------------

# 7. URL Checker UI

Input:

``` text
Paste a suspicious URL
```

Button:

``` text
Analyze URL
```

Loading:

``` text
Analyzing URL...
```

Result:

``` text
HIGH RISK
87 / 100

Suspicious URL structure
Domain anomaly

Recommended Action
Do not enter credentials or payment information.
```

Use semantic status styling.

Safe:

``` text
green
```

Warning:

``` text
amber
```

High risk:

``` text
orange/red
```

Critical:

``` text
red
```

Do not rely only on color. Always include text.

------------------------------------------------------------------------

# 8. Message Checker UI

Input:

``` text
Paste suspicious message...
```

Button:

``` text
Analyze Message
```

Result hierarchy:

``` text
MESSAGE RISK

HIGH RISK

91 / 100

Detected Signals

Urgency pattern
Credential-request pattern

What should I do?

Verify the request through an official channel.
```

The result must come from the actual backend model.

------------------------------------------------------------------------

# 9. API Client

Create:

``` text
src/api/client.ts
```

Example:

``` ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function scanUrl(url: string) {
  const response = await fetch(`${API_BASE_URL}/scan/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("URL scan failed");
  }

  return response.json();
}
```

Never place external provider API keys here.

------------------------------------------------------------------------

# 10. State Model

URL checker:

``` text
idle
loading
success
error
```

Message checker:

``` text
idle
loading
success
error
```

Assistant:

``` text
idle
thinking
success
error
```

Exposure:

``` text
idle
checking
success
error
```

Use state transitions to drive animation.

------------------------------------------------------------------------

# 11. Result Animation

When a result arrives:

``` text
loader
↓
fade/scale transition
↓
risk level
↓
score
↓
signals
↓
recommendation
```

Do not use long fake scanning animations.

Recommended:

``` text
300ms – 900ms
```

depending on actual backend response.

------------------------------------------------------------------------

# 12. Security Score

Display:

``` text
YOUR DIGITAL SAFETY

72 / 100

Good
```

Breakdown:

``` text
URL Safety
Message Safety
Exposure
```

Use a simple circular score or horizontal bars.

Avoid dashboard overload.

------------------------------------------------------------------------

# 13. Exposure Checker

Input:

``` text
Enter your email
```

Button:

``` text
Check Exposure
```

Result:

``` text
EXPOSURE STATUS

No known exposure detected
```

or:

``` text
EXPOSURE FOUND

Known breach records detected.

Review the affected services and
change reused passwords.
```

Do not expose unnecessary breach information.

Do not save the email in browser local storage.

------------------------------------------------------------------------

# 14. Groq Safety Assistant

UI:

``` text
SECURITY ASSISTANT

Ask about a suspicious message,
link, or security result.

[ Ask a security question... ]

[ Ask ]
```

When a scan exists, pass relevant structured context.

Example:

``` json
{
  "type": "url",
  "risk_level": "high",
  "risk_score": 87,
  "signals": [
    "Suspicious URL structure"
  ]
}
```

The assistant should explain the existing result.

It should not invent detection evidence.

------------------------------------------------------------------------

# 15. Contextual Guidance

After a scan result:

``` text
WHY THIS MATTERS
```

Expandable content:

``` text
This result was flagged because
specific risk indicators were detected.

WHAT YOU CAN DO

1. Avoid entering credentials.
2. Open the official website manually.
3. Verify the request through a trusted channel.
```

Keep advice concise.

------------------------------------------------------------------------

# 16. Feature Section

Use six visual items only if needed for presentation, but these
represent capabilities rather than six new product features:

``` text
URL Threat Detection
Message Detection
Exposure Check
Security Score
AI Safety Assistant
Contextual Guidance
```

Do not turn each into a separate application flow.

------------------------------------------------------------------------

# 17. How It Works

``` text
01 CHECK
Submit a URL, message or exposure query.

02 ANALYZE
Models and security services evaluate it.

03 UNDERSTAND
See the signals behind the result.

04 ACT
Follow the recommended security action.
```

Animate each step on scroll.

------------------------------------------------------------------------

# 18. FAQ

Questions:

``` text
How does URL detection work?
How does message detection work?
What does the risk score mean?
How is exposure checked?
Does the AI assistant decide whether something is malicious?
Is my submitted information stored?
What should I do if something is flagged?
```

Use accordion components.

------------------------------------------------------------------------

# 19. Responsive Design

## Desktop

Hero:

``` text
90vh–100vh
```

Security checker:

``` text
max-width: 900px
```

## Mobile

Everything becomes one column.

Inputs:

``` text
width: 100%
```

Buttons:

``` text
width: 100%
```

Do not shrink desktop cards until text becomes unreadable.

------------------------------------------------------------------------

# 20. Accessibility

Required:

-   keyboard navigation
-   focus states
-   semantic buttons
-   accessible labels
-   readable contrast
-   screen-reader-friendly results
-   reduced-motion support
-   no color-only status

Use:

``` css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

------------------------------------------------------------------------

# 21. Frontend Error Handling

If backend fails:

``` text
We couldn't complete the security check.

Please try again.
```

Button:

``` text
Try Again
```

Never show:

``` text
SAFE
```

when the API failed.

------------------------------------------------------------------------

# 22. Security Rules

Never:

-   expose Groq key
-   expose HIBP key
-   call Groq directly from browser
-   call HIBP directly from browser
-   hard-code AWS credentials
-   store sensitive scan content in localStorage
-   display backend stack traces
-   fabricate results

------------------------------------------------------------------------

# 23. Framer Interaction Rules

Use:

-   Scroll Transform
-   Appear
-   Hover
-   Press
-   Sticky sections
-   Tabs
-   Accordion
-   Motion Code Components where necessary

Animation philosophy:

> Animation should communicate state and hierarchy, not exist just for
> decoration.

------------------------------------------------------------------------

# 24. Frontend Completion Checklist

-   [ ] Hero matches reference visual language
-   [ ] Navbar responsive
-   [ ] URL checker connected
-   [ ] Message checker connected
-   [ ] Loading states
-   [ ] Result states
-   [ ] Security score
-   [ ] Exposure checker
-   [ ] Groq assistant
-   [ ] FAQ
-   [ ] Mobile layout
-   [ ] Accessibility
-   [ ] Error handling
-   [ ] No API keys exposed
-   [ ] Production API URL configured
-   [ ] Amplify deployment tested
