import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Star, Trophy, Sparkles, Target, Play } from 'lucide-react';

interface Props {
  onBack: () => void;
  onWin: (score: number) => void;
}

interface FloatingBalloon {
  id: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
  text: string;
  value: number;
  color: string;
  isTarget: boolean;
  isPopped?: boolean;
}

interface ShootMission {
  id: number;
  title: string;
  check: (v: number) => boolean;
  pool: { text: string; value: number }[];
}

const SHOOT_MISSIONS: ShootMission[] = [
  {
    id: 1,
    title: 'Bắn những quả bóng có kết quả bằng 10!',
    check: (v) => v === 10,
    pool: [
      { text: '6 + 4', value: 10 },
      { text: '8 + 2', value: 10 },
      { text: '7 + 3', value: 10 },
      { text: '5 + 5', value: 10 },
      { text: '9 + 1', value: 10 },
      { text: '10', value: 10 },
      { text: '5 + 2', value: 7 },
      { text: '9 - 4', value: 5 },
      { text: '4 + 4', value: 8 },
      { text: '6 + 2', value: 8 },
      { text: '3 + 4', value: 7 }
    ]
  },
  {
    id: 2,
    title: 'Bắn những quả bóng mang số LỚN HƠN 7!',
    check: (v) => v > 7,
    pool: [
      { text: '8', value: 8 },
      { text: '9', value: 9 },
      { text: '10', value: 10 },
      { text: '5 + 4', value: 9 },
      { text: '6 + 3', value: 9 },
      { text: '10 - 1', value: 9 },
      { text: '3', value: 3 },
      { text: '5', value: 5 },
      { text: '6', value: 6 },
      { text: '7', value: 7 },
      { text: '4', value: 4 }
    ]
  },
  {
    id: 3,
    title: 'Bắn những quả bóng có kết quả bằng 6!',
    check: (v) => v === 6,
    pool: [
      { text: '10 - 4', value: 6 },
      { text: '3 + 3', value: 6 },
      { text: '5 + 1', value: 6 },
      { text: '8 - 2', value: 6 },
      { text: '6', value: 6 },
      { text: '9 - 3', value: 6 },
      { text: '7 - 2', value: 5 },
      { text: '4 + 3', value: 7 },
      { text: '8', value: 8 },
      { text: '5 + 4', value: 9 }
    ]
  },
  {
    id: 4,
    title: 'Bắn những quả bóng mang số BÉ HƠN 5!',
    check: (v) => v < 5,
    pool: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '2 + 1', value: 3 },
      { text: '5', value: 5 },
      { text: '6', value: 6 },
      { text: '7', value: 7 },
      { text: '8', value: 8 },
      { text: '9', value: 9 }
    ]
  }
];

export const BalloonShooterGame: React.FC<Props> = ({ onBack, onWin }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [aimAngle, setAimAngle] = useState(0); // -45 to +45 deg
  const [starBullets, setStarBullets] = useState<{ id: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [popEffect, setPopEffect] = useState<{ x: number; y: number; text: string; color: string } | null>(null);

  const TARGET_GOAL = 12;
  const currentMission = SHOOT_MISSIONS[missionIdx % SHOOT_MISSIONS.length];

  const balloonsRef = useRef<FloatingBalloon[]>([]);
  const bulletsRef = useRef<{ id: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const bulletIdCounter = useRef(1);
  const balloonIdCounter = useRef(1);
  const lastSpawnTime = useRef(0);
  const scoreRef = useRef(0);
  const hitCountRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    hitCountRef.current = hitCount;
  }, [hitCount]);

  // Spawn balloon
  const spawnBalloon = () => {
    const pool = currentMission.pool;
    const targetPool = pool.filter(p => currentMission.check(p.value));
    const distractorPool = pool.filter(p => !currentMission.check(p.value));

    const pickTarget = Math.random() < 0.6 || distractorPool.length === 0;
    const item = pickTarget
      ? targetPool[Math.floor(Math.random() * targetPool.length)]
      : distractorPool[Math.floor(Math.random() * distractorPool.length)];

    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#A855F7', '#EC4899'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    const newBalloon: FloatingBalloon = {
      id: balloonIdCounter.current++,
      x: 70 + Math.random() * 460,
      y: 420, // starts near bottom and floats upward
      vy: -(0.9 + Math.random() * 0.7), // gentle float speed
      vx: (Math.random() - 0.5) * 0.6,
      text: item.text,
      value: item.value,
      color: chosenColor,
      isTarget: currentMission.check(item.value)
    };

    balloonsRef.current.push(newBalloon);
  };

  // Launch star projectile
  const handleShoot = () => {
    soundManager.unlockAudio();
    if (!isPlaying || isWon) return;

    soundManager.playPop();

    // Calculate velocity based on aimAngle (-45 to +45)
    const rad = ((aimAngle - 90) * Math.PI) / 180;
    const speed = 12;
    const vx = Math.cos(rad) * speed;
    const vy = Math.sin(rad) * speed;

    const newBullet = {
      id: bulletIdCounter.current++,
      x: 300,
      y: 410,
      vx,
      vy
    };

    bulletsRef.current.push(newBullet);
  };

  // Keyboard and mouse aim
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isWon) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setAimAngle(prev => Math.max(-45, prev - 5));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setAimAngle(prev => Math.min(45, prev + 5));
      } else if (e.key === ' ' || e.key === 'Enter') {
        handleShoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isWon, aimAngle]);

  // Main animation frame loop
  useEffect(() => {
    if (!isPlaying || isWon) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Spawn check
      if (time - lastSpawnTime.current > 1600) {
        lastSpawnTime.current = time;
        if (balloonsRef.current.length < 6) {
          spawnBalloon();
        }
      }

      // Update balloons
      const remainingBalloons: FloatingBalloon[] = [];
      balloonsRef.current.forEach(b => {
        b.y += b.vy * (dt * 60);
        b.x += b.vx * (dt * 60);

        // Keep within bounds
        if (b.x < 50 || b.x > 550) b.vx *= -1;

        // Still on screen
        if (b.y > -50 && !b.isPopped) {
          remainingBalloons.push(b);
        }
      });
      balloonsRef.current = remainingBalloons;

      // Update bullets
      const remainingBullets: typeof bulletsRef.current = [];
      bulletsRef.current.forEach(bullet => {
        bullet.x += bullet.vx * (dt * 60);
        bullet.y += bullet.vy * (dt * 60);

        let hitAny = false;

        // Check collision with balloons (radius ~ 35px)
        balloonsRef.current.forEach(balloon => {
          if (hitAny || balloon.isPopped) return;

          const dx = bullet.x - balloon.x;
          const dy = bullet.y - balloon.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 40) {
            // Collision!
            hitAny = true;
            balloon.isPopped = true;

            if (balloon.isTarget) {
              // CORRECT BALLOON!
              soundManager.playBalloonPop();
              soundManager.playStar();

              const newScore = scoreRef.current + 15;
              const newHit = hitCountRef.current + 1;
              setScore(newScore);
              setHitCount(newHit);

              setPopEffect({
                x: balloon.x,
                y: balloon.y,
                text: `+15 ⭐ CHÍNH XÁC!`,
                color: '#10B981'
              });
              setTimeout(() => setPopEffect(null), 900);

              if (newHit >= TARGET_GOAL) {
                // Completed!
                setIsWon(true);
                soundManager.playFanfare();
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
                onWin(newScore);
              }
            } else {
              // Hit wrong balloon!
              soundManager.playTryAgain();
              setPopEffect({
                x: balloon.x,
                y: balloon.y,
                text: `Ôi chưa đúng rồi! 🎈`,
                color: '#EF4444'
              });
              setTimeout(() => setPopEffect(null), 900);
            }
          }
        });

        // Keep bullet if still on screen and didn't hit
        if (!hitAny && bullet.y > -20 && bullet.x > -20 && bullet.x < 620) {
          remainingBullets.push(bullet);
        }
      });

      bulletsRef.current = remainingBullets;
      setStarBullets([...remainingBullets]);

      if (!isWon) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isWon, missionIdx]);

  const handleStartGame = () => {
    balloonsRef.current = [];
    bulletsRef.current = [];
    setScore(0);
    setHitCount(0);
    setIsWon(false);
    setIsPlaying(true);
    lastSpawnTime.current = performance.now();
    soundManager.playPop();
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-1.5 sm:p-2.5 select-none overflow-hidden">
      {/* Top Bar Navigation & Info */}
      <div className="flex-none flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border-2 border-sky-300 shadow-sm">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Về Siêu VIP
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 block">
            Vòng 5 · Ngắm bắn tọa độ & Quán tính
          </span>
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5 justify-center">
            🎈 XẠ THỦ BÓNG SỐ
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-amber-900 font-black text-xs flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{score} điểm</span>
          </div>
          <div className="bg-sky-100 border border-sky-300 px-2.5 py-1 rounded-xl text-sky-900 font-black text-xs">
            {hitCount} / {TARGET_GOAL} Bóng
          </div>
        </div>
      </div>

      {/* Main Carnival Sky Frame 16:9 Aspect Ratio */}
      <div className="flex-1 min-h-0 flex items-center justify-center my-1 relative w-full">
        <div
          ref={containerRef}
          className="relative w-full h-full max-h-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-sky-400 shadow-2xl bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 touch-none"
        >
        {/* Clouds and Sky Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-10 text-4xl opacity-80 animate-pulse">☁️</div>
          <div className="absolute top-14 right-20 text-3xl opacity-75">☁️</div>
          <div className="absolute top-28 left-48 text-2xl opacity-60">☁️</div>
        </div>

        {/* MISSION BANNER */}
        <div className="absolute top-3 inset-x-6 sm:inset-x-16 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border-2 border-sky-300 shadow-lg flex items-center justify-between gap-3 text-center">
            <span className="text-xs font-black bg-sky-500 text-white px-3 py-1 rounded-full shrink-0 shadow-xs">
              Nhiệm vụ
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight flex-1">
              {currentMission.title}
            </h3>
            <div className="bg-amber-100 text-amber-950 px-3 py-1 rounded-full text-xs font-black shrink-0">
              {hitCount} / {TARGET_GOAL} quả
            </div>
          </div>
        </div>

        {/* FLOATING BALLOONS */}
        {isPlaying && !isWon && balloonsRef.current.map(balloon => {
          const leftPercent = (balloon.x / 600) * 100;
          const topPercent = (balloon.y / 440) * 100;

          return (
            <div
              key={balloon.id}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute z-10 pointer-events-none"
            >
              {/* Balloon Body */}
              <div
                style={{ backgroundColor: balloon.color }}
                className="w-16 h-20 rounded-full shadow-lg border-2 border-white/60 flex flex-col items-center justify-center text-white relative ring-2 ring-black/5"
              >
                {/* Gloss highlight */}
                <div className="absolute top-2 left-3 w-4 h-6 rounded-full bg-white/40 blur-[1px]" />
                <span className="text-sm sm:text-base font-black drop-shadow-md text-center px-1">
                  {balloon.text}
                </span>
                {/* Balloon knot */}
                <div
                  style={{ borderTopColor: balloon.color }}
                  className="absolute -bottom-2 w-0 h-0 border-x-4 border-x-transparent border-t-6"
                />
                {/* String */}
                <div className="absolute -bottom-6 w-0.5 h-5 bg-slate-400" />
              </div>
            </div>
          );
        })}

        {/* POPPING FEEDBACK EFFECT */}
        {popEffect && (
          <div
            style={{
              left: `${(popEffect.x / 600) * 100}%`,
              top: `${(popEffect.y / 440) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute z-30 pointer-events-none animate-in zoom-in-125 duration-300"
          >
            <span
              style={{ color: popEffect.color }}
              className="bg-white/95 px-3 py-1 rounded-full text-xs sm:text-sm font-black shadow-xl border border-slate-200 whitespace-nowrap"
            >
              {popEffect.text}
            </span>
          </div>
        )}

        {/* FLYING STAR BULLETS */}
        {starBullets.map(bullet => (
          <div
            key={bullet.id}
            style={{
              left: `${(bullet.x / 600) * 100}%`,
              top: `${(bullet.y / 440) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute z-20 pointer-events-none text-2xl filter drop-shadow-[0_0_8px_#facc15]"
          >
            ⭐
          </div>
        ))}

        {/* TOY CANNON / STAR LAUNCHER AT BOTTOM */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          {/* Rotating Cannon Barrel */}
          <div
            style={{
              transform: `rotate(${aimAngle}deg)`,
              transformOrigin: 'bottom center'
            }}
            className="w-10 h-24 bg-gradient-to-t from-sky-600 via-indigo-600 to-amber-400 rounded-t-2xl border-3 border-amber-300 shadow-2xl relative transition-transform duration-75 flex items-start justify-center pt-2"
          >
            <div className="w-5 h-5 rounded-full bg-yellow-300 shadow-[0_0_10px_#f59e0b] animate-ping" />
          </div>

          {/* Cannon Base */}
          <div className="w-24 h-10 -mt-2 bg-gradient-to-r from-amber-600 to-orange-700 rounded-t-full border-2 border-amber-300 shadow-xl flex items-center justify-center text-white text-xs font-black">
            ỐNG PHÓNG
          </div>
        </div>

        {/* START SCREEN */}
        {!isPlaying && !isWon && (
          <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 text-center">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-sky-400 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-5xl shadow-xl animate-bounce">
                🎈⭐
              </div>
              <div>
                <span className="text-xs font-black uppercase text-sky-600 tracking-wider">
                  Trò chơi số 5 · Thiện xạ bầu trời
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  XẠ THỦ BÓNG SỐ
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Ngắm hướng và bắn ngôi sao làm nổ những quả bóng bay mang đáp án toán học chính xác!
                </p>
              </div>

              <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 text-xs text-sky-950 font-bold text-left space-y-1">
                <div>👉 <strong>Máy tính:</strong> Phím ⬅️ ➡️ để ngắm, Phím Cách (Space) để bắn.</div>
                <div>👉 <strong>Điện thoại:</strong> Kéo thanh góc ngắm và bấm nút BẮN NGÔI SAO.</div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-base shadow-lg shadow-sky-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" /> BẮT ĐẦU NGẮM BẮN
              </button>
            </div>
          </div>
        )}

        {/* VICTORY SCREEN */}
        {isWon && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 text-center">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-sky-400 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-sky-300 to-indigo-400 flex items-center justify-center text-5xl shadow-xl animate-bounce">
                🎯👑
              </div>
              <span className="text-xs font-black uppercase text-sky-700 tracking-wider">
                Thiện xạ đại tài
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                XẠ THỦ BÓNG SỐ!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bé đã xuất sắc bắn trúng 12 mục tiêu bóng số chính xác và giành được Huy hiệu Xạ Thủ Vàng!
              </p>
              <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 font-black text-sky-900 text-sm">
                + {score} Điểm thành tích Siêu VIP ⭐
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartGame}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 inline mr-1" /> Bắn lại
                </button>
                <button
                  onClick={onBack}
                  className="px-6 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Khu Siêu VIP
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* CONTROLLER BAR: AIM ANGLE & SHOOT BUTTON */}
      <div className="flex-none bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border-2 border-sky-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Aim angle slider */}
        <div className="flex-1 w-full flex items-center gap-2">
          <span className="text-xs font-black text-slate-700 whitespace-nowrap">
            🎯 Góc ngắm:
          </span>
          <button
            onClick={() => setAimAngle(prev => Math.max(-45, prev - 10))}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-xs cursor-pointer"
          >
            ⬅️ Trái
          </button>
          <input
            type="range"
            min="-45"
            max="45"
            value={aimAngle}
            onChange={(e) => setAimAngle(Number(e.target.value))}
            className="flex-1 accent-sky-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <button
            onClick={() => setAimAngle(prev => Math.min(45, prev + 10))}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-xs cursor-pointer"
          >
            Phải ➡️
          </button>
        </div>

        {/* Shoot Button */}
        <button
          onClick={handleShoot}
          disabled={!isPlaying || isWon}
          className="w-full sm:w-auto px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Target className="w-4 h-4" /> BẮN NGÔI SAO ⭐
        </button>
      </div>
    </div>
  );
};
