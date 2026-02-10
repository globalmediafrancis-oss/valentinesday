
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
    // Keep it within the bounds of the container roughly
    const range = 150; 
    const newX = (Math.random() - 0.5) * range * 2;
    const newY = (Math.random() - 0.5) * range;
    setNoButtonPos({ x: newX, y: newY });
  };

  const handleYes = () => {
    setAccepted(true);
    // Big heart explosion
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const h = document.createElement('div');
        h.innerHTML = i % 2 === 0 ? '❤️' : '💖';
        h.style.position = 'fixed';
        h.style.left = (Math.random() * 100) + 'vw';
        h.style.bottom = '-10vh';
        h.style.fontSize = (Math.random() * 30 + 20) + 'px';
        h.style.zIndex = '100';
        h.style.transition = `all ${Math.random() * 2 + 2.5}s cubic-bezier(0.25, 1, 0.5, 1)`;
        document.body.appendChild(h);
        setTimeout(() => {
          h.style.transform = `translateY(-115vh) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg)`;
          h.style.opacity = '0';
        }, 50);
        setTimeout(() => h.remove(), 4000);
      }, i * 60);
    }
  };

  return (
    <div id="proposal" className="brochure-section bg-rose-950 reveal overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 w-full text-center relative flex flex-col justify-center min-h-[85dvh]" ref={containerRef}>
        <div className="glass-dark p-12 md:p-32 rounded-[5rem] border-white/10 shadow-[0_0_120px_rgba(136,19,55,0.4)] relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-rose-500/20 blur-[120px] animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-400/20 blur-[120px] animate-pulse" />

          {!accepted ? (
            <div className="space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
              <div className="space-y-6">
                <span className="inline-block px-5 py-1.5 bg-white/10 rounded-full text-[11px] uppercase tracking-[0.6em] font-bold text-rose-300 border border-white/10">The Vow</span>
                <h2 className="text-6xl md:text-[9rem] font-serif leading-none text-white tracking-tighter">
                  One Final <span className="italic text-rose-200 font-light">Question</span>
                </h2>
              </div>

              <div className="relative">
                 <Sparkles className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 text-rose-400 animate-spin-slow opacity-40" />
                 <p className="text-4xl md:text-7xl font-script text-white max-w-4xl mx-auto leading-tight drop-shadow-2xl px-4">
                  "Will you be my Valentine, <br/> baby pochi ko?"
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-8">
                <button
                  onClick={handleYes}
                  className="group px-20 py-8 bg-white text-rose-950 rounded-full font-sans text-xs uppercase tracking-[0.5em] font-extrabold hover:scale-110 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] flex items-center gap-4"
                >
                  Yes, Forever <Heart className="w-5 h-5 fill-rose-900 group-hover:animate-pulse" />
                </button>

                <button
                  onMouseEnter={moveNoButton} 
                  onTouchStart={moveNoButton}
                  style={{ 
                    transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`, 
                    transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }}
                  className="px-14 py-6 border border-white/20 rounded-full font-sans text-[11px] uppercase tracking-[0.4em] text-white/40 hover:text-white/80 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-16 animate-in fade-in scale-in-90 duration-1000 relative z-10">
              <div className="relative inline-block">
                  <div className="w-44 h-44 bg-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(255,255,255,0.3)] border-4 border-rose-100">
                    <Heart className="w-28 h-28 fill-rose-600 text-rose-600 animate-pulse" />
                  </div>
                  <Sparkles className="absolute -top-6 -right-6 w-14 h-14 text-yellow-300 animate-spin-slow" />
              </div>

              <div className="space-y-8">
                <h2 className="text-8xl md:text-[11rem] font-script text-white leading-none drop-shadow-2xl">I'm So Grateful.</h2>
                <p className="text-2xl md:text-4xl font-serif italic text-rose-100/80 max-w-3xl mx-auto leading-relaxed font-light">
                  Salamat sa pagpili sa akin araw-araw, {personalization.partnerName}. Mahal na mahal kita, baby ko.
                </p>
              </div>

              <div className="pt-10 flex items-center justify-center gap-8">
                <div className="h-px w-16 bg-white/10" />
                <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-rose-400 font-bold opacity-60">
                   Our Story Continues &bull; {new Date().getFullYear()}
                </p>
                <div className="h-px w-16 bg-white/10" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValentineProposal;
