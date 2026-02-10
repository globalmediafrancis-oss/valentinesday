
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Sparkles, BookOpen, Eye, MousePointer2 } from 'lucide-react';

interface Props {
  personalization: {
    userName: string;
    partnerName: string;
  };
  onComplete?: () => void;
}

const GiftVisualizer: React.FC<Props> = ({ personalization, onComplete }) => {
  const photos = [
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691836_1000027656.jpg?alt=media&token=7a48a426-27dd-4b8a-8f26-6e9900a8d584",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691835_1000027651.jpg?alt=media&token=920b3853-ad8f-418e-89bb-5176cadbb2cf",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691834_1000027645.jpg?alt=media&token=e534ec74-2cbb-4ad2-9811-060e833425ec",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691835_1000027650.jpg?alt=media&token=99406cd8-58b2-4f27-8872-7e06a88a921f",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691835_1000027652.jpg?alt=media&token=53959e08-b11c-4f91-8865-9c2bb5843027",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691836_1000027655.jpg?alt=media&token=8bd45ea6-3cbb-4637-a617-0a61c54cb977",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691836_1000027661.jpg?alt=media&token=20ab156c-56f7-45e2-a728-e42b25f7a503",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691835_1000027647.jpg?alt=media&token=4779f71c-97ce-414a-8f3a-01ab3806acb8",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691837_1000027673.jpg?alt=media&token=f5d4f9fa-942c-43ba-b7cd-f21358d5e0e6",
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770618691836_1000027663.jpg?alt=media&token=e54629d7-9670-4859-ba54-9a61d2d5dd95"
  ];

  const captions = [
    "Ang simula ng ating walang hanggang kulitan. Ikaw ang paborito kong view, baby Alliah. ❤️",
    "Bawat ngiti mo ay liwanag sa pinakamadilim kong araw. Hinding-hindi ako magsasawang asarin ka. ✨",
    "Poching-pochi talaga ang baby ko dito! Ang sarap mong kurutin at yakapin forever. 😍",
    "Walang sawang asaran, walang sawang pagmamahalan. Salamat sa bawat tawa na binibigay mo sa akin. 💍",
    "Kahit saan man tayo mapadpad, basta kasama kita, feeling ko nasa home na ako. You're my peace. 🤍",
    "Hinding-hindi ako mapapagod na pasayahin ka. Bawat moment natin ay tinitreasure ko nang sobra. 👫",
    "Sa bawat click ng camera, nakatago ang saya nating dalawa. Ikaw ang pinaka-special na gift sa akin. 🌹",
    "Ang cute-cute mo talaga kapag kinikilig ka sa akin. Mahal na mahal kita, sobra-sobra. 🥰",
    "Memories that I will keep forever in my heart. Excited na ako sa marami pa nating adventures together. 🌎",
    "Dito nagsimula ang lahat, at dito rin tayo magpapatuloy. Forever yours, forever mine, forever us. ♾️"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [isIntro, setIsIntro] = useState(true);
  const [viewedCount, setViewedCount] = useState(0);

  const handleNext = () => {
    if (isIntro) {
      setIsIntro(false);
      return;
    }

    if (!showQuote) {
      // Step 1: Reveal the quote for the current photo
      setShowQuote(true);
    } else {
      // Step 2: Move to the next photo (reset blur/quote)
      const nextIdx = (currentIndex + 1) % photos.length;
      setCurrentIndex(nextIdx);
      setShowQuote(false);
      
      const newViewedCount = viewedCount + 1;
      setViewedCount(newViewedCount);
      if (newViewedCount >= 3 && onComplete) {
        onComplete();
      }
    }
  };

  const handlePrev = () => {
    if (isIntro) return;
    
    if (showQuote) {
      setShowQuote(false);
    } else {
      const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
      setCurrentIndex(prevIdx);
      setShowQuote(true);
    }
  };

  return (
    <div id="gift" className="brochure-section bg-transparent reveal py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col items-center justify-center">
        
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center w-full">
          
          {/* Text Description Side */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-center text-center lg:text-left">
            <div className="glass p-8 md:p-12 rounded-[3.5rem] border-white/60 space-y-4 md:space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Heart className="w-24 h-24 text-rose-900 fill-rose-900" />
              </div>
              
              <span className="inline-block px-4 py-1 bg-rose-100/50 rounded-full text-[10px] uppercase tracking-widest font-bold text-rose-900 border border-rose-200">Chapter III</span>
              <h2 className="text-5xl md:text-7xl font-serif text-rose-950 leading-tight">Our <br/><span className="italic text-rose-600">Kulitan Mode</span></h2>
              <p className="text-xl md:text-2xl text-slate-600 font-serif italic font-light leading-relaxed">
                May hinanda akong surprise dito para sa'yo, baby Alliah. 
              </p>

              <div className="pt-6 flex items-center justify-center lg:justify-start gap-4">
                 <div className="flex -space-x-3">
                    {photos.slice(0, 4).map((img, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md">
                        <img src={img} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-50 flex items-center justify-center text-[10px] font-bold text-rose-400 shadow-md">+{photos.length - 4}</div>
                 </div>
                 <p className="text-[10px] uppercase tracking-widest font-bold text-rose-900/40">The Memories we shared</p>
              </div>
            </div>

            {/* Hint Box */}
            <div className="glass p-6 rounded-[2.5rem] border-white/40 flex items-center gap-4 animate-bounce-slow">
              <div className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center text-white">
                {isIntro ? <MousePointer2 className="w-5 h-5" /> : showQuote ? <Eye className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-rose-900">
                {isIntro ? "Click the heart to begin" : showQuote ? "Click to see the next photo" : "Click the photo for my message"}
              </p>
            </div>
          </div>

          {/* Interactive Photo Frame Side */}
          <div className="lg:col-span-7 w-full flex justify-center items-center">
            <div className="relative w-full max-w-[550px] lg:max-w-[650px] aspect-[4/5]">
              
              {/* Main Interaction Area */}
              <div 
                onClick={handleNext}
                className="group relative w-full h-full glass p-4 md:p-6 rounded-[3.5rem] md:rounded-[4.5rem] border-white shadow-2xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="w-full h-full bg-stone-100 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative shadow-inner">
                  
                  {isIntro ? (
                    /* Intro Screen */
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-50/50 animate-in fade-in duration-700">
                      <div className="relative mb-8">
                        <Heart className="w-32 h-32 md:w-48 md:h-48 text-rose-600 fill-rose-100 animate-pulse" />
                        <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400 animate-spin-slow" />
                      </div>
                      <div className="glass px-8 py-6 rounded-[2.5rem] border-rose-200 text-center space-y-4 max-w-xs shadow-xl">
                        <p className="text-2xl md:text-3xl font-script text-rose-950 leading-snug">
                          Click mo muna yung photo baby HAHA
                        </p>
                        <div className="flex justify-center">
                           <MousePointer2 className="w-6 h-6 text-rose-400 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Photo Discovery Flow */
                    <>
                      {/* The Image */}
                      <img 
                        key={currentIndex}
                        src={photos[currentIndex]} 
                        alt="Our Story" 
                        className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                          showQuote ? 'blur-2xl scale-110 opacity-50' : 'blur-0 scale-100 opacity-100'
                        }`} 
                      />

                      {/* Quote Overlay */}
                      <div 
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center transition-all duration-700 ${
                          showQuote ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
                        }`}
                      >
                        <div className="relative">
                          <Sparkles className="absolute -top-12 -left-6 w-10 h-10 text-rose-300 animate-pulse" />
                          <Heart className="absolute -bottom-10 -right-6 w-8 h-8 text-rose-400 fill-rose-100 animate-bounce-slow" />
                          
                          <div className="space-y-6">
                            <div className="w-16 h-px bg-rose-200 mx-auto opacity-60" />
                            <p className="text-2xl md:text-4xl font-serif italic font-medium leading-relaxed text-rose-950 drop-shadow-sm">
                              "{captions[currentIndex]}"
                            </p>
                            <div className="w-16 h-px bg-rose-200 mx-auto opacity-60" />
                          </div>
                        </div>
                      </div>

                      {/* Progress Indicators */}
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {photos.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-500 ${
                              currentIndex === i ? 'w-6 bg-rose-500' : 'w-2 bg-rose-200/50'
                            }`} 
                          />
                        ))}
                      </div>

                      {/* Counter Tag */}
                      <div className="absolute top-8 right-8 z-30">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-rose-100 shadow-xl">
                          <span className="text-[10px] font-sans font-extrabold text-rose-900 tracking-widest uppercase">
                             {currentIndex + 1} / {photos.length}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Subtle Grain / Vignette */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
                </div>
              </div>

              {/* Navigation Arrows (Visible after intro) */}
              {!isIntro && (
                <div className="absolute inset-x-0 -bottom-16 flex justify-center gap-6">
                   <button 
                     onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                     className="w-14 h-14 rounded-full glass flex items-center justify-center text-rose-900 hover:bg-rose-900 hover:text-white transition-all shadow-xl active:scale-90"
                   >
                     <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleNext(); }}
                     className="w-14 h-14 rounded-full glass flex items-center justify-center text-rose-900 hover:bg-rose-900 hover:text-white transition-all shadow-xl active:scale-90"
                   >
                     <ChevronRight className="w-6 h-6" />
                   </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GiftVisualizer;
