import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, MessageSquare, Search, RefreshCw, AlertCircle, QrCode } from 'lucide-react';
import { scanUrl, scanMessage, ScanResult } from '../api/client';
import { ThreatResult } from './ThreatResult';
import { QRCodeScanner } from './QRCodeScanner';

interface SecurityCheckProps {
  onResultReceived?: (result: ScanResult) => void;
  onAskAssistant?: (question: string) => void;
}

export const SecurityCheck: React.FC<SecurityCheckProps> = ({ onResultReceived, onAskAssistant }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'qr' | 'message'>('url');
  const [resultSource, setResultSource] = useState<'url' | 'qr' | 'message'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScanUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setResultSource('url');

    try {
      const res = await scanUrl(urlInput.trim());
      setResult(res);
      if (onResultReceived) onResultReceived(res);
    } catch (err: any) {
      setError(err.message || "We couldn't complete the security check. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setResultSource('message');

    try {
      const res = await scanMessage(messageInput.trim());
      setResult(res);
      if (onResultReceived) onResultReceived(res);
    } catch (err: any) {
      setError(err.message || "We couldn't complete the security check. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="scan" className="py-20 px-5 max-w-4xl mx-auto text-center scroll-mt-24">
      
      {/* Section Header */}
      <div className="mb-8">
        <span className="text-xs font-display font-semibold text-[#FF5A00] tracking-[0.12em] uppercase block mb-2">
          PRIMARY SECURITY ANALYSIS
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
          What do you want to <span className="font-accent italic font-normal text-zinc-300">check?</span>
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8 border-b border-white/10 pb-4 flex-wrap">
        <button
          onClick={() => { setActiveTab('url'); setError(null); }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all ${
            activeTab === 'url'
              ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25'
              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>URL Checker</span>
        </button>

        <button
          onClick={() => { setActiveTab('qr'); setError(null); }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all ${
            activeTab === 'qr'
              ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25'
              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>QR Scanner</span>
        </button>

        <button
          onClick={() => { setActiveTab('message'); setError(null); }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all ${
            activeTab === 'message'
              ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25'
              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Message Checker</span>
        </button>
      </div>

      {/* Scanner Input Card */}
      <div className="bg-[#101010] border border-white/10 rounded-2xl p-4 sm:p-8 shadow-2xl relative">
        {activeTab === 'url' ? (
          <form onSubmit={handleScanUrl} className="space-y-4">
            <div className="text-left">
              <label htmlFor="url-input" className="block text-xs font-display font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Paste a suspicious link or URL
              </label>
              <div className="relative">
                <input
                  id="url-input"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. https://secure-verify-account.com/login"
                  className="w-full bg-[#050505] border border-white/15 rounded-xl px-4 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5A00] transition-colors pr-12 font-mono"
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Link2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="w-full btn-pill-orange text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-display font-semibold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing URL Features...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze URL</span>
                </>
              )}
            </button>
          </form>
        ) : activeTab === 'qr' ? (
          <QRCodeScanner
            analyzing={loading}
            onAnalyzeUrl={async (decodedUrl) => {
              setLoading(true);
              setError(null);
              setResult(null);
              setResultSource('qr');

              try {
                const res = await scanUrl(decodedUrl);
                setResult(res);
                if (onResultReceived) onResultReceived(res);
              } catch (err: any) {
                setError(err.message || "We couldn't complete the security check. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
            onClear={() => {
              setResult(null);
              setError(null);
            }}
          />
        ) : (
          <form onSubmit={handleScanMessage} className="space-y-4">
            <div className="text-left">
              <label htmlFor="message-input" className="block text-xs font-display font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Paste suspicious message or SMS text
              </label>
              <textarea
                id="message-input"
                rows={4}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="e.g. URGENT: Your account has been suspended! Verify your password immediately at http://bit.ly/login"
                className="w-full bg-[#050505] border border-white/15 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5A00] transition-colors font-sans font-normal resize-none leading-relaxed"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !messageInput.trim()}
              className="w-full btn-pill-orange text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-display font-semibold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Message Patterns...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-6 text-left flex items-start gap-3 text-red-300 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Security Check Unavailable</p>
            <p className="text-xs text-red-300/80">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Live Result State */}
      {result && (
        <ThreatResult 
          result={result} 
          sourceLabel={resultSource === 'qr' ? 'Detected via QR Code' : undefined}
          onAskAssistant={(q) => {
            if (onAskAssistant) onAskAssistant(q);
          }} 
        />
      )}

    </section>
  );
};
