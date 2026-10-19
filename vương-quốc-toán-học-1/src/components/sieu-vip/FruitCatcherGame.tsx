import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Heart, Star, Sparkles, Trophy, Award, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  onFinishGame: (gameId: 'fruit_catcher', score: number, wonBadge: boolean) => void;
}

interface FruitItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  label: string;
  value: number;
  type: 'apple' | 'orange' | 'strawberry' | 'pear';
  isCorrect: boolean;
  radius: number;
  caught?: boolean;
}

interface Mission {
  title: string;
  sub: string;
  targetCheck: (val: number) => boolean;
  pool: { label: string; value: number }[];
}

const MISSIONS: Mission[] = [
  {
    title: 'Hứng những quả có kết quả bằng 8!',
    sub: 'Tìm các phép tính hoặc số có giá trị đúng bằng 8 nhé bé!',
    targetCheck: (v) => v === 8,
    pool: [
      { label: '5 + 3', value: 8 },
      { label: '4 + 4', value: 8 },
      { label: '10 - 2', value: 8 },
      { label: '6 + 2', value: 8 },
      { label: '9 - 1', value: 8 },
      { label: 'Số 8', value: 8 },
      // Distractors
      { label: '4 + 2', value: 6 },
      { label: '6 + 1', value: 7 },
      { label: '5 + 4', value: 9 },
      { label: '10 - 5', value: 5 },
      { label: '3 + 2', value: 5 },
      { label: 'Số 7', value: 7 }
    ]
  },
  {
    title: 'Hứng những quả có kết quả bằng 10!',
    sub: 'Tìm các phép tính tạo thành một chục tròn (bằng 10) nhé!',
    targetCheck: (v) => v === 10,
    pool: [
      { label: '6 + 4', value: 10 },
      { label: '7 + 3', value: 10 },
      { label: '5 + 5', value: 10 },
      { label: '8 + 2', value: 10 },
      { label: '9 + 1', value: 10 },
      { label: 'Số 10', value: 10 },
      // Distractors
      { label: '5 + 3', value: 8 },
      { label: '8 + 1', value: 9 },
      { label: '4 + 3', value: 7 },
      { label: '10 - 4', value: 6 },
      { label: '6 + 2', value: 8 }
    ]
  },
  {
    title: 'Hứng những quả mang số lớn hơn 5!',
    sub: 'Chỉ hứng các quả có giá trị từ 6 trở lên nhé bé!',
    targetCheck: (v) => v > 5,
    pool: [
      { label: 'Số 7', value: 7 },
      { label: 'Số 9', value: 9 },
      { label: 'Số 8', value: 8 },
      { label: 'Số 6', value: 6 },
      { label: '4 + 3', value: 7 },
      { label: '5 + 2', value: 7 },
      // Distractors
      { label: 'Số 2', value: 2 },
      { label: 'Số 4', value: 4 },
      { label: 'Số 3', value: 3 },
      { label: 'Số 1', value: 1 },
      { label: '5 - 2', value: 3 }
    ]
  }
];

export const FruitCatcherGame: React.FC<Props> = ({ onBack, onFinishGame }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [levelIdx, setLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [caughtCount, setCaughtCount] = useState(0);
  const targetWin = 10;
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [bounceBasket, setBounceBasket] = useState(false);

  // Basket state
  const basketWidth = 96;
  const basketHeight = 56;
  const basketXRef = useRef<number>(200);

  // Fruit management
  const fruitsRef = useRef<FruitItem[]>([]);
  const nextFruitIdRef = useRef<number>(1);
  const lastSpawnTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);

  // Touch control helper
  const movingLeftRef = useRef(false);
  const movingRightRef = useRef(false);

  const currentMission = MISSIONS[levelIdx % MISSIONS.length];

  // Initialize or restart
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(3);
    setCaughtCount(0);
    setIsGameOver(false);
    setIsGameWon(false);
    fruitsRef.current = [];
    basketXRef.current = 240;
    lastSpawnTimeRef.current = performance.now();
  };

  const nextLevel = () => {
    setLevelIdx(prev => prev + 1);
    setCaughtCount(0);
    setIsGameWon(false);
    fruitsRef.current = [];
    lastSpawnTimeRef.current = performance.now();
  };

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        movingLeftRef.current = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        movingRightRef.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        movingLeftRef.current = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        movingRightRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main game physics loop
  useEffect(() => {
    if (!isPlaying || isGameOver || isGameWon) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Update basket position from keys / buttons
      const moveSpeed = 420; // px per second
      if (movingLeftRef.current) {
        basketXRef.current = Math.max(0, basketXRef.current - moveSpeed * dt);
      }
      if (movingRightRef.current) {
        basketXRef.current = Math.min(width - basketWidth, basketXRef.current + moveSpeed * dt);
      }

      // 2. Spawn fruits
      const spawnInterval = levelIdx === 0 ? 1500 : levelIdx === 1 ? 1200 : 950;
      if (currentTime - lastSpawnTimeRef.current > spawnInterval) {
        lastSpawnTimeRef.current = currentTime;

        const pool = currentMission.pool;
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        const isCorrect = currentMission.targetCheck(randomItem.value);

        const fruitTypes: ('apple' | 'orange' | 'strawberry' | 'pear')[] = ['apple', 'orange', 'strawberry', 'pear'];
        const fType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];

        // Speed depends on level
        const baseSpeed = levelIdx === 0 ? 95 : levelIdx === 1 ? 135 : 175;
        const speed = baseSpeed + Math.random() * 35;

        fruitsRef.current.push({
          id: nextFruitIdRef.current++,
          x: 40 + Math.random() * (width - 80),
          y: -30,
          speed,
          label: randomItem.label,
          value: randomItem.value,
          type: fType,
          isCorrect,
          radius: 26,
          caught: false
        });
      }

      // 3. Update fruits position and check collision with basket
      const basketY = height - 70;
      const currentBasketX = basketXRef.current;

      const remainingFruits: FruitItem[] = [];

      for (const fruit of fruitsRef.current) {
        fruit.y += fruit.speed * dt;

        // Check catch collision
        const inBasketX = fruit.x >= currentBasketX - 10 && fruit.x <= currentBasketX + basketWidth + 10;
        const inBasketY = fruit.y >= basketY - 15 && fruit.y <= basketY + 30;

        if (inBasketX && inBasketY && !fruit.caught) {
          fruit.caught = true;

          if (fruit.isCorrect) {
            // Correct catch!
            soundManager.playCatch();
            setScore(s => s + 10);
            setCaughtCount(c => {
              const next = c + 1;
              if (next >= targetWin) {
                // WON LEVEL
                setTimeout(() => {
                  setIsGameWon(true);
                  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                  soundManager.playFanfare();
                  onFinishGame('fruit_catcher', score + 10, true);
                }, 200);
              }
              return next;
            });
            setBounceBasket(true);
            setTimeout(() => setBounceBasket(false), 250);
          } else {
            // Wrong fruit caught!
            soundManager.playTryAgain();
            setLives(l => {
              const nextL = l - 1;
              if (nextL <= 0) {
                setIsGameOver(true);
              }
              return nextL;
            });
          }
          // Do not keep caught fruit
          continue;
        }

        // Check fallen off bottom
        if (fruit.y > height + 40) {
          continue;
        }

        remainingFruits.push(fruit);
      }

      fruitsRef.current = remainingFruits;

      // 4. Render Background
      ctx.clearRect(0, 0, width, height);

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#7DD3FC');
      skyGrad.addColorStop(0.65, '#E0F2FE');
      skyGrad.addColorStop(1, '#86EFAC');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(100, 50, 30, 0, Math.PI * 2);
      ctx.arc(130, 45, 38, 0, Math.PI * 2);
      ctx.arc(160, 50, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width - 120, 70, 26, 0, Math.PI * 2);
      ctx.arc(width - 95, 65, 34, 0, Math.PI * 2);
      ctx.arc(width - 70, 70, 24, 0, Math.PI * 2);
      ctx.fill();

      // Lush Green Hills at Bottom
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(width * 0.3, height + 40, width * 0.45, 90, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.ellipse(width * 0.75, height + 40, width * 0.4, 85, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flowers on grass
      const flowerXs = [40, 110, 190, 270, 360, 440, 510];
      flowerXs.forEach((fx, i) => {
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(i % 2 === 0 ? '🌸' : '🌼', fx, height - 12);
      });

      // 5. Render Falling Fruits
      for (const fruit of fruitsRef.current) {
        ctx.save();
        ctx.translate(fruit.x, fruit.y);

        // Fruit circle background
        let fruitColor = '#EF4444';
        let fruitEmoji = '🍎';
        if (fruit.type === 'orange') { fruitColor = '#F97316'; fruitEmoji = '🍊'; }
        if (fruit.type === 'strawberry') { fruitColor = '#F43F5E'; fruitEmoji = '🍓'; }
        if (fruit.type === 'pear') { fruitColor = '#84CC16'; fruitEmoji = '🍐'; }

        // Glow shadow
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        // Circular badge
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, fruit.radius + 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = fruitColor;
        ctx.beginPath();
        ctx.arc(0, 0, fruit.radius + 3, 0, Math.PI * 2);
        ctx.fill();

        // Inner white plate for readable math label
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, fruit.radius - 1, 0, Math.PI * 2);
        ctx.fill();

        // Fruit icon emoji at top
        ctx.shadowBlur = 0;
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(fruitEmoji, 0, -6);

        // Math Expression Text
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fruit.label, 0, 12);

        ctx.restore();
      }

      // 6. Render Bunny and Basket at bottom
      const bunnyX = currentBasketX + basketWidth / 2;
      const bunnyY = basketY + 10;

      ctx.save();
      if (bounceBasket) {
        ctx.translate(bunnyX, bunnyY);
        ctx.scale(1.08, 0.94);
        ctx.translate(-bunnyX, -bunnyY);
      }

      // Cute Bunny behind basket
      ctx.font = '38px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐰', bunnyX, bunnyY - 14);

      // Wicker Basket
      const bX = currentBasketX;
      const bY = basketY;

      // Basket body (woven wood texture)
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.roundRect(bX, bY, basketWidth, basketHeight, [6, 6, 20, 20]);
      ctx.fill();
      ctx.strokeStyle = '#92400E';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Woven cross lines
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bX + 16, bY + 8);
      ctx.lineTo(bX + 32, bY + basketHeight - 8);
      ctx.moveTo(bX + 48, bY + 8);
      ctx.lineTo(bX + 64, bY + basketHeight - 8);
      ctx.moveTo(bX + 80, bY + 8);
      ctx.lineTo(bX + 80, bY + basketHeight - 14);
      ctx.stroke();

      // Rim ribbon
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(bX - 4, bY, basketWidth + 8, 8);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, isGameOver, isGameWon, levelIdx, bounceBasket, currentMission, score, targetWin]);

  // Touch and drag handle on canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const clientX = e.clientX - rect.left;
    const targetX = clientX * scaleX - basketWidth / 2;
    basketXRef.current = Math.max(0, Math.min(canvas.width - basketWidth, targetX));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border-2 border-emerald-200 shadow-sm flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>

        <div className="text-center">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 block">
            GAME 1 · SIÊU SAO HỨNG QUẢ 🍎🐰
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Hứng Quả Thần Tốc (Màn {levelIdx + 1})
          </h2>
        </div>

        {/* Lives and Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-rose-500">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-transform ${
                  i < lives ? 'fill-rose-500 text-rose-500 scale-100' : 'text-slate-300 scale-90'
                }`}
              />
            ))}
          </div>

          <div className="bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 font-black text-xs text-amber-900 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{score} điểm</span>
          </div>
        </div>
      </div>

      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 p-4 rounded-3xl text-white shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce select-none">🐰</span>
          <div>
            <span className="text-[11px] font-black text-yellow-200 uppercase tracking-wider block">
              Mục tiêu Màn {levelIdx + 1}:
            </span>
            <h3 className="text-base sm:text-xl font-black text-white">
              {currentMission.title}
            </h3>
            <p className="text-xs text-emerald-100 font-semibold mt-0.5">
              {currentMission.sub}
            </p>
          </div>
        </div>

        {/* Progress badge */}
        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-100 block">Đã hứng đúng</span>
          <span className="text-xl sm:text-2xl font-black text-yellow-300">
            {caughtCount} / {targetWin} 🍎
          </span>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-300 shadow-2xl bg-sky-200">
        {!isPlaying ? (
          /* Introduction Screen */
          <div className="aspect-16/9 w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-400 via-emerald-300 to-emerald-500 text-white text-center space-y-4">
            <div className="text-7xl animate-bounce">🐰🧺🍎</div>
            <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
              HỨNG QUẢ THẦN TỐC
            </h3>
            <p className="text-sm sm:text-base max-w-md font-semibold text-emerald-50 leading-relaxed">
              Dùng phím mũi tên ⬅️ ➡️, chuột hoặc ngón tay để điều khiển chú thỏ di chuyển giỏ hứng đúng các quả mang đáp án chính xác!
            </p>

            <button
              onClick={startGame}
              className="py-3.5 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-900" /> BẮT ĐẦU CHƠI NGAY
            </button>
          </div>
        ) : isGameOver ? (
          /* Game Over Screen */
          <div className="aspect-16/9 w-full flex flex-col items-center justify-center p-6 bg-slate-900/90 text-white text-center space-y-4 backdrop-blur-sm">
            <div className="text-6xl">🐰💔</div>
            <h3 className="text-2xl font-black text-rose-400">
              TIẾC QUÁ, BÉ ĐÃ HẾT TRÁI TIM!
            </h3>
            <p className="text-sm font-semibold text-slate-300 max-w-md">
              Bé đã hứng được {caughtCount} quả đúng và đạt {score} điểm! Hãy bình tĩnh nhìn kỹ phép tính và thử lại nhé.
            </p>
            <button
              onClick={startGame}
              className="py-3 px-6 rounded-2xl bg-amber-400 text-slate-900 font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Chơi lại màn này
            </button>
          </div>
        ) : isGameWon ? (
          /* Game Won Screen */
          <div className="aspect-16/9 w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-400/95 to-orange-500/95 text-white text-center space-y-4 backdrop-blur-sm">
            <div className="text-7xl animate-bounce">🏆🌟🐰</div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-yellow-100">
              <Award className="w-4 h-4" /> Đạt Huy hiệu SIÊU SAO HỨNG QUẢ
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              XUẤT SẮC! BÉ ĐÃ CHIẾN THẮNG!
            </h3>
            <p className="text-sm sm:text-base font-bold text-amber-50 max-w-md">
              Bé đã hứng trọn vẹn {targetWin} quả chuẩn xác và ghi được {score} điểm rực rỡ!
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="py-3 px-6 rounded-2xl bg-white text-slate-900 font-black text-sm flex items-center gap-2 shadow-md hover:bg-slate-100 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Chơi lại
              </button>
              <button
                onClick={nextLevel}
                className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
              >
                Sang Màn Tiếp Theo ➔
              </button>
            </div>
          </div>
        ) : (
          /* Live Canvas */
          <canvas
            ref={canvasRef}
            width={560}
            height={380}
            onPointerMove={handlePointerMove}
            className="w-full h-auto max-h-[480px] block cursor-ew-resize touch-none select-none"
          />
        )}
      </div>

      {/* Mobile touch steering buttons */}
      {isPlaying && !isGameOver && !isGameWon && (
        <div className="flex items-center justify-between gap-4 pt-1">
          <button
            onPointerDown={() => { movingLeftRef.current = true; }}
            onPointerUp={() => { movingLeftRef.current = false; }}
            onPointerLeave={() => { movingLeftRef.current = false; }}
            className="flex-1 py-4 bg-emerald-500 active:bg-emerald-600 text-white font-black text-base rounded-2xl shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2 select-none touch-none cursor-pointer"
          >
            ◀ SANG TRÁI
          </button>
          <div className="text-xs font-bold text-slate-500 text-center px-2 hidden sm:block">
            Nhấn phím ⬅️ ➡️ hoặc kéo chuột/ngón tay
          </div>
          <button
            onPointerDown={() => { movingRightRef.current = true; }}
            onPointerUp={() => { movingRightRef.current = false; }}
            onPointerLeave={() => { movingRightRef.current = false; }}
            className="flex-1 py-4 bg-emerald-500 active:bg-emerald-600 text-white font-black text-base rounded-2xl shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2 select-none touch-none cursor-pointer"
          >
            SANG PHẢI ▶
          </button>
        </div>
      )}
    </div>
  );
};
