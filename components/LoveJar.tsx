
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Sparkles, ArrowRight, Target, Cloud, Skull, Move } from 'lucide-react';

interface Props {
  personalization: {
    userName: string;
    partnerName: string;
  };
  onComplete?: () => void;
}

const LoveJar: React.FC<Props> = ({ personalization, onComplete }) => {
  const notes = [
    "I promise to always listen, kahit paulit-ulit ka na. 😂❤️",
    "Ikaw ang pahinga ko sa mundong nakakapagod. 🕊️",
    "I promise to be your constant, your home, and your best friend. 🏠",
    "Kahit antok na antok na ako, hihintayin kita makauwi/makatulog. 😴💖",
    "I love how you make even the smallest moments feel like an adventure. 🌎",
    "Susuportahan kita sa lahat ng dreams mo, no matter how big or small. 🚀",
    "I promise to choose you, every single day, without hesitation. 💍",
    "Thank you for being my peace in a world full of noise. 🤫✨",
    "Hinding-hindi ako magsasawang sabihin sa'yo kung gaano ka kaganda. 😍",
    "I promise to grow with you and learn more about you every year. 🌱"
  ];

  // UI States
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [hits, setHits] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [aimAngle, setAimAngle] = useState(0);
  const [showBarrierHit, setShowBarrierHit] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  // Engine Refs - Optimized for humanly satisfying tracking speed
  const engineRef = useRef({
    arrow: { active: false, x: 50, y: 85, vx: 0, vy: 0, angle: 0 },
    target: { x: 50, speed: 18, direction: 1 }, 
    barrier: { x: 30, speed: 12, direction: -1 },
    gravity: 80, // Reduced from 120 for a more graceful, slower arc
    hits: 0,
    lastTime: 0,
    isUnlocked: false
  });

  const [renderState, setRenderState] = useState({
    arrow: { active: false, x: 50, y: 85, angle: 0 },
    targetX: 50,
    barrierX: 30
  });

  const gameRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);

  const handleHit = useCallback(() => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setCurrentNote(randomNote);
    
    engineRef.current.hits += 1;
    setHits(engineRef.current.hits);
    
    if (engineRef.current.hits >= 5 && !engineRef.current.isUnlocked) {
      engineRef.current.isUnlocked = true;
      setIsUnlocked(true);
      if (onComplete) onComplete();
    }
  }, [onComplete, notes]);

  const handleBarrierCollision = useCallback(() => {
    setShowBarrierHit(true);
    setTimeout(() => setShowBarrierHit(false), 400);
  }, []);

  const animate = useCallback((time: number) => {
    if (!engineRef.current.lastTime) {
      engineRef.current.lastTime = time;
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    let deltaTime = (time - engineRef.current.lastTime) / 1000;
    if (deltaTime > 0.032) deltaTime = 0.032; 
    engineRef.current.lastTime = time;

    // 1. Move Target
    engineRef.current.target.x += engineRef.current.target.speed * engineRef.current.target.direction * deltaTime;
    if (engineRef.current.target.x > 90 || engineRef.current.target.x < 10) {
      engineRef.current.target.direction *= -1;
    }

    // 2. Move Barrier
    engineRef.current.barrier.x += engineRef.current.barrier.speed * engineRef.current.barrier.direction * deltaTime;
    if (engineRef.current.barrier.x > 85 || engineRef.current.barrier.x < 15) {
      engineRef.current.barrier.direction *= -1;
    }

    // 3. Arrow Physics
    if (engineRef.current.arrow.active) {
      engineRef.current.arrow.vy += engineRef.current.gravity * deltaTime;
      engineRef.current.arrow.x += engineRef.current.arrow.vx * deltaTime;
      engineRef.current.arrow.y += engineRef.current.arrow.vy * deltaTime;

      engineRef.current.arrow.angle = (Math.atan2(engineRef.current.arrow.vy, engineRef.current.arrow.vx) * 180 / Math.PI) + 90;

      if (engineRef.current.arrow.x > 98 || engineRef.current.arrow.x < 2) {
        engineRef.current.arrow.vx *= -1;
      }

      const arr = engineRef.current.arrow;
      const bar = engineRef.current.barrier;
      const tar = engineRef.current.target;

      if (arr.y < 55 && arr.y > 42 && Math.abs(arr.x - bar.x) < 9) {
        engineRef.current.arrow.active = false;
        handleBarrierCollision();
      }

      if (arr.y < 25 && arr.y > 10 && Math.abs(arr.x - tar.x) < 8) {
        engineRef.current.arrow.active = false;
        handleHit();
      }

      if (arr.y < -30 || arr.y > 115) {
        engineRef.current.arrow.active = false;
      }
    }

    setRenderState({
      arrow: { ...engineRef.current.arrow },
      targetX: engineRef.current.target.x,
      barrierX: engineRef.current.barrier.x
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [handleHit, handleBarrierCollision]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const updateAim = (clientX: number, clientY: number) => {
    if (engineRef.current.arrow.active || currentNote) return;
    if (gameRef.current) {
      const rect = gameRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.85;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const angleRad = Math.atan2(dy, dx);
      let angleDeg = (angleRad * 180) / Math.PI + 90;
      angleDeg = Math.max(-85, Math.min(85, angleDeg));
      setAimAngle(angleDeg);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (engineRef.current.arrow.active || currentNote) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsPulling(true);
    updateAim(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPulling) {
      updateAim(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPulling) return;
    setIsPulling(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    // HUMAN SATISFYING SPEED: Reduced from 160 to 110 for better tracking
    const shootSpeed = 110; 
    const rad = (aimAngle - 90) * (Math.PI / 180);
    
    engineRef.current.arrow = {
      active: true,
      x: 50,
      y: 85,
      vx: Math.cos(rad) * shootSpeed,
      vy: Math.sin(rad) * shootSpeed,
      angle: aimAngle
    };
  };

  return (
    <div id="gallery" className="brochure-section bg-transparent reveal py-12 md:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center">
        
        <div className="text-center mb-8 space-y-3 max-w-2xl">
          <span className="inline-block px-4 py-1 bg-rose-950 text-rose-100 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold border border-rose-800">Chapter IV</span>
          <h2 className="text-5xl md:text-7xl font-serif text-rose-950">Cupid's <span className="italic text-rose-600">Archer</span></h2>
          <p className="text-base text-slate-600 font-serif italic leading-relaxed px-4">
            Master the arc of love! A smooth, graceful shot is all it takes to unlock my heart.
          </p>
        </div>

        {/* Game Container */}
        <div 
          ref={gameRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative w-full max-w-2xl h-[550px] md:h-[650px] glass rounded-[3.5rem] md:rounded-[4.5rem] border-white/60 shadow-2xl overflow-hidden cursor-crosshair bg-gradient-to-b from-rose-50/50 to-white touch-none transition-transform ${showBarrierHit ? 'animate-shake' : ''}`}
          style={{ touchAction: 'none' }}
        >
          {/* Barrier: Floating Cloud */}
          <div 
            className="absolute flex flex-col items-center pointer-events-none"
            style={{ 
              transform: `translate3d(${renderState.barrierX}%, 0, 0) translateX(-50%)`,
              top: '45%',
              left: 0,
              width: '100%',
              willChange: 'transform'
            }}
          >
             <div className="relative">
                <Cloud className="w-24 h-24 md:w-32 md:h-32 text-blue-100/90 fill-blue-50/40 filter drop-shadow-xl" />
                <Skull className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-9 md:h-9 text-rose-300/30" />
             </div>
          </div>

          {/* Target Jar */}
          <div 
            className="absolute pointer-events-none"
            style={{ 
              transform: `translate3d(${renderState.targetX}%, 0, 0) translateX(-50%)`,
              top: '12%',
              left: 0,
              width: '100%',
              willChange: 'transform'
            }}
          >
            <div className="relative flex flex-col items-center group">
              <div className="absolute -inset-10 bg-rose-200 blur-3xl opacity-20 animate-pulse rounded-full" />
              <div className="w-16 h-20 md:w-20 md:h-28 bg-white/70 backdrop-blur-md rounded-t-[3rem] rounded-b-2xl border-2 border-white shadow-2xl flex items-center justify-center transition-transform group-hover:scale-105">
                <Heart className="w-7 h-7 md:w-10 md:h-10 text-rose-500 fill-rose-500 animate-bounce" />
              </div>
              <div className="w-12 h-4 bg-rose-950 rounded-full -mt-3 shadow-lg" />
            </div>
          </div>

          {/* Bow Mechanism */}
          <div 
            className={`absolute bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300 ${isPulling ? 'scale-110' : 'scale-100'}`}
            style={{ transform: `translate3d(-50%, 0, 0) rotate(${aimAngle}deg)`, willChange: 'transform' }}
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
               <div className={`w-20 h-20 border-[4px] border-rose-300 border-t-transparent rounded-full transition-all ${isPulling ? 'border-rose-500 scale-y-110' : 'opacity-40'}`} />
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-rose-200/50 transition-all ${isPulling ? 'scale-y-125 translate-y-2' : ''}`} />
               <div className="absolute top-0 w-2 h-14 bg-rose-950 rounded-full shadow-xl" />
            </div>
          </div>

          {/* High-Fidelity Satisfying Arrow */}
          {renderState.arrow.active && (
            <div 
              className="absolute pointer-events-none z-30"
              style={{ 
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                transform: `translate3d(${renderState.arrow.x}%, ${renderState.arrow.y}%, 0) translate3d(-50%, -50%, 0) rotate(${renderState.arrow.angle}deg)`,
                willChange: 'transform'
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Visual Motion Trail */}
                <div className="absolute bottom-full w-2 h-24 bg-gradient-to-t from-rose-400/50 via-rose-200/10 to-transparent blur-[2px]" />
                
                {/* Arrow Head (Heart) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[80%]">
                   <Heart className="w-6 h-6 text-rose-600 fill-rose-600 drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
                </div>

                {/* Arrow Body (Shaft) */}
                <div className="w-1.5 h-16 md:h-20 bg-gradient-to-b from-rose-600 to-rose-400 rounded-full shadow-lg" />

                {/* Arrow Fletching (Feathers) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1 translate-y-[20%]">
                   <div className="w-2 h-6 bg-white/60 rounded-full -rotate-12 border border-rose-100" />
                   <div className="w-2 h-6 bg-white/60 rounded-full rotate-12 border border-rose-100" />
                </div>
              </div>
            </div>
          )}

          {/* Laser Aim Helper */}
          {isPulling && !renderState.arrow.active && (
            <div 
              className="absolute bottom-[12%] left-1/2 w-[1.5px] h-64 bg-gradient-to-t from-rose-400/20 via-rose-300/5 to-transparent pointer-events-none origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${aimAngle}deg)`, willChange: 'transform' }}
            />
          )}

          {/* Note Reveal Overlay */}
          {currentNote && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-rose-950/40 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-rose-100 text-center space-y-8 max-w-sm animate-in zoom-in-95 duration-500">
                <div className="flex justify-center">
                  <div className="p-5 bg-rose-50 rounded-full animate-bounce">
                    <Sparkles className="w-12 h-12 text-rose-500" />
                  </div>
                </div>
                <p className="text-2xl md:text-4xl font-script text-rose-950 leading-relaxed italic font-semibold">
                  "{currentNote}"
                </p>
                <button 
                  onClick={() => setCurrentNote(null)}
                  className="w-full bg-rose-900 text-white py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-extrabold shadow-xl hover:bg-rose-950 transition-all active:scale-95"
                >
                  Keep in my heart
                </button>
              </div>
            </div>
          )}

          {/* HUD Overlay */}
          <div className="absolute top-8 left-8 flex flex-col gap-2">
            <div className="glass px-6 py-3 rounded-full border-rose-100 flex items-center gap-4 shadow-xl">
              <Heart className={`w-5 h-5 text-rose-500 ${hits > 0 ? 'fill-rose-500 animate-pulse' : ''}`} />
              <p className="text-xs font-bold text-rose-900 uppercase tracking-[0.2em]">
                 CAUGHT: {hits} / 5
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-8 right-8 flex items-center gap-2 opacity-30">
             <Move className="w-4 h-4 text-rose-950" />
             <p className="text-[10px] uppercase tracking-widest font-bold text-rose-900">
                Aim & Release
             </p>
          </div>
        </div>

        {/* Progress Navigation */}
        <div className="mt-12 h-24 flex flex-col items-center">
           {isUnlocked && !currentNote && (
             <button 
               onClick={() => {
                  const el = document.getElementById('proposal');
                  el?.scrollIntoView({ behavior: 'smooth' });
               }}
               className="group flex items-center gap-5 bg-rose-900 text-white px-16 py-6 rounded-full text-xs uppercase tracking-[0.5em] font-extrabold shadow-2xl hover:bg-rose-950 transition-all animate-in fade-in slide-in-from-bottom-6 duration-700 active:scale-95"
             >
               To the Vow...
               <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </button>
           )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translate3d(0, 0, 0); }
          20% { transform: translate3d(-10px, 0, 0) rotate(-1.5deg); }
          40% { transform: translate3d(10px, 0, 0) rotate(1.5deg); }
          60% { transform: translate3d(-6px, 0, 0); }
          80% { transform: translate3d(6px, 0, 0); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      `}} />
    </div>
  );
};

export default LoveJar;
