import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, RefreshCw, Bot, User, X, MessageSquare } from 'lucide-react';
import { askAssistant, ScanResult } from '../api/client';

interface NovaAssistantWidgetProps {
  currentScanContext?: ScanResult | null;
  initialQuestion?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const NovaAssistantWidget: React.FC<NovaAssistantWidgetProps> = ({
  currentScanContext,
  initialQuestion,
  isOpen,
  onToggle,
  onClose,
}) => {
  const [question, setQuestion] = useState(initialQuestion || '');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; grounded?: boolean }>>([
    {
      sender: 'bot',
      text: 'Hello! I am Nova, your Digital Safety Companion. Ask me any question about a suspicious message, link, or digital safety practice.',
      grounded: true,
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    const userText = question.trim();
    setQuestion('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await askAssistant(userText, currentScanContext || undefined);
      setMessages((prev) => [...prev, { sender: 'bot', text: res.answer, grounded: res.grounded }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I couldn't process that question right now. Always remember: never share sensitive passwords or credentials over unverified messages.",
          grounded: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Why is this flagged?',
    'What if I clicked a scam link?',
    'How do I verify a bank email?',
  ];

  return (
    <>
      {/* Floating Circular Trigger Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF5A00] to-[#FF9D1C] text-white shadow-xl shadow-[#FF5A00]/30 flex items-center justify-center border-2 border-white/20 focus:outline-none"
          aria-label="Toggle Nova AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#050505] rounded-full animate-pulse" />
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[80vh] h-[580px] bg-[#101010] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-[#151515] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF5A00]/20 border border-[#FF5A00]/40 flex items-center justify-center text-[#FF5A00]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-semibold text-white leading-tight">
                    Nova — Digital Safety Companion
                  </h3>
                  <p className="text-[11px] font-sans text-zinc-400">Grounded Security Coach</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context Badge if active scan exists */}
            {currentScanContext && (
              <div className="bg-[#050505] px-3.5 py-2 border-b border-white/5 text-[11px] font-display uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span>
                  Context: {currentScanContext.type.toUpperCase()} ({currentScanContext.risk_level.toUpperCase()})
                </span>
                <span className="text-[#FF5A00] font-semibold">Grounded</span>
              </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-left text-xs font-sans">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                      msg.sender === 'user' ? 'bg-[#FF5A00] text-white' : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-[#FF5A00]" />}
                  </div>
                  <div
                    className={`p-3 rounded-xl leading-relaxed max-w-[85%] font-sans font-normal text-xs sm:text-[13px] ${
                      msg.sender === 'user'
                        ? 'bg-[#FF5A00] text-white font-medium'
                        : 'bg-[#181818] border border-white/10 text-zinc-200'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs font-sans text-zinc-400 py-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF5A00]" />
                  <span>Nova is reasoning...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Chips */}
            <div className="px-3.5 pt-2 pb-1 bg-[#0d0d0d] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuestion(q)}
                  className="text-[11px] font-sans whitespace-nowrap bg-white/5 border border-white/10 text-zinc-400 hover:text-white px-2.5 py-1 rounded-full transition-colors shrink-0"
                >
                  "{q}"
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAsk} className="p-3 bg-[#101010] border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask Nova a security question..."
                className="flex-1 bg-[#050505] border border-white/15 rounded-xl px-3 py-2 text-xs font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A00]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="btn-pill-orange px-3 py-2 flex items-center justify-center disabled:opacity-50 text-xs font-display font-semibold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
