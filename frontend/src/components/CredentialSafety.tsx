import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, AlertTriangle, RefreshCw, KeyRound, Lock } from 'lucide-react';
import { checkPasswordExposure, PasswordCheckResult } from '../api/client';

interface CredentialSafetyProps {
  onPasswordResult?: (compromised: boolean) => void;
}

export const CredentialSafety: React.FC<CredentialSafetyProps> = ({ onPasswordResult }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PasswordCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pure JavaScript SHA-1 fallback for environments where window.crypto.subtle is unavailable
  // (e.g. non-localhost HTTP, mobile network IP, embedded webviews, older browsers)
  const sha1Fallback = (str: string): string => {
    const utf8 = unescape(encodeURIComponent(str));
    const words: number[] = [];
    for (let i = 0; i < utf8.length; i++) {
      words[i >> 2] = (words[i >> 2] || 0) | ((utf8.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8));
    }
    const strLen = utf8.length * 8;
    words[strLen >> 5] = (words[strLen >> 5] || 0) | (0x80 << (24 - (strLen % 32)));
    const totalLen = (((strLen + 64) >> 9) << 4) + 15;
    while (words.length <= totalLen) words.push(0);
    words[totalLen] = strLen;

    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;

    const w = new Array(80);
    for (let i = 0; i < words.length; i += 16) {
      const oldA = a;
      const oldB = b;
      const oldC = c;
      const oldD = d;
      const oldE = e;

      for (let j = 0; j < 80; j++) {
        if (j < 16) {
          w[j] = words[i + j] || 0;
        } else {
          const t = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = (t << 1) | (t >>> 31);
        }

        let f: number, k: number;
        if (j < 20) {
          f = (b & c) | (~b & d);
          k = 1518500249;
        } else if (j < 40) {
          f = b ^ c ^ d;
          k = 1859775393;
        } else if (j < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = -1894007588;
        } else {
          f = b ^ c ^ d;
          k = -899497514;
        }

        const temp = (((a << 5) | (a >>> 27)) + f + e + k + (w[j] | 0)) | 0;
        e = d;
        d = c;
        c = (b << 30) | (b >>> 2);
        b = a;
        a = temp;
      }

      a = (a + oldA) | 0;
      b = (b + oldB) | 0;
      c = (c + oldC) | 0;
      d = (d + oldD) | 0;
      e = (e + oldE) | 0;
    }

    const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
    return (toHex(a) + toHex(b) + toHex(c) + toHex(d) + toHex(e)).toUpperCase();
  };

  const hashPasswordSha1 = async (plainText: string): Promise<{ prefix: string; suffix: string }> => {
    let hashHex = '';

    // If Web Crypto API is available in a secure context (HTTPS / localhost)
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
      try {
        const encoded = new TextEncoder().encode(plainText);
        const hashBuffer = await window.crypto.subtle.digest('SHA-1', encoded);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      } catch {
        hashHex = sha1Fallback(plainText);
      }
    } else {
      // Fallback for non-secure contexts (e.g. IP access http://192.168.x.x, webviews)
      hashHex = sha1Fallback(plainText);
    }
    
    return {
      prefix: hashHex.slice(0, 5),
      suffix: hashHex.slice(5)
    };
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Privacy: SHA-1 k-anonymity hashing locally in browser
      const { prefix, suffix } = await hashPasswordSha1(password);
      
      // Call backend with only 5-char prefix and 35-char suffix
      const res = await checkPasswordExposure(prefix, suffix);
      setResult(res);
      if (onPasswordResult) {
        onPasswordResult(res.compromised);
      }
    } catch (err: any) {
      setError(err.message || 'Exposure check temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101010] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl h-full flex flex-col justify-between text-left">
      
      {/* Header */}
      <div>
        <div className="border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-4 h-4 text-[#FF5A00]" />
            <span className="text-xs font-display text-[#FF5A00] tracking-[0.12em] uppercase font-semibold">
              CREDENTIAL SAFETY
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight">
            Password Safety Check
          </h3>
          <p className="text-xs sm:text-[13px] font-sans text-zinc-400 mt-1 leading-relaxed">
            Check whether a password has appeared in known data breaches.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCheck} className="space-y-4 mb-6">
          <div className="relative">
            <label htmlFor="pwd-input" className="sr-only">Enter password</label>
            <input 
              id="pwd-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              required
              className="w-full bg-[#050505] border border-white/15 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5A00] transition-colors pr-12 font-mono"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full btn-pill-orange text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 py-3 font-display font-semibold"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>CHECKING...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>CHECK PASSWORD</span>
              </>
            )}
          </button>
        </form>

        {/* Result Card */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-5 border text-left ${
              result.compromised 
                ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              {result.compromised ? (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-display font-semibold text-white">
                  {result.compromised ? '⚠ Compromised Password' : '✓ No Known Exposure'}
                </h4>
                
                {result.compromised ? (
                  <>
                    <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                      This password has appeared in known data breaches.
                    </p>
                    <div className="inline-block px-2.5 py-1 rounded bg-black/40 border border-red-500/20 text-xs font-display text-red-400 font-bold">
                      Exposure count: {result.count.toLocaleString()}
                    </div>
                    <p className="text-xs text-zinc-300 pt-1 font-sans leading-relaxed">
                      <strong className="font-semibold text-white">Recommendation:</strong> Change this password immediately and avoid reusing it across services.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                      This password was not found in the Have I Been Pwned Pwned Passwords dataset.
                    </p>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Still use a unique password and enable MFA where possible.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 text-left">
            {error}
          </div>
        )}
      </div>

      {/* Privacy Note & Attribution */}
      <div className="border-t border-white/5 pt-4 mt-6 space-y-1.5 text-[11px] font-mono text-zinc-500">
        <p>Your password is checked using privacy-preserving k-anonymity.</p>
        <p className="text-[10px] text-zinc-600">Powered by Have I Been Pwned Pwned Passwords.</p>
      </div>

    </div>
  );
};
