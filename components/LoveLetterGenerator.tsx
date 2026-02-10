
import React, { useState, useRef } from 'react';
import { Quote, Heart, Sparkles, ChevronRight, Fingerprint, MapPin } from 'lucide-react';

interface Props {
  personalization: {
    userName: string;
    partnerName: string;
    memories: string;
  };
  onComplete?: () => void;
}

const LoveLetterGenerator: React.FC<Props> = ({ personalization, onComplete }) => {
  const [step, setStep] = useState(0); 
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });

  const letterBody = [
    "Hello lovey, Yakee is here, pochi ko 🤍",
    "I just wanna say this straight from my heart. mahal na mahal kita, baby ko.",
    "Ang dami na nating pinagdaanan kahit 2 months pa lang ang 2026. Hindi naging madali ang journey natin. may misunderstandings, away, miscommunication, stress, heartbreaks at kung anu-anong emotional rollercoaster.",
    "Pero kahit ganun, we stayed. We talked. We healed. At sabay nating nilagpasan lahat.",
    "Unti-unti, hinaharap natin yung issues at hini-heal yung mga trauma. Lahat ng pinagdaanan natin helped us grow not just as a couple, but as individuals din.",
    "My heart feels so full, happy and finally at peace kasi ikaw pala ’yung hinahanap ko all this time. You make me feel so special in your life, and I’ll never take that for granted.",
    "You’re my peculiar gift from heaven, baby. Ikaw ang pinaka-special at pinaka-importanteng tao sa buhay ko. Hindi ko na kayang isipin ang future ko na wala ka kasi ikaw na yung future na gusto ko.",
  ];

  const moveNoButton = () => {
    const x = Math.random() * 140 * (Math.random() > 0.5 ? 1 : -1);
    const y = Math.random() * 60 * (Math.random() > 0.5 ? 1 : -1);
    setNoButtonPos({ x, y });
  };

  const handleYes = () => {
    setAccepted(true);
    const container = document.body;
    for (let i = 0; i < 50; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.top = '100vh';
      heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
      heart.style.transition = `all ${Math.random() * 2 + 3}s ease-out`;
      container.appendChild(heart);
      setTimeout(() => {
        heart.style.transform = `translateY(-110vh) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0';
      }, 50);
      setTimeout(() => heart.remove(), 5000);
    }
  };

  const handleUnlockRevelation = () => {
    setStep(2);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-start py-24">
      <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
        <div className="glass rounded-[3rem] p-10 border-white/60 shadow-2xl space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1 bg-rose-100/50 rounded-full text-[10px] uppercase tracking-widest font-bold text-rose-900 border border-rose-200">Chapter I</span>
            <h2 className="text-6xl font-serif text-rose-950 leading-tight">The Sacred <br/>Manuscript</h2>
            <div className="h-px w-16 bg-rose-200"></div>
            <p className="text-xl text-slate-600 italic leading-relaxed font-serif font-light">
              Reflections on a journey that changed everything.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-rose-400 bg-rose-50/30 p-4 rounded-2xl border border-rose-100">
             <Heart className={`w-6 h-6 ${step > 0 ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-rose-200'}`} />
             <div>
               <p className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-rose-900/40">Status</p>
               <p className="text-xs uppercase tracking-widest font-sans font-bold text-rose-900">{step === 0 ? 'Awaiting Access' : step === 1 ? 'Memoirs Unlocked' : 'Grand Revelation'}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 w-full flex flex-col gap-10">
        {step === 0 && (
          <div 
            onClick={() => setStep(1)}
            className="group cursor-pointer glass rounded-[4rem] p-16 md:p-24 text-center space-y-10 transition-all hover:scale-[1.01] hover:bg-white shadow-2xl border-white"
          >
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100 group-hover:scale-110 transition-transform shadow-inner">
              <Quote className="w-10 h-10 text-rose-300" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-serif text-rose-950 italic">"Hi baby Alliah..."</h3>
              <p className="text-slate-400 font-sans uppercase tracking-[0.4em] text-[11px] font-bold">Touch to read our heart</p>
            </div>
            <ChevronRight className="w-8 h-8 mx-auto text-rose-200 animate-bounce-horizontal" />
          </div>
        )}

        {step >= 1 && (
          <div className={`glass relative p-10 md:p-20 rounded-[3.5rem] shadow-2xl border-white transition-all duration-1000 ${step > 1 ? 'opacity-30 blur-sm scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <Quote className="absolute top-12 left-12 w-12 h-12 text-rose-100/50" />
            <div className="space-y-8 font-serif text-xl md:text-3xl leading-relaxed text-slate-800 font-light">
              <p className="text-rose-950 font-bold mb-12 tracking-tight">Hi baby Alliah,</p>
              {letterBody.map((paragraph, i) => (
                <p key={i} className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {step === 1 && (
              <div className="mt-20 pt-16 border-t border-rose-100 text-center space-y-8">
                <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-rose-400 font-bold">The final question awaits you...</p>
                <button
                  onClick={handleUnlockRevelation}
                  className="group relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-rose-900 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                >
                  <Sparkles className="w-10 h-10 animate-pulse" />
                  <span className="absolute -bottom-12 w-48 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-rose-900 font-bold">Unlock Revelation</span>
                </button>
              </div>
            )}

            <div className="absolute bottom-12 right-12 text-right opacity-30">
              <p className="text-sm font-sans uppercase tracking-widest font-bold text-rose-900 mb-1">Eternally yours,</p>
              <p className="font-script text-5xl text-rose-950">Yakee</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div 
            className="glass-dark relative p-12 md:p-24 rounded-[4rem] shadow-2xl text-center space-y-16 animate-in fade-in zoom-in-95 duration-1000 overflow-hidden min-h-[600px] flex flex-col justify-center border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-950/80 to-rose-900/60 z-0" />
            
            <div className="relative z-20 space-y-12">
              {!accepted ? (
                <>
                  <div className="space-y-8">
                    <div className="inline-block p-6 bg-white/10 rounded-full backdrop-blur-xl border border-white/20 animate-pulse">
                      <Heart className="w-14 h-14 text-white fill-white" />
                    </div>
                    <h2 className="text-5xl md:text-8xl font-script text-white leading-tight">
                      Will you be my Valentine, <br/> baby pochi ko?
                    </h2>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-10">
                    <button
                      onClick={handleYes}
                      className="px-16 py-6 bg-white text-rose-900 rounded-full font-sans text-xs uppercase tracking-[0.4em] font-bold hover:scale-110 active:scale-95 transition-all shadow-2xl"
                    >
                      Yes, My Pochi!
                    </button>

                    <button
                      onMouseEnter={moveNoButton} onTouchStart={moveNoButton}
                      style={{ transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`, transition: 'transform 0.1s ease-out' }}
                      className="px-10 py-5 border border-white/30 rounded-full font-sans text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                    >
                      No
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-12 animate-in fade-in scale-in-95 duration-1000">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <Heart className="w-16 h-16 fill-rose-600 text-rose-600 animate-pulse" />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-6xl md:text-9xl font-script text-white">Thank You, Baby</h2>
                    <p className="text-2xl md:text-4xl font-serif text-rose-100 font-light leading-relaxed max-w-2xl mx-auto">
                      My heart is officially yours for another beautiful year.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoveLetterGenerator;
