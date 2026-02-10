
import React, { useState } from 'react';
import { Quote, Heart, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';

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

  const letterBody = [
    "Hello lovey, Yakee is here, pochi ko 🤍",
    "I just wanna say this straight from my heart. mahal na mahal kita, baby ko.",
    "Ang dami na nating pinagdaanan kahit 2 months pa lang ang 2026. Hindi naging madali ang journey natin. may misunderstandings, away, miscommunication, stress, heartbreaks at kung anu-anong emotional rollercoaster.",
    "Pero kahit ganun, we stayed. We talked. We healed. At sabay nating nilagpasan lahat.",
    "Unti-unti, hinaharap natin yung issues at hini-heal yung mga trauma. Lahat ng pinagdaanan natin helped us grow not just as a couple, but as individuals din.",
    "My heart feels so full, happy and finally at peace kasi ikaw pala ’yung hinahanap ko all this time. You make me feel so special in your life, and I’ll never take that for granted.",
    "You’re my peculiar gift from heaven, baby. Ikaw ang pinaka-special at pinaka-importanteng tao sa buhay ko. Hindi ko na kayang isipin ang future ko na wala ka kasi ikaw na yung future na gusto ko.",
  ];

  const handleFinishLetter = () => {
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
               <p className="text-xs uppercase tracking-widest font-sans font-bold text-rose-900">{step === 0 ? 'Awaiting Access' : 'Reading Memoirs'}</p>
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
          <div className="glass relative p-10 md:p-20 rounded-[3.5rem] shadow-2xl border-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Quote className="absolute top-12 left-12 w-12 h-12 text-rose-100/50" />
            <div className="space-y-8 font-serif text-xl md:text-3xl leading-relaxed text-slate-800 font-light pb-20">
              <p className="text-rose-950 font-bold mb-12 tracking-tight">Hi baby Alliah,</p>
              {letterBody.map((paragraph, i) => (
                <p key={i} className="mb-8">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-rose-100 flex flex-col items-center gap-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-rose-400 font-bold italic">End of memoirs... the journey continues.</p>
                <button
                  onClick={handleFinishLetter}
                  className="group flex items-center gap-4 bg-rose-900 text-white px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-extrabold shadow-xl hover:bg-rose-950 transition-all active:scale-95"
                >
                  Enter the Abyss
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="absolute bottom-12 right-12 text-right opacity-30">
              <p className="text-sm font-sans uppercase tracking-widest font-bold text-rose-900 mb-1">Eternally yours,</p>
              <p className="font-script text-5xl text-rose-950">Yakee</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoveLetterGenerator;
