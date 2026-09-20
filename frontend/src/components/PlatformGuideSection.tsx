import React, { useState } from 'react';
import { HowItWorks } from './HowItWorks';
import { FeatureGrid } from './FeatureGrid';
import { FAQ } from './FAQ';
import { CyberSense } from './CyberSense';

interface PlatformGuideSectionProps {
  onScanClick: () => void;
}

export const PlatformGuideSection: React.FC<PlatformGuideSectionProps> = ({ onScanClick }) => {
  const [activeTab, setActiveTab] = useState<'how' | 'features'>('how');

  return (
    <section className="py-20 px-5 max-w-6xl mx-auto">
      
      {/* 1. Cyber Sense: Interactive Cybersecurity Awareness Interaction */}
      <div className="mb-20">
        <CyberSense onScanClick={onScanClick} />
      </div>

      {/* 2. Platform Architecture & Guidance: How It Works & Capabilities */}
      <div id="guide" className="scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-display font-semibold text-[#FF5A00] tracking-[0.12em] uppercase block mb-2">
            PLATFORM ARCHITECTURE & GUIDANCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
            How It Works & <span className="font-accent italic font-normal text-zinc-300">Capabilities</span>
          </h2>
        </div>

        {/* Tab Switcher for How It Works vs Capabilities */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('how')}
            className={`px-5 py-2 rounded-full text-xs font-display font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'how'
                ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            Workflow (4 Steps)
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-5 py-2 rounded-full text-xs font-display font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'features'
                ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            Core Capabilities (8 Features)
          </button>
        </div>

        {/* Content depending on Tab */}
        <div className="mb-20">
          {activeTab === 'how' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
              {[
                {
                  step: "01",
                  title: "CHECK",
                  desc: "Submit a suspicious URL link, QR code, SMS message, or check password safety."
                },
                {
                  step: "02",
                  title: "ANALYZE",
                  desc: "Python ML model inference evaluates structural risk features."
                },
                {
                  step: "03",
                  title: "UNDERSTAND",
                  desc: "Review evidence signals and grounded Nova AI explanations."
                },
                {
                  step: "04",
                  title: "ACT",
                  desc: "Follow recommended security actions or escalate high-risk threats directly to the Cyber Crime Portal."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#101010] border border-white/10 rounded-2xl p-6">
                  <span className="text-3xl font-display font-bold text-white/15 block mb-3">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-display font-semibold text-[#FF5A00] tracking-wider uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
              {[
                { title: "URL Threat Detection", desc: "33-feature Random Forest ML inference on suspicious domains." },
                { title: "QR / Quishing Scanner", desc: "Client-side private QR image decoder extracting destination links before you click." },
                { title: "Message Detection", desc: "TF-IDF + 22 security pattern checks for phishing and scam SMS." },
                { title: "Password Safety Check", desc: "Free HIBP Pwned Passwords verification via privacy-preserving SHA-1 k-anonymity." },
                { title: "Digital Safety Score", desc: "Authoritative weighted 40%/30%/30% scoring algorithm." },
                { title: "Nova AI Companion", desc: "Grounded LLM explanations directly accessible via the floating icon." },
                { title: "In-Context Coaching", desc: "Contextual guidance teaching proactive digital safety habits." },
                { title: "Cyber Crime Portal Reporting", desc: "Direct reporting action to the official GoI Cyber Crime Reporting Portal for threats with risk score ≥ 76, with 1930 helpline guidance." }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#101010] border border-white/10 rounded-2xl p-5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A00] block mb-3" />
                  <h4 className="text-sm font-display font-semibold text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs text-zinc-400 font-sans font-normal leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. FAQ */}
      <div id="faq" className="scroll-mt-24">
        <FAQ />
      </div>

    </section>
  );
};
