
import React, { useState, useRef } from 'react';
import { Heart, Stars, PartyPopper, Sparkles } from 'lucide-react';

interface Props {
  personalization: {
    userName: string;
    partnerName: string;
  };
}

const ValentineProposal: React.FC<Props> = ({ personalization }) => {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNoButton = () => {
    if (!containerRef.current) return;
    const padding = 100;
    const btnW = 120;
    const btnH = 60;
    const availableW = window.innerWidth - padding * 2;
    const availableH = window.innerHeight - padding * 2;
    const newX = (Math.random() - 0.5) * (availableW - btnW);
    const newY = (Math.random() - 0.5) * (availableH - btnH);
    setNoButtonPos({ x: newX, y: newY });
  };

  const handleYes = () => {
    setAccepted(true);
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const h = document.createElement('div');
        h.innerHTML = '❤️';
        h.style.position = 'fixed';
        h.style.left = (Math.random() * 100) + 'vw';
        h.style.bottom = '-10vh';
        h.style.fontSize = (Math.random() * 20 + 20) + 'px';
        h.style.zIndex = '100';
        h.style.transition = `all ${Math.random() * 2 + 2}s ease-out`;
        document.body.appendChild(h);
        setTimeout(() => {
          h.style.transform = `translateY(-110vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg)`;
          h.style.opacity = '0';
        }, 50);
        setTimeout(() => h.remove(), 4000);
      }, i * 100);
    }
  };

  return (
    <div id="proposal" className="brochure-section bg-rose-950 reveal overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 w-full text-center relative flex flex-col justify-center min-h-[80dvh]" ref={containerRef}>
        <div className="glass-dark p-16 md:p-32 rounded-[5rem] border-white/10 shadow-[0_0_120px_rgba(136,19,55,0.4)] relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-500/20 blur-[100px] animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rose-400/20 blur-[100px] animate-pulse" />

          {!accepted ? (
            <div className="space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
              <div className="space-y-6">
                <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-[11px] uppercase tracking-[0.5em] font-bold text-rose-300 border border-white/10">The Vow</span>
                <h2 className="text-7xl md:text-[10rem] font-serif leading-none text-white tracking-tighter">
                  The <span className="italic text-rose-200">Question</span>
                </h2>
              </div>

              <p className="text-3xl md:text-6xl font-script text-white max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                "{personalization.partnerName}, will you be my Valentine this year and every year after?"
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-12">
                <button
                  onClick={handleYes}
                  className="px-20 py-8 bg-white text-rose-950 rounded-full font-sans text-xs uppercase tracking-[0.5em] font-extrabold hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-4"
                >
                  Yes, Always <Heart className="w-5 h-5 fill-rose-900" />
                </button>

                <button
                  onMouseEnter={moveNoButton} onTouchStart={moveNoButton}
                  style={{ transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`, transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  className="px-12 py-6 border border-white/20 rounded-full font-sans text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-16 animate-in fade-in scale-in-90 duration-1000 relative z-10">
              <div className="relative inline-block">
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-rose-100">
                    <Heart className="w-24 h-24 fill-rose-600 text-rose-600 animate-pulse" />
                  </div>
                  <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-300 animate-spin-slow" />
              </div>

              <div className="space-y-8">
                <h2 className="text-8xl md:text-[11rem] font-script text-white leading-none">I'm So Grateful.</h2>
                <p className="text-2xl md:text-4xl font-serif italic text-rose-100/80 max-w-2xl mx-auto leading-relaxed">
                  Thank you for being the beautiful melody in the song of my life, {personalization.partnerName}.
                </p>
              </div>

              <div className="pt-10 flex items-center justify-center gap-6">
                <div className="h-px w-12 bg-white/20" />
                <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-rose-400 font-bold">Seal of Love &bull; {new Date().getFullYear()}</p>
                <div className="h-px w-12 bg-white/20" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValentineProposal;
