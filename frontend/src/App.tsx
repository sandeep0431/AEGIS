import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveParticles } from './components/InteractiveParticles';
import { SecurityCheck } from './components/SecurityCheck';
import { MicroCoaching } from './components/MicroCoaching';
import { PostureAndExposureSection } from './components/PostureAndExposureSection';
import { PlatformGuideSection } from './components/PlatformGuideSection';
import { NovaAssistantWidget } from './components/NovaAssistantWidget';
import { Footer } from './components/Footer';
import { ScanResult } from './api/client';
import './styles/design-system.css';

export function App() {
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [assistantQuestion, setAssistantQuestion] = useState<string>('');
  const [isNovaOpen, setIsNovaOpen] = useState<boolean>(false);
  const [credentialChecked, setCredentialChecked] = useState<boolean>(false);
  const [credentialCompromised, setCredentialCompromised] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScanResult = (result: ScanResult) => {
    setCurrentScan(result);
  };

  const handleAskAssistant = (question: string) => {
    setAssistantQuestion(question);
    setIsNovaOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] relative selection:bg-[#FF5A00] selection:text-white">
      
      {/* Subtle Interactive Mouse Particles */}
      <InteractiveParticles />

      {/* Fixed Navbar */}
      <Navbar 
        onScanClick={() => scrollToSection('scan')} 
        onOpenNova={() => setIsNovaOpen(true)}
      />

      {/* Main 4-Section Flow */}
      <main className="space-y-4 md:space-y-8 relative z-10">
        
        {/* SECTION 1: Hero with Interactive 3D Metallic Ring */}
        <Hero 
          onScanClick={() => scrollToSection('scan')} 
          onExploreClick={() => scrollToSection('posture')} 
        />

        {/* SECTION 2: Threat Scanner & In-Context Guidance */}
        <section id="scan" className="scroll-mt-24">
          <SecurityCheck 
            onResultReceived={handleScanResult}
            onAskAssistant={handleAskAssistant}
          />
          <MicroCoaching />
        </section>

        {/* SECTION 3: Security Posture & Credential Safety Hub (2-Column Dashboard) */}
        <PostureAndExposureSection 
          urlRisk={currentScan?.type === 'url' ? currentScan.risk_score : 0}
          messageRisk={currentScan?.type === 'message' ? currentScan.risk_score : 0}
          credentialChecked={credentialChecked}
          credentialCompromised={credentialCompromised}
          onCredentialResult={(compromised) => {
            setCredentialChecked(true);
            setCredentialCompromised(compromised);
          }}
        />

        {/* SECTION 4: Platform Guide & FAQ (Workflow, Capabilities, FAQ, Final CTA) */}
        <PlatformGuideSection onScanClick={() => scrollToSection('scan')} />

      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Nova AI Assistant Round Side Widget */}
      <NovaAssistantWidget 
        isOpen={isNovaOpen}
        onToggle={() => setIsNovaOpen(!isNovaOpen)}
        onClose={() => setIsNovaOpen(false)}
        currentScanContext={currentScan}
        initialQuestion={assistantQuestion}
      />

    </div>
  );
}

export default App;
