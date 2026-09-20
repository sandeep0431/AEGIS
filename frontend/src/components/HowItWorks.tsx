import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "CHECK",
      desc: "Submit a suspicious URL link, SMS message, or email exposure query."
    },
    {
      step: "02",
      title: "ANALYZE",
      desc: "Python ML model inference and verified security services evaluate structural indicators."
    },
    {
      step: "03",
      title: "UNDERSTAND",
      desc: "See exact evidence signals and grounded Nova AI explanations behind the score."
    },
    {
      step: "04",
      title: "ACT",
      desc: "Follow clear recommended security actions to protect your credentials and data."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-5 max-w-6xl mx-auto text-center scroll-mt-24">
      <div className="mb-12">
        <span className="text-xs font-display font-semibold text-[#FF5A00] tracking-[0.12em] uppercase block mb-2">
          PRODUCT WORKFLOW
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
          How Aegis <span className="font-accent italic font-normal text-zinc-300">Works</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {steps.map((item, idx) => (
          <div key={idx} className="bg-[#101010] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <span className="text-4xl font-display font-bold text-white/15 block mb-4">
              {item.step}
            </span>
            <h3 className="text-base font-display font-semibold text-[#FF5A00] tracking-wider uppercase mb-2">
              {item.title}
            </h3>
            <p className="text-xs text-zinc-400 font-sans font-normal leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
