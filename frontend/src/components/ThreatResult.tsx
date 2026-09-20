import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp, Sparkles, ExternalLink } from 'lucide-react';
import { ScanResult } from '../api/client';
import { shouldShowReportOption, hasFinancialContext, getReportSupportingText, CYBER_CRIME_PORTAL_URL } from '../utils/cyberCrime';

interface ThreatResultProps {
  result: ScanResult;
  onAskAssistant: (question: string) => void;
}

export const ThreatResult: React.FC<ThreatResultProps> = ({ result, onAskAssistant }) => {
  const [expanded, setExpanded] = useState(false);
  const showReport = shouldShowReportOption(result.risk_score);
  const hasFinancial = hasFinancialContext(result);

  const getStatusBadge = () => {
    switch (result.risk_level) {
      case 'critical':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          label: 'CRITICAL RISK'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
          label: 'HIGH RISK'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: <Info className="w-5 h-5 text-amber-400" />,
          label: 'MEDIUM RISK'
        };
      case 'low':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          label: 'LOW RISK'
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          label: 'SAFE'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#101010] border border-white/10 rounded-2xl p-6 sm:p-8 mt-8 text-left shadow-2xl"
    >
      {/* Header Badge & Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={`px-3.5 py-1.5 rounded-full border flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wider ${badge.bg}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>

          {result.prediction && (
            <div
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wider ${
                result.prediction.toUpperCase() === 'PHISHING'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  result.prediction.toUpperCase() === 'PHISHING' ? 'bg-red-400' : 'bg-emerald-400'
                }`}
              />
              <span>{result.prediction}</span>
            </div>
          )}

          <span className="text-xs font-display font-medium text-zinc-500 uppercase tracking-[0.12em]">
            {result.type === 'url' ? 'URL SCAN RESULT' : 'MESSAGE SCAN RESULT'}
          </span>
        </div>

        <div className="flex items-baseline gap-2 shrink-0">
          <span className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">{result.risk_score}</span>
          <span className="text-xs sm:text-sm font-sans font-medium text-zinc-500 uppercase tracking-wider">/ 100 RISK SCORE</span>
        </div>
      </div>

      {/* Target Content Snippet */}
      <div className="bg-[#050505] border border-white/5 rounded-lg p-3.5 mb-6 text-xs font-mono text-zinc-400 truncate">
        {result.type === 'url' ? (
          <span>Target: {result.url}</span>
        ) : (
          <span>Input Message: "{result.message_snippet}"</span>
        )}
      </div>

      {/* Possible Impersonation Highlighted Warning */}
      {result.impersonation?.detected && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3.5 sm:p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5A00] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-xs font-display font-bold text-[#FF5A00] tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <span>⚠ POSSIBLE IMPERSONATION</span>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-200 font-sans leading-relaxed">
              {result.impersonation.message || `Claims to represent ${result.impersonation.claimed_identity || 'the organization'}, but the linked domain doesn't match the organization's known domain.`}
            </p>
          </div>
        </div>
      )}

      {/* Detected Signals */}
      <div className="mb-6">
        <h4 className="text-xs font-display font-semibold text-zinc-400 uppercase tracking-[0.08em] mb-3">Detected Evidence Signals</h4>
        <ul className="space-y-2">
          {result.signals.map((sig, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-200 font-sans leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] mt-2 shrink-0" />
              <span>{sig}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Action */}
      <div className="bg-[#151515] border border-white/10 rounded-xl p-4 sm:p-5 mb-6">
        <h4 className="text-xs font-display font-semibold text-[#FF5A00] uppercase tracking-[0.08em] mb-1">Recommended Action</h4>
        <p className="text-sm text-zinc-200 font-sans font-normal leading-relaxed">{result.recommendation}</p>
      </div>

      {/* Ask AI Safety Assistant Action Button */}
      <div className="mb-6">
        <button
          onClick={() => onAskAssistant(`Can you explain why this ${result.type} was flagged with risk score ${result.risk_score}?`)}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-[#FF5A00]/40 bg-[#FF5A00]/[0.05] hover:bg-[#FF5A00]/15 hover:border-[#FF5A00] text-zinc-100 text-xs sm:text-sm font-display font-semibold tracking-wide transition-all group focus:outline-none focus:ring-1 focus:ring-[#FF5A00]"
        >
          <Sparkles className="w-4 h-4 text-[#FF5A00] shrink-0 group-hover:rotate-12 transition-transform" />
          <span>Ask AI Safety Assistant about this result →</span>
        </button>
      </div>

      {/* Expandable "Why was this flagged?" */}
      <div className="border-t border-white/10 pt-4">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs font-display font-medium text-zinc-400 hover:text-white py-2 transition-colors uppercase tracking-[0.08em]"
        >
          <span>WHY WAS THIS FLAGGED & WHAT IT MEANS</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="pt-3 text-xs sm:text-sm text-zinc-400 space-y-3 font-sans font-normal leading-relaxed"
          >
            <p>
              This result was evaluated by our trained ML model artifacts ({result.type === 'url' ? 'PhiUSIIL Random Forest classifier' : 'SMS Spam Logistic Regression classifier'}) trained on thousands of security threat datasets.
            </p>
            <p>
              Confidence Level: <strong className="text-zinc-200 font-medium">{Math.round(result.confidence * 100)}%</strong>. Indicators like domain length, structural entropy, urgency patterns, or sensitive keyword counts contributed to this assessment.
            </p>
          </motion.div>
        )}
      </div>

      {/* Report to Cyber Crime Portal Action (Shown only if risk_score >= 76) */}
      {showReport && (
        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="bg-[#151515] border border-white/10 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#FF5A00] shrink-0" />
              <h4 className="text-xs font-display font-semibold text-white uppercase tracking-[0.08em]">
                Report to Cyber Crime Portal
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 font-sans font-normal leading-relaxed mb-4">
              {getReportSupportingText(result.type)}
            </p>

            {hasFinancial && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-lg p-3 mb-4 flex items-start gap-2.5 text-xs sm:text-sm text-amber-300">
                <span className="font-semibold shrink-0">1930 Helpline:</span>
                <span>
                  Financial cyber fraud? Report immediately by calling{' '}
                  <a
                    href="tel:1930"
                    className="underline font-bold text-amber-200 hover:text-white"
                    aria-label="Call 1930 for financial cyber fraud"
                  >
                    1930
                  </a>
                  .
                </span>
              </div>
            )}

            <div className="pt-1">
              <a
                href={CYBER_CRIME_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Report to Cyber Crime Portal (opens official portal in a new tab)"
                className="btn-pill-orange inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider font-display font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2 focus:ring-offset-[#101010]"
              >
                <span>Report to Cyber Crime Portal →</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
};
