import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Star, Trophy, Sparkles, Play, Target } from 'lucide-react';

interface Props {
  onBack: () => void;
  onWin: (score: number) => void;
}

interface BowlingPin {
  id: number;
  label: string;
  value: number | string;
  x: number; // percentage across lane width: 15% to 85%
  isTarget: boolean;
  isFallen?: boolean;
}

interface BowlingRound {
  id: number;
  missionText: string;
  pins: { label: string; value: number | string; isTarget: boolean }[];
  hint: string;
}

const BOWLING_ROUNDS: BowlingRound[] = [
  {
    id: 1,
    missionText: 'Hãy đánh đổ chai mang số LỚN NHẤT!',
    hint: 'So sánh các số: 3, 6, 9, 5, 7. Số lớn nhất là số 9 nhé!',
    pins: [
      { label: '3', value: 3, isTarget: false },
      { label: '6', value: 6, isTarget: false },
      { label: '9', value: 9, isTarget: true },
      { label: '5', value: 5, isTarget: false },
      { label: '7', value: 7, isTarget: false }
    ]
  },
  {
    id: 2,
    missionText: 'Hãy đánh đổ kết quả của phép tính: 6 + 3 = ?',
    hint: 'Bé hãy giữ 6 trong đầu rồi đếm thêm 3 nhé: 7, 8, 9!',
    pins: [
      { label: '7', value: 7, isTarget: false },
      { label: '8', value: 8, isTarget: false },
      { label: '9', value: 9, isTarget: true },
      { label: '10', value: 10, isTarget: false },
      { label: '6', value: 6, isTarget: false }
    ]
  },
  {
    id: 3,
    missionText: 'Hãy đánh đổ chai mang số BÉ NHẤT!',
    hint: 'Trong các số: 8, 4, 10, 2, 6. Số bé nhất là số 2 nhé!',
    pins: [
      { label: '8', value: 8, isTarget: false },
      { label: '4', value: 4, isTarget: false },
      { label: '10', value: 10, isTarget: false },
      { label: '2', value: 2, isTarget: true },
      { label: '6', value: 6, isTarget: false }
    ]
  },
  {
    id: 4,
    missionText: 'Hãy đánh đổ kết quả của phép tính: 10 - 4 = ?',
    hint: '10 bớt đi 4 đơn vị là còn 6 nhé bé!',
    pins: [
      { label: '4', value: 4, isTarget: false },
      { label: '5', value: 5, isTarget: false },
      { label: '6', value: 6, isTarget: true },
      { label: '7', value: 7, isTarget: false },
      { label: '8', value: 8, isTarget: false }
    ]
  },
  {
    id: 5,
    missionText: 'Tìm số còn thiếu trong dãy: 2, 4, 6, [ ? ], 10',
    hint: 'Dãy số đếm thêm 2: sau 6 thêm 2 là 8 nhé bé!',
    pins: [
      { label: '5', value: 5, isTarget: false },
      { label: '7', value: 7, isTarget: false },
      { label: '8', value: 8, isTarget: true },
      { label: '9', value: 9, isTarget: false },
      { label: '3', value: 3, isTarget: false }
    ]
  },
  {
    id: 6,
    missionText: 'Hãy đánh đổ kết quả của: 5 + 5 = ?',
    hint: '5 ngón tay thêm 5 ngón tay là tròn một chục (10)!',
    pins: [
      { label: '8', value: 8, isTarget: false },
      { label: '9', value: 9, isTarget: false },
      { label: '10', value: 10, isTarget: true },
      { label: '11', value: 11, isTarget: false },
      { label: '7', value: 7, isTarget: false }
    ]
  },
  {
    id: 7,
    missionText: 'Hãy đánh đổ chai mang SỐ TRÒN CHỤC!',
    hint: 'Số tròn chục có chữ số 0 ở hàng đơn vị (như 20, 30, 40...)!',
    pins: [
      { label: '23', value: 23, isTarget: false },
      { label: '30', value: 30, isTarget: true },
      { label: '15', value: 15, isTarget: false },
      { label: '42', value: 42, isTarget: false },
      { label: '18', value: 18, isTarget: false }
    ]
  },
  {
    id: 8,
    missionText: 'Hãy đánh đổ kết quả của: 18 - 8 = ?',
    hint: '1 chục và 8 đơn vị bớt đi 8 đơn vị thì còn lại 10!',
    pins: [
      { label: '8', value: 8, isTarget: false },
      { label: '9', value: 9, isTarget: false },
      { label: '10', value: 10, isTarget: true },
      { label: '12', value: 12, isTarget: false },
      { label: '11', value: 11, isTarget: false }
    ]
  }
];

export const MathBowlingGame: React.FC<Props> = ({ onBack, onWin }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStrikes, setCorrectStrikes] = useState(0);
  const [aimAngle, setAimAngle] = useState(0); // -40 (left) to 40 (right)
  const [ballPower, setBallPower] = useState(70); // 30 to 100
  const [isRolling, setIsRolling] = useState(false);
  const [ballPos, setBallPos] = useState({ x: 50, y: 88, scale: 1 });
  const [fallenPinId, setFallenPinId] = useState<number | null>(null);
  const [strikeResult, setStrikeResult] = useState<'strike' | 'miss' | null>(null);
  const [isWon, setIsWon] = useState(false);

  const currentRound = BOWLING_ROUNDS[currentRoundIdx % BOWLING_ROUNDS.length];

  // Distribute pins across lane
  const pinPositions = [20, 35, 50, 65, 80];
  const activePins: BowlingPin[] = currentRound.pins.map((p, idx) => ({
    id: idx,
    label: p.label,
    value: p.value,
    x: pinPositions[idx],
    isTarget: p.isTarget,
    isFallen: fallenPinId === idx
  }));

  // Handle Ball Roll Animation
  const handleRollBall = () => {
    soundManager.unlockAudio();
    if (isRolling || isWon) return;

    soundManager.playPop();
    setIsRolling(true);
    setStrikeResult(null);

    // Ball starts at x = 50%, y = 88%
    // Moves towards target x based on aimAngle: -40 to +40 -> 20% to 80%
    const targetX = 50 + (aimAngle / 40) * 32;

    const startTime = performance.now();
    const duration = 1100; // ms

    const animateRoll = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease out cubic
      const currentY = 88 - progress * 66; // 88% down to 22%
      const currentX = 50 + (targetX - 50) * progress;
      const currentScale = 1 - progress * 0.55; // gets smaller as it rolls away

      setBallPos({
        x: currentX,
        y: currentY,
        scale: currentScale
      });

      if (progress < 1) {
        requestAnimationFrame(animateRoll);
      } else {
        // Roll finished, check collision with closest pin
        let closestPin: BowlingPin | null = null;
        let minDistance = 999;

        activePins.forEach(pin => {
          const dist = Math.abs(pin.x - targetX);
          if (dist < minDistance) {
            minDistance = dist;
            closestPin = pin;
          }
        });

        if (closestPin && minDistance <= 12) {
          // Hit a pin!
          const hitPin: BowlingPin = closestPin;
          setFallenPinId(hitPin.id);

          if (hitPin.isTarget) {
            // STRIKE!
            soundManager.playBowlingStrike();
            soundManager.playSuccess();
            setStrikeResult('strike');

            const newScore = score + 20;
            const newStrikes = correctStrikes + 1;
            setScore(newScore);
            setCorrectStrikes(newStrikes);

            confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });

            setTimeout(() => {
              if (currentRoundIdx + 1 >= BOWLING_ROUNDS.length) {
                // Completed all 8 rounds!
                setIsWon(true);
                soundManager.playFanfare();
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
                onWin(newScore);
              } else {
                // Next round
                setCurrentRoundIdx(prev => prev + 1);
                resetBall();
              }
            }, 1800);
          } else {
            // Hit wrong pin
            soundManager.playTryAgain();
            setStrikeResult('miss');
            setTimeout(() => {
              resetBall();
            }, 1800);
          }
        } else {
          // Gutter / missed all pins
          soundManager.playTryAgain();
          setStrikeResult('miss');
          setTimeout(() => {
            resetBall();
          }, 1600);
        }
      }
    };

    requestAnimationFrame(animateRoll);
  };

  const resetBall = () => {
    setIsRolling(false);
    setBallPos({ x: 50, y: 88, scale: 1 });
    setFallenPinId(null);
    setStrikeResult(null);
  };

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setScore(0);
    setCorrectStrikes(0);
    setIsWon(false);
    resetBall();
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-1.5 sm:p-2.5 select-none overflow-hidden">
      {/* Top Bar Navigation & Info */}
      <div className="flex-none flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border-2 border-amber-300 shadow-sm">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Về Siêu VIP
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
            Vòng 2 · Lực ném & Quán tính thực tế
          </span>
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5 justify-center">
            🎳 BOWLING TOÁN HỌC
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-amber-900 font-black text-xs flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{score} điểm</span>
          </div>

          <div className="bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl text-emerald-900 font-black text-xs">
            {correctStrikes} / {BOWLING_ROUNDS.length} Strike
          </div>
        </div>
      </div>

      {/* Main Bowling Alley Frame 16:9 Aspect Ratio */}
      <div className="flex-1 min-h-0 flex items-center justify-center my-1 relative w-full">
        <div className="relative w-full h-full max-h-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-amber-400 shadow-2xl bg-slate-900">
        {/* Alley Environment Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-950/80">
          {/* Neon lights overhead */}
          <div className="absolute top-2 inset-x-8 h-1 bg-gradient-to-r from-pink-500 via-amber-300 to-cyan-400 rounded-full shadow-[0_0_15px_#f59e0b]" />

          {/* Cheering Spectators & Mascots at the side */}
          <div className="absolute top-16 left-4 text-3xl opacity-80 animate-bounce duration-700">
            🐱🎉
          </div>
          <div className="absolute top-16 right-4 text-3xl opacity-80 animate-bounce duration-500">
            🐶🎈
          </div>
        </div>

        {/* 3D Bowling Lane with Perspective Transformation */}
        <div className="absolute inset-x-12 bottom-0 top-18 flex items-center justify-center pointer-events-none">
          <div
            style={{
              clipPath: 'polygon(25% 0%, 75% 0%, 95% 100%, 5% 100%)'
            }}
            className="w-full h-full bg-gradient-to-b from-amber-700 via-amber-600 to-amber-500 shadow-2xl relative border-x-8 border-slate-800"
          >
            {/* Lane floor wood boards */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,#000,#000_20px,transparent_20px,transparent_40px)]" />
            
            {/* Arrow guide marks on lane */}
            <div className="absolute top-1/2 inset-x-0 flex justify-around opacity-40 text-amber-200 text-sm">
              <span>▲</span>
              <span>▲</span>
              <span>▲</span>
              <span>▲</span>
              <span>▲</span>
            </div>
          </div>
        </div>

        {/* MISSION DISPLAY AT TOP */}
        <div className="absolute top-3 inset-x-6 sm:inset-x-16 z-30">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border-2 border-amber-300 shadow-xl flex items-center justify-between gap-3 text-center">
            <span className="text-xs font-black bg-amber-400 text-amber-950 px-3 py-1 rounded-full shrink-0 shadow-xs">
              Mục tiêu #{currentRoundIdx + 1}
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight flex-1">
              {currentRound.missionText}
            </h3>
            <span className="text-xs font-bold text-slate-400 shrink-0 hidden sm:inline">
              Ngắm chuẩn & Lăn bóng!
            </span>
          </div>
        </div>

        {/* 5 BOWLING PINS AT THE END OF THE LANE */}
        <div className="absolute top-22 inset-x-16 z-20 flex justify-between items-end h-28 pointer-events-none px-4">
          {activePins.map(pin => {
            return (
              <div
                key={pin.id}
                style={{
                  left: `${pin.x}%`,
                  transform: `translateX(-50%) ${
                    pin.isFallen
                      ? 'rotate(75deg) translateY(18px) scale(0.9)'
                      : 'rotate(0deg) scale(1)'
                  }`,
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className="absolute flex flex-col items-center select-none"
              >
                {/* Bowling Pin Body */}
                <div className="relative flex flex-col items-center">
                  {/* Pin Neck with Red Stripes */}
                  <div className="w-5 h-7 bg-white rounded-t-full border-2 border-slate-300 relative shadow-md">
                    <div className="absolute top-2 inset-x-0 h-1 bg-rose-500" />
                    <div className="absolute top-4 inset-x-0 h-1 bg-rose-500" />
                  </div>
                  {/* Pin Belly with Number Label */}
                  <div className="w-10 h-12 -mt-1 bg-gradient-to-b from-white to-slate-100 rounded-2xl border-2 border-slate-300 shadow-lg flex items-center justify-center">
                    <span className="font-black text-base text-slate-900 drop-shadow-xs">
                      {pin.label}
                    </span>
                  </div>
                </div>

                {/* Ground shadow */}
                <div className="w-8 h-2 bg-black/40 rounded-full blur-[2px] mt-1" />
              </div>
            );
          })}
        </div>

        {/* AIMING GUIDE TRAJECTORY LINE */}
        {!isRolling && (
          <div
            style={{
              left: '50%',
              bottom: '50px',
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${aimAngle}deg)`
            }}
            className="absolute z-10 w-1 h-56 bg-gradient-to-t from-amber-400/80 via-yellow-300/40 to-transparent pointer-events-none flex flex-col items-center justify-start"
          >
            <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] -mt-2 animate-ping" />
          </div>
        )}

        {/* BOWLING BALL */}
        <div
          style={{
            left: `${ballPos.x}%`,
            top: `${ballPos.y}%`,
            transform: `translate(-50%, -50%) scale(${ballPos.scale})`,
            transition: isRolling ? 'none' : 'left 0.1s ease-out'
          }}
          className="absolute z-20 pointer-events-none flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-950 border-2 border-purple-400 shadow-2xl relative flex items-center justify-center">
            {/* 3 Bowling ball finger holes */}
            <div className="absolute top-3 left-4 w-2.5 h-2.5 rounded-full bg-black/80" />
            <div className="absolute top-3 right-4 w-2.5 h-2.5 rounded-full bg-black/80" />
            <div className="absolute bottom-4 w-3 h-3 rounded-full bg-black/80" />
          </div>
        </div>

        {/* STRIKE / MISS SPLASH POPUP */}
        {strikeResult && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className={`p-6 rounded-3xl border-4 text-center animate-in zoom-in-110 duration-200 ${
              strikeResult === 'strike'
                ? 'bg-emerald-500 text-white border-yellow-300 shadow-2xl ring-8 ring-emerald-300'
                : 'bg-rose-500 text-white border-white shadow-2xl ring-8 ring-rose-300'
            }`}>
              <span className="text-4xl block mb-1">
                {strikeResult === 'strike' ? '💥 STRIKE! 🎳' : '❌ CHƯA TRÚNG!'}
              </span>
              <span className="text-sm font-black">
                {strikeResult === 'strike' ? '+20 ĐIỂM XUẤT SẮC!' : 'Con hãy chỉnh hướng rồi thử lại nhé!'}
              </span>
            </div>
          </div>
        )}

        {/* VICTORY SCREEN */}
        {isWon && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 text-center">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-300 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center text-5xl shadow-xl animate-bounce">
                🎳👑
              </div>
              <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
                Đỉnh cao thiện xạ
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                VUA BOWLING TOÁN HỌC!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bé đã xuất sắc đánh đổ toàn bộ 8 chai mục tiêu toán học và giành được Huy hiệu Vàng Siêu VIP!
              </p>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 font-black text-emerald-800 text-sm">
                + {score} Điểm thành tích Siêu VIP ⭐
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 inline mr-1" /> Chơi lại
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

      {/* INTERACTIVE CONTROLS BAR: AIM SLIDER & ROLL BUTTON */}
      <div className="flex-none bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Aim Angle Controller */}
        <div className="flex-1 w-full flex items-center gap-2">
          <span className="text-xs font-black text-slate-700 whitespace-nowrap">
            🎯 Hướng ngắm:
          </span>
          <button
            onClick={() => setAimAngle(prev => Math.max(-40, prev - 10))}
            disabled={isRolling}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-xs cursor-pointer"
          >
            ⬅️ Trái
          </button>
          <input
            type="range"
            min="-40"
            max="40"
            value={aimAngle}
            disabled={isRolling}
            onChange={(e) => setAimAngle(Number(e.target.value))}
            className="flex-1 accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <button
            onClick={() => setAimAngle(prev => Math.min(40, prev + 10))}
            disabled={isRolling}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-xs cursor-pointer"
          >
            Phải ➡️
          </button>
        </div>

        {/* Roll Action Button */}
        <button
          onClick={handleRollBall}
          disabled={isRolling}
          className="w-full sm:w-auto px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>LĂN BÓNG 🎳</span>
        </button>
      </div>
    </div>
  );
};
