import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Search, Sparkles, CheckCircle2, AlertCircle, Trophy, Star } from 'lucide-react';
import { MathSVG } from '../MathSVG';

interface Props {
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

interface DetectiveMission {
  id: string;
  prompt: string;
  hint: string;
  options: {
    id: string;
    label: string;
    shapeType?: 'flat_shapes' | 'solids_3d';
    shapeKind?: 'square' | 'circle' | 'triangle' | 'rectangle' | 'cube' | 'cuboid';
    color?: string;
    iconEmoji?: string;
    isCorrect: boolean;
  }[];
}

export const GeometryDetectiveGame: React.FC<Props> = ({ onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; hintText?: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasScoredThisRound, setHasScoredThisRound] = useState(false);

  // 5 verified pedagogical missions synchronized with Topic 2 (Flat shapes) and Topic 4 (3D solids)
  const missions: DetectiveMission[] = [
    {
      id: 'mis_1',
      prompt: 'Thám tử ơi, đâu là HÌNH TAM GIÁC (có 3 cạnh thẳng và 3 góc nhọn)?',
      hint: 'Hình tam giác có đúng 3 cạnh và 3 góc nhọn nhé thám tử.',
      options: [
        { id: 'opt_1a', label: 'Hình A', shapeType: 'flat_shapes', shapeKind: 'square', color: '#3B82F6', isCorrect: false },
        { id: 'opt_1b', label: 'Hình B', shapeType: 'flat_shapes', shapeKind: 'circle', color: '#EF4444', isCorrect: false },
        { id: 'opt_1c', label: 'Hình C', shapeType: 'flat_shapes', shapeKind: 'triangle', color: '#FACC15', isCorrect: true },
        { id: 'opt_1d', label: 'Hình D', shapeType: 'flat_shapes', shapeKind: 'rectangle', color: '#22C55E', isCorrect: false }
      ]
    },
    {
      id: 'mis_2',
      prompt: 'Thám tử hãy tìm HÌNH VUÔNG (có 4 cạnh bằng nhau và 4 góc vuông):',
      hint: 'Hình vuông có 4 cạnh đều bằng nhau tăm tắp.',
      options: [
        { id: 'opt_2a', label: 'Hình A', shapeType: 'flat_shapes', shapeKind: 'rectangle', color: '#22C55E', isCorrect: false },
        { id: 'opt_2b', label: 'Hình B', shapeType: 'flat_shapes', shapeKind: 'square', color: '#3B82F6', isCorrect: true },
        { id: 'opt_2c', label: 'Hình C', shapeType: 'flat_shapes', shapeKind: 'circle', color: '#EF4444', isCorrect: false },
        { id: 'opt_2d', label: 'Hình D', shapeType: 'flat_shapes', shapeKind: 'triangle', color: '#FACC15', isCorrect: false }
      ]
    },
    {
      id: 'mis_3',
      prompt: 'Đâu là HÌNH CHỮ NHẬT (có 2 cạnh dài bằng nhau và 2 cạnh ngắn bằng nhau)?',
      hint: 'Hình chữ nhật có 2 cạnh dài và 2 cạnh ngắn đối diện nhau.',
      options: [
        { id: 'opt_3a', label: 'Hình A', shapeType: 'flat_shapes', shapeKind: 'circle', color: '#EF4444', isCorrect: false },
        { id: 'opt_3b', label: 'Hình B', shapeType: 'flat_shapes', shapeKind: 'triangle', color: '#FACC15', isCorrect: false },
        { id: 'opt_3c', label: 'Hình C', shapeType: 'flat_shapes', shapeKind: 'rectangle', color: '#22C55E', isCorrect: true },
        { id: 'opt_3d', label: 'Hình D', shapeType: 'flat_shapes', shapeKind: 'square', color: '#3B82F6', isCorrect: false }
      ]
    },
    {
      id: 'mis_4',
      prompt: 'Đồ vật nào dưới đây có dạng KHỐI LẬP PHƯƠNG (6 mặt đều là hình vuông)?',
      hint: 'Con xúc xắc có 6 mặt hình vuông bằng nhau là khối lập phương.',
      options: [
        { id: 'opt_4a', label: 'Con xúc xắc 🎲', shapeType: 'solids_3d', shapeKind: 'cube', isCorrect: true },
        { id: 'opt_4b', label: 'Hộp sữa tươi dài 🧃', shapeType: 'solids_3d', shapeKind: 'cuboid', isCorrect: false },
        { id: 'opt_4c', label: 'Quả bóng tròn ⚽', iconEmoji: '⚽', isCorrect: false }
      ]
    },
    {
      id: 'mis_5',
      prompt: 'Đồ vật nào dưới đây có dạng KHỐI HỘP CHỮ NHẬT?',
      hint: 'Bao diêm và hộp phấn có các mặt là hình chữ nhật.',
      options: [
        { id: 'opt_5a', label: 'Bao diêm / Hộp bánh 📦', shapeType: 'solids_3d', shapeKind: 'cuboid', isCorrect: true },
        { id: 'opt_5b', label: 'Khối rubik vuông 🎲', shapeType: 'solids_3d', shapeKind: 'cube', isCorrect: false },
        { id: 'opt_5c', label: 'Mặt đồng hồ tròn ⏰', iconEmoji: '⏰', isCorrect: false }
      ]
    }
  ];

  const current = missions[currentIdx];

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (feedback?.isCorrect) return; // Prevent double trigger when already won round

    setSelectedId(optId);

    if (isCorrect) {
      soundManager.playSuccess();
      const pointsToAdd = hasScoredThisRound ? 0 : 20;
      const newScore = score + pointsToAdd;
      const newCorrect = correctCount + (hasScoredThisRound ? 0 : 1);

      setScore(newScore);
      setCorrectCount(newCorrect);
      setHasScoredThisRound(true);

      setFeedback({
        isCorrect: true,
        message: 'CHÍNH XÁC! Hình hình học phát sáng! Bé nhận được 1 Kính lúp Thám tử Vàng! 🔍⭐'
      });

      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Ignore
      }

      setTimeout(() => {
        setFeedback(null);
        setSelectedId(null);
        setHasScoredThisRound(false);

        if (currentIdx + 1 < missions.length) {
          setCurrentIdx(i => i + 1);
        } else {
          setIsGameOver(true);
          try {
            confetti({ particleCount: 90, spread: 80 });
          } catch {
            // Ignore
          }
          soundManager.playFanfare();
          onFinish(newScore, newCorrect, missions.length);
        }
      }, 1600);
    } else {
      soundManager.playTryAgain();
      setFeedback({
        isCorrect: false,
        message: 'Chưa chính xác thám tử ơi! Không được cộng điểm.',
        hintText: current.hint
      });

      // Clear wrong selection after 1.2s to allow retry
      setTimeout(() => {
        setFeedback(null);
        setSelectedId(null);
      }, 1400);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setSelectedId(null);
    setFeedback(null);
    setHasScoredThisRound(false);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white/95 rounded-3xl border-2 border-purple-200 shadow-2xl text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-5xl shadow-lg shadow-purple-500/20 text-white animate-pulse">
          🔍
        </div>

        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200 inline-block mb-2">
            Trò chơi #6 · Chủ đề 2 & 4
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            Thám Tử Hình Học
          </h2>
          <p className="text-base font-extrabold text-purple-600 mb-3">
            Phân loại hình phẳng & khối không gian
          </p>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Quan sát kỹ lưỡng các hình phẳng (hình vuông, hình tròn, hình tam giác, hình chữ nhật) và hình khối (khối lập phương, khối hộp chữ nhật). Khi chọn đúng, hình sẽ phát sáng và thám tử nhận thêm một kính lúp vàng!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-left max-w-lg mx-auto text-xs font-bold text-purple-900 leading-relaxed">
          <p className="flex items-center gap-1.5 mb-1 font-extrabold text-purple-950">
            <Sparkles className="w-4 h-4 text-amber-500" /> Cơ chế chơi thám tử chuẩn xác:
          </p>
          <span>Nhận diện đúng hình học → Hình phát sáng rực rỡ → Nhận Kính lúp vàng → Tiến độ vụ án +1</span>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setIsPlaying(true);
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-base shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Search className="w-5 h-5" /> BẮT ĐẦU PHÁ ÁN
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    const isPerfect = correctCount === missions.length;

    return (
      <div className="max-w-xl mx-auto p-6 sm:p-8 bg-white/95 rounded-3xl border-2 border-purple-300 shadow-2xl text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center text-5xl shadow-xl animate-bounce">
          {isPerfect ? '👑' : '🎖️'}
        </div>

        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200 inline-block mb-2">
            HOÀN THÀNH 5 VỤ ÁN HÌNH HỌC
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {isPerfect ? 'THÁM TỬ TRƯỞNG XUẤT SẮC!' : 'BÉ ĐÃ PHÁ ÁN THÀNH CÔNG!'}
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            {isPerfect
              ? 'Bé có đôi mắt quan sát hình học vô cùng tinh tường! Đạt điểm tuyệt đối 100/100!'
              : `Bé đã giải quyết được ${correctCount} / ${missions.length} câu hỏi hình học!`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-center">
            <span className="text-xs text-purple-700 font-bold block mb-1">Điểm số</span>
            <span className="text-3xl font-black text-purple-600">{score}</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
            <span className="text-xs text-emerald-700 font-bold block mb-1">Đúng câu</span>
            <span className="text-3xl font-black text-emerald-600">
              {correctCount} / {missions.length}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-3">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Thử lại
          </button>
          <button
            onClick={onBack}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Về sân chơi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-purple-100 shadow-sm">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            Vụ án #{currentIdx + 1} / {missions.length}
          </span>
          <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {score} điểm
          </span>
        </div>
      </div>

      {/* Main Mission Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-purple-200 shadow-lg text-center space-y-6">
        <div>
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
            Nhiệm vụ Thám Tử Lớp 1
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            {current.prompt}
          </h3>
        </div>

        {/* Options Grid (3 or 4 choices with exact SVG shapes, NO text inside shapes) */}
        <div className={`grid gap-4 ${
          current.options.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'
        }`}>
          {current.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            const isRight = feedback?.isCorrect && isSelected;
            const isWrong = feedback && !feedback.isCorrect && isSelected;

            return (
              <button
                key={opt.id}
                disabled={feedback?.isCorrect}
                onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-between gap-3 transition-all cursor-pointer ${
                  isRight
                    ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-500/20 scale-105 ring-4 ring-emerald-300'
                    : isWrong
                    ? 'border-rose-500 bg-rose-50 ring-4 ring-rose-300 animate-shake'
                    : 'border-slate-200 bg-slate-50/70 hover:border-purple-400 hover:bg-purple-50/60 active:scale-95'
                }`}
              >
                {/* Visual shape rendering */}
                <div className="w-full flex items-center justify-center min-h-[90px]">
                  {opt.shapeType === 'flat_shapes' && opt.shapeKind && (
                    <MathSVG
                      illustration={{
                        type: 'flat_shapes',
                        shape: opt.shapeKind,
                        data: { color: opt.color }
                      }}
                      className="p-0 border-0 bg-transparent shadow-none"
                    />
                  )}

                  {opt.shapeType === 'solids_3d' && opt.shapeKind && (
                    <MathSVG
                      illustration={{
                        type: 'solids_3d',
                        shape: opt.shapeKind
                      }}
                      className="p-0 border-0 bg-transparent shadow-none"
                    />
                  )}

                  {!opt.shapeType && opt.iconEmoji && (
                    <span className="text-6xl drop-shadow-sm select-none">
                      {opt.iconEmoji}
                    </span>
                  )}
                </div>

                {/* Option Label (OUTSIDE shape) */}
                <span className={`text-xs sm:text-sm font-black px-3 py-1 rounded-full ${
                  isRight
                    ? 'bg-emerald-600 text-white'
                    : isWrong
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`p-4 rounded-2xl border-2 text-center transition-all animate-bounce ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <p className="font-black text-sm mb-0.5 flex items-center justify-center gap-2">
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              {feedback.message}
            </p>
            {feedback.hintText && (
              <p className="text-xs font-bold text-slate-700 mt-1">
                Gợi ý: {feedback.hintText}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
