
import React, { useState, useRef, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
import Hero from './components/Hero';
import LoveLetterGenerator from './components/LoveLetterGenerator';
import LoveMaze from './components/LoveMaze';
import GiftVisualizer from './components/GiftVisualizer';
import LoveJar from './components/LoveJar';
import ValentineProposal from './components/ValentineProposal';
import BackgroundMusic from './components/BackgroundMusic';
import { Heart, Lock, Sparkles, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [personalization] = useState({
    userName: 'Yakee',
    partnerName: 'Alliah',
    memories: 'Every moment with you is a new favorite memory, from our first date to our quiet evenings together.',
    isOnboarded: true,
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [unlockedProgress, setUnlockedProgress] = useState<string[]>(['hero']);
  const [currentSection, setCurrentSection] = useState('hero');
  const [musicStarted, setMusicStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'hero', label: 'Cover' },
    { id: 'letter', label: 'I' },
    { id: 'maze', label: 'II' },
    { id: 'gift', label: 'III' },
    { id: 'gallery', label: 'IV' },
    { id: 'proposal', label: 'Vow' }
  ];

  // Track scroll position to update current active section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollPos = containerRef.current.scrollTop;
      const height = containerRef.current.offsetHeight;
      const index = Math.round(scrollPos / height);
      if (sections[index] && sections[index].id !== currentSection) {
        setCurrentSection(sections[index].id);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [currentSection, sections]);

  const handleNav = (id: string) => {
    if (!unlockedProgress.includes(id)) return;
    performScroll(id);
  };

  const performScroll = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      setIsTransitioning(true);
      target.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(id);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  const completeTask = (currentId: string, nextId?: string, autoScroll: boolean = true) => {
    if (nextId && !unlockedProgress.includes(nextId)) {
      setUnlockedProgress(prev => {
        const nextProgress = [...prev, nextId];
        if (autoScroll) {
          setTimeout(() => {
            performScroll(nextId);
          }, 100);
        }
        return nextProgress;
      });
    }
  };

  const isUnlocked = (id: string) => unlockedProgress.includes(id);

  return (
    <div className="relative h-full overflow-hidden bg-transparent">
      {/* Visual Overlay for Transitions */}
      <div 
        className={`fixed inset-0 z-[100] pointer-events-none bg-rose-500/5 backdrop-blur-[1px] transition-opacity duration-700 ease-in-out ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      <FloatingHearts />
      
      <BackgroundMusic shouldPlay={musicStarted} />
      
      {/* Navigation Bar */}
      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[60] px-4 w-full max-w-xs md:max-w-md pointer-events-none">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-full px-4 py-2 shadow-2xl flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pointer-events-auto">
          {sections.map((s) => {
            const unlocked = isUnlocked(s.id);
            const isCurrent = currentSection === s.id;
            return (
              <button 
                key={s.id}
                disabled={!unlocked}
                onClick={() => handleNav(s.id)} 
                className={`flex items-center justify-center gap-1 text-[9px] uppercase tracking-widest font-bold px-3 py-2 rounded-full transition-all min-h-[44px] flex-shrink-0 ${
                  isCurrent ? 'bg-rose-900 text-white' : 
                  unlocked ? 'text-rose-900 hover:bg-rose-50' : 'text-slate-300'
                }`}
              >
                {!unlocked && <Lock className="w-2.5 h-2.5" />}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Scroll Container - Always allows overflow to keep wheel active */}
      <main 
        ref={containerRef}
        className="brochure-container relative z-10 overflow-y-auto"
        tabIndex={0}
      >
        <section id="hero" className={`brochure-section ${!isUnlocked('hero') ? 'section-locked' : ''}`}>
          <Hero 
            personalization={personalization} 
            onNav={() => completeTask('hero', 'letter')}
            onFirstInteraction={() => setMusicStarted(true)} 
          />
        </section>

        <section id="letter" className={`brochure-section ${!isUnlocked('letter') ? 'section-locked' : ''}`}>
          {!isUnlocked('letter') && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
               <div className="glass px-8 py-4 rounded-full flex items-center gap-3 animate-bounce">
                 <Lock className="w-4 h-4 text-rose-600" />
                 <span className="text-xs uppercase tracking-widest font-bold text-rose-900">Unlock at the Cover</span>
               </div>
            </div>
          )}
          <LoveLetterGenerator 
            personalization={personalization} 
            onComplete={() => completeTask('letter', 'maze')}
          />
        </section>

        <section id="maze" className={`brochure-section ${!isUnlocked('maze') ? 'section-locked' : ''}`}>
          {!isUnlocked('maze') && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
               <div className="glass px-8 py-4 rounded-full flex items-center gap-3 animate-bounce">
                 <Lock className="w-4 h-4 text-rose-600" />
                 <span className="text-xs uppercase tracking-widest font-bold text-rose-900">Finish the Letter First</span>
               </div>
            </div>
          )}
          <LoveMaze 
            personalization={personalization} 
            onWin={() => completeTask('maze', 'gift', false)}
            onNext={() => performScroll('gift')}
          />
        </section>

        <section id="gift" className={`brochure-section ${!isUnlocked('gift') ? 'section-locked' : ''}`}>
          {!isUnlocked('gift') && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
               <div className="glass px-8 py-4 rounded-full flex items-center gap-3 animate-bounce">
                 <Lock className="w-4 h-4 text-rose-600" />
                 <span className="text-xs uppercase tracking-widest font-bold text-rose-900">Solve the Maze First</span>
               </div>
            </div>
          )}
          <GiftVisualizer 
            personalization={personalization} 
            onComplete={() => completeTask('gift', 'gallery')}
          />
        </section>

        <section id="gallery" className={`brochure-section ${!isUnlocked('gallery') ? 'section-locked' : ''}`}>
          {!isUnlocked('gallery') && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
               <div className="glass px-8 py-4 rounded-full flex items-center gap-3 animate-bounce">
                 <Lock className="w-4 h-4 text-rose-600" />
                 <span className="text-xs uppercase tracking-widest font-bold text-rose-900">View the Gallery First</span>
               </div>
            </div>
          )}
          <LoveJar 
            personalization={personalization} 
            onComplete={() => completeTask('gallery', 'proposal', false)} 
          />
        </section>

        <section id="proposal" className={`brochure-section ${!isUnlocked('proposal') ? 'section-locked' : ''}`}>
          {!isUnlocked('proposal') && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
               <div className="glass px-8 py-4 rounded-full flex items-center gap-3 animate-bounce">
                 <Lock className="w-4 h-4 text-rose-600" />
                 <span className="text-xs uppercase tracking-widest font-bold text-rose-900">Catch 5 Hearts First</span>
               </div>
            </div>
          )}
          <ValentineProposal personalization={personalization} />
        </section>

        <footer className="brochure-section bg-rose-950 text-rose-100 overflow-hidden relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/20 blur-[150px] animate-pulse rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-900/40 blur-[150px] animate-pulse rounded-full pointer-events-none" style={{ animationDelay: '2s' }} />

          <div className="max-w-6xl mx-auto px-6 text-center w-full relative z-10 py-12">
            <div className="reveal space-y-8 md:space-y-12">
              <div className="flex justify-center items-center gap-4 md:gap-6">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-rose-400 animate-spin-slow" />
                <div className="h-px w-12 md:w-32 bg-rose-800"></div>
                <Heart className="w-8 h-8 md:w-12 md:h-12 fill-rose-600 text-rose-600 animate-pulse" />
                <div className="h-px w-12 md:w-32 bg-rose-800"></div>
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-rose-400 animate-spin-slow" />
              </div>
              
              <div className="space-y-2 md:space-y-4">
                <h2 className="text-[14vw] md:text-[10rem] font-script leading-none text-white drop-shadow-2xl">
                  I Love You
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
                  <span className="text-lg md:text-3xl font-serif italic text-rose-300 tracking-[0.2em] uppercase font-light">Forever & Always</span>
                  <div className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping hidden md:block" />
                  <span className="text-lg md:text-3xl font-serif italic text-rose-300 tracking-[0.2em] uppercase font-light">My Pochi Ko</span>
                </div>
              </div>

              <p className="text-xl md:text-4xl font-serif text-white/80 italic font-light max-w-2xl mx-auto border-t border-b border-white/10 py-8 md:py-10 leading-relaxed px-4">
                "Ikaw ang pinakamagandang tula na naisulat sa aking buhay."
              </p>

              <div className="pt-12 md:pt-20 space-y-8">
                <div className="flex flex-col items-center gap-4">
                   <p className="text-[9px] md:text-xs uppercase tracking-[0.6em] text-rose-400 font-bold opacity-60">
                     A Story by Yakee for Alliah
                   </p>
                   <button 
                    onClick={() => handleNav('hero')}
                    className="group relative px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] uppercase tracking-[0.4em] text-white transition-all overflow-hidden"
                  >
                    <span className="relative z-10">Return to the Beginning</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </div>

                <div className="pt-8 md:pt-12 space-y-3 pb-20 md:pb-24 text-center opacity-30">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] font-sans font-bold text-center">
                    Private Digital Keepsake
                  </p>
                  <p className="text-[8px] md:text-[9px] font-sans tracking-widest">
                    &bull; VALENTINE'S DAY {new Date().getFullYear()} &bull;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll indicator for mouse users */}
      <div className={`fixed bottom-24 right-8 z-[55] transition-opacity duration-500 hidden md:flex flex-col items-center gap-2 ${unlockedProgress.length > 1 ? 'opacity-40' : 'opacity-0'}`}>
         <div className="h-12 w-[1px] bg-rose-200/50" />
         <ChevronDown className="w-4 h-4 text-rose-400 animate-bounce" />
      </div>
    </div>
  );
};

export default App;
