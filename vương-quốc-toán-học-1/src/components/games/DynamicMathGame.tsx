import React, { useState } from 'react';
import { GameMetadata } from '../../data/gamesData';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { MathSVG } from '../MathSVG';
import { FlatShapeRenderer } from '../FlatShapeRenderer';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Star,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  Box,
  Calendar,
  Layers
} from 'lucide-react';

interface Props {
  game: GameMetadata;
  onBack: () => void;
  onFinish: (score: number, correct: number, total: number) => void;
}

export const DynamicMathGame: React.FC<Props> = ({ game, onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    actionText: string;
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [collectedItems, setCollectedItems] = useState<number>(0);
  const [animatingAction, setAnimatingAction] = useState(false);

  const currentRound = game.rounds[currentIdx] || game.rounds[0];
  const progressPercent = Math.round((currentIdx / game.rounds.length) * 100);

  const handleOptionClick = (option: string) => {
    // Strictly prevent double-clicking or scoring multiple times per round
    if (feedback !== null || animatingAction) return;

    setSelectedOption(option);
    const isCorrect = option === currentRound.correctAnswer;

    if (isCorrect) {
      soundManager.playSuccess();
      setAnimatingAction(true);
      const newScore = score + 20;
      const newCorrect = correctCount + 1;
      const newCollected = collectedItems + 1;

      setScore(newScore);
      setCorrectCount(newCorrect);
      setCollectedItems(newCollected);

      setFeedback({
        isCorrect: true,
        message: 'Hoan hô! Bé đã giải đúng và nhận thành quả nhiệm vụ! 🎉✨',
        actionText: currentRound.actionFeedback
      });

      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }

      setTimeout(() => {
        setAnimatingAction(false);
        setFeedback(null);
        setSelectedOption(null);
        setShowHint(false);

        if (currentIdx + 1 < game.rounds.length) {
          setCurrentIdx(i => i + 1);
        } else {
          setIsGameOver(true);
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 }
            });
          } catch {
            // Ignore
          }
          soundManager.playFanfare();
          onFinish(newScore, newCorrect, game.rounds.length);
        }
      }, 1900);
    } else {
      soundManager.playTryAgain();
      setFeedback({
        isCorrect: false,
        message: 'Chưa chính xác rồi bé ơi! Bé hãy thử suy nghĩ lại nhé.',
        actionText: currentRound.hint
      });

      // Clear wrong selection after 1.4s so the child can retry
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 1400);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setCollectedItems(0);
    setFeedback(null);
    setSelectedOption(null);
    setShowHint(false);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  // Render Specialized Interactive Stage based on ActionVisualType
  const renderInteractiveStage = () => {
    const isActionActive = animatingAction || feedback?.isCorrect;

    // 1. CHỦ ĐỀ 9: ĐỒNG HỒ THÔNG MINH (CLOCK_MASTER)
    if (game.actionVisualType === 'clock') {
      const matchHour = currentRound.question.match(/(\d+)\s*giờ/);
      const targetHour = matchHour ? parseInt(matchHour[1], 10) : (currentIdx + 7);

      return (
        <div className="relative w-full py-5 rounded-3xl bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 border-2 border-sky-200 shadow-inner flex flex-col items-center justify-between p-4">
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-xs font-black text-sky-900 bg-white/90 px-3 py-1 rounded-full border border-sky-100 shadow-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Chìa khóa thời gian: <b className="text-amber-600">{collectedItems}</b> / {game.rounds.length}</span>
            </span>
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
              +{score} điểm
            </span>
          </div>

          <div className={`transition-all duration-500 my-1 ${isActionActive ? 'scale-110 ring-8 ring-amber-300 rounded-full' : ''}`}>
            <MathSVG
              illustration={{
                type: 'clock_face',
                data: { hour: targetHour }
              }}
              className="p-1 border-0 bg-transparent shadow-none"
            />
          </div>

          <div className="text-center mt-2">
            <span className="text-xs sm:text-sm font-black text-slate-800 bg-white/95 px-3 py-1 rounded-full shadow-xs border border-slate-200 inline-block">
              {isActionActive ? (currentRound.stageVisualHint || 'Chính xác rồi!') : 'Quan sát mặt đồng hồ'}
            </span>
          </div>
        </div>
      );
    }

    // 2. CHỦ ĐỀ 4: LẮP RÁP ROBOT 3D (BUILD_ROBOT)
    if (game.actionVisualType === 'robot') {
      return (
        <div className="relative w-full py-5 rounded-3xl bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 border-2 border-purple-200 shadow-inner flex flex-col items-center justify-between p-4">
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-xs font-black text-purple-900 bg-white/90 px-3 py-1 rounded-full border border-purple-100 shadow-xs flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-purple-600" />
              <span>Khối đã lắp: <b className="text-purple-700">{collectedItems}</b> / {game.rounds.length} bộ phận</span>
            </span>
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
              +{score} điểm
            </span>
          </div>

          {/* Isometric Assembly Visual */}
          <div className={`transition-all duration-500 my-1 ${isActionActive ? 'scale-110' : ''}`}>
            {collectedItems <= 1 && (
              <MathSVG illustration={{ type: 'solids_3d', shape: 'cube' }} className="p-0 border-0 bg-transparent shadow-none" />
            )}
            {collectedItems >= 2 && (
              <MathSVG illustration={{ type: 'solids_3d', shape: 'cuboid' }} className="p-0 border-0 bg-transparent shadow-none" />
            )}
          </div>

          <div className="text-center mt-2">
            <span className="text-xs sm:text-sm font-black text-purple-900 bg-white/95 px-3 py-1 rounded-full shadow-xs border border-purple-200 inline-block">
              Khối lập phương & Khối hộp chữ nhật
            </span>
          </div>
        </div>
      );
    }

    // 3. CHỦ ĐỀ 9 (TIẾP TỤC): THÁM HIỂM LỊCH TUẦN (CALENDAR_EXPLORER)
    if (game.actionVisualType === 'calendar') {
      const matchDay = currentRound.question.match(/(Thứ [^\s,\.\?]+|Chủ [^\s,\.\?]+)/i);
      const dayLabel = matchDay ? matchDay[0] : (currentIdx % 2 === 0 ? 'Thứ Hai' : 'Thứ Sáu');

      return (
        <div className="relative w-full py-5 rounded-3xl bg-gradient-to-b from-sky-100 via-indigo-50 to-amber-50 border-2 border-sky-200 shadow-inner flex flex-col items-center justify-between p-4">
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-xs font-black text-sky-900 bg-white/90 px-3 py-1 rounded-full border border-sky-100 shadow-xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>Ngày lịch hoàn thành: <b className="text-sky-700">{collectedItems}</b> / {game.rounds.length}</span>
            </span>
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
              +{score} điểm
            </span>
          </div>

          <div className={`transition-all duration-500 my-1 ${isActionActive ? 'scale-105' : ''}`}>
            <MathSVG
              illustration={{
                type: 'calendar_page',
                data: {
                  dayName: dayLabel,
                  dayNumber: (currentIdx + 1) * 5,
                  month: 5,
                  year: 2026
                }
              }}
              className="p-0 border-0 bg-transparent shadow-none"
            />
          </div>

          <div className="text-center mt-2">
            <span className="text-xs sm:text-sm font-black text-slate-800 bg-white/95 px-3 py-1 rounded-full shadow-xs border border-slate-200 inline-block">
              Lịch tuần của bé
            </span>
          </div>
        </div>
      );
    }

    // 4. CHỦ ĐỀ 2: GHÉP TRANH HÌNH HỌC TANGRAM (SHAPE_TANGRAM)
    if (game.actionVisualType === 'tangram') {
      return (
        <div className="relative w-full py-5 rounded-3xl bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 border-2 border-amber-200 shadow-inner flex flex-col items-center justify-between p-4">
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-xs font-black text-amber-900 bg-white/90 px-3 py-1 rounded-full border border-amber-200 shadow-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Mảnh ghép đã lắp: <b className="text-amber-700">{collectedItems}</b> / {game.rounds.length}</span>
            </span>
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
              +{score} điểm
            </span>
          </div>

          <div className={`transition-all duration-500 my-1 ${isActionActive ? 'scale-105' : ''}`}>
            <MathSVG
              illustration={{
                type: 'shapes_composition',
                data: { mode: collectedItems < 3 ? 'two_triangles_square' : 'house' }
              }}
              className="p-0 border-0 bg-transparent shadow-none"
            />
          </div>

          <div className="text-center mt-2">
            <span className="text-xs sm:text-sm font-black text-amber-950 bg-white/95 px-3 py-1 rounded-full shadow-xs border border-amber-200 inline-block">
              Ghép hình học phẳng
            </span>
          </div>
        </div>
      );
    }

    // 5. CHỦ ĐỀ 7 & 10: THƯỚC KẺ ĐO ĐỘ DÀI (RULER_MEASUREMENT)
    if (game.actionVisualType === 'ruler') {
      const matchCm = currentRound.correctAnswer.match(/(\d+)\s*cm/);
      const measuredLen = matchCm ? parseInt(matchCm[1], 10) : 7;

      // Extract item from question
      const qLower = currentRound.question.toLowerCase();
      let itemType: 'eraser' | 'pencil' | 'clip' | 'ribbon' | 'segment' | 'crayon' = 'pencil';
      if (qLower.includes('tẩy')) {
        itemType = 'eraser';
      } else if (qLower.includes('bút chì')) {
        itemType = 'pencil';
      } else if (qLower.includes('kẹp ghim')) {
        itemType = 'clip';
      } else if (qLower.includes('ruy băng')) {
        itemType = 'ribbon';
      } else if (qLower.includes('đoạn thẳng') || qLower.includes('+') || qLower.includes('tính:')) {
        itemType = 'segment';
      } else if (qLower.includes('sáp') || qLower.includes('compa')) {
        itemType = 'crayon';
      }

      return (
        <div className="relative w-full py-4 rounded-3xl bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 border-2 border-amber-200 shadow-inner flex flex-col items-center justify-between p-4">
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-xs font-black text-amber-900 bg-white/90 px-3 py-1 rounded-full border border-amber-200 shadow-xs flex items-center gap-1.5">
              <span>📏 Vật đo chính xác: <b className="text-emerald-700">{collectedItems}</b> / {game.rounds.length}</span>
            </span>
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
              +{score} điểm
            </span>
          </div>

          <div className={`w-full flex justify-center transition-all duration-500 my-1 ${isActionActive ? 'scale-102 ring-4 ring-emerald-300 rounded-3xl' : ''}`}>
            <MathSVG
              illustration={{
                type: 'ruler_cm',
                data: {
                  lengthCm: measuredLen,
                  item: itemType,
                  startCm: 0
                }
              }}
              className="p-0 border-0 bg-transparent shadow-none"
            />
          </div>

          <div className="text-center mt-2">
            <span className="text-xs sm:text-sm font-black text-slate-800 bg-white/95 px-3 py-1 rounded-full shadow-xs border border-slate-200 inline-block">
              {isActionActive ? (currentRound.stageVisualHint || 'Chính xác rồi!') : 'Thước đo xăng-ti-mét (cm)'}
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-full h-48 sm:h-56 rounded-3xl bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 border-2 border-sky-200 overflow-hidden shadow-inner flex flex-col items-center justify-between p-4">
        <div className="w-full flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-sky-900 border border-sky-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Thành quả: <b className="text-amber-600 text-sm">{collectedItems}</b> / {game.rounds.length} {game.rewardNoun}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-100/90 px-2.5 py-1 rounded-full text-xs font-extrabold text-amber-800 border border-amber-200">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>+{score} điểm</span>
          </div>
        </div>

        <div className="relative my-auto flex flex-col items-center justify-center">
          <div className={`text-6xl sm:text-7xl transition-transform duration-500 select-none ${
            isActionActive ? 'scale-125 animate-bounce' : 'hover:scale-105'
          }`}>
            {game.icon}
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs sm:text-sm font-black text-slate-800 bg-white/95 px-3 py-1 rounded-full shadow-sm border border-slate-200 inline-block">
              {isActionActive ? (currentRound.stageVisualHint || 'Chính xác rồi!') : game.subtitle}
            </span>
          </div>

          {isActionActive && (
            <div className="absolute -top-6 animate-pulse text-3xl select-none">
              ✨⭐🎉
            </div>
          )}
        </div>

        <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-sky-100/80 z-10">
          {Array.from({ length: game.rounds.length }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300 ${
                i < collectedItems
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md scale-105 rotate-3'
                  : 'bg-white/80 border border-dashed border-sky-300 text-sky-400'
              }`}
            >
              {i < collectedItems ? '⭐' : i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Màn hình giới thiệu trước khi bấm Chơi
  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-sky-200 shadow-2xl text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-5xl shadow-lg shadow-indigo-500/20 animate-pulse">
          {game.icon}
        </div>

        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200 inline-block mb-2">
            Trò chơi #{game.num} · {game.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {game.title}
          </h2>
          <p className="text-base font-extrabold text-amber-600 mb-3">
            {game.subtitle}
          </p>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {game.desc}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-left max-w-lg mx-auto">
          <h4 className="text-xs font-extrabold text-sky-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> Cơ chế chơi nhận thành quả thực tế:
          </h4>
          <p className="text-xs font-bold text-sky-850 leading-relaxed">
            {game.mechanicDesc}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setIsPlaying(true);
            }}
            className={`px-8 py-3.5 rounded-2xl bg-gradient-to-r ${game.bgGradient} text-white font-black text-base shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2`}
          >
            BẮT ĐẦU CHƠI NGAY <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Màn hình kết thúc trò chơi (Game Over)
  if (isGameOver) {
    const isPerfect = correctCount === game.rounds.length;

    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white/95 rounded-3xl border-2 border-amber-300 shadow-2xl text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 flex items-center justify-center text-5xl shadow-xl animate-bounce">
          {isPerfect ? '👑' : '🏆'}
        </div>

        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200 inline-block mb-2">
            HOÀN THÀNH THỬ THÁCH
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {isPerfect ? 'XUẤT SẮC TUYỆT ĐỐI!' : 'BÉ ĐÃ VƯỢT QUA TRÒ CHƠI!'}
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            {isPerfect
              ? `Bé đã trả lời đúng tất cả ${game.rounds.length} câu hỏi và thu thập đủ trọn vẹn ${collectedItems} ${game.rewardNoun}!`
              : `Bé đã rất nỗ lực thu thập được ${collectedItems} / ${game.rounds.length} ${game.rewardNoun}!`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-700 block mb-1">Điểm số</span>
            <span className="text-3xl font-black text-amber-600">{score}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs font-bold text-emerald-700 block mb-1">Đúng câu</span>
            <span className="text-3xl font-black text-emerald-600">
              {correctCount} / {game.rounds.length}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Chơi lại
          </button>
          <button
            onClick={onBack}
            className={`px-8 py-3.5 rounded-xl bg-gradient-to-r ${game.bgGradient} text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2`}
          >
            Tiếp tục khám phá <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Màn hình khi đang chơi
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Thanh công cụ đỉnh: Nút quay lại, Tiến độ */}
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-sky-100 shadow-sm">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>

        {/* Thanh tiến độ */}
        <div className="flex-1 max-w-xs">
          <div className="flex items-center justify-between text-xs font-black text-slate-600 mb-1">
            <span>Câu {currentIdx + 1} / {game.rounds.length}</span>
            <span className="text-amber-600 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full bg-gradient-to-r ${game.bgGradient} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Chủ đề: {game.badge}
        </span>
      </div>

      {/* SÂN KHẤU HÀNH ĐỘNG THỰC TẾ 3D */}
      {renderInteractiveStage()}

      {/* Khung Câu Hỏi */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border-2 border-sky-200 shadow-md">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
            {currentRound.question}
          </h3>
          <button
            onClick={() => {
              soundManager.playPop();
              setShowHint(!showHint);
            }}
            className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
            title="Gợi ý"
          >
            <HelpCircle className="w-4 h-4" /> Gợi ý
          </button>
        </div>

        {/* Hộp gợi ý nếu mở (Hướng dẫn tư duy, tuyệt đối không lộ đáp án) */}
        {showHint && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-bold leading-relaxed flex items-start gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{(() => {
              const qLower = currentRound.question.toLowerCase();
              const ans = String(currentRound.correctAnswer).trim();

              if (qLower.includes('tẩy')) {
                return 'Bé hãy quan sát điểm đầu cục tẩy ở vạch 0 và nhìn xem điểm cuối chạm đúng vạch số mấy trên thước nhé!';
              }
              if (qLower.includes('bút chì')) {
                return 'Bé hãy quan sát điểm đầu bút chì ở vạch 0 và nhìn vạch số mà đầu nhọn bút chì chạm tới nhé!';
              }
              if (qLower.includes('xăng-ti-mét') || qLower.includes(' cm') || qLower.includes('thước')) {
                return 'Bé hãy nhìn kỹ vạch số trên thước kẻ tương ứng với độ dài của vật nhé!';
              }
              if (qLower.includes('giờ') || qLower.includes('đồng hồ')) {
                return 'Bé hãy nhìn kim ngắn chỉ vào số mấy và kim dài chỉ số 12 để đọc đúng giờ nhé!';
              }
              if (qLower.includes('thứ') || qLower.includes('tuần') || qLower.includes('ngày')) {
                return 'Bé hãy nhớ lại thứ tự các ngày trong tuần: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ nhật nhé!';
              }
              if (qLower.includes('hình vuông')) {
                return 'Con hãy tìm hình có 4 cạnh bằng nhau và 4 góc vuông nhé!';
              }
              if (qLower.includes('hình chữ nhật')) {
                return 'Con hãy tìm hình có 4 góc vuông và 2 cặp cạnh đối diện bằng nhau nhé!';
              }
              if (qLower.includes('hình tam giác')) {
                return 'Con hãy tìm hình có đúng 3 cạnh thẳng và 3 đỉnh nhọn nhé!';
              }
              if (qLower.includes('hình tròn')) {
                return 'Con hãy tìm hình tròn đều và không có góc nào nhé!';
              }
              if (qLower.includes('+') || qLower.includes('cộng') || qLower.includes('thêm')) {
                return 'Bé hãy giữ số thứ nhất trong đầu rồi đếm thêm từng bước để tìm kết quả nhé!';
              }
              if (qLower.includes('-') || qLower.includes('trừ') || qLower.includes('bớt')) {
                return 'Bé hãy lấy số ban đầu bớt đi và đếm lùi từng bước nhé!';
              }
              if (qLower.includes('liền sau')) {
                return 'Số liền sau là số ngay sau đó, lớn hơn 1 đơn vị nhé bé!';
              }
              if (qLower.includes('liền trước')) {
                return 'Số liền trước là số ngay phía trước, bé hơn 1 đơn vị nhé bé!';
              }

              if (currentRound.hint && !currentRound.hint.toLowerCase().includes(ans.toLowerCase())) {
                return currentRound.hint;
              }

              return 'Bé hãy quan sát thật kỹ câu hỏi và các phương án để chọn đáp án đúng nhé!';
            })()}</span>
          </div>
        )}

        {/* Các Lựa Chọn Đáp Án */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentRound.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isRight = feedback?.isCorrect && isSelected;
            const isWrong = feedback && !feedback.isCorrect && isSelected;

            const matchShape = (val: string) => {
              const norm = (val || '').trim().toLowerCase();
              if (norm === 'hình vuông') return 'square';
              if (norm === 'hình chữ nhật') return 'rectangle';
              if (norm === 'hình tam giác') return 'triangle';
              if (norm === 'hình tròn') return 'circle';
              return null;
            };
            const optShape = matchShape(opt);

            return (
              <button
                key={i}
                disabled={feedback !== null || animatingAction}
                onClick={() => handleOptionClick(opt)}
                className={`p-4 rounded-2xl text-base font-black transition-all text-left flex items-center justify-between border-2 shadow-sm ${
                  isRight
                    ? 'bg-emerald-500 text-white border-emerald-600 scale-102 shadow-lg shadow-emerald-500/20'
                    : isWrong
                    ? 'bg-rose-500 text-white border-rose-600 animate-shake'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300 active:scale-98'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    isRight || isWrong ? 'bg-white/20 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {optShape && (
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      <FlatShapeRenderer shape={optShape} size={28} />
                    </div>
                  )}
                  <span>{opt}</span>
                </div>

                {isRight && <CheckCircle className="w-5 h-5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thông báo kết quả và hành động nhận thành quả */}
      {feedback && (
        <div className={`p-4 rounded-2xl border-2 shadow-lg text-center transition-all animate-bounce ${
          feedback.isCorrect
            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <p className="font-black text-sm mb-1">{feedback.message}</p>
          <p className="font-extrabold text-xs text-slate-700">
            {feedback.actionText}
          </p>
        </div>
      )}
    </div>
  );
};
