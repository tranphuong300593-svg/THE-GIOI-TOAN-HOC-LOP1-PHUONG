import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { MathSVG } from '../MathSVG';

interface Props {
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

export const MysteryNumberGame: React.FC<Props> = ({ onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const rounds = [
    {
      hint: 'Bé hãy đếm số chú gà con đang vui đùa:',
      illustration: { type: 'animals' as const, count: 5, itemType: 'chick' as const },
      correct: 5,
      choices: [3, 4, 5, 6]
    },
    {
      hint: 'Bé hãy đếm số quả cà chua chín đỏ:',
      illustration: { type: 'fruits' as const, count: 7, itemType: 'tomato' as const },
      correct: 7,
      choices: [6, 7, 8, 9]
    },
    {
      hint: 'Số bí ẩn đứng ngay liền sau số 8 là số nào?',
      illustration: { type: 'train_cars' as const, data: { sequence: [7, 8, '?', 10] } },
      correct: 9,
      choices: [6, 8, 9, 10]
    },
    {
      hint: 'Đếm xem trong bể có bao nhiêu chú cá đang bơi lội?',
      illustration: { type: 'sea_creatures' as const, count: 6, itemType: 'fish' as const },
      correct: 6,
      choices: [4, 5, 6, 7]
    },
    {
      hint: 'Số tròn chục gồm 3 chục và 0 đơn vị là số mấy?',
      illustration: { type: 'fruits' as const, count: 3, itemType: 'apple' as const },
      correct: 30,
      choices: [3, 13, 30, 33]
    }
  ];

  const current = rounds[currentRound];

  const handleSelect = (num: number) => {
    if (feedback !== null) return;
    setSelectedCard(num);
    const isCorrect = num === current.correct;

    if (isCorrect) {
      soundManager.playSuccess();
      setScore(s => s + 20);
      setCorrectCount(c => c + 1);
      setFeedback({ isCorrect: true, message: `Chính xác! Bé tìm đúng số ${num} rồi! 🌟` });
    } else {
      soundManager.playTryAgain();
      setFeedback({ isCorrect: false, message: `Chưa đúng rồi! Đáp án đúng là ${current.correct} nhé.` });
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedCard(null);
      if (currentRound + 1 < rounds.length) {
        setCurrentRound(r => r + 1);
      } else {
        setIsGameOver(true);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        soundManager.playFanfare();
        onFinish(score + (isCorrect ? 20 : 0), correctCount + (isCorrect ? 1 : 0), rounds.length);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setScore(0);
    setCorrectCount(0);
    setFeedback(null);
    setSelectedCard(null);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur-sm rounded-3xl border border-sky-200 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
          🕵️‍♂️
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Trò chơi 1: Săn Số Bí Ẩn</h2>
        <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
          Nhìn tranh gợi ý và nhanh tay chạm vào chiếc thẻ số bí ẩn chính xác nhất. Mỗi câu trả lời đúng bé sẽ được nhận 20 điểm và một ngôi sao sáng!
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
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Bắt đầu chơi ngay
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white/95 rounded-3xl border border-amber-200 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
          🏆
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">Chúc mừng bé hoàn thành xuất sắc!</h3>
        <p className="text-amber-600 font-semibold mb-6">Bé là tay thợ săn số đại tài!</p>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <span className="text-xs text-amber-700 font-medium">Điểm số</span>
            <p className="text-3xl font-black text-amber-600">{score}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-700 font-medium">Câu đúng</span>
            <p className="text-3xl font-black text-emerald-600">{correctCount} / {rounds.length}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-md"
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
    <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-sky-200 shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
            Vòng {currentRound + 1} / {rounds.length}
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            ⭐ {score} điểm
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-4">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">{current.hint}</h3>

        {/* Illustration */}
        <div className="my-3">
          <MathSVG illustration={current.illustration} className="max-w-md mx-auto" />
        </div>
      </div>

      {/* Number Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {current.choices.map((num) => {
          const isSelected = selectedCard === num;
          let btnStyle = 'bg-white border-sky-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50 shadow-sm';
          if (isSelected && feedback) {
            btnStyle = feedback.isCorrect
              ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-emerald-500/30'
              : 'bg-rose-500 border-rose-600 text-white scale-95';
          }

          return (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              disabled={feedback !== null}
              className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center font-black text-3xl md:text-4xl transition-all active:scale-95 ${btnStyle}`}
            >
              <span>{num}</span>
            </button>
          );
        })}
      </div>

      {/* Immediate Feedback Notification */}
      {feedback && (
        <div
          className={`mt-6 p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-base transition-all ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
          {feedback.message}
        </div>
      )}
    </div>
  );
};
