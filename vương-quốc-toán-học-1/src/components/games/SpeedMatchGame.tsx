import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Check, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

interface MatchPair {
  id: string;
  leftText: string;
  rightText: string;
}

export const SpeedMatchGame: React.FC<Props> = ({ onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);

  const rawPairs: MatchPair[] = [
    { id: 'p1', leftText: '3 + 2', rightText: '5' },
    { id: 'p2', leftText: '7 − 3', rightText: '4' },
    { id: 'p3', leftText: '10 − 2', rightText: '8' },
    { id: 'p4', leftText: '4 + 5', rightText: '9' },
    { id: 'p5', leftText: 'Hình tam giác', rightText: '3 cạnh 3 góc' },
    { id: 'p6', leftText: 'Số tròn chục', rightText: '10, 20, 30...' }
  ];

  // Shuffled right cards
  const [shuffledRight, setShuffledRight] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      const shuffled = [...rawPairs]
        .map(p => ({ id: p.id, text: p.rightText }))
        .sort(() => Math.random() - 0.5);
      setShuffledRight(shuffled);

      const interval = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            handleEnd(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, isGameOver]);

  const handleEnd = (won: boolean) => {
    setIsGameOver(true);
    if (won) {
      confetti({ particleCount: 100, spread: 70 });
      soundManager.playFanfare();
    } else {
      soundManager.playTryAgain();
    }
    const finalScore = score + (won ? timer * 2 : 0);
    onFinish(finalScore, matchedPairs.length, rawPairs.length);
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      soundManager.playSuccess();
      const updated = [...matchedPairs, leftId];
      setMatchedPairs(updated);
      setScore(s => s + 20);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (updated.length === rawPairs.length) {
        setTimeout(() => handleEnd(true), 500);
      }
    } else {
      soundManager.playTryAgain();
      setMistakes(m => m + 1);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  const handleLeftClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    soundManager.playPop();
    setSelectedLeft(id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    soundManager.playPop();
    setSelectedRight(id);
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const handleRestart = () => {
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setScore(0);
    setMistakes(0);
    setTimer(60);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-sky-200 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
          ⚡
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Trò chơi 3: Ghép Đôi Thần Tốc</h2>
        <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
          Nhanh mắt nhanh tay ghép đúng từng phép tính hoặc khái niệm với kết quả tương ứng. Càng nhanh thời gian bé càng nhận nhiều điểm thưởng!
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
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-base shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Bắt đầu ghép đôi
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    const isWin = matchedPairs.length === rawPairs.length;
    return (
      <div className="max-w-xl mx-auto p-8 bg-white/95 rounded-3xl border border-emerald-200 shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
          {isWin ? '🌟' : '⏰'}
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">
          {isWin ? 'Tuyệt vời! Bé đã ghép đôi xuất sắc!' : 'Hết thời gian mất rồi!'}
        </h3>
        <p className="text-emerald-700 font-semibold mb-6">
          {isWin ? `Hoàn thành khi còn ${timer} giây!` : `Bé ghép đúng ${matchedPairs.length}/${rawPairs.length} cặp.`}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-700 font-medium">Tổng điểm</span>
            <p className="text-3xl font-black text-emerald-600">{score + (isWin ? timer * 2 : 0)}</p>
          </div>
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200">
            <span className="text-xs text-sky-700 font-medium">Thời gian còn lại</span>
            <p className="text-3xl font-black text-sky-600">{timer}s</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
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
    <div className="max-w-3xl mx-auto p-6 bg-white/95 rounded-3xl border border-emerald-200 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${timer <= 15 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            ⏱️ {timer} giây
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Đã ghép: {matchedPairs.length} / {rawPairs.length}
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            ⭐ {score} điểm
          </span>
        </div>
      </div>

      <p className="text-center text-sm font-semibold text-slate-600 mb-6">
        Chọn 1 thẻ ở cột trái và 1 thẻ ở cột phải để tạo thành cặp tương ứng:
      </p>

      {/* Two columns grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        {/* Left Cards */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">
            Câu hỏi / Phép tính
          </span>
          {rawPairs.map((p) => {
            const isMatched = matchedPairs.includes(p.id);
            const isSelected = selectedLeft === p.id;
            return (
              <button
                key={p.id}
                disabled={isMatched}
                onClick={() => handleLeftClick(p.id)}
                className={`w-full p-4 rounded-2xl border-2 text-center font-bold text-base md:text-lg transition-all ${
                  isMatched
                    ? 'bg-emerald-100/60 border-emerald-300 text-emerald-700 opacity-60 cursor-default'
                    : isSelected
                    ? 'bg-sky-500 border-sky-600 text-white scale-102 shadow-md'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-sky-300 hover:bg-sky-50/50 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="mx-auto">{p.leftText}</span>
                  {isMatched && <Check className="w-5 h-5 text-emerald-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Cards */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">
            Kết quả / Khái niệm
          </span>
          {shuffledRight.map((r) => {
            const isMatched = matchedPairs.includes(r.id);
            const isSelected = selectedRight === r.id;
            return (
              <button
                key={r.id}
                disabled={isMatched}
                onClick={() => handleRightClick(r.id)}
                className={`w-full p-4 rounded-2xl border-2 text-center font-bold text-base md:text-lg transition-all ${
                  isMatched
                    ? 'bg-emerald-100/60 border-emerald-300 text-emerald-700 opacity-60 cursor-default'
                    : isSelected
                    ? 'bg-amber-500 border-amber-600 text-white scale-102 shadow-md'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-amber-300 hover:bg-amber-50/50 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="mx-auto">{r.text}</span>
                  {isMatched && <Check className="w-5 h-5 text-emerald-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
