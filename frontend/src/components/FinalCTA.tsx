import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  onScanClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onScanClick }) => {
  return (
    <section className="py-24 px-5 max-w-5xl mx-auto text-center relative overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A00]/10 via-[#D93600]/15 to-[#650B05]/20 blur-3xl -z-10 rounded-3xl" />

      <div className="bg-[#101010] border border-white/10 rounded-3xl p-8 sm:p-14 relative z-10 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#FF5A00]/15 border border-[#FF5A00]/30 flex items-center justify-center text-[#FF5A00] mx-auto mb-6">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight mb-4">
          Make every click a more <br className="hidden sm:block" /> <span className="font-accent italic font-normal text-zinc-300">informed decision.</span>
        </h2>

        <p className="text-sm sm:text-base font-sans font-normal text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Detect threats, evaluate digital exposure, and build safer digital habits with real ML inference and grounded AI coaching.
        </p>

        <button
          onClick={onScanClick}
          className="btn-pill-orange text-sm uppercase tracking-wider inline-flex items-center gap-2 group font-display font-semibold"
        >
          <span>Run a Security Check</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </section>
  );
};
