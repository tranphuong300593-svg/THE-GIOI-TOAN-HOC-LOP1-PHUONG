import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Gift, Star } from 'lucide-react';

interface Props {
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

interface BoxItem {
  id: number;
  isOpen: boolean;
  question: string;
  options: string[];
  correct: string;
  starsReward: number;
  badgeName: string;
}

export const LuckyBoxGame: React.FC<Props> = ({ onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [boxes, setBoxes] = useState<BoxItem[]>([
    {
      id: 1,
      isOpen: false,
      question: 'Phép tính nào dưới đây có kết quả bằng 10?',
      options: ['5 + 5', '4 + 4', '6 + 2', '3 + 5'],
      correct: '5 + 5',
      starsReward: 3,
      badgeName: 'Huy hiệu Ngôi Sao Vàng ⭐'
    },
    {
      id: 2,
      isOpen: false,
      question: 'Số nào là số bé nhất trong các số: 9, 3, 7, 1?',
      options: ['9', '3', '7', '1'],
      correct: '1',
      starsReward: 3,
      badgeName: 'Huy hiệu Mắt Tinh Anh 👁️'
    },
    {
      id: 3,
      isOpen: false,
      question: 'Khi kim dài chỉ số 12, kim ngắn chỉ số 3, đồng hồ chỉ mấy giờ?',
      options: ['12 giờ', '3 giờ', '6 giờ', '9 giờ'],
      correct: '3 giờ',
      starsReward: 3,
      badgeName: 'Huy hiệu Bác Thợ Đồng Hồ ⏰'
    },
    {
      id: 4,
      isOpen: false,
      question: 'Dài 10 cm hay ngắn 10 cm thì cái nào bằng 10 xăng-ti-mét?',
      options: ['Dài 10 cm', 'Cả hai đều đúng', 'Không có cái nào'],
      correct: 'Dài 10 cm',
      starsReward: 3,
      badgeName: 'Huy hiệu Thước Kẻ Thông Thái 📏'
    },
    {
      id: 5,
      isOpen: false,
      question: 'Tách số 7 gồm 5 và mấy?',
      options: ['1', '2', '3', '4'],
      correct: '2',
      starsReward: 3,
      badgeName: 'Huy hiệu Bậc Thầy Tách Gộp 🧩'
    },
    {
      id: 6,
      isOpen: false,
      question: '70 cộng thêm 20 bằng bao nhiêu?',
      options: ['80', '90', '100', '72'],
      correct: '90',
      starsReward: 5,
      badgeName: 'Huy hiệu Phù Thủy Số Tròn Chục 🧙‍♂️'
    }
  ]);

  const [activeBox, setActiveBox] = useState<BoxItem | null>(null);
  const [collectedBadges, setCollectedBadges] = useState<string[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleOpenBox = (box: BoxItem) => {
    if (box.isOpen || activeBox !== null) return;
    soundManager.playPop();
    setActiveBox(box);
  };

  const handleAnswer = (chosen: string) => {
    if (!activeBox || feedback !== null) return;
    const isCorrect = chosen === activeBox.correct;

    if (isCorrect) {
      soundManager.playStar();
      setTotalStars(s => s + activeBox.starsReward);
      setCollectedBadges(b => [...b, activeBox.badgeName]);
      setFeedback({
        isCorrect: true,
        message: `Mở quà thành công! Bé nhận được +${activeBox.starsReward} sao và ${activeBox.badgeName}! 🎉`
      });

      // Update box state
      setBoxes(prev =>
        prev.map(b => (b.id === activeBox.id ? { ...b, isOpen: true } : b))
      );

      setTimeout(() => {
        setFeedback(null);
        setActiveBox(null);

        // Check if all boxes opened
        const remaining = boxes.filter(b => !b.isOpen && b.id !== activeBox.id);
        if (remaining.length === 0) {
          setIsGameOver(true);
          confetti({ particleCount: 100, spread: 80 });
          soundManager.playFanfare();
          onFinish(totalStars * 10 + 50, collectedBadges.length + 1, boxes.length);
        }
      }, 1800);
    } else {
      soundManager.playTryAgain();
      setFeedback({
        isCorrect: false,
        message: `Hộp quà chưa chịu mở ra rồi! Đáp án đúng là: ${activeBox.correct}. Bé thử mở hộp khác xem sao nhé!`
      });

      setTimeout(() => {
        setFeedback(null);
        setActiveBox(null);
      }, 1800);
    }
  };

  const handleRestart = () => {
    setBoxes(prev => prev.map(b => ({ ...b, isOpen: false })));
    setActiveBox(null);
    setCollectedBadges([]);
    setTotalStars(0);
    setFeedback(null);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white/95 rounded-3xl border border-sky-200 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-pink-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
          🎁
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Trò chơi 7: Chiếc Hộp May Mắn</h2>
        <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
          Mỗi chiếc hộp bí mật chứa đựng một câu đố toán học thú vị. Giải đúng để mở khóa các ngôi sao rực rỡ và sưu tầm các huy hiệu danh giá!
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
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Gift className="w-5 h-5" /> Bắt đầu mở quà
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white/95 rounded-3xl border border-pink-200 shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
          🎉
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">Bé đã mở toàn bộ hộp quà!</h3>
        <p className="text-pink-600 font-semibold mb-6">Bộ sưu tập huy hiệu của bé thật đáng tự hào!</p>

        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200 max-w-md mx-auto mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span className="text-2xl font-black text-slate-800">{totalStars} Ngôi sao</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {collectedBadges.map((badge, idx) => (
              <span key={idx} className="text-xs bg-white border border-pink-200 px-3 py-1.5 rounded-xl font-bold text-pink-700 shadow-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Mở lại các hộp
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
    <div className="max-w-3xl mx-auto p-6 bg-white/95 rounded-3xl border border-pink-200 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-pink-500" /> {totalStars} sao
          </span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            Đã mở: {boxes.filter(b => b.isOpen).length} / {boxes.length}
          </span>
        </div>
      </div>

      {!activeBox ? (
        <div>
          <p className="text-center font-bold text-slate-700 mb-6 text-sm md:text-base">
            Chạm vào một chiếc hộp quà may mắn bất kỳ để mở câu hỏi:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {boxes.map((box) => (
              <button
                key={box.id}
                onClick={() => handleOpenBox(box)}
                disabled={box.isOpen}
                className={`h-36 rounded-3xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                  box.isOpen
                    ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-default'
                    : 'bg-gradient-to-b from-white to-pink-50 border-pink-200 hover:border-pink-400 hover:scale-102 hover:shadow-lg shadow-sm active:scale-95'
                }`}
              >
                <span className="text-4xl mb-1">{box.isOpen ? '📦' : '🎁'}</span>
                <span className="font-extrabold text-sm text-slate-800">
                  {box.isOpen ? 'Đã nhận quà' : `Hộp quà số ${box.id}`}
                </span>
                {!box.isOpen && (
                  <span className="text-[11px] font-semibold text-pink-600 mt-1">
                    +{box.starsReward} sao thưởng
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Active Box Modal / Card Question */
        <div className="max-w-md mx-auto p-6 bg-pink-50/70 rounded-3xl border-2 border-pink-300 shadow-md animate-in zoom-in-95">
          <div className="text-center mb-4">
            <span className="text-3xl mb-1 block">🎁</span>
            <span className="text-xs font-extrabold text-pink-700 uppercase tracking-wider">
              Câu đố hộp quà số {activeBox.id}
            </span>
            <h3 className="font-bold text-base text-slate-800 mt-2">{activeBox.question}</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {activeBox.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className="py-3 px-4 bg-white border-2 border-pink-200 hover:border-pink-400 rounded-2xl font-bold text-slate-800 shadow-sm active:scale-95 transition-all text-center"
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div
              className={`mt-4 p-3 rounded-2xl border text-center font-bold text-sm ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
