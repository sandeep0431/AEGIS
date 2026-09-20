import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does URL threat detection work?",
      a: "Our backend extracts 33 structural, lexical, and cryptographic features (such as entropy, subdomain depth, IP host usage, special character ratios, and sensitive vocabulary) and passes them to an ML Random Forest model trained on dataset benchmarks."
    },
    {
      q: "How does message detection work?",
      a: "Messages undergo text cleaning, TF-IDF vectorization, and 22 security pattern feature extractions (including urgency phrasing, credential requests, OTP references, and link count) evaluated by a Logistic Regression model."
    },
    {
      q: "What does the Digital Safety Score mean?",
      a: "The score (0–100) is an authoritative backend calculation combining URL risk (40%), message threat risk (30%), and breach exposure (30%). A higher score represents stronger safety posture."
    },
    {
      q: "Does the AI assistant make the detection decision?",
      a: "No. Detection decisions come strictly from our dedicated trained machine learning models. Nova — Digital Safety Companion provides grounded explanations of those evidence signals to help you understand why an item was flagged."
    },
    {
      q: "Is my submitted information stored or logged?",
      a: "No raw messages, passwords, tokens, or emails are stored or logged in CloudWatch. All analysis occurs in ephemeral serverless execution memory under privacy-first design principles."
    },
    {
      q: "When can I report a threat to the Cyber Crime Portal?",
      a: "When a URL or message scan detects a high risk score of 76 or above, an official reporting option appears allowing you to report details directly to the Government of India National Cyber Crime Reporting Portal (cybercrime.gov.in). For financial fraud, you are guided to call the 1930 national helpline immediately."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto text-left">
      <div className="text-center mb-8">
        <span className="text-xs font-display font-semibold text-[#FF5A00] tracking-[0.12em] uppercase block mb-2">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h3 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
          Common Security Questions
        </h3>
      </div>

      <div className="space-y-3.5 font-sans">
        {faqs.map((faq, idx) => (
          <div 
            key={idx}
            className="bg-[#101010] border border-white/10 rounded-xl overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-medium text-white hover:text-[#FF5A00] transition-colors"
            >
              <span>{faq.q}</span>
              {openIdx === idx ? <ChevronUp className="w-4 h-4 text-[#FF5A00]" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </button>

            {openIdx === idx && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-5 pb-5 text-xs sm:text-[13px] text-zinc-400 font-normal leading-relaxed border-t border-white/5 pt-3"
              >
                {faq.a}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
