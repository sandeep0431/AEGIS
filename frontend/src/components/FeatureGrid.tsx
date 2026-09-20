import React from 'react';
import { Search, MessageSquare, Shield, Activity, Bot, Lightbulb, ShieldAlert, QrCode } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-[#FF5A00]" />,
      title: "URL Threat Detection",
      desc: "33 structural feature extraction pipeline powered by Random Forest ML models trained on PhiUSIIL datasets."
    },
    {
      icon: <QrCode className="w-6 h-6 text-[#FF5A00]" />,
      title: "QR / Quishing Scanner",
      desc: "100% client-side QR image decoder. Inspects destination links from screenshots before you take the click."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[#FF5A00]" />,
      title: "Message & SMS Detection",
      desc: "TF-IDF text vectorization + 22 security pattern indicators evaluating scam, urgency, and credential requests."
    },
    {
      icon: <Shield className="w-6 h-6 text-[#FF5A00]" />,
      title: "Password Safety Check",
      desc: "Free Have I Been Pwned Pwned Passwords verification using SHA-1 k-anonymity without ever revealing your password."
    },
    {
      icon: <Activity className="w-6 h-6 text-[#FF5A00]" />,
      title: "Digital Safety Score",
      desc: "Authoritative weighted scoring formula combining link safety, message risk, and exposure history into a 0–100 score."
    },
    {
      icon: <Bot className="w-6 h-6 text-[#FF5A00]" />,
      title: "Nova AI Safety Companion",
      desc: "Grounded LLM explanations powered by Nova, clarifying technical risk signals in simple, friendly terms."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-[#FF5A00]" />,
      title: "In-Context Micro-Coaching",
      desc: "Contextual guidance teaching user safety habits at the exact moment they evaluate suspicious activity."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-[#FF5A00]" />,
      title: "Cyber Crime Portal Reporting",
      desc: "Direct reporting action to the official Government of India Cyber Crime Reporting Portal for threats with risk score ≥ 76, with 1930 financial helpline guidance."
    }
  ];

  return (
    <section className="py-20 px-5 max-w-6xl mx-auto text-center">
      <div className="mb-12">
        <span className="text-xs font-display font-semibold text-[#FF5A00] tracking-[0.12em] uppercase block mb-2">
          CORE CAPABILITIES
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
          Built for Everyday <span className="font-accent italic font-normal text-zinc-300">Safety</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {features.map((item, idx) => (
          <div 
            key={idx}
            className="bg-[#101010] border border-white/10 hover:border-[#FF5A00]/40 rounded-2xl p-6 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-lg font-display font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-xs text-zinc-400 font-sans font-normal leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
