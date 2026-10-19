import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';

interface Props {
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

interface HouseItem {
  id: string;
  number: number;
  wordName: string;
  targetCalc: string;
}

export const FindHouseGame: React.FC<Props> = ({ onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // 5 rounds of finding houses for penguins and cute animals
  const rounds = [
    {
      animal: '🐧 Chú chim cánh cụt mang số 20',
      number: 20,
      question: 'Bé hãy tìm ngôi nhà lều tuyết ghi đúng cách đọc của số 20:',
      houses: [
        { label: 'Mười', value: 10 },
        { label: 'Hai mươi', value: 20 },
        { label: 'Ba mươi', value: 30 }
      ],
      correctValue: 20
    },
    {
      animal: '🐰 Chú thỏ trắng mang thẻ phép tính 4 + 4',
      number: 8,
      question: 'Ngôi nhà nào có số bằng kết quả của 4 + 4?',
      houses: [
        { label: 'Nhà số 7', value: 7 },
        { label: 'Nhà số 8', value: 8 },
        { label: 'Nhà số 9', value: 9 }
      ],
      correctValue: 8
    },
    {
      animal: '🐻 Chú gấu con mang thẻ số 50',
      number: 50,
      question: 'Ngôi nhà nào là nơi ở của số 5 chục (50)?',
      houses: [
        { label: 'Năm mươi', value: 50 },
        { label: 'Bốn mươi', value: 40 },
        { label: 'Sáu mươi', value: 60 }
      ],
      correctValue: 50
    },
    {
      animal: '🐱 Chú mèo con mang thẻ phép trừ 10 − 5',
      number: 5,
      question: 'Ngôi nhà nào có kết quả tương ứng với 10 − 5?',
      houses: [
        { label: 'Nhà số 4', value: 4 },
        { label: 'Nhà số 5', value: 5 },
        { label: 'Nhà số 6', value: 6 }
      ],
      correctValue: 5
    },
    {
      animal: '🦊 Chú cáo nhỏ tìm ngôi nhà có số lớn hơn 15',
      number: 18,
      question: 'Trong các ngôi nhà sau, nhà nào có số lớn hơn 15?',
      houses: [
        { label: 'Nhà 12', value: 12 },
        { label: 'Nhà 14', value: 14 },
        { label: 'Nhà 18', value: 18 }
      ],
      correctValue: 18
    }
  ];

  const current = rounds[currentIdx];

  const handleHouseChoose = (val: number) => {
    if (feedback !== null) return;
    const isCorrect = val === current.correctValue;

    if (isCorrect) {
      soundManager.playSuccess();
      setScore(s => s + 20);
      setCorrectCount(c => c + 1);
      setFeedback({ isCorrect: true, message: 'Hoan hô! Bé đã dẫn bạn về đúng nhà an toàn rồi! 🏡✨' });
    } else {
      soundManager.playTryAgain();
      setFeedback({ isCorrect: false, message: 'Ồ chưa đúng nhà rồi! Lần sau bé nhìn kỹ hơn nhé.' });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx + 1 < rounds.length) {
        setCurrentIdx(i => i + 1);
      } else {
        setIsGameOver(true);
        confetti({ particleCount: 90, spread: 70 });
        soundManager.playFanfare();
        onFinish(score + (isCorrect ? 20 : 0), correctCount + (isCorrect ? 1 : 0), rounds.length);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setFeedback(null);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-sky-200 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
          🏡
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Trò chơi 4: Tìm Nhà Cho Số</h2>
        <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
          Các bạn chim cánh cụt, thỏ con và gấu nhỏ đang đi tìm ngôi nhà ấm áp của mình. Bé hãy giúp các bạn tìm đúng nhà có điều kiện phù hợp nhé!
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
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-600 text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Home className="w-5 h-5" /> Bắt đầu tìm nhà
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white/95 rounded-3xl border border-indigo-200 shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-400 to-sky-500 text-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
          🏰
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">Mọi bạn nhỏ đều đã về nhà!</h3>
        <p className="text-indigo-600 font-semibold mb-6">Bé thật là một người bạn tốt bụng và thông minh!</p>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
            <span className="text-xs text-indigo-700 font-medium">Điểm số</span>
            <p className="text-3xl font-black text-indigo-600">{score}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-700 font-medium">Tìm đúng nhà</span>
            <p className="text-3xl font-black text-emerald-600">{correctCount} / {rounds.length}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Chơi lại
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
    <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-indigo-200 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
            Vòng {currentIdx + 1} / {rounds.length}
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            ⭐ {score} điểm
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl max-w-md mx-auto mb-4">
          <div className="text-3xl mb-1">{current.animal.split(' ')[0]}</div>
          <span className="font-extrabold text-indigo-950 text-base block">{current.animal}</span>
        </div>

        <h3 className="text-base md:text-lg font-bold text-slate-800">{current.question}</h3>
      </div>

      {/* 3 Houses to choose */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {current.houses.map((house, idx) => (
          <button
            key={idx}
            onClick={() => handleHouseChoose(house.value)}
            disabled={feedback !== null}
            className="p-5 rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-white to-sky-50/50 hover:border-indigo-400 hover:shadow-lg transition-all active:scale-95 flex flex-col items-center group"
          >
            {/* Cute House Roof SVG */}
            <svg width="80" height="70" viewBox="0 0 80 70" className="mb-2 group-hover:scale-105 transition-transform">
              <polygon points="40,5 5,35 75,35" fill="#3B82F6" stroke="none" strokeWidth="0" />
              <rect x="15" y="35" width="50" height="32" rx="0" ry="0" fill="#E0F2FE" stroke="none" strokeWidth="0" />
              <rect x="32" y="44" width="16" height="23" rx="0" ry="0" fill="#F97316" stroke="none" strokeWidth="0" />
              <circle cx="36" cy="56" r="1.5" fill="#FFFFFF" stroke="none" strokeWidth="0" />
              <circle cx="40" cy="22" r="5" fill="#FEF08A" stroke="none" strokeWidth="0" />
            </svg>
            <span className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
              {house.label}
            </span>
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
