import React, { useState } from 'react';
import { Shield, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onScanClick: () => void;
  onOpenNova: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScanClick, onOpenNova }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 h-16 md:h-20 transition-all">
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-full flex items-center justify-between">
        
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 text-white group">
          <div className="w-9 h-9 rounded-full bg-[#FF5A00]/15 border border-[#FF5A00]/40 flex items-center justify-center text-[#FF5A00] group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">AEGIS</span>
          <span className="text-[10px] font-display font-semibold tracking-[0.14em] text-zinc-400 uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10">SAFETY</span>
        </a>

        {/* Desktop Nav Links: strictly mapping to the 4 compact sections + Nova */}
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-sans font-medium">
          <a href="#scan" className="hover:text-white transition-colors">Threat Scanner</a>
          <a href="#posture" className="hover:text-white transition-colors">Posture & Credentials</a>
          <a href="#cyber-sense" className="hover:text-white transition-colors">Cyber Sense</a>
          <a href="#faq" className="hover:text-white transition-colors">Guide & FAQ</a>
          <button 
            onClick={onOpenNova}
            className="flex items-center gap-1.5 text-[#FF5A00] hover:text-[#FF9D1C] transition-colors font-display text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Nova</span>
          </button>
        </div>

        {/* Desktop Action Button */}
        <div className="hidden md:block">
          <button 
            onClick={onScanClick}
            className="btn-pill-primary text-xs uppercase tracking-wider font-display font-semibold"
          >
            Check Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-300 hover:text-white p-2"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden bg-[#050505] border-b border-white/10 px-6 py-6 space-y-4 text-center">
          <a 
            href="#scan" 
            onClick={() => setMobileOpen(false)}
            className="block text-zinc-300 hover:text-white text-base py-2 font-medium"
          >
            Threat Scanner
          </a>
          <a 
            href="#posture" 
            onClick={() => setMobileOpen(false)}
            className="block text-zinc-300 hover:text-white text-base py-2 font-medium"
          >
            Posture & Credentials
          </a>
          <a 
            href="#cyber-sense" 
            onClick={() => setMobileOpen(false)}
            className="block text-zinc-300 hover:text-white text-base py-2 font-medium"
          >
            Cyber Sense
          </a>
          <a 
            href="#faq" 
            onClick={() => setMobileOpen(false)}
            className="block text-zinc-300 hover:text-white text-base py-2 font-medium"
          >
            Guide & FAQ
          </a>
          <button 
            onClick={() => { setMobileOpen(false); onOpenNova(); }}
            className="block w-full text-center text-[#FF5A00] hover:text-[#FF9D1C] text-base py-2 font-medium font-mono"
          >
            ✦ Ask Nova AI Assistant
          </button>
          <div className="pt-2">
            <button 
              onClick={() => { setMobileOpen(false); onScanClick(); }}
              className="w-full btn-pill-orange text-sm uppercase tracking-wider"
            >
              Check Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
