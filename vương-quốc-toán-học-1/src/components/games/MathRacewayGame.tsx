import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Volume2, Award, Flag } from 'lucide-react';

interface Props {
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

export const MathRacewayGame: React.FC<Props> = ({ onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerPos, setPlayerPos] = useState(0); // 0 to 8 (Goal is 8)
  const [score, setScore] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    calc: string;
    options: number[];
    correct: number;
    stepsReward: number;
  } | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const totalSteps = 8;

  const questionPool = [
    { calc: '5 + 3 = ?', options: [7, 8, 9], correct: 8, stepsReward: 2 },
    { calc: '10 − 4 = ?', options: [5, 6, 7], correct: 6, stepsReward: 2 },
    { calc: '7 + 2 = ?', options: [8, 9, 10], correct: 9, stepsReward: 2 },
    { calc: '8 − 5 = ?', options: [2, 3, 4], correct: 3, stepsReward: 2 },
    { calc: '4 + 6 = ?', options: [9, 10, 11], correct: 10, stepsReward: 2 },
    { calc: '9 − 3 = ?', options: [6, 7, 8], correct: 6, stepsReward: 2 },
    { calc: '30 + 20 = ?', options: [40, 50, 60], correct: 50, stepsReward: 2 }
  ];

  const rollDice = () => {
    if (isRolling || activeQuestion !== null || feedback !== null) return;
    setIsRolling(true);
    soundManager.playPop();

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      setDiceValue(rolled);
      setIsRolling(false);

      // Pick a random question to earn the move
      const q = questionPool[Math.floor(Math.random() * questionPool.length)];
      setActiveQuestion({ ...q, stepsReward: rolled });
    }, 500);
  };

  const handleAnswer = (chosen: number) => {
    if (!activeQuestion || feedback !== null) return;
    const isCorrect = chosen === activeQuestion.correct;

    if (isCorrect) {
      soundManager.playSuccess();
      const newPos = Math.min(playerPos + activeQuestion.stepsReward, totalSteps);
      setPlayerPos(newPos);
      setScore(s => s + 25);
      setFeedback({
        isCorrect: true,
        message: `Xuất sắc! Chú Rô-bốt tiến thêm ${activeQuestion.stepsReward} bước!`
      });

      setTimeout(() => {
        setFeedback(null);
        setActiveQuestion(null);
        setDiceValue(null);

        if (newPos >= totalSteps) {
          setIsGameOver(true);
          confetti({ particleCount: 120, spread: 80 });
          soundManager.playFanfare();
          onFinish(score + 25, newPos, totalSteps);
        }
      }, 1400);
    } else {
      soundManager.playTryAgain();
      setFeedback({
        isCorrect: false,
        message: `Chưa đúng! Đáp án đúng là ${activeQuestion.correct}. Giữ nguyên vị trí và cố gắng ở lượt sau nhé!`
      });

      setTimeout(() => {
        setFeedback(null);
        setActiveQuestion(null);
        setDiceValue(null);
      }, 1600);
    }
  };

  const handleRestart = () => {
    setPlayerPos(0);
    setScore(0);
    setDiceValue(null);
    setActiveQuestion(null);
    setFeedback(null);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-sky-200 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
          🏎️
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Trò chơi 5: Đường Đua Toán Học (Đảo Giấu Vàng)</h2>
        <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
          Mô phỏng trò chơi trên sách giáo khoa trang 8 & 20! Gieo xúc xắc và giải đúng phép tính để đưa Rô-bốt về đích Đảo Giấu Vàng!
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setIsPlaying(true);
            }}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-base shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Flag className="w-5 h-5" /> Bắt đầu xuất phát
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white/95 rounded-3xl border border-teal-200 shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-yellow-500 text-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
          🏝️
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">Rô-bốt đã cập bến Đảo Giấu Vàng!</h3>
        <p className="text-teal-700 font-semibold mb-6">Bé đã mở khóa rương kho báu trí tuệ Toán học!</p>

        <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200 max-w-xs mx-auto mb-6">
          <span className="text-xs text-teal-700 font-medium">Tổng điểm hành trình</span>
          <p className="text-3xl font-black text-teal-600">{score}</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Đua lại
          </button>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
          >
            Về danh sách trò chơi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/95 rounded-3xl border border-teal-200 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
            Vị trí: Ô {playerPos} / {totalSteps}
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            ⭐ {score} điểm
          </span>
        </div>
      </div>

      {/* Board Raceway Track */}
      <div className="my-6 p-4 bg-gradient-to-r from-sky-100 via-amber-50 to-emerald-100 rounded-3xl border-2 border-teal-200 shadow-inner">
        <div className="grid grid-cols-5 md:grid-cols-9 gap-2 items-center">
          {Array.from({ length: totalSteps + 1 }).map((_, step) => {
            const hasPlayer = playerPos === step;
            const isStart = step === 0;
            const isGoal = step === totalSteps;

            return (
              <div
                key={step}
                className={`relative h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-1 transition-all ${
                  hasPlayer
                    ? 'bg-amber-300 border-amber-500 scale-105 shadow-md z-10'
                    : isGoal
                    ? 'bg-emerald-200 border-emerald-400 font-black text-emerald-800'
                    : isStart
                    ? 'bg-sky-200 border-sky-400 font-bold text-sky-800'
                    : 'bg-white/80 border-slate-200 text-slate-700'
                }`}
              >
                {hasPlayer ? (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl animate-bounce">🤖</span>
                    <span className="text-[10px] font-black text-amber-900">Bé ở đây</span>
                  </div>
                ) : isGoal ? (
                  <div className="text-center">
                    <span className="text-xl">🏝️</span>
                    <span className="text-[10px] font-black block">Đích</span>
                  </div>
                ) : isStart ? (
                  <div className="text-center">
                    <span className="text-xl">🚩</span>
                    <span className="text-[10px] font-bold block">Bắt đầu</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-slate-500">{step}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Action Area: Roll Dice or Answer Question */}
      <div className="text-center min-h-[160px] flex flex-col items-center justify-center">
        {!activeQuestion ? (
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-3">
              Gieo xúc xắc để nhận số bước tiến lên:
            </p>
            <button
              onClick={rollDice}
              disabled={isRolling}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center gap-3 mx-auto"
            >
              <span className="text-2xl">🎲</span>
              {isRolling ? 'Đang lắc xúc xắc...' : 'Gieo xúc xắc'}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md animate-in fade-in">
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full mb-2 inline-block">
              Giải đúng để tiến {activeQuestion.stepsReward} bước!
            </span>
            <div className="text-3xl md:text-4xl font-black text-slate-800 my-2">
              {activeQuestion.calc}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {activeQuestion.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedback !== null}
                  className="py-3 bg-white border-2 border-teal-300 hover:border-teal-500 hover:bg-teal-50 rounded-xl font-bold text-xl text-slate-800 shadow-sm active:scale-95 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl border font-bold text-sm ${
              feedback.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
};
