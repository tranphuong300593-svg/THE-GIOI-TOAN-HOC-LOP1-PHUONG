import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Heart, Star, Sparkles, Trophy, Award, Play } from 'lucide-react';

interface Props {
  onBack: () => void;
  onWin: (score: number) => void;
}

interface FallingFruit {
  id: number;
  x: number;
  y: number;
  vy: number;
  text: string;
  value: number;
  kind: 'apple' | 'orange' | 'strawberry' | 'pear';
  color: string;
  isTarget: boolean;
  collected?: boolean;
}

interface CatchMission {
  id: number;
  title: string;
  check: (val: number) => boolean;
  pool: { text: string; value: number }[];
}

const MISSIONS: CatchMission[] = [
  {
    id: 1,
    title: 'Hứng những quả có kết quả bằng 8!',
    check: (v) => v === 8,
    pool: [
      { text: '5 + 3', value: 8 },
      { text: '10 - 2', value: 8 },
      { text: '4 + 4', value: 8 },
      { text: '9 - 1', value: 8 },
      { text: '8', value: 8 },
      { text: '6 + 2', value: 8 },
      { text: '4 + 2', value: 6 },
      { text: '6 + 1', value: 7 },
      { text: '5', value: 5 },
      { text: '3 + 2', value: 5 },
      { text: '10 - 1', value: 9 }
    ]
  },
  {
    id: 2,
    title: 'Hứng những quả có số LỚN HƠN 5!',
    check: (v) => v > 5,
    pool: [
      { text: '6', value: 6 },
      { text: '7', value: 7 },
      { text: '8', value: 8 },
      { text: '9', value: 9 },
      { text: '10', value: 10 },
      { text: '4 + 3', value: 7 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '1', value: 1 },
      { text: '5', value: 5 }
    ]
  },
  {
    id: 3,
    title: 'Hứng những quả có kết quả bằng 10!',
    check: (v) => v === 10,
    pool: [
      { text: '5 + 5', value: 10 },
      { text: '8 + 2', value: 10 },
      { text: '7 + 3', value: 10 },
      { text: '9 + 1', value: 10 },
      { text: '10', value: 10 },
      { text: '6 + 4', value: 10 },
      { text: '4 + 4', value: 8 },
      { text: '7', value: 7 },
      { text: '5 + 4', value: 9 },
      { text: '6 + 2', value: 8 },
      { text: '3 + 3', value: 6 }
    ]
  },
  {
    id: 4,
    title: 'Hứng những quả có số BÉ HƠN 6!',
    check: (v) => v < 6,
    pool: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
      { text: '2 + 2', value: 4 },
      { text: '6', value: 6 },
      { text: '7', value: 7 },
      { text: '8', value: 8 },
      { text: '9', value: 9 },
      { text: '10', value: 10 }
    ]
  },
  {
    id: 5,
    title: 'Hứng những quả có kết quả bằng 7!',
    check: (v) => v === 7,
    pool: [
      { text: '4 + 3', value: 7 },
      { text: '5 + 2', value: 7 },
      { text: '10 - 3', value: 7 },
      { text: '6 + 1', value: 7 },
      { text: '7', value: 7 },
      { text: '9 - 2', value: 7 },
      { text: '5', value: 5 },
      { text: '8 - 2', value: 6 },
      { text: '4 + 4', value: 8 },
      { text: '3 + 3', value: 6 }
    ]
  }
];

export const FruitCatcherGame: React.FC<Props> = ({ onBack, onWin }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCatches, setCorrectCatches] = useState(0);
  const [lives, setLives] = useState(3);
  const [basketX, setBasketX] = useState(300); // 0 to 600
  const [basketBounce, setBasketBounce] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<{ x: number; y: number; text: string; color: string } | null>(null);

  const TARGET_GOAL = 10;
  const currentMission = MISSIONS[missionIndex % MISSIONS.length];

  // Game state stored in refs for the RAF loop
  const fruitsRef = useRef<FallingFruit[]>([]);
  const basketXRef = useRef(300);
  const livesRef = useRef(3);
  const correctCatchesRef = useRef(0);
  const scoreRef = useRef(0);
  const isPlayingRef = useRef(false);
  const lastSpawnTimeRef = useRef(0);
  const nextFruitIdRef = useRef(1);

  // Keep refs in sync
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    correctCatchesRef.current = correctCatches;
  }, [correctCatches]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    isPlayingRef.current = isPlaying && !isGameOver && !isWon;
  }, [isPlaying, isGameOver, isWon]);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlayingRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX(prev => Math.max(60, prev - 45));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX(prev => Math.min(540, prev + 45));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle pointer/mouse move on game canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isPlayingRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * 600;
    setBasketX(Math.max(60, Math.min(540, relativeX)));
  };

  // Spawn a new fruit
  const spawnFruit = () => {
    const pool = currentMission.pool;
    // 60% chance to spawn a target fruit, 40% distractor
    const targetPool = pool.filter(p => currentMission.check(p.value));
    const distractorPool = pool.filter(p => !currentMission.check(p.value));

    const pickTarget = Math.random() < 0.6 || distractorPool.length === 0;
    const item = pickTarget
      ? targetPool[Math.floor(Math.random() * targetPool.length)]
      : distractorPool[Math.floor(Math.random() * distractorPool.length)];

    const kinds: FallingFruit['kind'][] = ['apple', 'orange', 'strawberry', 'pear'];
    const fruitKind = kinds[Math.floor(Math.random() * kinds.length)];
    const colors: Record<FallingFruit['kind'], string> = {
      apple: '#EF4444',
      orange: '#F97316',
      strawberry: '#EC4899',
      pear: '#84CC16'
    };

    const newFruit: FallingFruit = {
      id: nextFruitIdRef.current++,
      x: 70 + Math.random() * 460,
      y: 10,
      vy: 1.8 + Math.min(1.5, (missionIndex * 0.3)), // gentle speed increase
      text: item.text,
      value: item.value,
      kind: fruitKind,
      color: colors[fruitKind],
      isTarget: currentMission.check(item.value)
    };

    fruitsRef.current.push(newFruit);
  };

  // Main game tick
  useEffect(() => {
    if (!isPlaying || isGameOver || isWon) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Spawn check
      if (time - lastSpawnTimeRef.current > 1800) {
        lastSpawnTimeRef.current = time;
        if (fruitsRef.current.length < 5) {
          spawnFruit();
        }
      }

      // Update fruits
      const basketCurrentX = basketXRef.current;
      const basketY = 380;
      const basketHalfWidth = 55;

      const remaining: FallingFruit[] = [];

      fruitsRef.current.forEach(fruit => {
        fruit.y += fruit.vy * (dt * 60);

        // Check collision with basket
        if (fruit.y >= basketY - 30 && fruit.y <= basketY + 30) {
          if (Math.abs(fruit.x - basketCurrentX) <= basketHalfWidth) {
            // Collision!
            if (fruit.isTarget) {
              // Correct fruit!
              soundManager.playCatch();
              soundManager.playStar();
              setBasketBounce(true);
              setTimeout(() => setBasketBounce(false), 200);

              const newCorrect = correctCatchesRef.current + 1;
              const newScore = scoreRef.current + 10;
              setCorrectCatches(newCorrect);
              setScore(newScore);

              setFeedbackEffect({
                x: fruit.x,
                y: fruit.y,
                text: `+10 ⭐ (${fruit.text})`,
                color: '#10B981'
              });
              setTimeout(() => setFeedbackEffect(null), 900);

              if (newCorrect >= TARGET_GOAL) {
                // WON!
                setIsWon(true);
                soundManager.playFanfare();
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                onWin(newScore);
              }
              return;
            } else {
              // Caught wrong fruit!
              soundManager.playTryAgain();
              const newLives = Math.max(0, livesRef.current - 1);
              setLives(newLives);

              setFeedbackEffect({
                x: fruit.x,
                y: fruit.y,
                text: `Ôi chưa đúng! 💔`,
                color: '#EF4444'
              });
              setTimeout(() => setFeedbackEffect(null), 900);

              if (newLives <= 0) {
                setIsGameOver(true);
              }
              return;
            }
          }
        }

        // Check ground hit
        if (fruit.y > 440) {
          // Fallen to ground without catch
          return;
        }

        remaining.push(fruit);
      });

      fruitsRef.current = remaining;

      if (!isGameOver && !isWon) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, isWon, missionIndex]);

  // Restart game
  const handleStartGame = () => {
    soundManager.unlockAudio();
    fruitsRef.current = [];
    setBasketX(300);
    setScore(0);
    setCorrectCatches(0);
    setLives(3);
    setIsGameOver(false);
    setIsWon(false);
    setIsPlaying(true);
    lastSpawnTimeRef.current = performance.now();
    soundManager.playPop();
  };

  const handleNextMission = () => {
    fruitsRef.current = [];
    setBasketX(300);
    setCorrectCatches(0);
    setLives(3);
    setIsGameOver(false);
    setIsWon(false);
    setMissionIndex(prev => prev + 1);
    setIsPlaying(true);
    lastSpawnTimeRef.current = performance.now();
    soundManager.playPop();
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-1.5 sm:p-2.5 select-none overflow-hidden">
      {/* Top Bar Navigation & Info */}
      <div className="flex-none flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Về Siêu VIP
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
            Vòng 1 · Thao tác vận động thực tế
          </span>
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5 justify-center">
            🍎 HỨNG QUẢ THẦN TỐC
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 transition-transform ${
                  i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-300 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Score */}
          <div className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-amber-900 font-black text-xs flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{score} điểm</span>
          </div>
        </div>
      </div>

      {/* Main Game Screen 16:9 Aspect Ratio Frame */}
      <div className="flex-1 min-h-0 flex items-center justify-center my-1 relative w-full">
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className="relative w-full h-full max-h-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-emerald-300 shadow-2xl bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 cursor-ew-resize touch-none"
        >
          {/* Sky, Clouds, Orchard Tree Background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Sun */}
            <div className="absolute top-3 right-6 w-12 h-12 rounded-full bg-yellow-300/80 blur-xs border-3 border-yellow-200 animate-pulse" />
            
            {/* Clouds */}
            <div className="absolute top-4 left-8 bg-white/80 rounded-full px-4 py-1 shadow-xs text-base">
              ☁️
            </div>
            <div className="absolute top-8 left-36 bg-white/70 rounded-full px-3 py-0.5 text-xs">
              ☁️
            </div>

            {/* Lush Tree branches on top */}
            <div className="absolute -top-12 inset-x-0 h-24 bg-gradient-to-b from-emerald-600 via-emerald-500 to-transparent rounded-b-[80px] opacity-90 shadow-lg" />
            
            {/* Garden fence and flowers at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-emerald-600 to-emerald-500 border-t-2 border-emerald-400 flex items-center justify-between px-4 text-base">
              <span>🌸</span>
              <span>🌼</span>
              <span>🌷</span>
              <span>🌻</span>
              <span>🌺</span>
              <span>🌼</span>
              <span>🌸</span>
            </div>
          </div>

          {/* MISSION BANNER AT TOP */}
          <div className="absolute top-2 inset-x-3 sm:inset-x-8 z-20">
            <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border-2 border-amber-300 shadow-md flex items-center justify-between gap-2 text-center">
              <span className="text-[10px] sm:text-xs font-black bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
                Nhiệm vụ
              </span>
              <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-800 leading-tight flex-1">
                {currentMission.title}
              </h3>
              <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-black shrink-0">
                {correctCatches} / {TARGET_GOAL} quả
              </div>
            </div>
          </div>

          {/* FALLING FRUITS */}
          {isPlaying && !isGameOver && !isWon && fruitsRef.current.map(fruit => {
            const leftPercent = (fruit.x / 600) * 100;
            const topPercent = (fruit.y / 440) * 100;

            return (
              <div
                key={fruit.id}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-10 pointer-events-none transition-transform"
              >
                <div
                  style={{ backgroundColor: fruit.color }}
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl shadow-lg flex flex-col items-center justify-center text-white border-2 border-white ring-2 ring-black/10"
                >
                  <span className="text-[10px] sm:text-xs font-extrabold -mt-0.5">
                    {fruit.kind === 'apple' && '🍎'}
                    {fruit.kind === 'orange' && '🍊'}
                    {fruit.kind === 'strawberry' && '🍓'}
                    {fruit.kind === 'pear' && '🍐'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-black tracking-tight drop-shadow-md text-center leading-none px-0.5">
                    {fruit.text}
                  </span>
                </div>
              </div>
            );
          })}

          {/* FLOATING FEEDBACK EFFECT */}
          {feedbackEffect && (
            <div
              style={{
                left: `${(feedbackEffect.x / 600) * 100}%`,
                top: `${(feedbackEffect.y / 440) * 100}%`,
                transform: 'translate(-50%, -100%)'
              }}
              className="absolute z-30 pointer-events-none animate-in fade-in zoom-in-110"
            >
              <span
                style={{ color: feedbackEffect.color }}
                className="bg-white/95 px-2.5 py-0.5 rounded-full text-xs font-black shadow-lg border border-slate-200 whitespace-nowrap"
              >
                {feedbackEffect.text}
              </span>
            </div>
          )}

          {/* BASKET & RABBIT MASCOT AT BOTTOM */}
          <div
            style={{
              left: `${(basketX / 600) * 100}%`,
              bottom: '16px',
              transform: `translateX(-50%) ${basketBounce ? 'scale(1.15) translateY(-6px)' : 'scale(1)'}`
            }}
            className="absolute z-20 pointer-events-none transition-all duration-75 flex flex-col items-center"
          >
            {/* Rabbit mascot face behind basket */}
            <div className="text-2xl sm:text-3xl -mb-1.5 select-none filter drop-shadow-md">
              🐰
            </div>

            {/* Wicker basket */}
            <div className="w-20 sm:w-24 h-9 sm:h-10 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-b-2xl rounded-t-lg border-2 border-amber-400 shadow-xl flex items-center justify-center text-amber-200 font-black text-[10px] relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
              <span className="relative z-10 tracking-wider">GIỎ TOÁN</span>
            </div>
          </div>

          {/* START OVERLAY SCREEN */}
          {!isPlaying && !isGameOver && !isWon && (
            <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 text-center">
              <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border-4 border-amber-300 shadow-2xl space-y-3 animate-in zoom-in-95">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-3xl shadow-lg animate-bounce">
                  🐰🧺
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                    Vòng 1 · Đại Hội Game Toán Học
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    HỨNG QUẢ THẦN TỐC
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Di chuyển giỏ hứng đúng các quả mang số hoặc phép tính theo yêu cầu. Tránh các quả sai để bảo vệ trái tim!
                  </p>
                </div>

                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold text-left space-y-0.5">
                  <div>👉 <strong>Máy tính:</strong> Dùng phím ⬅️ ➡️ hoặc rê chuột.</div>
                  <div>👉 <strong>Điện thoại:</strong> Kéo ngón tay hoặc bấm nút điều khiển.</div>
                </div>

                <button
                  onClick={handleStartGame}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> BẮT ĐẦU HỨNG QUẢ
                </button>
              </div>
            </div>
          )}

          {/* GAME OVER SCREEN */}
          {isGameOver && (
            <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 text-center">
              <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full border-4 border-rose-300 shadow-2xl space-y-3 animate-in zoom-in-95">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-2xl">
                  💔
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  HẾT TRÁI TIM RỒI!
                </h3>
                <p className="text-xs text-slate-600">
                  Bé đã hứng được <strong className="text-emerald-600">{correctCatches}</strong> quả đúng và đạt được <strong className="text-amber-600">{score}</strong> điểm!
                </p>
                <button
                  onClick={handleStartGame}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Thử lại lần nữa
                </button>
              </div>
            </div>
          )}

          {/* VICTORY SCREEN */}
          {isWon && (
            <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 text-center">
              <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border-4 border-amber-300 shadow-2xl space-y-3 animate-in zoom-in-95">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center text-3xl shadow-xl animate-bounce">
                  👑
                </div>
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                  Xuất sắc hoàn thành
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  SIÊU SAO HỨNG QUẢ! 🍎🌟
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bé đã hứng đủ {TARGET_GOAL} quả toán học chính xác và hoàn thành xuất sắc Vòng 1!
                </p>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-black text-emerald-800 text-xs sm:text-sm">
                  + {score} Điểm thành tích Siêu VIP ⭐
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleNextMission}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Màn tiếp theo 🚀
                  </button>
                  <button
                    onClick={onBack}
                    className="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Khu Siêu VIP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CONTROLS & GUIDANCE */}
      <div className="flex-none flex items-center justify-between gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 text-[11px] sm:text-xs">
          <span className="text-amber-400 font-black">👉 Hướng dẫn:</span>
          <span>Dùng phím ⬅️ ➡️ hoặc rê chuột để di chuyển giỏ hứng đúng quả</span>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setBasketX(prev => Math.max(60, prev - 60))}
            className="px-3 py-1 rounded-lg bg-emerald-500 active:bg-emerald-600 font-black text-xs cursor-pointer"
          >
            ⬅️ Trái
          </button>
          <button
            onClick={() => setBasketX(prev => Math.min(540, prev + 60))}
            className="px-3 py-1 rounded-lg bg-emerald-500 active:bg-emerald-600 font-black text-xs cursor-pointer"
          >
            Phải ➡️
          </button>
        </div>
      </div>
    </div>
  );
};
