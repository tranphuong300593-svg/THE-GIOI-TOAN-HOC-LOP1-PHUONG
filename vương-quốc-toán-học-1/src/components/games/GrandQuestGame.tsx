import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Compass, ShieldAlert, Award } from 'lucide-react';
import { MathSVG } from '../MathSVG';

interface Props {
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

export const GrandQuestGame: React.FC<Props> = ({ onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [questStep, setQuestStep] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const questStages = [
    {
      stageName: 'Trạm 1: Đầm Lầy Đếm Số',
      question: 'Bé hãy đếm số chú ếch xanh trong đầm:',
      illustration: { type: 'animals' as const, count: 6, itemType: 'frog' as const },
      options: ['5', '6', '7', '8'],
      correct: '6',
      exp: 'Có đúng 6 chú ếch xanh đang hát ca.'
    },
    {
      stageName: 'Trạm 2: Hẻm Núi So Sánh',
      question: 'Chọn dấu đúng để vượt qua cầu: 8 ? 6',
      options: ['>', '<', '='],
      correct: '>',
      exp: '8 lớn hơn 6 nên ta dùng dấu >.'
    },
    {
      stageName: 'Trạm 3: Rừng Cây Hình Học',
      question: 'Bé quan sát hình vẽ dưới đây: Đây là hình gì?',
      illustration: { type: 'flat_shapes' as const, shape: 'triangle' as const },
      options: ['Hình tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'],
      correct: 'Hình tam giác',
      exp: 'Hình có 3 cạnh thẳng và 3 đỉnh là hình tam giác.'
    },
    {
      stageName: 'Trạm 4: Thác Nước Phép Cộng',
      question: 'Tính nhanh để giải lời nguyền thác nước: 5 + 4 = ?',
      options: ['8', '9', '10', '7'],
      correct: '9',
      exp: '5 + 4 = 9.'
    },
    {
      stageName: 'Trạm 5: Hang Đá Xăng-Ti-Mét',
      question: 'Quan sát hình vẽ. Bút chì dài bao nhiêu xăng-ti-mét?',
      illustration: { type: 'ruler_cm' as const, data: { pencilLength: 7 } },
      options: ['5 cm', '6 cm', '7 cm', '8 cm'],
      correct: '7 cm',
      exp: 'Đầu trái bút chì trùng đúng vạch số 0, đầu nhọn chạm đúng vạch số 7. Vậy bút chì dài 7 cm.'
    },
    {
      stageName: 'Trạm 6: Tháp Chuông Thời Gian',
      question: 'Bé quan sát đồng hồ: Lúc này là mấy giờ đúng?',
      illustration: { type: 'clock_face' as const, data: { hour: 9 } },
      options: ['8 giờ', '9 giờ', '10 giờ', '12 giờ'],
      correct: '9 giờ',
      exp: 'Kim ngắn chỉ số 9, kim dài chỉ số 12 nên là đúng 9 giờ.'
    }
  ];

  const current = questStages[questStep];

  const handleAnswer = (chosen: string) => {
    if (feedback !== null) return;
    const isCorrect = chosen === current.correct;

    if (isCorrect) {
      soundManager.playSuccess();
      setScore(s => s + 25);
      setCorrectCount(c => c + 1);
      setFeedback({ isCorrect: true, message: `Vượt trạm thành công! Bé xuất sắc giải đúng! 🛡️✨` });
    } else {
      soundManager.playTryAgain();
      setFeedback({ isCorrect: false, message: `Chưa đúng! Đáp án đúng là: ${current.correct}.` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (questStep + 1 < questStages.length) {
        setQuestStep(s => s + 1);
      } else {
        setIsGameOver(true);
        confetti({ particleCount: 130, spread: 90 });
        soundManager.playFanfare();
        onFinish(score + (isCorrect ? 25 : 0), correctCount + (isCorrect ? 1 : 0), questStages.length);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setQuestStep(0);
    setScore(0);
    setCorrectCount(0);
    setFeedback(null);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-sky-200 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
          🧭
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Trò chơi 8: Vượt Thử Thách Tổng Hợp</h2>
        <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
          Chuyến thám hiểm vĩ đại đi qua 6 trạm thử thách gồm Đếm số, So sánh, Hình học, Cộng trừ, Đo độ dài và Đồng hồ thời gian!
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
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Compass className="w-5 h-5" /> Bắt đầu thám hiểm
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white/95 rounded-3xl border border-orange-200 shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
          👑
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">Đại kiện tướng Toán học Lớp 1!</h3>
        <p className="text-orange-600 font-semibold mb-6">Bé đã xuất sắc chinh phục toàn bộ các trạm thử thách tổng hợp!</p>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
            <span className="text-xs text-orange-700 font-medium">Điểm tổng kết</span>
            <p className="text-3xl font-black text-orange-600">{score}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-700 font-medium">Trạm vượt qua</span>
            <p className="text-3xl font-black text-emerald-600">{correctCount} / {questStages.length}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Thám hiểm lại
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
    <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-orange-200 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
            Trạm {questStep + 1} / {questStages.length}
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            ⭐ {score} điểm
          </span>
        </div>
      </div>

      {/* Quest Progress Tracker */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
          <span>{current.stageName}</span>
          <span>{Math.round(((questStep + 1) / questStages.length) * 100)}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300"
            style={{ width: `${((questStep + 1) / questStages.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center my-4">
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3">{current.question}</h3>

        {current.illustration && (
          <div className="my-2">
            <MathSVG illustration={current.illustration} className="max-w-md mx-auto" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={feedback !== null}
            className="py-3 px-4 bg-white border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 rounded-2xl font-bold text-lg text-slate-800 shadow-sm active:scale-95 transition-all text-center"
          >
            {opt}
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
          {feedback.message}
        </div>
      )}
    </div>
  );
};
