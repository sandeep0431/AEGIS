import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { getSecurityScore, SafetyScoreResult } from '../api/client';

interface SecurityScoreProps {
  urlRisk?: number;
  messageRisk?: number;
  credentialChecked?: boolean;
  credentialCompromised?: boolean;
}

export const SecurityScore: React.FC<SecurityScoreProps> = ({ 
  urlRisk = 0, 
  messageRisk = 0, 
  credentialChecked = false, 
  credentialCompromised = false 
}) => {
  const [scoreData, setScoreData] = useState<SafetyScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scoreError, setScoreError] = useState(false);

  useEffect(() => {
    fetchScore();
  }, [urlRisk, messageRisk, credentialChecked, credentialCompromised]);

  const fetchScore = async () => {
    setLoading(true);
    setScoreError(false);
    try {
      const res = await getSecurityScore(urlRisk, messageRisk, credentialChecked, credentialCompromised);
      setScoreData(res);
    } catch (e) {
      setScoreError(true);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40';
    if (score >= 75) return 'text-emerald-400 border-emerald-500/40';
    if (score >= 50) return 'text-amber-400 border-amber-500/40';
    return 'text-red-400 border-red-500/40';
  };

  const credentialSafetyValue = scoreData?.breakdown?.credential_safety;
  const isCredentialChecked = credentialSafetyValue !== null && credentialSafetyValue !== undefined;

  return (
    <div className="bg-[#101010] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
          <div>
            <span className="text-xs font-display font-semibold text-[#FF5A00] tracking-[0.12em] uppercase block mb-1">
              POSTURE EVALUATION
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight">
              Digital Safety Score
            </h3>
          </div>
          <button 
            onClick={fetchScore} 
            disabled={loading}
            className="text-xs font-display font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 transition-colors uppercase tracking-wider"
            aria-label="Refresh Security Score"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error state — shown only when the /score API call failed */}
        {scoreError && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <p className="text-sm text-zinc-400 font-sans">Safety score unavailable right now.</p>
            <button
              onClick={fetchScore}
              className="text-xs font-display font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 transition-colors uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading skeleton while first fetch is in progress */}
        {loading && !scoreData && !scoreError && (
          <div className="flex items-center justify-center py-10 gap-2 text-zinc-500 text-xs font-sans">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF5A00]" />
            <span>Loading score...</span>
          </div>
        )}

        {/* Gauge & Main Label */}
        {scoreData && !scoreError && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 bg-[#050505] p-5 rounded-xl border border-white/5">
              <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(scoreData.score)}`}>
                <span className="text-3xl font-display font-bold text-white tracking-tight">{scoreData.score}</span>
                <span className="text-[10px] font-sans font-medium text-zinc-500">/ 100</span>
              </div>
              <div className="text-left">
                <span className="text-xs font-display uppercase tracking-[0.08em] text-[#FF5A00] font-semibold block mb-1">
                  Status: {scoreData.label}
                </span>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {scoreData.summary}
                </p>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-4 text-left font-sans">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">URL Safety (40% Weight)</span>
                  <span className="text-zinc-200 font-display font-semibold">{scoreData.breakdown.url_safety}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${scoreData.breakdown.url_safety}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-[#FF5A00]" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Message Safety (30% Weight)</span>
                  <span className="text-zinc-200 font-display font-semibold">{scoreData.breakdown.message_safety}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${scoreData.breakdown.message_safety}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full bg-[#FF9D1C]" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Credential Safety (30% Weight)</span>
                  {isCredentialChecked ? (
                    <span className={`font-display font-semibold ${credentialSafetyValue! >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {credentialSafetyValue}%
                    </span>
                  ) : (
                    <span className="text-zinc-500 font-medium">Not Checked</span>
                  )}
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  {isCredentialChecked ? (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${credentialSafetyValue}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full ${credentialSafetyValue! >= 75 ? 'bg-emerald-400' : 'bg-red-500'}`} 
                    />
                  ) : (
                    <div className="h-full w-full bg-white/5" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-[11px] font-mono text-zinc-500 text-left border-t border-white/5 pt-4 mt-6">
        Authoritative backend calculation. No client-side formula tampering.
      </div>

    </div>
  );
};