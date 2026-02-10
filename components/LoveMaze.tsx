
import { Heart, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Sparkles, Ghost, Skull, Flame, Moon, Trophy, ArrowRight } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

interface Props {
  personalization: {
    userName: string;
    partnerName: string;
  };
  onWin?: () => void;
  onNext?: () => void;
}

type CellType = 0 | 1 | 2 | 3 | 4;
const MAZE_SIZE = 12;

const LoveMaze: React.FC<Props> = ({ personalization, onWin, onNext }) => {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [health, setHealth] = useState(100);
  const [lightRadius, setLightRadius] = useState(3);
  const [struggleMsg, setStruggleMsg] = useState('');
  const [winQuote, setWinQuote] = useState('');

  const quotes = [
    "Sa dami ng pwedeng puntahan, sa'yo pa rin ako laging nakarating. ❤️",
    "Kahit gaano kaligaw, ang puso ko ang naging kompas ko para mahanap ka. ✨",
    "Hindi mahalaga kung gaano kahirap ang lakad, basta ikaw ang dulo. 💍",
    "Saksi ang dilim na ikaw ang tanging liwanag na laging hinahanap ko. 😍",
    "Kahit gaano pa kalaki ang mundo, hinding-hindi ako mapapagod sa'yo. 🌹",
    "Ikaw ang dulo ng bawat maze, ang pahinga sa bawat paglalakbay. 🤍",
    "Hindi bale nang maligaw sa dilim, basta sa huli, ikaw ang kasama. 👫"
  ];

  const generateMaze = useCallback(() => {
    const layout: CellType[][] = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 2, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 3, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 2, 0, 0, 0, 0, 3, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    setMaze(layout);
  }, []);

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  const triggerCheer = () => {
    const container = document.body;
    for (let i = 0; i < 40; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = i % 3 === 0 ? '❤️' : i % 3 === 1 ? '✨' : '🌸';
      heart.style.position = 'fixed';
      heart.style.left = '50vw';
      heart.style.top = '50vh';
      heart.style.fontSize = (Math.random() * 24 + 16) + 'px';
      heart.style.zIndex = '1000';
      heart.style.transition = `all ${Math.random() * 1.5 + 1}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      container.appendChild(heart);
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 500 + 300;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      setTimeout(() => {
        heart.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg) scale(0)`;
        heart.style.opacity = '0';
      }, 50);
      setTimeout(() => heart.remove(), 2500);
    }
  };

  const movePlayer = (dx: number, dy: number) => {
    if (!gameStarted || isWon) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE) {
      const cell = maze[newY][newX];
      if (cell !== 1) {
        setPlayerPos({ x: newX, y: newY });

        if (cell === 2) {
          setHealth(h => Math.max(0, h - 15));
          setStruggleMsg("May humaharang... pero 'di ako papatalo.");
          setTimeout(() => setStruggleMsg(''), 1500);
        } else if (cell === 3) {
          setLightRadius(r => r + 1);
          setHealth(h => Math.min(100, h + 10));
          const newMaze = [...maze];
          newMaze[newY][newX] = 0;
          setMaze(newMaze);
        } else if (cell === 4) {
          setIsWon(true);
          setWinQuote(quotes[Math.floor(Math.random() * quotes.length)]);
          triggerCheer();
          if (onWin) onWin();
        }
      }
    }
  };

  const reset = () => {
    setPlayerPos({ x: 1, y: 1 });
    setHealth(100);
    setLightRadius(3);
    setIsWon(false);
    setGameStarted(false);
    generateMaze();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, gameStarted, isWon, maze]);

  return (
    <div id="maze" className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 md:py-12 gap-8 lg:gap-16">
      <div className="max-w-[1400px] w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20">
        
        <div className="lg:w-[35%] space-y-4 md:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          <div className="glass p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-white/60 shadow-2xl space-y-4 md:space-y-6 w-full max-w-md">
            <span className="inline-block px-4 py-1 bg-rose-950 text-rose-100 rounded-full text-[10px] uppercase tracking-widest font-bold border border-rose-900">Chapter II: The Abyss</span>
            <h2 className="text-4xl md:text-6xl font-serif text-rose-950 leading-tight">Darkness <br/><span className="italic text-rose-600">& Light</span></h2>
            <p className="text-base md:text-lg text-slate-700 font-serif italic leading-relaxed">
              Minsan madilim ang paligid, minsan nakakatakot. Pero hangga't hinahanap natin ang isa't isa, laging may liwanag sa dulo.
            </p>
          </div>

          {gameStarted && !isWon && (
            <div className="glass p-6 rounded-[2rem] border-rose-100 shadow-xl space-y-4 w-full max-w-md">
              <div className="flex justify-between items-end">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-900/40">Determination</p>
                <p className="text-xl font-serif italic text-rose-900">{health}%</p>
              </div>
              <div className="h-2 w-full bg-rose-50 rounded-full overflow-hidden border border-rose-100 p-0.5">
                <div 
                  className="h-full bg-rose-600 rounded-full transition-all duration-300"
                  style={{ width: `${health}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-[65%] w-full flex items-center justify-center order-1 lg:order-2">
          <div className="relative aspect-square w-full max-w-[650px] lg:max-w-[850px]">
            <div className="absolute inset-0 bg-stone-950 rounded-[3rem] lg:rounded-[4.5rem] shadow-2xl overflow-hidden border-[8px] lg:border-[16px] border-rose-900/20">
              
              <div 
                className="grid w-full h-full p-4 md:p-10" 
                style={{ 
                  gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${MAZE_SIZE}, 1fr)`,
                }}
              >
                {maze.map((row, y) => row.map((cell, x) => {
                  const distance = Math.sqrt(Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2));
                  const isVisible = distance < lightRadius;
                  const opacity = Math.max(0, 1 - (distance / lightRadius));

                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className={`relative flex items-center justify-center transition-all duration-500 rounded-sm`}
                      style={{
                        backgroundColor: cell === 1 ? '#1c1917' : 'transparent',
                        opacity: isVisible ? 1 : 0.05,
                      }}
                    >
                      {isVisible && (
                        <>
                          {cell === 2 && <Ghost className="w-6 h-6 md:w-10 md:h-10 text-rose-300 opacity-60 animate-pulse" />}
                          {cell === 3 && <Flame className="w-6 h-6 md:w-10 md:h-10 text-yellow-400 fill-yellow-400 animate-bounce" />}
                          {cell === 4 && (
                            <div className="relative">
                              <span className="text-3xl md:text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">👦</span>
                            </div>
                          )}
                        </>
                      )}
                      <div 
                        className="absolute inset-0 bg-stone-950 transition-opacity duration-700 pointer-events-none"
                        style={{ opacity: isVisible ? 1 - opacity : 0.95 }}
                      />
                    </div>
                  );
                }))}
              </div>

              <div 
                className="absolute transition-all duration-300 ease-in-out pointer-events-none flex flex-col items-center justify-center"
                style={{ 
                  width: `${100 / MAZE_SIZE}%`,
                  height: `${100 / MAZE_SIZE}%`,
                  left: `${(playerPos.x / MAZE_SIZE) * 100}%`,
                  top: `${(playerPos.y / MAZE_SIZE) * 100}%`,
                  zIndex: 30
                }}
              >
                <div className="relative flex items-center justify-center w-full h-full">
                   <div className="absolute -inset-8 lg:-inset-16 bg-rose-500/30 blur-2xl rounded-full" />
                   <span className="text-4xl md:text-7xl drop-shadow-[0_0_25px_rgba(244,63,94,0.8)]">👧</span>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

              {!gameStarted && !isWon && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md">
                  <button 
                    onClick={() => setGameStarted(true)}
                    className="flex flex-col items-center gap-6 md:gap-8 group"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-rose-950 rounded-full flex items-center justify-center border-4 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.5)] group-hover:scale-110 transition-transform duration-500">
                      <Moon className="w-10 h-10 md:w-14 md:h-14 text-rose-500 fill-rose-500" />
                    </div>
                    <div className="glass px-8 py-3 rounded-full border border-white/20 shadow-2xl">
                      <span className="text-xs md:text-sm uppercase tracking-[0.4em] font-bold text-rose-950">Simulan ang journey</span>
                    </div>
                  </button>
                </div>
              )}

              {isWon && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-700 px-4 py-8 overflow-y-auto">
                   <div className="relative mb-6 md:mb-10 scale-90 md:scale-110">
                      <div className="absolute -inset-16 bg-rose-100/50 rounded-full blur-[40px] animate-pulse" />
                      <div className="relative z-10 flex gap-6 md:gap-10 text-6xl md:text-9xl items-center animate-bounce-slow">
                        <span>👧</span>
                        <div className="relative flex items-center justify-center">
                          <Heart className="w-12 h-12 md:w-24 md:h-24 text-rose-600 fill-rose-600" />
                          <Sparkles className="absolute -top-4 -right-4 w-6 h-6 md:w-10 md:h-10 text-yellow-400 animate-spin-slow" />
                        </div>
                        <span>👦</span>
                      </div>
                   </div>
                   
                   <div className="glass p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-rose-200 text-center space-y-6 md:space-y-8 max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col items-center">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-30" />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-rose-800">
                          <Trophy className="w-4 h-4 text-rose-500" />
                          <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold">Tagumpay ng Puso</span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-script text-rose-950">Nahanap din kita!</h3>
                      </div>

                      <p className="text-lg md:text-2xl font-serif italic leading-relaxed text-slate-800 px-1">
                        "{winQuote}"
                      </p>

                      <div className="pt-4 flex flex-col gap-3 w-full">
                        <button 
                          onClick={onNext}
                          className="group relative w-full py-4 bg-rose-900 text-white rounded-full text-[10px] uppercase tracking-[0.4em] font-extrabold shadow-xl hover:bg-rose-950 transition-all active:scale-95 overflow-hidden flex items-center justify-center gap-3 z-20"
                        >
                          <span className="relative z-10">Tuloy na tayo, mahal</span>
                          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </button>
                        
                        <button 
                          onClick={reset}
                          className="w-full py-3 text-rose-900/60 hover:text-rose-900 text-[10px] uppercase tracking-widest font-bold transition-colors z-20"
                        >
                          Ulitin ang journey
                        </button>
                      </div>
                   </div>
                </div>
              )}

              {gameStarted && !isWon && (
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 md:gap-3 scale-75 md:scale-110">
                  <button onClick={() => movePlayer(0, -1)} className="w-14 h-14 md:w-16 md:h-16 glass rounded-2xl flex items-center justify-center text-rose-950 shadow-2xl active:scale-90 border-2 border-white/40"><ChevronUp className="w-8 h-8 md:w-10 md:h-10" /></button>
                  <div className="flex gap-2 md:gap-3">
                    <button onClick={() => movePlayer(-1, 0)} className="w-14 h-14 md:w-16 md:h-16 glass rounded-2xl flex items-center justify-center text-rose-950 shadow-2xl active:scale-90 border-2 border-white/40"><ChevronLeft className="w-8 h-8 md:w-10 md:h-10" /></button>
                    <button onClick={() => movePlayer(0, 1)} className="w-14 h-14 md:w-16 md:h-16 glass rounded-2xl flex items-center justify-center text-rose-950 shadow-2xl active:scale-90 border-2 border-white/40"><ChevronDown className="w-8 h-8 md:w-10 md:h-10" /></button>
                    <button onClick={() => movePlayer(1, 0)} className="w-14 h-14 md:w-16 md:h-16 glass rounded-2xl flex items-center justify-center text-rose-950 shadow-2xl active:scale-90 border-2 border-white/40"><ChevronRight className="w-8 h-8 md:w-10 md:h-10" /></button>
                  </div>
                </div>
              )}

              {struggleMsg && (
                 <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-6 duration-500">
                    <div className="bg-rose-950/95 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl border border-rose-500/40 flex items-center gap-2">
                       <Skull className="w-3 h-3 text-rose-400" />
                       {struggleMsg}
                    </div>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveMaze;
