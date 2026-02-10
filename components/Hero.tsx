
import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronDown, Fingerprint, Sparkles } from 'lucide-react';

interface HeroProps {
  personalization: {
    userName: string;
    partnerName: string;
  };
  onNav: () => void;
  onFirstInteraction?: () => void;
}

const Hero: React.FC<HeroProps> = ({ personalization, onNav, onFirstInteraction }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startHold = () => {
    if (isDone) return;
    setIsHolding(true);
    
    // Trigger music/audio on first real interaction to bypass browser blocks
    if (onFirstInteraction) onFirstInteraction();

    const startTime = Date.now();
    const duration = 1200;

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timerRef.current!);
        setIsDone(true);
        setTimeout(() => {
          onNav();
        }, 300);
      }
    }, 16);
  };

  const stopHold = () => {
    if (isDone) return;
    setIsHolding(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const resetTimer = window.setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) { clearInterval(resetTimer); return 0; }
        return Math.max(prev - 5, 0);
      });
    }, 16);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center bg-transparent overflow-hidden px-6">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
        <div className="glass px-6 py-3 rounded-full flex items-center justify-between border-rose-100 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-900">{personalization.userName}</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-900">{personalization.partnerName}</span>
        </div>
      </div>

      <div className={`relative z-10 transition-all duration-1000 w-full flex flex-col items-center ${isHolding && !isDone ? 'scale-95 opacity-80 blur-sm' : 'scale-100'}`}>
        <div className="glass rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden w-full max-w-4xl border-white/60 mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-30" />
          
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 bg-rose-200 rounded-full blur-3xl opacity-20 scale-150" />
            <Sparkles className="absolute -top-6 -right-6 text-rose-300 w-8 h-8 animate-spin-slow" />
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border border-rose-100 shadow-inner transition-colors duration-500 ${isDone ? 'bg-rose-900' : 'bg-rose-50'}`}>
              <Heart className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${isDone ? 'text-white fill-white scale-125' : 'text-rose-400 fill-rose-100'}`} />
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-rose-500 font-sans font-bold opacity-80">
              A Private Digital Keepsake
            </p>
            <h1 className="text-7xl md:text-9xl font-serif text-rose-950 leading-none tracking-tighter drop-shadow-sm select-none">
              Lovey
            </h1>
            <div className="h-px w-20 bg-rose-200 mx-auto my-8 opacity-60"></div>
            <h2 className="text-xl md:text-4xl font-serif italic text-rose-800 font-light max-w-2xl mx-auto leading-tight">
              A timeless story written for<br/>
              <span className="font-script text-4xl md:text-7xl block mt-4 text-rose-900 tracking-normal animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                Lovey {personalization.partnerName}
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6 relative z-20">
        <div className="relative group cursor-pointer">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-rose-100/50" />
            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="2.5" fill="transparent" strokeDasharray={276.5} strokeDashoffset={276.5 - (276.5 * progress) / 100} className={`transition-all duration-75 ${isDone ? 'text-rose-900' : 'text-rose-600'}`} strokeLinecap="round" />
          </svg>
          <button
            onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold} onTouchStart={startHold} onTouchEnd={stopHold}
            className={`absolute inset-0 m-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
              isDone ? 'bg-rose-900 scale-110' :
              isHolding ? 'bg-rose-900 scale-90' : 'bg-white hover:bg-rose-50 scale-100'
            }`}
          >
            {isDone ? (
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            ) : progress < 100 ? (
              <Fingerprint className={`w-6 h-6 transition-colors ${isHolding ? 'text-white' : 'text-rose-300'}`} />
            ) : (
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            )}
          </button>
        </div>
        <div className="glass px-8 py-3 rounded-full border border-rose-100 shadow-sm animate-bounce-slow">
          <p className="text-[9px] uppercase tracking-[0.4em] text-rose-900 font-sans font-extrabold">
            {isDone ? 'Success! Our story awaits...' : isHolding ? 'Opening Our Universe...' : 'Hold Fingerprint to Unlock'}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-20 left-20 w-64 h-64 bg-rose-200/40 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-rose-300/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default Hero;
