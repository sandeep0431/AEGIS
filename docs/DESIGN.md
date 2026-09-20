# DESIGN.md --- AI-Powered Digital Safety Platform

## 1. Design Direction

This document defines the visual and interaction system for the
**AI-powered Digital Safety Platform**, a cybersecurity-awareness
product designed around:

-   URL threat detection
-   Message/phishing detection
-   Digital exposure and safety scoring
-   Breach/exposure checking
-   Groq-powered AI Safety Assistant
-   Contextual micro-coaching
-   Lightweight suspicious-activity reporting
-   Clear, actionable security guidance

The visual direction is based on the supplied premium black/orange
reference design, but adapted specifically for cybersecurity.

The website must feel like a **premium security product**, not a generic
SaaS template and not a stereotypical neon "hacker" dashboard.

------------------------------------------------------------------------

## 2. Core Visual Principle

### Reference-inspired, product-specific

Preserve the reference's:

-   Deep black canvas
-   Large editorial typography
-   Strong negative space
-   Warm orange/red visual language
-   Large organic gradient forms
-   Minimal navigation
-   Pill-shaped CTAs
-   Subtle motion
-   Premium landing-page composition

Adapt it to cybersecurity with:

-   Threat-focused terminology
-   Security status indicators
-   Risk visualization
-   Detection results
-   Exposure information
-   Trust and verification cues
-   Clean investigation-oriented UI

### Avoid

-   Blue/purple AI gradients
-   Generic "cyberpunk" aesthetics
-   Excessive neon
-   Matrix/rain-code backgrounds
-   Excessive glassmorphism
-   Excessive glowing borders
-   Random 3D objects
-   Too many rounded cards
-   Fake security alerts
-   Hard-coded threat results
-   Decorative elements that reduce readability

------------------------------------------------------------------------

# 3. Color System

## Primary

``` text
Background        #050505
Surface           #101010
Surface Elevated  #151515
Border            rgba(255,255,255,0.10)

Text Primary      #F5F5F5
Text Secondary    #A3A3A3
Text Muted        #6F6F6F

Orange            #FF5A00
Amber             #FF9D1C
Deep Orange       #D93600
Deep Red          #650B05
```

## Semantic Security Colors

Use semantic colors carefully and only where the meaning requires them.

``` text
Safe              #36C275
Warning            #F2B84B
High Risk          #FF7A45
Critical           #E5484D
Informational      #8FA3B8
```

Do not turn the entire interface into a rainbow of security colors.

Orange remains the primary brand/accent color.

------------------------------------------------------------------------

# 4. Typography

Use a modern grotesk/editorial combination.

Preferred:

``` text
Primary:
Inter / Geist / Manrope

Monospace:
IBM Plex Mono
```

## Hero heading

Desktop:

``` text
72px – 88px
font-weight: 500–600
line-height: 0.95–1.05
letter-spacing: -0.04em
```

Tablet:

``` text
56px – 68px
```

Mobile:

``` text
42px – 52px
```

## Body

``` text
15px – 17px
line-height: 1.5–1.7
```

## Labels / metadata

Use IBM Plex Mono or a similar monospace face:

``` text
11px – 13px
letter-spacing: 0.08em
text-transform: uppercase
```

Examples:

``` text
THREAT ANALYSIS
SECURITY STATUS
EXPOSURE CHECK
REAL-TIME RESULT
```

------------------------------------------------------------------------

# 5. Global Layout

Desktop content width:

``` text
max-width: 1200px – 1280px
```

Horizontal padding:

``` text
Desktop: 40px – 64px
Tablet: 28px – 40px
Mobile: 20px
```

Use large vertical spacing.

Typical section spacing:

``` text
Desktop: 120px – 180px
Mobile: 80px – 110px
```

The interface should breathe.

------------------------------------------------------------------------

# 6. Navigation

## Desktop

``` text
[ BRAND ]        Scan   Security   Exposure   Learn   About        [Check Now]
```

Keep navigation minimal.

### Appearance

-   Transparent/black background
-   64--76px height
-   Small typography
-   No heavy border
-   White logo/text
-   White pill CTA

### CTA

``` text
Check Now
```

White background with black text.

Hover:

``` text
scale: 1.03
y: -1px
```

Press:

``` text
scale: 0.97
```

Transition:

``` text
180–240ms
ease-out
```

## Mobile

``` text
[ BRAND ]                              [ MENU ]
```

Menu opens as a clean full-height panel.

------------------------------------------------------------------------

# 7. Hero Section

The hero should closely follow the supplied reference composition.

## Structure

``` text
                [ DIGITAL SAFETY ]

          Stay ahead of digital threats.

        Check links, messages and exposure
          before they become a problem.

           [ Scan Now ] [ Explore Security ]

        URL CHECKER   MESSAGE CHECKER
        BREACH CHECK  SAFETY SCORE


       LARGE ORANGE / RED ABSTRACT VISUAL
```

Recommended primary headline:

> **Know the risk before you take the click.**

Alternative supporting copy:

> Check suspicious links and messages, understand your digital exposure,
> and get clear security guidance when it matters.

The headline should be large, centered, and surrounded by significant
negative space.

------------------------------------------------------------------------

# 8. Hero Background

Create two large organic gradient forms.

## Top form

A large curved orange/amber shape enters from the top-right/top-center.

Suggested construction:

``` css
background:
  radial-gradient(
    ellipse at center,
    #FFB52E 0%,
    #FF7300 35%,
    #FF3D00 60%,
    transparent 72%
  );
```

Apply:

``` text
border-radius: 50%;
filter: blur(2px);
transform: scale(1.4);
```

Keep most of the hero black.

## Bottom form

Use a second large orange/deep-red abstract shape emerging from the
bottom.

It should visually echo the reference without becoming a distracting
illustration.

------------------------------------------------------------------------

# 9. Hero Abstract Visual

The lower hero visual should represent **digital threat detection /
connected security signals** rather than generic business 3D shapes.

Possible visual language:

-   Interlocking orange rings
-   Abstract security nodes
-   Layered arcs
-   Connected threat signals
-   Circular scanning geometry

The visual must remain abstract and premium.

Do not use stock cybersecurity illustrations.

------------------------------------------------------------------------

# 10. Hero Animation

Use Framer/Motion for subtle cinematic movement.

### Page load

Sequence:

``` text
Badge
↓
Heading
↓
Description
↓
CTA
↓
Trust indicators
↓
Hero visual
```

Animation:

``` text
opacity: 0 → 1
y: 24 → 0
```

Duration:

``` text
0.5s – 0.8s
```

Stagger:

``` text
0.06s – 0.12s
```

### Scroll

Top gradient:

``` text
y: 0 → -80px
scale: 1 → 1.08
```

Hero visual:

``` text
y: 80px → 0
```

Heading:

``` text
scale: 1 → 0.96
opacity: 1 → 0.85
```

Keep movement subtle.

------------------------------------------------------------------------

# 11. Security Scan Section

This is the main functional area.

## Layout

``` text
              SECURITY CHECK

       What do you want to check?

 ┌─────────────────────────────────────────┐
 │ Paste a suspicious URL or message...    │
 │                                         │
 │                              [ Scan ]   │
 └─────────────────────────────────────────┘

 URL Scan       Message Scan       Exposure
```

Use a large, simple input.

The user should immediately understand what the product does.

------------------------------------------------------------------------

# 12. URL Checker

The URL checker must use the real URL detection model.

The interface should never display fabricated detection results.

## Input

``` text
Paste URL
```

## Result

``` text
SECURITY ANALYSIS

Risk Level
HIGH RISK

Risk Score
87 / 100

Detected Signals
• Suspicious URL structure
• Domain-related anomaly
• Redirect-related signal

Recommendation
Do not enter credentials or payment information.
```

Use a strong hierarchy.

Do not overwhelm the user with every raw ML feature by default.

Provide:

``` text
Why was this flagged?
```

as an expandable section.

------------------------------------------------------------------------

# 13. Message / Phishing Checker

Provide a separate message analysis mode.

Example:

``` text
MESSAGE CHECK

Paste suspicious message

┌─────────────────────────────────────┐
│ Your account has been suspended...  │
│                                     │
│                                     │
└─────────────────────────────────────┘

              [ Analyze Message ]
```

Result:

``` text
MESSAGE RISK
HIGH RISK

Signals
Urgency
Credential request
Suspicious language

Recommended Action
Do not click the provided link.
Verify the request through an official channel.
```

Use the actual message classifier/vectorizer pipeline.

------------------------------------------------------------------------

# 14. Security Score

Create a simple security posture summary.

Example:

``` text
YOUR DIGITAL SAFETY

              72
           / 100

Good security posture

URL Safety       ████████░░
Message Safety   ███████░░░
Exposure         ██████░░░░
Account Safety   ████████░░
```

The score should be explainable.

Never present an unexplained arbitrary number.

------------------------------------------------------------------------

# 15. Exposure / Breach Checker

Provide a dedicated section:

``` text
CHECK YOUR EXPOSURE

Find out whether your information
has appeared in known breaches.

[ Enter email / identifier ]

             [ Check Exposure ]
```

The interface should clearly communicate that the result comes from the
configured breach-checking service.

For HIBP integration, do not expose API keys in the frontend.

------------------------------------------------------------------------

# 16. AI Safety Assistant

Use the AI assistant as a **security coach**, not as the source of truth
for detection.

## UI

``` text
SECURITY ASSISTANT

Have a security question?

"Is this message safe?"

┌───────────────────────────────┐
│ Ask about a suspicious        │
│ message, link or situation... │
└───────────────────────────────┘

                     [ Ask ]
```

The assistant can provide:

-   Explanations
-   Security guidance
-   Contextual education
-   Next-step recommendations
-   Micro-coaching

Detection results should remain grounded in actual application/model
evidence.

------------------------------------------------------------------------

# 17. Micro-Coaching

Instead of a static "Cybersecurity Tips" section, provide contextual
education.

Example:

``` text
WHY THIS MATTERS

This message creates urgency and asks
you to verify an account through a link.

SECURITY TIP

Legitimate organizations generally
provide official ways to verify account
activity without requiring you to trust
an unexpected link.

[ Learn More ]
```

This directly supports the "in-context guidance" requirement.

------------------------------------------------------------------------

# 18. Threat Explanation

Every major security result should answer:

``` text
WHAT HAPPENED?
WHY WAS IT FLAGGED?
WHAT SHOULD I DO?
```

Use expandable sections.

Example:

``` text
WHY WAS THIS FLAGGED?       +
```

On click:

``` text
Threat indicators detected
↓
Evidence
↓
Risk contribution
↓
Recommended action
```

This builds user trust.

------------------------------------------------------------------------

# 19. Community Reporting

Create a lightweight reporting flow.

``` text
REPORT SUSPICIOUS ACTIVITY

[ Suspicious URL ]
[ Scam Message ]
[ Fake Account ]
[ Other ]

Description
____________________________

              [ Submit Report ]
```

The interface should be extremely simple.

Show confirmation:

``` text
REPORT RECEIVED

Thank you for helping improve
community digital safety.
```

------------------------------------------------------------------------

# 20. Feature Section

Use a minimal grid rather than a traditional SaaS card wall.

``` text
                    BUILT FOR EVERYDAY SAFETY

        Detect              Understand

        Protect             Learn

        Verify              Report
```

Possible features:

### URL Threat Detection

Analyze suspicious URLs using the trained detection model.

### Message Detection

Identify phishing/scam patterns in suspicious messages.

### Exposure Check

Check configured breach intelligence sources.

### Security Score

Understand your overall security posture.

### AI Safety Assistant

Get contextual explanations and guidance.

### Micro-Coaching

Learn safer practices at the moment they matter.

------------------------------------------------------------------------

# 21. Interactive Threat Demo

Add a visually strong interactive section.

## Concept

``` text
TRY A SECURITY CHECK

        ┌────────────────────────┐
        │ suspicious-link.com    │
        └────────────────────────┘

                  ↓

           ANALYZING...

                  ↓

             HIGH RISK

        87 / 100 RISK SCORE

      [ View Analysis ]
```

Animation:

``` text
idle → scanning → result
```

Use only real backend/model responses in the actual application.

------------------------------------------------------------------------

# 22. How It Works

Use a simple three/four-step story.

``` text
01
CHECK

Submit a link, message,
or exposure query.

        ↓

02
ANALYZE

Security models and
verified services evaluate it.

        ↓

03
EXPLAIN

Understand the signals
behind the result.

        ↓

04
ACT

Follow clear recommended
security actions.
```

------------------------------------------------------------------------

# 23. Trust Section

Security products need trust.

Show:

``` text
MODEL-BASED ANALYSIS
REAL SECURITY SIGNALS
EXPLAINABLE RESULTS
PRIVACY-FIRST DESIGN
```

Do not claim certifications or guarantees that the system does not
actually have.

------------------------------------------------------------------------

# 24. FAQ

Use accordion interactions.

Questions:

``` text
How does URL detection work?
How does message detection work?
What does the risk score mean?
How is breach exposure checked?
Does the AI assistant make the detection decision?
What should I do if something is flagged?
Is my submitted information stored?
```

Accordion animation:

``` text
height: 0 → auto
opacity: 0 → 1
```

Duration:

``` text
220–300ms
```

------------------------------------------------------------------------

# 25. Final CTA

Large editorial section.

Example:

> **Make every click a more informed decision.**

Supporting copy:

> Detect threats, understand your exposure, and build safer digital
> habits.

CTA:

``` text
[ Run a Security Check ]
```

Use a large orange/red organic gradient behind the CTA.

------------------------------------------------------------------------

# 26. Footer

Minimal footer.

``` text
DIGITAL SAFETY PLATFORM

Security
URL Checker
Message Checker
Exposure Check
Safety Assistant
Learn

Privacy
Terms
Contact

© 2026
```

Keep the footer mostly black.

------------------------------------------------------------------------

# 27. Component Architecture

Recommended React/Framer structure:

``` text
src/
│
├── components/
│   ├── Navbar
│   ├── Hero
│   ├── GradientBackground
│   ├── SecurityScanner
│   ├── UrlChecker
│   ├── MessageChecker
│   ├── ExposureChecker
│   ├── SecurityScore
│   ├── ThreatResult
│   ├── ThreatExplanation
│   ├── SafetyAssistant
│   ├── MicroCoaching
│   ├── CommunityReport
│   ├── FeatureGrid
│   ├── HowItWorks
│   ├── FAQ
│   ├── FinalCTA
│   └── Footer
│
├── animations/
│   ├── hero.ts
│   ├── reveal.ts
│   └── transitions.ts
│
└── styles/
    └── design-system.css
```

------------------------------------------------------------------------

# 28. Interaction Library

Use Framer's native animation system and Motion for React where custom
animation is required.

Preferred animation categories:

``` text
Scroll reveal
Parallax
Hover
Press
Accordion
Tabs
Modal
Toast
Loading states
Result transitions
```

Animation philosophy:

> **Motion should communicate state, not decorate the interface.**

Examples:

-   Scanning animation = system is processing
-   Risk transition = result became available
-   Accordion = more explanation is available
-   Hover = element is interactive
-   Parallax = visual depth

------------------------------------------------------------------------

# 29. Responsive Rules

## Desktop

Hero:

``` text
min-height: 90vh – 100vh
```

Large typography and wide negative space.

## Tablet

Reduce:

``` text
heading size
hero spacing
gradient scale
navigation gap
```

## Mobile

Hero should become:

``` text
badge

large heading

description

primary CTA
secondary CTA

trust indicators

abstract visual
```

Do not place too many elements beside each other.

Security scan inputs should become full width.

------------------------------------------------------------------------

# 30. Accessibility

The interface itself must support digital accessibility.

Required:

-   Keyboard navigation
-   Visible focus states
-   Semantic HTML
-   ARIA labels where necessary
-   Screen-reader-friendly controls
-   Sufficient contrast
-   Reduced-motion support
-   Large enough interactive targets
-   No information conveyed by color alone

------------------------------------------------------------------------

# 31. Loading States

Never leave users wondering whether the security check is working.

Use:

``` text
CHECKING URL
      ↓
EXTRACTING SIGNALS
      ↓
ANALYZING
      ↓
RESULT READY
```

Keep the animation short and informative.

Do not simulate a long "hacking" sequence.

------------------------------------------------------------------------

# 32. Error States

Every external/model operation must have a useful error state.

Example:

``` text
WE COULDN'T COMPLETE THE CHECK

The security service is temporarily
unavailable.

[ Try Again ]
```

Never show a fake safe/unsafe result when the backend fails.

------------------------------------------------------------------------

# 33. Security UX Principles

### Principle 1 --- Evidence before confidence

Show why a result was generated.

### Principle 2 --- Action over fear

Every threat result should provide a next step.

### Principle 3 --- Explain risk

Avoid unexplained "87/100" style scores.

### Principle 4 --- No false certainty

Use appropriate language:

``` text
Likely suspicious
Potential risk
No known indicators detected
Unable to verify
```

instead of absolute claims when the system cannot guarantee them.

### Principle 5 --- Keep the user in control

Never automatically perform destructive or irreversible security
actions.

------------------------------------------------------------------------

# 34. Visual Rhythm

Use this approximate section rhythm:

``` text
HERO
↓
Large whitespace
↓
SECURITY CHECK
↓
THREAT DETECTION
↓
EXPOSURE / SCORE
↓
AI SAFETY ASSISTANT
↓
MICRO-COACHING
↓
HOW IT WORKS
↓
COMMUNITY REPORTING
↓
FAQ
↓
FINAL CTA
↓
FOOTER
```

The landing page should feel like a single continuous story rather than
a collection of unrelated dashboard modules.

------------------------------------------------------------------------

# 35. Framer Build Rules

When implementing the design in Framer:

1.  Build the visual system first.
2.  Create reusable typography and spacing tokens.
3.  Build the Hero before the rest of the page.
4.  Match the reference's composition before adding functionality.
5.  Use native Framer interactions wherever possible.
6.  Use Code Components for custom security widgets and stateful
    interactions.
7.  Keep animation subtle.
8.  Make every functional result connected to the real backend/model.
9.  Do not hard-code fake scan results.
10. Test desktop, tablet, and mobile layouts independently.

------------------------------------------------------------------------

# 36. Final Design Goal

The final product should feel like:

``` text
Premium security platform
        +
Editorial SaaS landing page
        +
Real cybersecurity tooling
        +
Clear consumer UX
```

The visual identity should immediately communicate:

**"This is a serious digital safety product."**

It should NOT communicate:

**"This is a generic AI website with a cybersecurity theme."**

The supplied black/orange reference is therefore the **visual
foundation**, while the information architecture, interactions, content,
and functional UI are specifically designed around the AI-powered
Digital Safety Platform.
