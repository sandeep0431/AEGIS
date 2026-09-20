import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  CheckCircle2, 
  XCircle,
  ShieldAlert,
  Globe,
  KeyRound,
  Package,
  Wifi,
  QrCode,
  UserCheck,
  Download,
  Key,
  CreditCard,
  Headphones,
  Zap,
  Briefcase,
  Scale,
  Smartphone
} from 'lucide-react';

interface CoachingScenario {
  id: number;
  icon: React.ReactNode;
  category: string;
  title: string;
  dont: string;
  do: string;
}

const COACHING_SCENARIOS: CoachingScenario[] = [
  {
    id: 1,
    icon: <ShieldAlert className="w-4 h-4 text-orange-400" />,
    category: 'Urgency & Phishing',
    title: 'Urgent Account Suspension Alerts',
    dont: 'Panic and click unexpected links threatening 24-hour closure or password deactivation.',
    do: 'Open a fresh browser tab and navigate directly to the verified service portal to check status.'
  },
  {
    id: 2,
    icon: <Globe className="w-4 h-4 text-sky-400" />,
    category: 'Domain Security',
    title: 'Lookalike & Deceptive Link Inspection',
    dont: 'Trust green padlock icons blindly or mistake pay-pal-support.com for paypal.com.',
    do: 'Read the root domain strictly right-to-left before the extension and use trusted bookmarks.'
  },
  {
    id: 3,
    icon: <KeyRound className="w-4 h-4 text-amber-400" />,
    category: 'Authentication',
    title: 'MFA Push Fatigue & Login Prompts',
    dont: 'Click "Approve" on repeated mobile prompts just to silence harassing notification alerts.',
    do: 'Deny unsolicited prompts immediately, report the trigger, and switch to FIDO2 passkeys or TOTP.'
  },
  {
    id: 4,
    icon: <Package className="w-4 h-4 text-yellow-400" />,
    category: 'Smishing & Delivery',
    title: 'Package Delivery & Unpaid Fee SMS',
    dont: 'Tap shortlinks claiming unpaid customs dues or download unknown courier tracking APKs.',
    do: 'Enter the legitimate tracking code directly inside the official postal carrier app.'
  },
  {
    id: 5,
    icon: <Key className="w-4 h-4 text-purple-400" />,
    category: 'Credential Hygiene',
    title: 'Password Reuse & Breach Fallout',
    dont: 'Use identical or slight variations of your primary password across multiple online accounts.',
    do: 'Store uncrackable, randomized 20+ character credentials inside a secure password vault.'
  },
  {
    id: 6,
    icon: <Wifi className="w-4 h-4 text-blue-400" />,
    category: 'Network Safety',
    title: 'Public Wi-Fi & Hotspot Hygiene',
    dont: 'Submit banking logins or confidential work credentials over open airport/café networks.',
    do: 'Rely on cellular data tethering or route all traffic through an encrypted VPN tunnel.'
  },
  {
    id: 7,
    icon: <QrCode className="w-4 h-4 text-red-400" />,
    category: 'Physical Vectors',
    title: 'QR Code "Quishing" Traps',
    dont: 'Blindly scan physical stickers placed over parking meters, bill counters, or public menus.',
    do: 'Preview the full destination URL in your camera application before confirming navigation.'
  },
  {
    id: 8,
    icon: <UserCheck className="w-4 h-4 text-rose-400" />,
    category: 'Social Engineering',
    title: 'Executive & Relative Spoofing',
    dont: 'Wire money, purchase gift cards, or divulge data following urgent messages from "executives".',
    do: 'Conduct an out-of-band verification via an established phone call before taking any action.'
  },
  {
    id: 9,
    icon: <Download className="w-4 h-4 text-teal-400" />,
    category: 'Software Defense',
    title: 'Search Ads & Utility Downloads',
    dont: 'Click sponsored search engine ad links for software tools or disable antivirus to run installers.',
    do: 'Obtain tools directly from official vendor repositories and verify file checksum signatures.'
  },
  {
    id: 10,
    icon: <CreditCard className="w-4 h-4 text-emerald-400" />,
    category: 'UPI & Payments',
    title: 'UPI "Receive Money" PIN Traps',
    dont: 'Enter your 4 or 6-digit UPI PIN or scan QR codes sent by buyers claiming they are paying you.',
    do: 'Remember: entering a UPI PIN strictly deducts money. Receiving money never requires a PIN or OTP.'
  },
  {
    id: 11,
    icon: <Headphones className="w-4 h-4 text-indigo-400" />,
    category: 'Customer Support',
    title: 'Fake Search Engine Helpline Numbers',
    dont: 'Call customer support numbers found on Google search ads, Google Maps photos, or social comments.',
    do: 'Initiate support strictly inside the official verified application or from the true company domain.'
  },
  {
    id: 12,
    icon: <Zap className="w-4 h-4 text-amber-300" />,
    category: 'Utility & Bills',
    title: 'Power / Water Cutoff SMS Threats',
    dont: 'Panic and dial the mobile number in an SMS threatening electricity disconnection tonight at 9:30 PM.',
    do: 'Inspect your real bill payment history directly on the official state electricity board portal or app.'
  },
  {
    id: 13,
    icon: <Briefcase className="w-4 h-4 text-cyan-400" />,
    category: 'Work & Income',
    title: 'Part-Time "Like & Earn" Task Scams',
    dont: 'Pay "prepaid task security deposits" to unlock earnings for liking YouTube videos or rating hotels.',
    do: 'Block unsolicited WhatsApp recruiters offering instant daily cash for trivial online tasks.'
  },
  {
    id: 14,
    icon: <Scale className="w-4 h-4 text-red-400" />,
    category: 'Impersonation',
    title: '"Digital Arrest" & Police Video Calls',
    dont: 'Transfer money to "safe government verification accounts" during intimidating Skype video calls.',
    do: 'Recognize that real police, customs, and courts never arrest or investigate people over video calls.'
  },
  {
    id: 15,
    icon: <Smartphone className="w-4 h-4 text-violet-400" />,
    category: 'Telecom & SIM',
    title: 'SIM Swap & 5G Upgrade Traps',
    dont: 'Forward SMS verification codes or approve eSIM profile transfers requested by callers posing as telecom reps.',
    do: 'Handle SIM upgrades, 5G conversions, and eSIM requests in person at official network retail stores.'
  }
];

export const MicroCoaching: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const totalCards = COACHING_SCENARIOS.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate every 5.5 seconds unless paused by user or hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, totalCards]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <section className="py-10 sm:py-16 px-3.5 sm:px-5 max-w-6xl mx-auto text-left">
      <div 
        className="bg-[#101010] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5A00]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-6 mb-5 sm:mb-8 relative z-20">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
              <Lightbulb className="w-4 h-4 text-[#FF5A00] shrink-0" />
              <span className="text-[10px] sm:text-xs font-display text-[#FF5A00] uppercase tracking-[0.12em] font-semibold">
                CONTEXTUAL SECURITY PROTOCOLS
              </span>
            </div>
            <h3 className="text-lg sm:text-3xl font-display font-semibold text-white tracking-tight leading-snug">
              What to Do vs. What NOT to Do in <span className="font-accent italic font-normal text-zinc-300">Critical Cases</span>
            </h3>
          </div>

          {/* Controls: Prev, Pause/Play, Next */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#FF5A00]/40 transition-all hover:scale-105 active:scale-95"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all active:scale-95"
              aria-label={isPaused ? "Play rotation" : "Pause rotation"}
              title={isPaused ? "Play rotation" : "Pause rotation"}
            >
              {isPaused ? <Play className="w-4 h-4 text-[#FF5A00]" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#FF5A00]/40 transition-all hover:scale-105 active:scale-95"
              aria-label="Next card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rectangular Responsive Stage */}
        <div className="relative h-[410px] xs:h-[380px] sm:h-[300px] w-full flex items-center justify-center overflow-hidden">
          
          {/* Edge Vignette Fades - desktop only to prevent clipping mobile cards */}
          <div className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#101010] to-transparent z-40" />
          <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#101010] to-transparent z-40" />

          {COACHING_SCENARIOS.map((card, i) => {
            // Shortest circular index diff relative to currentIndex
            let diff = (i - currentIndex) % totalCards;
            if (diff > totalCards / 2) diff -= totalCards;
            if (diff < -totalCards / 2) diff += totalCards;

            // Render up to 2 cards on each side for desktop, or adjacent for mobile slide
            const isVisible = isMobile ? Math.abs(diff) <= 1 : Math.abs(diff) <= 2;
            if (!isVisible) return null;

            const isCenter = diff === 0;

            // Mobile: full slide transition without overlapping dark rectangles
            // Desktop: 3D coverflow with peek
            const xOffset = isMobile 
              ? (isCenter ? 0 : (diff > 0 ? 340 : -340)) 
              : diff * 380;
            
            const scale = isMobile
              ? (isCenter ? 1 : 0.9)
              : (isCenter ? 1 : Math.max(0.82, 1 - Math.abs(diff) * 0.12));

            const opacity = isMobile
              ? (isCenter ? 1 : 0)
              : (isCenter ? 1 : Math.max(0.12, 0.45 - Math.abs(diff) * 0.18));

            const blurAmount = isMobile 
              ? 0 
              : (isCenter ? 0 : Math.min(8, Math.abs(diff) * 4));

            const zIndex = isCenter ? 30 : 20 - Math.abs(diff) * 5;

            return (
              <motion.div
                key={card.id}
                onClick={() => !isCenter && setCurrentIndex(i)}
                drag={isMobile && isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40 || info.velocity.x < -280) {
                    handleNext();
                  } else if (info.offset.x > 40 || info.velocity.x > 280) {
                    handlePrev();
                  }
                }}
                animate={{
                  x: xOffset,
                  scale: scale,
                  opacity: opacity,
                  filter: `blur(${blurAmount}px)`,
                  zIndex: zIndex
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 28
                }}
                className={`absolute w-full max-w-[96%] sm:max-w-[660px] md:max-w-[720px] rounded-2xl p-4 sm:p-6 flex flex-col justify-between select-none ${
                  isCenter
                    ? 'bg-[#0a0a0a] border border-white/20 shadow-2xl shadow-black/80 ring-1 ring-white/10 cursor-grab active:cursor-grabbing sm:cursor-default'
                    : 'bg-[#050505] border border-white/10 shadow-lg cursor-pointer hover:border-white/20 pointer-events-none sm:pointer-events-auto'
                }`}
              >
                {/* Header: Category & Scenario Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                      {card.icon}
                    </span>
                    <h4 className="text-sm sm:text-base font-display font-semibold text-white tracking-tight leading-snug">
                      {card.title}
                    </h4>
                  </div>
                  <span className="text-[10px] sm:text-xs font-display font-medium text-orange-400 sm:text-zinc-400 uppercase tracking-[0.08em] shrink-0 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/10 self-start sm:self-auto">
                    {card.category}
                  </span>
                </div>

                {/* Rectangular Split: WHAT NOT TO DO vs. WHAT TO DO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                  {/* Left: What NOT to do */}
                  <div className="p-3 sm:p-4 rounded-xl bg-red-500/[0.05] border border-red-500/25 flex flex-col justify-start">
                    <div className="flex items-center gap-1.5 text-xs font-display font-bold text-red-400 uppercase tracking-[0.08em] mb-1.5 sm:mb-2">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>WHAT NOT TO DO</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-zinc-300 font-sans font-normal leading-relaxed">
                      {card.dont}
                    </p>
                  </div>

                  {/* Right: What to do */}
                  <div className="p-3 sm:p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/25 flex flex-col justify-start">
                    <div className="flex items-center gap-1.5 text-xs font-display font-bold text-emerald-400 uppercase tracking-[0.08em] mb-1.5 sm:mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>WHAT TO DO</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-zinc-300 font-sans font-normal leading-relaxed">
                      {card.do}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Minimal Bottom Pill Indicators & Mobile Swipe Hint */}
        <div className="flex flex-col items-center gap-2 pt-3 sm:pt-4 mt-2 relative z-20">
          <div className="flex items-center justify-center gap-1.5">
            {COACHING_SCENARIOS.map((scenario, idx) => (
              <button
                key={scenario.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'w-7 bg-[#FF5A00]' 
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Jump to scenario ${idx + 1}`}
              />
            ))}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono sm:hidden">
            Swipe card or tap arrows ({currentIndex + 1} of {totalCards})
          </p>
        </div>
      </div>
    </section>
  );
};
