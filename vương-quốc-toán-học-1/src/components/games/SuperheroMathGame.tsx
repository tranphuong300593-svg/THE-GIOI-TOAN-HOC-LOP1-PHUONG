import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, ShieldCheck, Zap } from 'lucide-react';
import { MathSVG } from '../MathSVG';

interface Props {
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

export const SuperheroMathGame: React.FC<Props> = ({ onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const challenges = [
    {
      calc: '4 + 3 = ?',
      text: 'Bé hãy tính nhẩm phép cộng 4 cộng 3:',
      leftCount: 4,
      rightCount: 3,
      correct: 7,
      choices: [5, 6, 7, 8],
      kind: 'apple' as const
    },
    {
      calc: '6 − 2 = ?',
      text: 'Siêu nhân có 6 củ cà rốt, bớt đi 2 củ còn mấy?',
      leftCount: 6,
      rightCount: 2,
      correct: 4,
      choices: [3, 4, 5, 8],
      kind: 'carrot' as const
    },
    {
      calc: '5 + 5 = ?',
      text: 'Gộp 5 chú gà con với 5 chú gà con được mấy?',
      leftCount: 5,
      rightCount: 5,
      correct: 10,
      choices: [8, 9, 10, 11],
      kind: 'chick' as const
    },
    {
      calc: '9 − 4 = ?',
      text: 'Trong hồ có 9 chú cá, 4 chú bơi đi, còn lại mấy?',
      leftCount: 9,
      rightCount: 4,
      correct: 5,
      choices: [3, 4, 5, 6],
      kind: 'fish' as const
    },
    {
      calc: '20 + 30 = ?',
      text: 'Siêu nhân cộng hai số tròn chục: 2 chục + 3 chục = mấy chục?',
      leftCount: 2,
      rightCount: 3,
      correct: 50,
      choices: [40, 50, 60, 23],
      kind: 'tomato' as const
    }
  ];

  const current = challenges[round];

  const handleAnswer = (ans: number) => {
    if (feedback !== null) return;
    const isCorrect = ans === current.correct;

    if (isCorrect) {
      soundManager.playSuccess();
      setScore(s => s + 20);
      setCorrectCount(c => c + 1);
      setFeedback({ isCorrect: true, message: `Tuyệt đỉnh siêu nhân! ${current.calc.replace('?', String(ans))} là chính xác! ⚡` });
    } else {
      soundManager.playTryAgain();
      setFeedback({ isCorrect: false, message: `Chưa đúng! Kết quả đúng là ${current.correct}. Cố lên nào siêu nhân!` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (round + 1 < challenges.length) {
        setRound(r => r + 1);
      } else {
        setIsGameOver(true);
        confetti({ particleCount: 90, spread: 80 });
        soundManager.playFanfare();
        onFinish(score + (isCorrect ? 20 : 0), correctCount + (isCorrect ? 1 : 0), challenges.length);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setFeedback(null);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-sky-200 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
          🦸‍♂️
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Trò chơi 2: Siêu Nhân Cộng Trừ</h2>
        <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
          Cùng siêu nhân robot giải phóng năng lượng toán học bằng cách hoàn thành các phép cộng và phép trừ chính xác nhất!
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
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-base shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Zap className="w-5 h-5" /> Bắt đầu giải cứu số học
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white/95 rounded-3xl border border-rose-200 shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-rose-400 to-red-600 text-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
          ⚡
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">Siêu nhân đã hoàn thành nhiệm vụ!</h3>
        <p className="text-rose-600 font-semibold mb-6">Bé tính toán rất nhanh nhẹn và chính xác!</p>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
            <span className="text-xs text-rose-700 font-medium">Điểm siêu nhân</span>
            <p className="text-3xl font-black text-rose-600">{score}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-700 font-medium">Số phép tính đúng</span>
            <p className="text-3xl font-black text-emerald-600">{correctCount} / {challenges.length}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Thử thách lại
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
    <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-rose-200 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
            Cấp độ {round + 1} / {challenges.length}
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            ⚡ {score} điểm
          </span>
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm md:text-base font-semibold text-slate-700 mb-2">{current.text}</p>

        {/* Big Crisp Math Formula Display */}
        <div className="my-3 py-3 px-6 bg-rose-50/70 border border-rose-200 rounded-2xl inline-block shadow-sm">
          <span className="text-3xl md:text-5xl font-black text-rose-700 tracking-wider">
            {current.calc}
          </span>
        </div>

        {/* Visual tray representation */}
        <div className="my-2">
          <MathSVG
            illustration={{
              type: 'balance_tray',
              count: current.leftCount,
              secondaryCount: current.rightCount,
              itemType: current.kind
            }}
            className="max-w-md mx-auto"
          />
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {current.choices.map((ans) => (
          <button
            key={ans}
            onClick={() => handleAnswer(ans)}
            disabled={feedback !== null}
            className="h-20 rounded-2xl border-2 border-rose-200 bg-white hover:bg-rose-50 hover:border-rose-400 font-black text-3xl text-slate-800 shadow-sm active:scale-95 transition-all flex items-center justify-center"
          >
            {ans}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`mt-6 p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-base ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.isCorrect ? <ShieldCheck className="w-5 h-5 text-emerald-600" /> : <Zap className="w-5 h-5 text-rose-600" />}
          {feedback.message}
        </div>
      )}
    </div>
  );
};
