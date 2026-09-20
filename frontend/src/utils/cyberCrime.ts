import { ScanResult } from '../api/client';

export const REPORT_THRESHOLD = 76;

export const CYBER_CRIME_PORTAL_URL = 'https://www.cybercrime.gov.in/Webform/cyber_suspect.aspx';

export const FINANCIAL_FRAUD_NOTE = 'Financial cyber fraud? Report immediately by calling 1930.';

export const shouldShowReportOption = (riskScore: number | string): boolean => {
  return Number(riskScore) >= REPORT_THRESHOLD;
};

/**
 * Checks whether the detection flags/signals or target content
 * indicate financial fraud, banking, payment, OTP, UPI, card, or account compromise.
 */
export const hasFinancialContext = (result: Partial<ScanResult> & { flags?: string[] }): boolean => {
  const financialPattern = /\b(bank|banking|payment|financial|fraud|otp|upi|card|wallet|billing|account)\b/i;

  const flagSources = [
    ...(result.signals || []),
    ...(result.flags || []),
    result.url || '',
    result.message_snippet || ''
  ];

  return flagSources.some((item) => financialPattern.test(item));
};

export const getReportSupportingText = (type: 'url' | 'message'): string => {
  if (type === 'url') {
    return 'This URL has been identified as high-risk. If you believe it is involved in a cybercrime or scam, you can report it through the official Government of India Cyber Crime Reporting Portal.';
  }
  return 'Potentially suspicious message detected. If you believe this message is part of a cybercrime or scam, you can report it through the official Government of India Cyber Crime Reporting Portal.';
};
