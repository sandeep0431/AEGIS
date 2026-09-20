import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { allCyberSenseQuestions, CyberSenseQuestion, CyberSenseOption } from '../data/cyberSenseQuestions';

interface CyberSenseProps {
  onScanClick?: () => void;
}

export const CyberSense: React.FC<CyberSenseProps> = () => {
  // Store recent question IDs to prevent immediate repeats (buffer of last 5)
  const recentIdsRef = useRef<string[]>([]);
  const timerRef = useRef<number | null>(null);

  // Helper to pick a random question avoiding recent ones
  const pickRandomQuestion = useCallback((): CyberSenseQuestion => {
    const available = allCyberSenseQuestions.filter(
      (q) => !recentIdsRef.current.includes(q.id)
    );
    const pool = available.length > 0 ? available : allCyberSenseQuestions;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    // Update recent IDs buffer
    recentIdsRef.current = [...recentIdsRef.current.slice(-4), chosen.id];
    return chosen;
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState<CyberSenseQuestion>(() => pickRandomQuestion());
  const [selectedOption, setSelectedOption] = useState<CyberSenseOption | null>(null);

  // Handler to advance to another thought
  const nextThought = useCallback(() => {
    setSelectedOption(null);
    setCurrentQuestion(pickRandomQuestion());
  }, [pickRandomQuestion]);

  // Silent automatic rotation between 2 and 3 minutes (120,000ms to 180,000ms)
  const scheduleNextRotation = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Randomized delay between 120s (2m) and 180s (3m)
    const randomizedDelay = Math.floor(Math.random() * 60000) + 120000;

    timerRef.current = window.setTimeout(() => {
      nextThought();
    }, randomizedDelay);
  }, [nextThought]);

  // Set up timer whenever question changes or on mount
  useEffect(() => {
    scheduleNextRotation();

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestion, scheduleNextRotation]);

  const handleSelectOption = (option: CyberSenseOption) => {
    if (selectedOption) return; // Prevent multiple clicks
    setSelectedOption(option);
  };

  return (
    <section id="cyber-sense" className="py-6 max-w-5xl mx-auto scroll-mt-24">
      {/* Clean bordered card with restrained AEGIS aesthetic */}
      <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 sm:p-9 shadow-lg relative overflow-hidden transition-all duration-300 hover:border-white/15">
        
        {/* Subtle orange accent bar at top border */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF5A00]/40 to-transparent" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FF5A00] font-semibold">
                INTERACTIVE HABIT CHECK
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-white flex items-baseline gap-2">
              <span>CYBER</span>
              <span className="font-accent italic font-normal text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF9D1C] via-[#FF5A00] to-[#D93600]">
                Sense
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1.5">
              One small question. <span className="font-accent italic font-normal text-zinc-200 text-sm sm:text-base">One safer habit.</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
              A Quick Safety Check
            </span>
          </div>
        </div>

        {/* Dynamic Interactive Body */}
        <div className="pt-6 min-h-[190px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!selectedOption ? (
              /* QUESTION STATE */
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Scenario text */}
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                    Real-World Scenario
                  </p>
                  <p className="text-base sm:text-lg font-sans font-medium text-white leading-relaxed max-w-3xl">
                    {currentQuestion.scenario}
                  </p>
                </div>

                {/* Prompt & Options */}
                <div className="space-y-3 pt-1">
                  <p className="text-xs font-display font-semibold tracking-wider text-[#FF5A00] uppercase">
                    {currentQuestion.prompt}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(option)}
                        className="group text-left p-3.5 sm:p-4 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#FF5A00]/40 transition-all duration-200 flex flex-col justify-between focus:outline-none focus:ring-1 focus:ring-[#FF5A00]/60 active:scale-[0.99]"
                      >
                        <span className="text-xs sm:text-sm text-zinc-300 group-hover:text-white font-sans leading-snug">
                          {option.text}
                        </span>
                        <span className="mt-3 text-[10px] font-mono text-zinc-600 group-hover:text-[#FF5A00] transition-colors flex items-center gap-1">
                          Option 0{idx + 1}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* RESPONSE STATE (Inside the same card) */
              <motion.div
                key={`${currentQuestion.id}-response`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* User's choice badge */}
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="font-mono text-[11px] text-zinc-400">Your choice:</span>
                  <span className="text-zinc-300 italic font-sans truncate max-w-md">"{selectedOption.text}"</span>
                </div>

                {/* Headline & Feedback */}
                <div className="space-y-2">
                  <h4 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight">
                    <span className="font-accent italic font-normal text-2xl sm:text-3xl text-zinc-200">
                      {selectedOption.responseHeadline}
                    </span>
                  </h4>
                  <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-3xl">
                    {selectedOption.responseBody}
                  </p>
                </div>

                {/* Habit Takeaway Box */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] mt-2 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A00]/90 font-semibold block">
                      SAFER HABIT TAKEAWAY
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans font-medium leading-relaxed">
                      {selectedOption.saferHabit}
                    </p>
                  </div>
                </div>

                {/* Action button: Another thought */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={nextThought}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-semibold uppercase tracking-wider bg-white/5 hover:bg-[#FF5A00] text-zinc-300 hover:text-white border border-white/10 hover:border-transparent transition-all duration-200 group"
                  >
                    <span>Another thought</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
