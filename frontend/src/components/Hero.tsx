import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Lock, AlertTriangle, ArrowRight } from 'lucide-react';

interface HeroProps {
  onScanClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScanClick, onExploreClick }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden flex flex-col justify-center items-center text-center px-5">

      {/* Background Radial Gradients */}
      <div className="hero-gradient-top" />
      <div className="hero-gradient-bottom" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Monospace Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
          <span className="text-xs font-display font-medium tracking-[0.12em] uppercase text-zinc-300">
            DIGITAL THREAT PROTECTION
          </span>
        </motion.div>

        {/* Hero Editorial Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white leading-[1.08] mb-6"
        >
          Know the risk before <br className="hidden sm:block" />
          you take the <span className="font-accent italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FF9D1C] via-[#FF5A00] to-[#D93600]">click.</span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans font-normal leading-[1.65] mb-10"
        >
          Check suspicious links and messages, evaluate your digital breach exposure, and receive grounded security AI guidance before a threat causes harm.
        </motion.p>

        {/* Hero Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onScanClick}
            className="w-full sm:w-auto btn-pill-orange text-sm uppercase tracking-wider flex items-center justify-center gap-2 group font-display font-semibold"
          >
            <span>Scan Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto btn-pill-primary text-sm uppercase tracking-wider font-display font-semibold"
          >
            Explore Security
          </button>
        </motion.div>

        {/* Minimal Feature Trust Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-display font-medium tracking-[0.08em] text-zinc-400 border-t border-white/10 pt-8"
        >
          <div className="flex items-center justify-center gap-2 py-1">
            <Search className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>URL SCANNING</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>PHISHING DETECTION</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1">
            <Lock className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>BREACH LOOKUP</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>SAFETY SCORING</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
