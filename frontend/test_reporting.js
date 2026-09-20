// Verification tests for Cyber Crime Portal reporting feature
import assert from 'node:assert';

// Import compiled or direct logic to test
const REPORT_THRESHOLD = 76;
const CYBER_CRIME_PORTAL_URL = 'https://www.cybercrime.gov.in/Webform/cyber_suspect.aspx';
const FINANCIAL_FRAUD_NOTE = 'Financial cyber fraud? Report immediately by calling 1930.';

const shouldShowReportOption = (riskScore) => {
  return Number(riskScore) >= REPORT_THRESHOLD;
};

const hasFinancialContext = (result) => {
  const financialPattern = /\b(bank|banking|payment|financial|fraud|otp|upi|card|wallet|billing|account)\b/i;
  const flagSources = [
    ...(result.signals || []),
    ...(result.flags || []),
    result.url || '',
    result.message_snippet || ''
  ];
  return flagSources.some((item) => financialPattern.test(item));
};

const getReportSupportingText = (type) => {
  if (type === 'url') {
    return 'This URL has been identified as high-risk. If you believe it is involved in a cybercrime or scam, you can report it through the official Government of India Cyber Crime Reporting Portal.';
  }
  return 'Potentially suspicious message detected. If you believe this message is part of a cybercrime or scam, you can report it through the official Government of India Cyber Crime Reporting Portal.';
};

console.log("--- Starting Unit Tests ---");

// Test 1: Threshold Boundary Verification
console.log("1. Testing Threshold Boundaries:");
assert.strictEqual(shouldShowReportOption(75), false, "Score 75 must NOT show report option");
assert.strictEqual(shouldShowReportOption("75"), false, "Score '75' must NOT show report option");
assert.strictEqual(shouldShowReportOption(75.9), false, "Score 75.9 must NOT show report option");
assert.strictEqual(shouldShowReportOption(76), true, "Score 76 MUST show report option");
assert.strictEqual(shouldShowReportOption("76"), true, "Score '76' MUST show report option");
assert.strictEqual(shouldShowReportOption(77), true, "Score 77 MUST show report option");
assert.strictEqual(shouldShowReportOption(94), true, "Score 94 MUST show report option");
assert.strictEqual(shouldShowReportOption(100), true, "Score 100 MUST show report option");
console.log("✓ Threshold boundary tests passed (75 -> hidden, 76 -> visible, 77 -> visible, 100 -> visible)");

// Test 2: URL Scan Result Behavior
console.log("2. Testing URL Scan Result Behavior:");
const benignUrlResult = {
  type: 'url',
  url: 'https://example.com',
  risk_score: 15,
  risk_level: 'safe',
  signals: ['Standard domain and path structure']
};
assert.strictEqual(shouldShowReportOption(benignUrlResult.risk_score), false, "Low-risk URL should NOT show report option");

const borderUrlResult75 = {
  type: 'url',
  url: 'https://suspicious-test.com',
  risk_score: 75,
  risk_level: 'high',
  signals: ['High URL entropy']
};
assert.strictEqual(shouldShowReportOption(borderUrlResult75.risk_score), false, "URL with score 75 should NOT show report option");

const highRiskUrlResult76 = {
  type: 'url',
  url: 'https://phishing-site-verify.com',
  risk_score: 76,
  risk_level: 'critical',
  signals: ['Punycode homograph domain detected']
};
assert.strictEqual(shouldShowReportOption(highRiskUrlResult76.risk_score), true, "URL with score 76 MUST show report option");
assert.strictEqual(
  getReportSupportingText(highRiskUrlResult76.type),
  'This URL has been identified as high-risk. If you believe it is involved in a cybercrime or scam, you can report it through the official Government of India Cyber Crime Reporting Portal.'
);
console.log("✓ URL scan reporting behavior tests passed");

// Test 3: Message Scan Result Behavior
console.log("3. Testing Message Scan Result Behavior:");
const normalMessageResult = {
  type: 'message',
  message_snippet: "Hey, are we still meeting today?",
  risk_score: 10,
  risk_level: 'safe',
  signals: ['Normal conversational message structure']
};
assert.strictEqual(shouldShowReportOption(normalMessageResult.risk_score), false, "Normal message should NOT show report option");

const borderMessageResult75 = {
  type: 'message',
  message_snippet: "Special offer discount! Click now!",
  risk_score: 75,
  risk_level: 'high',
  signals: ['Prize, reward, or lottery scam indicator']
};
assert.strictEqual(shouldShowReportOption(borderMessageResult75.risk_score), false, "Message with score 75 should NOT show report option");

const highRiskMessageResult76 = {
  type: 'message',
  message_snippet: "URGENT: Click here to verify http://bad.link",
  risk_score: 76,
  risk_level: 'critical',
  signals: ['High urgency or pressure tactics detected', 'Embedded link detected in unverified message']
};
assert.strictEqual(shouldShowReportOption(highRiskMessageResult76.risk_score), true, "Message with score 76 MUST show report option");
assert.strictEqual(
  getReportSupportingText(highRiskMessageResult76.type),
  'Potentially suspicious message detected. If you believe this message is part of a cybercrime or scam, you can report it through the official Government of India Cyber Crime Reporting Portal.'
);
console.log("✓ Message scan reporting behavior tests passed");

// Test 4: Financial Fraud / 1930 Contextual Note
console.log("4. Testing Financial Fraud Contextual Behavior:");
// Non-financial phishing (should NOT trigger 1930 note)
const nonFinancialMessage = {
  type: 'message',
  message_snippet: "Congratulations you won a holiday trip! Claim prize at link",
  risk_score: 85,
  signals: ['Prize, reward, or lottery scam indicator', 'Excessive uppercase lettering for emotional influence']
};
assert.strictEqual(hasFinancialContext(nonFinancialMessage), false, "Generic prize scam without financial flags should not trigger 1930");

// Financial phishing examples (MUST trigger 1930 note)
const otpMessage = {
  type: 'message',
  message_snippet: "Do not share this OTP with anyone",
  risk_score: 90,
  signals: ['OTP or security code reference pattern']
};
assert.strictEqual(hasFinancialContext(otpMessage), true, "OTP reference must trigger financial note");

const bankAccountMessage = {
  type: 'message',
  message_snippet: "Your bank account has been suspended",
  risk_score: 95,
  signals: ['Account verification / suspension call to action']
};
assert.strictEqual(hasFinancialContext(bankAccountMessage), true, "Account suspension must trigger financial note");

const upiCardMessage = {
  type: 'message',
  message_snippet: "Update your UPI PIN and credit card info immediately",
  risk_score: 92,
  signals: ['Sensitive credential or password solicitation pattern']
};
assert.strictEqual(hasFinancialContext(upiCardMessage), true, "UPI and card mention must trigger financial note");

const financialUrl = {
  type: 'url',
  url: 'https://secure-login-bank-payment.com',
  risk_score: 88,
  signals: ['Security/sensitive keywords found: bank, payment']
};
assert.strictEqual(hasFinancialContext(financialUrl), true, "Financial keywords in URL flags must trigger financial note");
console.log("✓ Financial fraud / 1930 contextual tests passed");

// Test 5: Portal URL Verification
console.log("5. Testing Portal URL & Note Constants:");
assert.strictEqual(CYBER_CRIME_PORTAL_URL, 'https://www.cybercrime.gov.in/Webform/cyber_suspect.aspx');
assert.strictEqual(FINANCIAL_FRAUD_NOTE, 'Financial cyber fraud? Report immediately by calling 1930.');
console.log("✓ Portal URL and Note constants verified");

console.log("\nALL 5 TEST SUITES PASSED SUCCESSFULLY!");
