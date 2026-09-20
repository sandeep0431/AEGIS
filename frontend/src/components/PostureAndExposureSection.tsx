import React from 'react';
import { SecurityScore } from './SecurityScore';
import { CredentialSafety } from './CredentialSafety';

interface PostureAndExposureSectionProps {
  urlRisk?: number;
  messageRisk?: number;
  credentialChecked?: boolean;
  credentialCompromised?: boolean;
  onCredentialResult?: (compromised: boolean) => void;
}

export const PostureAndExposureSection: React.FC<PostureAndExposureSectionProps> = ({
  urlRisk = 0,
  messageRisk = 0,
  credentialChecked = false,
  credentialCompromised = false,
  onCredentialResult,
}) => {
  return (
    <section id="posture" className="py-20 px-5 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-display font-semibold text-[#FF5A00] tracking-[0.12em] uppercase block mb-2">
          POSTURE & CREDENTIAL INTELLIGENCE
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
          Safety Posture & Credential <span className="font-accent italic font-normal text-zinc-300">Safety</span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-3 font-sans font-normal leading-relaxed max-w-2xl mx-auto">
          Monitor your weighted digital security score and check password breach exposure with k-anonymity privacy in real time.
        </p>
      </div>

      {/* 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="h-full">
          <SecurityScore
            urlRisk={urlRisk}
            messageRisk={messageRisk}
            credentialChecked={credentialChecked}
            credentialCompromised={credentialCompromised}
          />
        </div>
        <div className="h-full">
          <CredentialSafety onPasswordResult={onCredentialResult} />
        </div>
      </div>
    </section>
  );
};
