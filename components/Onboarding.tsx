
import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import Card from './Card';

interface OnboardingProps {
  onComplete: (data: { userName: string; partnerName: string; memories: string }) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [memories, setMemories] = useState('');

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ userName, partnerName, memories });
  };

  return (
    <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Card className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-rose-600 fill-rose-600" />
          </div>
          <h1 className="text-3xl font-serif text-rose-900">Welcome to Lovey</h1>
          <p className="text-rose-500 italic mt-2">Let's make this space your own.</p>
        </div>

        <div className="space-y-6 min-h-[220px] flex flex-col justify-center">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">What is your name?</label>
              <input
                autoFocus
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-center text-lg"
              />
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">And who are we celebrating today?</label>
              <input
                autoFocus
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Partner's Name"
                className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-center text-lg"
              />
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tell us a little about your story...</label>
              <textarea
                autoFocus
                rows={4}
                value={memories}
                onChange={(e) => setMemories(e.target.value)}
                placeholder="Favorite dates, how you met, or things they love..."
                className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-sm resize-none"
              />
            </div>
          )}
        </div>

        <button
          onClick={next}
          disabled={(step === 1 && !userName) || (step === 2 && !partnerName)}
          className="w-full mt-8 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
        >
          {step === 3 ? "Enter Our Space" : "Continue"}
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                s === step ? 'bg-rose-600 w-4' : 'bg-rose-200'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;