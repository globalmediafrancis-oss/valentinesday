
import React, { useState } from 'react';
import { Camera, Sparkles, Heart, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { analyzePhoto } from '../services/geminiService';

interface Props {
  personalization: {
    userName: string;
    partnerName: string;
  };
  onComplete?: () => void;
}

const PhotoGallery: React.FC<Props> = ({ personalization, onComplete }) => {
  // Predefined list of photos. 
  // The first one is the Snoopy collage provided by the user. 
  // Others are curated romantic placeholders.
  const photos = [
    "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770617305491_e49c5ee3dd9056099f8e030d72760303.png?alt=media&token=f93134d3-c1fe-445b-a90d-cf75dd13dcd4",
    "https://images.unsplash.com/photo-1516589174184-c685266e430c?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522673607200-164848378364?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=2071&auto=format&fit=crop"
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [caption, setCaption] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleMagicCaption = async () => {
    const currentImage = photos[selectedIndex];
    setLoading(true);
    setCaption('');
    try {
      // Analyze the currently selected photo
      const result = await analyzePhoto(currentImage, personalization.partnerName);
      setCaption(result);
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Analysis failed", error);
      setCaption("In every frame, our love finds a way to shine brighter than any star.");
      if (onComplete) onComplete();
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = () => {
    setSelectedIndex((prev) => (prev + 1) % photos.length);
    setCaption('');
  };

  const prevPhoto = () => {
    setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setCaption('');
  };

  return (
    <div id="gallery" className="brochure-section bg-transparent reveal py-24">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-10 order-2 lg:order-1">
            {/* Header Card with rounded corners and glassmorphism */}
            <div className="bg-white/70 backdrop-blur-md p-10 rounded-[3rem] border border-white/40 shadow-xl shadow-rose-100/20 space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-rose-500 font-sans font-bold">Chapter IV</p>
              <h2 className="text-5xl md:text-7xl font-serif text-rose-900 leading-tight">The Gallery <br/>of Us</h2>
              <p className="text-xl text-slate-600 italic leading-relaxed font-serif">
                A curation of our most cherished moments. Swipe through the frames of our journey, and let the AI breathe poetry into each one.
              </p>
            </div>

            <div className="space-y-6">
              {/* Photo Navigation Grid */}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3 bg-white/40 backdrop-blur-sm p-4 rounded-[2rem] border border-white/30">
                {photos.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedIndex(idx);
                      setCaption('');
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedIndex === idx ? 'border-rose-500 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Memory ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
                <button
                  onClick={handleMagicCaption}
                  disabled={loading}
                  className="relative w-full overflow-hidden group bg-rose-900 text-white rounded-[2rem] py-5 px-8 flex items-center justify-between font-sans text-xs uppercase tracking-[0.3em] font-bold transition-all hover:shadow-2xl hover:shadow-rose-900/40 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="flex items-center gap-3">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-rose-300" />}
                    {loading ? 'Consulting the Heart...' : 'Manifest Poetic Caption'}
                  </span>
                  <Heart className={`w-4 h-4 fill-rose-500 text-rose-500 transition-all duration-500 ${loading ? 'animate-pulse' : 'group-hover:scale-125'}`} />
                </button>
              </div>
            </div>

            {/* Caption Display Card */}
            {caption && (
              <div className="p-8 bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-rose-200/50 italic font-serif text-2xl text-rose-900 leading-relaxed relative animate-in zoom-in-95 duration-700 shadow-2xl">
                <div className="absolute -top-3 left-10 px-4 py-1 bg-rose-900 text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-white rounded-full">Poetic Insight</div>
                <span className="text-rose-300 text-4xl leading-none absolute -top-2 left-4 opacity-50">"</span>
                {caption}
                <span className="text-rose-300 text-4xl leading-none absolute -bottom-6 right-8 opacity-50">"</span>
              </div>
            )}
          </div>

          {/* Main Photo Display with Navigation */}
          <div className="order-1 lg:order-2">
            <div className="relative group">
              <div className="aspect-[3/4] md:aspect-square lg:aspect-[4/5] bg-white/60 backdrop-blur-md border border-white/40 p-4 md:p-12 shadow-2xl rounded-[3rem] overflow-hidden relative">
                {/* Decorative corner details */}
                <div className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-rose-200 z-10" />
                <div className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-rose-200 z-10" />
                
                <div className="w-full h-full bg-white shadow-2xl relative overflow-hidden flex items-center justify-center border-[12px] border-white rounded-2xl">
                  <img 
                    key={selectedIndex}
                    src={photos[selectedIndex]} 
                    alt="Current Memory" 
                    className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-1000" 
                  />
                  
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" />

                  {/* Navigation Arrows */}
                  <button 
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 border border-white/20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 border border-white/20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Counter Display */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-rose-100 shadow-lg z-20">
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-rose-900">
                  {selectedIndex + 1} / {photos.length}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
