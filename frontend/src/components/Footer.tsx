import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#050505] py-12 px-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-xs">
        
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#FF5A00]" />
          <span className="text-zinc-300 font-display font-semibold uppercase tracking-wider">AEGIS DIGITAL SAFETY PLATFORM</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-400 font-sans">
          <a href="#scan" className="hover:text-white transition-colors">URL Checker</a>
          <a href="#scan" className="hover:text-white transition-colors">Message Checker</a>
          <a href="#posture" className="hover:text-white transition-colors">Credential Safety</a>
          <a href="#cyber-sense" className="hover:text-white transition-colors">Cyber Sense</a>
          <a href="#faq" className="hover:text-white transition-colors">Guide & FAQ</a>
        </div>

        <div className="font-sans text-zinc-500 text-center md:text-right">
          <span>Developed by team The ACERS</span>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs text-zinc-500 font-sans tracking-wide">
        <p>Built with AWS · Lambda · API Gateway · ECR · CloudWatch · Docker</p>
      </div>
    </footer>
  );
};
