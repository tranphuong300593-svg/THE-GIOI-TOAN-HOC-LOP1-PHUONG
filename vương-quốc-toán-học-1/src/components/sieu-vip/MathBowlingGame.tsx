import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw, Star, Sparkles, Trophy, Award, Target, Flame } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  onFinishGame: (gameId: 'math_bowling', score: number, wonBadge: boolean) => void;
}

interface BowlingPin {
  id: number;
  x: number; // Lane coordinate (0 to 1)
  label: string;
  value: number;
  isTarget: boolean;
  isHit: boolean;
  knockedAngle: number;
}

interface BowlingMission {
  instruction: string;
  explanation: string;
  targetCheck: (val: number) => boolean;
  pins: { label: string; value: number }[];
}

const BOWLING_MISSIONS: BowlingMission[] = [
  {
    instruction: 'Đánh đổ chai bowling mang SỐ LỚN NHẤT!',
    explanation: 'Trong các số 3, 6, 9, 5, 7 thì số 9 là số lớn nhất.',
    targetCheck: (v) => v === 9,
    pins: [
      { label: '3', value: 3 },
      { label: '6', value: 6 },
      { label: '9', value: 9 },
      { label: '5', value: 5 },
      { label: '7', value: 7 },
    ]
  },
  {
    instruction: 'Đánh đổ chai mang KẾT QUẢ của: 6 + 3 = ?',
    explanation: '6 + 3 = 9.',
    targetCheck: (v) => v === 9,
    pins: [
      { label: '7', value: 7 },
      { label: '8', value: 8 },
      { label: '9', value: 9 },
      { label: '10', value: 10 },
      { label: '6', value: 6 },
    ]
  },
  {
    instruction: 'Đánh đổ chai mang SỐ BÉ NHẤT!',
    explanation: 'Trong các số 8, 4, 2, 7, 5 thì số 2 là số bé nhất.',
    targetCheck: (v) => v === 2,
    pins: [
      { label: '8', value: 8 },
      { label: '4', value: 4 },
      { label: '2', value: 2 },
      { label: '7', value: 7 },
      { label: '5', value: 5 },
    ]
  },
  {
    instruction: 'Đánh đổ chai mang KẾT QUẢ của: 10 - 4 = ?',
    explanation: '10 trừ 4 bằng 6.',
    targetCheck: (v) => v === 6,
    pins: [
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },
    ]
  },
  {
    instruction: 'Đánh đổ SỐ CÒN THIẾU: 10, 20, 30, __, 50',
    explanation: 'Dãy số tròn chục tiếp theo sau 30 là 40.',
    targetCheck: (v) => v === 40,
    pins: [
      { label: '35', value: 35 },
      { label: '40', value: 40 },
      { label: '45', value: 45 },
      { label: '60', value: 60 },
      { label: '25', value: 25 },
    ]
  },
  {
    instruction: 'Đánh đổ chai mang KẾT QUẢ của: 8 + 2 = ?',
    explanation: '8 + 2 = 10 (một chục tròn).',
    targetCheck: (v) => v === 10,
    pins: [
      { label: '9', value: 9 },
      { label: '10', value: 10 },
      { label: '11', value: 11 },
      { label: '7', value: 7 },
      { label: '12', value: 12 },
    ]
  },
  {
    instruction: 'Đánh đổ chai mang SỐ LIỀN SAU của số 15:',
    explanation: 'Số liền sau của 15 là 16.',
    targetCheck: (v) => v === 16,
    pins: [
      { label: '14', value: 14 },
      { label: '16', value: 16 },
      { label: '17', value: 17 },
      { label: '15', value: 15 },
      { label: '18', value: 18 },
    ]
  },
  {
    instruction: 'Đánh đổ chai có độ dài bằng: 7 cm - 3 cm = ? cm',
    explanation: '7 cm trừ 3 cm bằng 4 cm.',
    targetCheck: (v) => v === 4,
    pins: [
      { label: '2 cm', value: 2 },
      { label: '3 cm', value: 3 },
      { label: '4 cm', value: 4 },
      { label: '5 cm', value: 5 },
      { label: '6 cm', value: 6 },
    ]
  }
];

export const MathBowlingGame: React.FC<Props> = ({ onBack, onFinishGame }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [strikesCount, setStrikesCount] = useState(0);
  const totalStrikesTarget = 8;
  const [isGameWon, setIsGameWon] = useState(false);

  // Bowling controls
  const [ballAimX, setBallAimX] = useState(0.5); // 0 (left) to 1 (right)
  const [power, setPower] = useState(70); // 30 to 100
  const [isRolling, setIsRolling] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Ball rolling animation state
  const ballPosRef = useRef<{ x: number; y: number; radius: number; progress: number }>({
    x: 0.5,
    y: 1.0,
    radius: 28,
    progress: 0
  });

  const pinsRef = useRef<BowlingPin[]>([]);

  const currentMission = BOWLING_MISSIONS[missionIdx % BOWLING_MISSIONS.length];

  // Setup pins for current mission
  const setupPins = (mission: BowlingMission) => {
    const count = mission.pins.length;
    // Space pins across lane width
    const margin = 0.15;
    const spacing = (1 - 2 * margin) / (count - 1);

    pinsRef.current = mission.pins.map((p, idx) => ({
      id: idx,
      x: margin + idx * spacing,
      label: p.label,
      value: p.value,
      isTarget: mission.targetCheck(p.value),
      isHit: false,
      knockedAngle: 0
    }));
  };

  useEffect(() => {
    setupPins(currentMission);
    setFeedback(null);
    setIsRolling(false);
    ballPosRef.current = { x: ballAimX, y: 1.0, radius: 28, progress: 0 };
  }, [missionIdx]);

  // Main canvas render & ball trajectory loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Update ball physics if rolling
      if (isRolling) {
        ballPosRef.current.progress += 0.025; // Speed of roll
        const p = ballPosRef.current.progress;

        // Ball moves from bottom (y = 1) to pins line (y = 0.22)
        const currentY = 1.0 - p * 0.78;
        // In perspective: target X based on aim
        const targetX = ballAimX;
        // Perspective convergence towards center
        const convergedX = 0.5 + (targetX - 0.5) * (1.0 - p * 0.15);

        ballPosRef.current.y = currentY;
        ballPosRef.current.x = convergedX;
        ballPosRef.current.radius = 28 - p * 14; // Perspective scale smaller

        // Check pin hit when reaching pin row (p >= 0.95)
        if (p >= 0.95) {
          setIsRolling(false);

          // Find closest pin to ball
          let hitPin: BowlingPin | null = null;
          let minDist = 0.12;

          for (const pin of pinsRef.current) {
            const dist = Math.abs(pin.x - convergedX);
            if (dist < minDist) {
              minDist = dist;
              hitPin = pin;
            }
          }

          if (hitPin) {
            hitPin.isHit = true;
            hitPin.knockedAngle = (convergedX < hitPin.x ? 1 : -1) * (Math.PI / 2.5);
            soundManager.playBowlingStrike();

            if (hitPin.isTarget) {
              // CORRECT HIT!
              soundManager.playSuccess();
              setScore(s => s + 25);
              setStrikesCount(c => {
                const nextC = c + 1;
                if (nextC >= totalStrikesTarget) {
                  setTimeout(() => {
                    setIsGameWon(true);
                    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
                    soundManager.playFanfare();
                    onFinishGame('math_bowling', score + 25, true);
                  }, 400);
                }
                return nextC;
              });

              setFeedback({
                isCorrect: true,
                text: `STRIKE! Đánh đổ chính xác chai mang kết quả ${hitPin.label}! 🎳✨`
              });

              // Advance to next mission after short delay
              setTimeout(() => {
                if (missionIdx + 1 < BOWLING_MISSIONS.length) {
                  setMissionIdx(prev => prev + 1);
                }
              }, 1800);
            } else {
              // WRONG PIN HIT
              soundManager.playTryAgain();
              setFeedback({
                isCorrect: false,
                text: `Chưa đúng mục tiêu rồi! Bé đã đánh trúng chai ${hitPin.label}. Hãy ngắm lại chai đúng nhé!`
              });
            }
          } else {
            // MISSED ALL PINS (Gutter ball)
            soundManager.playTryAgain();
            setFeedback({
              isCorrect: false,
              text: 'Bóng trượt ra ngoài mất rồi! Con hãy điều chỉnh hướng ngắm thẳng vào chai nhé.'
            });
          }
        }
      }

      // 1. Draw Bowling Arena
      ctx.clearRect(0, 0, w, h);

      // Arena background wall
      const wallGrad = ctx.createLinearGradient(0, 0, 0, h * 0.28);
      wallGrad.addColorStop(0, '#1E1B4B');
      wallGrad.addColorStop(1, '#312E81');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, w, h * 0.28);

      // Cheering Audience & Neon lights
      ctx.fillStyle = '#F59E0B';
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⭐ BOWLING TOÁN HỌC LỚP 1 ⭐', w / 2, 34);

      // Bowling Lane (Perspective Trapezoid)
      const laneTopWidth = w * 0.68;
      const laneBotWidth = w * 0.94;
      const laneTopY = h * 0.25;
      const laneBotY = h;

      const laneLeftTop = (w - laneTopWidth) / 2;
      const laneRightTop = laneLeftTop + laneTopWidth;
      const laneLeftBot = (w - laneBotWidth) / 2;
      const laneRightBot = laneLeftBot + laneBotWidth;

      // Wooden Lane Gradient
      const laneGrad = ctx.createLinearGradient(0, laneTopY, 0, laneBotY);
      laneGrad.addColorStop(0, '#B45309');
      laneGrad.addColorStop(0.2, '#D97706');
      laneGrad.addColorStop(0.7, '#F59E0B');
      laneGrad.addColorStop(1, '#FDE68A');

      ctx.fillStyle = laneGrad;
      ctx.beginPath();
      ctx.moveTo(laneLeftTop, laneTopY);
      ctx.lineTo(laneRightTop, laneTopY);
      ctx.lineTo(laneRightBot, laneBotY);
      ctx.lineTo(laneLeftBot, laneBotY);
      ctx.closePath();
      ctx.fill();

      // Lane board lines (perspective stripes)
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.25)';
      ctx.lineWidth = 1.5;
      for (let i = 1; i < 7; i++) {
        const topX = laneLeftTop + (laneTopWidth / 7) * i;
        const botX = laneLeftBot + (laneBotWidth / 7) * i;
        ctx.beginPath();
        ctx.moveTo(topX, laneTopY);
        ctx.lineTo(botX, laneBotY);
        ctx.stroke();
      }

      // Gutters on sides
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(0, laneTopY);
      ctx.lineTo(laneLeftTop, laneTopY);
      ctx.lineTo(laneLeftBot, laneBotY);
      ctx.lineTo(0, laneBotY);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(laneRightTop, laneTopY);
      ctx.lineTo(w, laneTopY);
      ctx.lineTo(w, laneBotY);
      ctx.lineTo(laneRightBot, laneBotY);
      ctx.closePath();
      ctx.fill();

      // 2. Render Bowling Pins
      const pinY = laneTopY + 28;
      pinsRef.current.forEach(pin => {
        const pinPixelX = laneLeftTop + pin.x * laneTopWidth;

        ctx.save();
        ctx.translate(pinPixelX, pinY);

        if (pin.isHit) {
          ctx.rotate(pin.knockedAngle);
          ctx.globalAlpha = 0.45;
        }

        // Bowling pin shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 24, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pin Body (White curved wood)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        // Pin head
        ctx.arc(0, -22, 9, 0, Math.PI * 2);
        // Pin belly
        ctx.ellipse(0, 8, 15, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Red neck stripes
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(-7, -13, 14, 3);
        ctx.fillRect(-8, -8, 16, 3);

        // Circular math badge on pin belly
        ctx.fillStyle = '#1E3A8A';
        ctx.beginPath();
        ctx.arc(0, 8, 12, 0, Math.PI * 2);
        ctx.fill();

        // Text label on pin
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pin.label, 0, 8);

        ctx.restore();
      });

      // 3. Render Aim Arrow Guide (when not rolling)
      if (!isRolling) {
        const startBallX = laneLeftBot + ballAimX * laneBotWidth;
        const startBallY = h - 50;

        const targetPinX = laneLeftTop + ballAimX * laneTopWidth;
        const targetPinY = pinY + 30;

        // Dotted aim projection trajectory
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(startBallX, startBallY);
        ctx.lineTo(targetPinX, targetPinY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Target bullseye marker at top
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(targetPinX, targetPinY, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Render Bowling Ball
      let ballDrawX = laneLeftBot + ballAimX * laneBotWidth;
      let ballDrawY = h - 50;
      let ballDrawR = 26;

      if (isRolling) {
        ballDrawX = laneLeftTop + ballPosRef.current.x * (laneTopWidth + (laneBotWidth - laneTopWidth) * ballPosRef.current.y);
        ballDrawY = laneTopY + (laneBotY - laneTopY) * ballPosRef.current.y;
        ballDrawR = ballPosRef.current.radius;
      }

      ctx.save();
      ctx.translate(ballDrawX, ballDrawY);

      // Ball shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(0, ballDrawR * 0.8, ballDrawR * 0.9, ballDrawR * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shiny Purple Ball Gradient
      const ballGrad = ctx.createRadialGradient(-ballDrawR * 0.3, -ballDrawR * 0.3, 2, 0, 0, ballDrawR);
      ballGrad.addColorStop(0, '#C084FC');
      ballGrad.addColorStop(0.4, '#7E22CE');
      ballGrad.addColorStop(1, '#3B0764');

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(0, 0, ballDrawR, 0, Math.PI * 2);
      ctx.fill();

      // 3 Bowling ball finger holes
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(-ballDrawR * 0.2, -ballDrawR * 0.25, ballDrawR * 0.12, 0, Math.PI * 2);
      ctx.arc(ballDrawR * 0.2, -ballDrawR * 0.25, ballDrawR * 0.12, 0, Math.PI * 2);
      ctx.arc(0, ballDrawR * 0.15, ballDrawR * 0.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [ballAimX, isRolling, missionIdx]);

  // Roll the bowling ball action
  const handleRollBall = () => {
    if (isRolling) return;
    soundManager.playPop();
    setFeedback(null);
    ballPosRef.current = { x: ballAimX, y: 1.0, radius: 28, progress: 0 };
    setIsRolling(true);
  };

  const handleRestart = () => {
    setMissionIdx(0);
    setScore(0);
    setStrikesCount(0);
    setIsGameWon(false);
    setFeedback(null);
    setIsRolling(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border-2 border-indigo-200 shadow-sm flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>

        <div className="text-center">
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
            GAME 2 · BOWLING TOÁN HỌC 🎳👑
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Lượt ném #{missionIdx + 1} / {BOWLING_MISSIONS.length}
          </h2>
        </div>

        {/* Strikes and Score */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-black text-indigo-900 flex items-center gap-1.5">
            <span>🎳 Strikes:</span>
            <span className="text-indigo-600 font-extrabold">{strikesCount} / {totalStrikesTarget}</span>
          </div>

          <div className="bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 font-black text-xs text-amber-900 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{score} điểm</span>
          </div>
        </div>
      </div>

      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-3xl text-white shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce select-none">🎳</span>
          <div>
            <span className="text-[11px] font-black text-yellow-300 uppercase tracking-wider block">
              Thử thách Lượt #{missionIdx + 1}:
            </span>
            <h3 className="text-base sm:text-xl font-black text-white">
              {currentMission.instruction}
            </h3>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-indigo-100 block">Tiến trình</span>
          <span className="text-xl sm:text-2xl font-black text-yellow-300">
            {strikesCount} / {totalStrikesTarget} 👑
          </span>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-indigo-300 shadow-2xl bg-indigo-950">
        {!isPlaying ? (
          /* Introduction Screen */
          <div className="aspect-16/9 w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-900 via-purple-800 to-indigo-950 text-white text-center space-y-4">
            <div className="text-7xl animate-bounce">🎳⭐👑</div>
            <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
              BOWLING TOÁN HỌC
            </h3>
            <p className="text-sm sm:text-base max-w-md font-semibold text-indigo-100 leading-relaxed">
              Quan sát yêu cầu Toán học, chỉnh thanh ngắm hướng bóng lăn và nhấn nút ném để làm đổ đúng chai bowling mục tiêu!
            </p>

            <button
              onClick={() => {
                soundManager.playPop();
                setIsPlaying(true);
              }}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-900" /> BẮT ĐẦU NÉM BÓNG NGAY
            </button>
          </div>
        ) : isGameWon ? (
          /* Game Won Screen */
          <div className="aspect-16/9 w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-900/95 to-purple-900/95 text-white text-center space-y-4 backdrop-blur-sm">
            <div className="text-7xl animate-bounce">👑🏆🎳</div>
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4" /> Đạt Huy hiệu VUA BOWLING TOÁN HỌC
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              CHIẾN THẮNG TUYỆT ĐỐI!
            </h3>
            <p className="text-sm sm:text-base font-bold text-indigo-100 max-w-md">
              Bé đã xuất sắc đánh đổ toàn bộ {totalStrikesTarget} chai bowling mục tiêu và ghi được {score} điểm!
            </p>
            <button
              onClick={handleRestart}
              className="py-3 px-6 rounded-2xl bg-amber-400 text-slate-900 font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Chơi lại từ đầu
            </button>
          </div>
        ) : (
          /* Live Canvas */
          <canvas
            ref={canvasRef}
            width={580}
            height={360}
            className="w-full h-auto max-h-[460px] block select-none"
          />
        )}
      </div>

      {/* Control panel: Aim Slider and Throw Button */}
      {isPlaying && !isGameWon && (
        <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Aim Slider */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" /> Điều chỉnh hướng ngắm bóng:
                </span>
                <span className="text-indigo-600 font-extrabold">
                  {ballAimX < 0.4 ? '⬅️ Lệch Trái' : ballAimX > 0.6 ? 'Lệch Phải ➡️' : '🎯 Chính Giữa'}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.02"
                value={ballAimX}
                disabled={isRolling}
                onChange={(e) => setBallAimX(parseFloat(e.target.value))}
                className="w-full h-3 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Launch Action Button */}
            <button
              onClick={handleRollBall}
              disabled={isRolling}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-500 hover:to-rose-600 disabled:opacity-50 text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Flame className="w-5 h-5 text-yellow-200 fill-yellow-200" />
              <span>{isRolling ? 'ĐANG LĂN BÓNG...' : 'NÉM BÓNG 🎳'}</span>
            </button>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
