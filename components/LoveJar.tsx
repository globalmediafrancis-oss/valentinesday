
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

  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [hits, setHits] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [aimAngle, setAimAngle] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [showBarrierHit, setShowBarrierHit] = useState(false);

  // Constants
  const GRAVITY = 100; 
  const SHOOT_SPEED = 120;
  const TARGET_Y = 18;
  const BARRIER_Y = 50;

  const engineRef = useRef({
    arrow: { active: false, x: 50, y: 85, vx: 0, vy: 0, angle: 0 },
    target: { x: 50, speed: 15, direction: 1 },
    barrier: { x: 30, speed: 10, direction: -1 },
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
  }, [onComplete]);

  const animate = useCallback((time: number) => {
    if (!engineRef.current.lastTime) {
      engineRef.current.lastTime = time;
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    let deltaTime = (time - engineRef.current.lastTime) / 1000;
    if (deltaTime > 0.032) deltaTime = 0.032;
    engineRef.current.lastTime = time;

    // Move Elements
    engineRef.current.target.x += engineRef.current.target.speed * engineRef.current.target.direction * deltaTime;
    if (engineRef.current.target.x > 85 || engineRef.current.target.x < 15) engineRef.current.target.direction *= -1;

    engineRef.current.barrier.x += engineRef.current.barrier.speed * engineRef.current.barrier.direction * deltaTime;
    if (engineRef.current.barrier.x > 80 || engineRef.current.barrier.x < 20) engineRef.current.barrier.direction *= -1;

    // Arrow Physics
    if (engineRef.current.arrow.active) {
      const prevY = engineRef.current.arrow.y;
      const prevX = engineRef.current.arrow.x;
      
      engineRef.current.arrow.vy += GRAVITY * deltaTime;
      engineRef.current.arrow.x += engineRef.current.arrow.vx * deltaTime;
      engineRef.current.arrow.y += engineRef.current.arrow.vy * deltaTime;
      engineRef.current.arrow.angle = (Math.atan2(engineRef.current.arrow.vy, engineRef.current.arrow.vx) * 180 / Math.PI) + 90;

      const curr = engineRef.current.arrow;
      const bar = engineRef.current.barrier;
      const tar = engineRef.current.target;

      // Barrier Collision (More robust range)
      const hitBarrier = curr.y >= BARRIER_Y - 5 && curr.y <= BARRIER_Y + 5 && Math.abs(curr.x - bar.x) < 10;
      if (hitBarrier) {
        curr.active = false;
        setShowBarrierHit(true);
        setTimeout(() => setShowBarrierHit(false), 400);
      }

      // Target Collision
      const hitTarget = curr.y >= TARGET_Y - 8 && curr.y <= TARGET_Y + 8 && Math.abs(curr.x - tar.x) < 8;
      if (hitTarget) {
        curr.active = false;
        handleHit();
      }

      // Out of bounds
      if (curr.y < -50 || curr.y > 110 || curr.x < -10 || curr.x > 110) {
        curr.active = false;
      }
    }

    setRenderState({
      arrow: { ...engineRef.current.arrow },
      targetX: engineRef.current.target.x,
      barrierX: engineRef.current.barrier.x
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [handleHit]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [animate]);

  // Aim Logic
  const updateAim = (clientX: number, clientY: number) => {
    if (engineRef.current.arrow.active || currentNote || !gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.85;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI + 90;
    angleDeg = Math.max(-80, Math.min(80, angleDeg)); // Limit aim range
    setAimAngle(angleDeg);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (engineRef.current.arrow.active || currentNote) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsPulling(true);
    updateAim(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPulling) updateAim(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPulling) return;
    setIsPulling(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    const rad = (aimAngle - 90) * (Math.PI / 180);
    engineRef.current.arrow = {
      active: true,
      x: 50,
      y: 85,
      vx: Math.cos(rad) * SHOOT_SPEED,
      vy: Math.sin(rad) * SHOOT_SPEED,
      angle: aimAngle
    };
  };

  // Trajectory Prediction
  const renderTrajectory = () => {
    if (!isPulling || engineRef.current.arrow.active) return null;
    const points = [];
    const rad = (aimAngle - 90) * (Math.PI / 180);
    let px = 50, py = 85;
    let pvx = Math.cos(rad) * SHOOT_SPEED;
    let pvy = Math.sin(rad) * SHOOT_SPEED;
    const dt = 0.05;

    for (let i = 0; i < 20; i++) {
      pvy += GRAVITY * dt;
      px += pvx * dt;
      py += pvy * dt;
      if (py < 0 || py > 100 || px < 0 || px > 100) break;
      points.push({ x: px, y: py });
    }

    return points.map((p, i) => (
      <div 
        key={i} 
        className="absolute w-1.5 h-1.5 bg-rose-400/40 rounded-full"
        style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
      />
    ));
  };

  return (
    <div id="gallery" className="brochure-section bg-transparent reveal py-8 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center">
        
        <div className="text-center mb-6 space-y-2">
          <span className="inline-block px-4 py-1 bg-rose-950 text-rose-100 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold border border-rose-800">Chapter IV</span>
          <h2 className="text-4xl md:text-6xl font-serif text-rose-950">Cupid's <span className="italic text-rose-600">Archer</span></h2>
          <p className="text-sm text-slate-600 font-serif italic max-w-lg mx-auto">
            Huliin mo ang mga mensaheng nilaan ko para sa'yo, baby Alliah. Aim carefully!
          </p>
        </div>

        <div 
          ref={gameRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative w-full max-w-2xl h-[500px] md:h-[600px] glass rounded-[3.5rem] border-white/60 shadow-2xl overflow-hidden cursor-crosshair bg-gradient-to-b from-rose-50/30 to-white touch-none ${showBarrierHit ? 'animate-shake' : ''}`}
          style={{ touchAction: 'none' }}
        >
          {/* Barrier */}
          <div 
            className="absolute flex flex-col items-center pointer-events-none transition-transform duration-75"
            style={{ left: `${renderState.barrierX}%`, top: `${BARRIER_Y}%`, transform: 'translate(-50%, -50%)' }}
          >
             <div className="relative group">
                <Cloud className="w-24 h-24 md:w-32 md:h-32 text-slate-200 fill-slate-50/50 filter drop-shadow-xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-40">
                   <Skull className="w-5 h-5 text-rose-900" />
                   <p className="text-[8px] font-bold uppercase tracking-widest text-rose-950">Blocked</p>
                </div>
             </div>
          </div>

          {/* Target */}
          <div 
            className="absolute pointer-events-none transition-transform duration-75"
            style={{ left: `${renderState.targetX}%`, top: `${TARGET_Y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative flex flex-col items-center">
              <div className="absolute -inset-12 bg-rose-300 blur-3xl opacity-20 animate-pulse rounded-full" />
              <div className="w-14 h-18 md:w-20 md:h-24 bg-white/80 backdrop-blur-md rounded-t-[2.5rem] rounded-b-xl border-2 border-rose-100 shadow-xl flex items-center justify-center">
                <Heart className="w-6 h-6 md:w-9 md:h-9 text-rose-500 fill-rose-500 animate-bounce" />
              </div>
              <div className="w-10 h-3 bg-rose-900/80 rounded-full -mt-2 shadow-lg" />
            </div>
          </div>

          {/* Trajectory */}
          {renderTrajectory()}

          {/* Bow UI */}
          <div 
            className={`absolute bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all ${isPulling ? 'scale-110' : 'scale-100'}`}
            style={{ transform: `translateX(-50%) rotate(${aimAngle}deg)` }}
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
               <div className={`absolute w-16 h-16 border-[3px] border-rose-300 border-t-transparent rounded-full transition-all ${isPulling ? 'border-rose-500 scale-y-125' : 'opacity-30'}`} />
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-rose-200/50 transition-all ${isPulling ? 'scale-y-110 translate-y-1' : ''}`} />
               <div className="absolute top-0 w-2.5 h-12 bg-rose-950 rounded-full shadow-lg" />
            </div>
          </div>

          {/* Arrow */}
          {renderState.arrow.active && (
            <div 
              className="absolute pointer-events-none z-30"
              style={{ 
                left: `${renderState.arrow.x}%`, 
                top: `${renderState.arrow.y}%`, 
                transform: `translate(-50%, -50%) rotate(${renderState.arrow.angle}deg)` 
              }}
            >
              <div className="relative flex flex-col items-center">
                <div className="absolute bottom-full w-1.5 h-16 bg-gradient-to-t from-rose-500/30 to-transparent blur-[1px]" />
                <Heart className="w-5 h-5 text-rose-600 fill-rose-600 drop-shadow-lg -mb-2" />
                <div className="w-1.5 h-14 md:h-18 bg-rose-950 rounded-full shadow-lg" />
                <div className="absolute bottom-0 flex gap-0.5 translate-y-1/2">
                   <div className="w-1.5 h-5 bg-white/40 rounded-full -rotate-15" />
                   <div className="w-1.5 h-5 bg-white/40 rounded-full rotate-15" />
                </div>
              </div>
            </div>
          )}

          {/* HUD */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className="glass px-5 py-2.5 rounded-full border-rose-100 flex items-center gap-3 shadow-lg">
              <Heart className={`w-4 h-4 text-rose-500 ${hits > 0 ? 'fill-rose-500 animate-pulse' : ''}`} />
              <p className="text-[9px] font-bold text-rose-900 uppercase tracking-[0.2em]">
                 Hearts Caught: {hits} / 5
              </p>
            </div>
          </div>

          {/* Controls Hint */}
          {!isPulling && !renderState.arrow.active && hits === 0 && (
             <div className="absolute inset-x-0 bottom-24 flex flex-col items-center animate-bounce opacity-40 pointer-events-none">
                <Move className="w-6 h-6 text-rose-900" />
                <p className="text-[8px] uppercase tracking-widest font-bold text-rose-950 mt-2">Pull & Aim</p>
             </div>
          )}

          {/* Note Reveal */}
          {currentNote && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-rose-950/20 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-rose-100 text-center space-y-6 max-w-sm animate-in zoom-in-95 duration-500">
                <div className="flex justify-center">
                  <div className="p-4 bg-rose-50 rounded-full animate-bounce">
                    <Sparkles className="w-10 h-10 text-rose-500" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-script text-rose-950 leading-relaxed italic font-bold">
                  "{currentNote}"
                </p>
                <button 
                  onClick={() => setCurrentNote(null)}
                  className="w-full bg-rose-900 text-white py-4 rounded-full text-[9px] uppercase tracking-[0.4em] font-extrabold shadow-lg hover:bg-rose-950 transition-all active:scale-95"
                >
                  Save in my heart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Next Section Button */}
        <div className="mt-10 h-20 flex flex-col items-center">
           {isUnlocked && !currentNote && (
             <button 
               onClick={() => {
                  const el = document.getElementById('proposal');
                  el?.scrollIntoView({ behavior: 'smooth' });
               }}
               className="group flex items-center gap-4 bg-rose-900 text-white px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.5em] font-extrabold shadow-xl hover:bg-rose-950 transition-all animate-in fade-in slide-in-from-bottom-4 duration-700 active:scale-95"
             >
               Final Chapter
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
           )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-4px, 2px); }
          50% { transform: translate(4px, -2px); }
          75% { transform: translate(-2px, -2px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default LoveJar;
