
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const MUSIC_URL = "https://firebasestorage.googleapis.com/v0/b/nano-stream-d1d91.firebasestorage.app/o/public_assets%2F1770629847955_eheads_cut.mp3?alt=media&token=7f43ca6e-2e22-412e-bf58-d7f543c37447";

interface Props {
  shouldPlay: boolean;
}

const BackgroundMusic: React.FC<Props> = ({ shouldPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (shouldPlay && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Autoplay blocked, waiting for more interaction", err);
      });
    }
  }, [shouldPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-6 right-6 z-[70]">
      <audio ref={audioRef} src={MUSIC_URL} loop />
      <button
        onClick={togglePlay}
        className={`group flex items-center justify-center w-12 h-12 rounded-full glass border-rose-100 shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 ${isPlaying ? 'bg-rose-900 text-white' : 'bg-white text-rose-900'}`}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Volume2 className="w-5 h-5 animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-white/20 animate-ping" />
          </div>
        ) : (
          <VolumeX className="w-5 h-5 opacity-60" />
        )}
        
        {/* Floating Label */}
        <div className="absolute right-14 px-3 py-1.5 bg-rose-900 text-white text-[9px] uppercase tracking-widest font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          {isPlaying ? 'Pause Music' : 'Play Music'}
        </div>
      </button>
      
      {/* Musical Note Particles when playing */}
      {isPlaying && (
        <div className="absolute -z-10 top-0 left-0 w-full h-full pointer-events-none">
          <Music className="absolute top-0 left-0 w-3 h-3 text-rose-400 animate-float-note opacity-0" style={{ animationDelay: '0s' }} />
          <Music className="absolute top-0 left-0 w-3 h-3 text-rose-400 animate-float-note opacity-0" style={{ animationDelay: '1s' }} />
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-note {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translate(-40px, -60px) rotate(45deg); opacity: 0; }
        }
        .animate-float-note {
          animation: float-note 3s ease-out infinite;
        }
      `}} />
    </div>
  );
};

export default BackgroundMusic;
