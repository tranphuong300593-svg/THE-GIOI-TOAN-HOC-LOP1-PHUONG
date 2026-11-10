/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { FullscreenStage } from '../common/FullscreenStage';
import { Volume2, VolumeX, RotateCcw, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface GiantTurnipFarmGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface TurnipQuestion {
  id: number;
  titleVi: string;
  titleEn: string;
  promptVi: string;
  promptEn: string;
  options: (number | string)[];
  answer: number | string;
  progressPercent: number; // 20, 40, 60, 80, 100
  type: 'count_carrots' | 'add_apples' | 'sub_tomatoes' | 'compare_baskets' | 'sum_carrots';
}

const QUESTIONS: TurnipQuestion[] = [
  {
    id: 1,
    titleVi: 'Câu 1 – Đếm cà rốt',
    titleEn: 'Question 1 – Count carrots',
    promptVi: 'Có mấy củ cà rốt?',
    promptEn: 'How many carrots are there?',
    options: [4, 5, 6],
    answer: 5,
    progressPercent: 20,
    type: 'count_carrots',
  },
  {
    id: 2,
    titleVi: 'Câu 2 – Thêm táo vào giỏ',
    titleEn: 'Question 2 – Add apples to basket',
    promptVi: '3 + 2 = ?',
    promptEn: '3 + 2 = ?',
    options: [4, 5, 6],
    answer: 5,
    progressPercent: 40,
    type: 'add_apples',
  },
  {
    id: 3,
    titleVi: 'Câu 3 – Bán cà chua',
    titleEn: 'Question 3 – Sell tomatoes',
    promptVi: '8 − 3 = ?',
    promptEn: '8 - 3 = ?',
    options: [4, 5, 6],
    answer: 5,
    progressPercent: 60,
    type: 'sub_tomatoes',
  },
  {
    id: 4,
    titleVi: 'Câu 4 – So sánh hai giỏ',
    titleEn: 'Question 4 – Compare two baskets',
    promptVi: 'Giỏ nào nhiều hơn?',
    promptEn: 'Which basket has more?',
    options: ['Giỏ A', 'Giỏ B', 'Bằng nhau'],
    answer: 'Giỏ A',
    progressPercent: 80,
    type: 'compare_baskets',
  },
  {
    id: 5,
    titleVi: 'Câu 5 – Thu hoạch đủ hàng',
    titleEn: 'Question 5 – Harvest enough goods',
    promptVi: '6 + 4 = ?',
    promptEn: '6 + 4 = ?',
    options: [8, 9, 10],
    answer: 10,
    progressPercent: 100,
    type: 'sum_carrots',
  },
];

const CORRECT_PRAISES = ['Great job!', 'Excellent!', 'Well done!', 'Amazing!'];
const WRONG_ENCOURAGEMENTS = ['Try again!', 'Almost there!', 'You can do it!'];

function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

export const GiantTurnipFarmGame: React.FC<GiantTurnipFarmGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  // Game lifecycle
  const [hasStarted, setHasStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Turnip pulling animation states
  const [turnipLevel, setTurnipLevel] = useState(0); // 0 (0%), 1 (20%), 2 (40%), 3 (60%), 4 (80%), 5 (100%)
  const [isPulling, setIsPulling] = useState(false);
  const [isFallen, setIsFallen] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<(number | string)[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [wrongOption, setWrongOption] = useState<number | string | null>(null);

  const [startTime] = useState(Date.now());

  const currentQ = QUESTIONS[qIndex];

  // Shuffle options on question change
  useEffect(() => {
    if (currentQ) {
      setCurrentOptions(shuffle(currentQ.options));
      setSelectedOption(null);
      setWrongOption(null);
    }
  }, [qIndex]);

  const handleStart = () => {
    soundService.playClick();
    if (!isMuted) {
      soundService.playMagicChime();
    }
    setHasStarted(true);
  };

  const handleSelectOption = (opt: number | string) => {
    if (isPulling || isCompleted) return;

    soundService.playClick();

    if (String(opt).trim().toLowerCase() === String(currentQ.answer).trim().toLowerCase()) {
      // --- CORRECT ANSWER ---
      setSelectedOption(opt);
      setWrongOption(null);
      setIsPulling(true);

      const nextLevel = qIndex + 1;

      // Play SFX & Speech
      if (!isMuted) {
        soundService.playMagicChime();
        soundService.playCorrect();
        const praise = CORRECT_PRAISES[Math.floor(Math.random() * CORRECT_PRAISES.length)];
        soundService.speakEn(praise);
      }

      // If final level 5, trigger tumble & truck
      if (nextLevel === 5) {
        setTimeout(() => {
          setTurnipLevel(5);
          setIsFallen(true);
          soundService.playVictory();
        }, 600);

        setTimeout(() => {
          triggerVictory();
        }, 1800);
      } else {
        // Levels 1 to 4: Turnip emerges to next height milestone
        setTimeout(() => {
          setTurnipLevel(nextLevel);
        }, 500);

        // Auto-advance to next question after pull completes
        setTimeout(() => {
          setIsPulling(false);
          setQIndex((prev) => prev + 1);
        }, 1400);
      }
    } else {
      // --- WRONG ANSWER ---
      setWrongOption(opt);
      if (!isMuted) {
        soundService.playIncorrect();
        const encourage = WRONG_ENCOURAGEMENTS[Math.floor(Math.random() * WRONG_ENCOURAGEMENTS.length)];
        soundService.speakEn(encourage);
      }

      // Allow retry after 600ms
      setTimeout(() => {
        setWrongOption(null);
      }, 700);
    }
  };

  const triggerVictory = () => {
    setIsCompleted(true);
    setIsPulling(false);
    if (!isMuted) {
      soundService.speakEn('Congratulations! You did it!');
      soundService.playApplause();
    }
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });

    // Record activity in StorageService
    StorageService.recordActivity(student.id, {
      type: 'game',
      targetId: 'giant-turnip-farm',
      targetName: 'Nông Trại Nhổ Củ Cải',
      score: 5,
      totalQuestions: 5,
      starsEarned: 25,
      timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
    });

    const updated = StorageService.getCurrentStudent();
    if (updated) onUpdateStudent(updated);
  };

  const handleRestart = () => {
    soundService.playClick();
    setQIndex(0);
    setTurnipLevel(0);
    setIsPulling(false);
    setIsFallen(false);
    setIsCompleted(false);
    setSelectedOption(null);
    setWrongOption(null);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
    soundService.playClick();
  };

  const handleSpeakQuestion = () => {
    soundService.cancelSpeech();
    soundService.speakEn(currentQ.promptEn);
  };

  // Turnip vertical translation offset according to level
  // 0: +72px (buried deep, only top leaves)
  // 1: +54px (20%)
  // 2: +36px (40%)
  // 3: +18px (60%)
  // 4: +4px (80%)
  // 5: -60px (100% pops out completely)
  const getTurnipTranslateY = () => {
    switch (turnipLevel) {
      case 0:
        return 'translate-y-[72px]';
      case 1:
        return 'translate-y-[54px]';
      case 2:
        return 'translate-y-[36px]';
      case 3:
        return 'translate-y-[18px]';
      case 4:
        return 'translate-y-[4px]';
      case 5:
        return '-translate-y-[65px] rotate-12 scale-110';
      default:
        return 'translate-y-[72px]';
    }
  };

  return (
    <FullscreenStage
      titleVi="NÔNG TRẠI NHỔ CỦ CẢI THẦN KỲ"
      titleEn="Magic Giant Turnip Farm"
      categoryBadge="Khu 5: Siêu Thị Toán Học"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-1.5 sm:gap-2">
          {hasStarted && !isCompleted && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded-xl font-black text-xs">
              Nhiệm vụ {qIndex + 1} / 5
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {hasStarted && (
            <button
              type="button"
              onClick={handleRestart}
              title="Làm lại từ đầu"
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      }
    >
      {!hasStarted ? (
        /* --- 1. WELCOME SCREEN (Direct Start - No Level Selection) --- */
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col items-center justify-between p-3 sm:p-5 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-100 text-center select-none overflow-hidden">
          {/* Header */}
          <div className="pt-1">
            <span className="text-4xl sm:text-5xl animate-bounce inline-block mb-1">🌱👨‍🌾👵👧🐶🐱🐭</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 font-heading tracking-tight">
              NÔNG TRẠI NHỔ CỦ CẢI THẦN KỲ
            </h2>
            <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5">
              Cùng cả gia đình thu hoạch củ cải khổng lồ để mang đến Siêu Thị Toán Học!
            </p>
          </div>

          {/* Reference Image Artwork Showcase */}
          <div className="relative w-full max-w-md aspect-video max-h-[220px] rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300 bg-white">
            <img
              src="/assets/aistudio/nh__ccai_a21d831c.png"
              alt="Cả gia đình cùng nhổ củ cải"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-2">
              <span className="text-xs sm:text-sm font-black text-yellow-200 drop-shadow">
                5 Nhiệm vụ toán · Nhổ củ cải 100% · Mang đến Siêu thị 🛒
              </span>
            </div>
          </div>

          {/* Start Action */}
          <div className="pb-2">
            <button
              type="button"
              onClick={handleStart}
              className="px-8 py-3.5 sm:px-12 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-600 hover:from-emerald-600 hover:to-amber-600 text-white font-black text-base sm:text-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3 border-2 border-yellow-200"
            >
              <span>BẮT ĐẦU NHỔ CỦ CẢI 🌱</span>
            </button>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1.5">
              Đếm số lượng · Phép cộng trừ · So sánh nhiều hơn
            </p>
          </div>
        </div>
      ) : !isCompleted ? (
        /* --- 2. MAIN GAME SCREEN (Strict 16:9 - Layered Pulling Arena & Question) --- */
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col justify-between overflow-hidden select-none p-1 sm:p-2 bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100">
          
          {/* TOP SECTION: Pull Progress Milestones (10% Height) */}
          <div className="h-[10%] flex items-center justify-between bg-white/95 backdrop-blur-xs px-3 sm:px-4 py-1 rounded-2xl border border-amber-300 shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🌱</span>
              <span className="text-xs sm:text-sm font-black text-emerald-950">
                Tiến độ nhổ củ cải:
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-600">
                {turnipLevel * 20}%
              </span>
            </div>

            {/* 5-Step Visual Progress Bar */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => {
                const reached = turnipLevel >= lvl;
                return (
                  <div
                    key={lvl}
                    className={`h-2.5 sm:h-3 rounded-full transition-all ${
                      reached
                        ? 'w-7 sm:w-10 bg-gradient-to-r from-emerald-500 to-amber-500 shadow-xs'
                        : 'w-4 sm:w-6 bg-slate-200'
                    }`}
                    title={`Mốc ${lvl * 20}%`}
                  />
                );
              })}
            </div>
          </div>

          {/* MIDDLE SECTION: Layered Interactive Arena (62% Height) */}
          <div className="h-[62%] relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 border-amber-300 bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-200 select-none flex items-center justify-center p-2 shrink-0">
            
            {/* Layer 1: Farm Backdrop (Cottage, Sunflowers, Sky) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <img
                src="/assets/aistudio/nh__ccai_a21d831c.png"
                alt="Fairytale Farm Background"
                className="w-full h-full object-cover filter blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-sky-400/20" />
            </div>

            {/* Heave-Ho Speech Bubble when Pulling */}
            {isPulling && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-white/95 text-amber-950 font-black px-4 py-1.5 rounded-full border-2 border-amber-400 shadow-lg text-xs sm:text-sm animate-bounce flex items-center gap-1.5">
                <span>💨</span>
                <span>“1, 2, 3... KÉO NÀO! HÂY DÔ! HÂY DÔ!”</span>
                <span>💦</span>
              </div>
            )}

            {/* Layer 2 & 3: Giant Turnip & Earthen Mound */}
            <div className="relative w-full max-w-3xl h-full flex items-end justify-between px-4 sm:px-8 pb-3 z-10">
              
              {/* THE GIANT TURNIP ASSEMBLY (Left Side) */}
              <div className="relative w-36 sm:w-44 md:w-52 flex flex-col items-center">
                {/* Turnip Body with sliding transform */}
                <div
                  className={`relative transition-transform duration-700 ease-out z-10 ${getTurnipTranslateY()} ${
                    isPulling ? 'animate-shake' : ''
                  }`}
                >
                  {/* Lush Green Leafy Tops */}
                  <div className="flex items-end justify-center -mb-2 relative z-10">
                    <span className="text-4xl sm:text-5xl md:text-6xl filter drop-shadow -mr-3 transform -rotate-12">
                      🥬
                    </span>
                    <span className="text-5xl sm:text-6xl md:text-7xl filter drop-shadow transform">
                      🌿
                    </span>
                    <span className="text-4xl sm:text-5xl md:text-6xl filter drop-shadow -ml-3 transform rotate-12">
                      🥬
                    </span>
                  </div>

                  {/* Plump Round Turnip Root SVG */}
                  <svg
                    viewBox="0 0 100 90"
                    className="w-28 sm:w-36 md:w-42 drop-shadow-2xl select-none"
                  >
                    <defs>
                      <radialGradient id="turnipGrad" cx="40%" cy="30%" r="65%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="60%" stopColor="#fdf4ff" />
                        <stop offset="85%" stopColor="#f5d0fe" />
                        <stop offset="100%" stopColor="#e879f9" />
                      </radialGradient>
                    </defs>
                    {/* Turnip Root Body */}
                    <path
                      d="M50,8 C22,8 10,35 12,58 C14,75 35,88 50,88 C65,88 86,75 88,58 C90,35 78,8 50,8 Z"
                      fill="url(#turnipGrad)"
                      stroke="#d946ef"
                      strokeWidth="1.5"
                    />
                    {/* Cute rosy blush */}
                    <circle cx="34" cy="46" r="6" fill="#f472b6" opacity="0.4" />
                    <circle cx="66" cy="46" r="6" fill="#f472b6" opacity="0.4" />
                    {/* Delicate Root Tip */}
                    <path
                      d="M50,88 Q48,94 52,98"
                      stroke="#c084fc"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Earthen Soil Mound (`Lớp đất che thân củ cải`) in front */}
                <div className="absolute -bottom-2 w-44 sm:w-56 md:w-64 h-18 sm:h-22 bg-gradient-to-t from-amber-950 via-amber-900 to-amber-800 rounded-t-3xl border-t-4 border-amber-700 shadow-2xl z-20 flex flex-col justify-start items-center pt-1 overflow-hidden">
                  {/* Grass & Wildflower Sprigs on Top of Soil */}
                  <div className="w-full flex items-center justify-around text-xs sm:text-sm text-emerald-400">
                    <span>🌱</span>
                    <span>🌸</span>
                    <span>🌿</span>
                    <span>🌼</span>
                    <span>🌱</span>
                  </div>
                  {/* Cracks in Soil when Pulling */}
                  {isPulling && (
                    <div className="text-amber-300 text-xs font-black animate-pulse flex items-center gap-1 mt-1">
                      <span>💥 RẮC! RẮC!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* THE PULLING FAMILY CHAIN (Right Side - 6 Characters) */}
              <div
                className={`relative flex items-end gap-0.5 sm:gap-1 z-30 transition-all duration-300 ${
                  isPulling ? '-rotate-6 translate-x-3 scale-102' : ''
                } ${isFallen ? 'rotate-12 translate-y-3' : ''}`}
              >
                {/* 1. Ông (Grandpa) */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow transform group-hover:scale-105">
                    👴
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-amber-950 bg-amber-100/90 px-1 rounded-sm">
                    Ông
                  </span>
                </div>

                {/* 2. Bà (Grandma) */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow">
                    👵
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-purple-950 bg-purple-100/90 px-1 rounded-sm">
                    Bà
                  </span>
                </div>

                {/* 3. Cháu gái (Little Girl) */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow">
                    👧
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-pink-950 bg-pink-100/90 px-1 rounded-sm">
                    Cháu
                  </span>
                </div>

                {/* 4. Chó cún (Dog) */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow">
                    🐕
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-yellow-950 bg-yellow-100/90 px-1 rounded-sm">
                    Cún
                  </span>
                </div>

                {/* 5. Mèo con (Cat) */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow">
                    🐱
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-800 bg-slate-100/90 px-1 rounded-sm">
                    Mèo
                  </span>
                </div>

                {/* 6. Chuột nhắt (Mouse) */}
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl md:text-3xl filter drop-shadow">
                    🐭
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-blue-950 bg-blue-100/90 px-1 rounded-sm">
                    Chuột
                  </span>
                </div>
              </div>

              {/* Delivery Truck arriving on Victory */}
              {turnipLevel === 5 && (
                <div className="absolute top-2 right-4 z-40 bg-white/95 p-2 rounded-2xl border-2 border-emerald-400 shadow-xl flex items-center gap-2 animate-bounce">
                  <span className="text-3xl">🚚</span>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Xe chở củ cải đến</div>
                    <div className="text-xs font-black text-emerald-700">SIÊU THỊ TOÁN HỌC 🛒</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM SECTION: Question Visual & 3 Choice Buttons (28% Height) */}
          <div className="h-[28%] bg-white/95 backdrop-blur-xs rounded-2xl p-2 sm:p-2.5 border border-amber-300 shadow-xs flex flex-col justify-between shrink-0">
            
            {/* Question Text Line with English pronunciation button */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                  {currentQ.titleVi}
                </span>
                <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 truncate">
                  {currentQ.promptVi}
                </span>
              </div>

              {/* English Audio Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-slate-500 font-semibold hidden md:inline">
                  {currentQ.promptEn}
                </span>
                <button
                  type="button"
                  onClick={handleSpeakQuestion}
                  className="p-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1 text-[11px] font-bold"
                  title="Nghe phát âm tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Phát âm 🔊</span>
                </button>
              </div>
            </div>

            {/* Question Visual Container (Count, Add, Subtract, Compare) */}
            <div className="flex-1 min-h-0 flex items-center justify-center my-0.5">
              {/* Question 1: Count exactly 5 carrots */}
              {currentQ.type === 'count_carrots' && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 bg-amber-50/80 px-3 py-1 rounded-xl border border-amber-200">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="flex flex-col items-center">
                      <span className="text-2xl sm:text-3xl filter drop-shadow">🥕</span>
                      <span className="text-[10px] font-black text-amber-900 bg-white px-1.5 rounded-full border border-amber-300 shadow-2xs">
                        {num}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Question 2: Add 3 apples + 2 apples */}
              {currentQ.type === 'add_apples' && (
                <div className="flex items-center justify-center gap-2 sm:gap-4 bg-rose-50/80 px-3 py-1 rounded-xl border border-rose-200">
                  {/* Group 1: 3 apples */}
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-rose-200">
                    <span className="text-2xl filter drop-shadow">🍎</span>
                    <span className="text-2xl filter drop-shadow">🍎</span>
                    <span className="text-2xl filter drop-shadow">🍎</span>
                    <span className="text-xs font-black text-rose-700 ml-1">3 quả</span>
                  </div>

                  <span className="text-lg font-black text-rose-600">➕</span>

                  {/* Group 2: 2 apples */}
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                    <span className="text-2xl filter drop-shadow">🍏</span>
                    <span className="text-2xl filter drop-shadow">🍏</span>
                    <span className="text-xs font-black text-emerald-700 ml-1">2 quả</span>
                  </div>
                </div>
              )}

              {/* Question 3: 8 tomatoes - 3 tomatoes */}
              {currentQ.type === 'sub_tomatoes' && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 bg-red-50/80 px-3 py-1 rounded-xl border border-red-200">
                  <div className="flex items-center gap-1">
                    {/* 5 remaining */}
                    <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-red-300">
                      <span className="text-2xl">🍅</span>
                      <span className="text-2xl">🍅</span>
                      <span className="text-2xl">🍅</span>
                      <span className="text-2xl">🍅</span>
                      <span className="text-2xl">🍅</span>
                      <span className="text-xs font-black text-red-600 ml-1">Còn lại</span>
                    </div>

                    <span className="text-sm font-black text-slate-400 mx-1">|</span>

                    {/* 3 sold into bag */}
                    <div className="flex items-center gap-1 bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-300 opacity-60">
                      <span className="text-2xl line-through">🍅</span>
                      <span className="text-2xl line-through">🍅</span>
                      <span className="text-2xl line-through">🍅</span>
                      <span className="text-[10px] font-black text-amber-900 ml-1">Đã bán 3</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Question 4: Compare Basket A (6 oranges) vs Basket B (4 oranges) */}
              {currentQ.type === 'compare_baskets' && (
                <div className="flex items-center justify-center gap-4 sm:gap-8 bg-orange-50/80 px-4 py-1 rounded-xl border border-orange-200">
                  {/* Basket A: 6 oranges */}
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border-2 border-orange-400 shadow-xs">
                    <div className="text-left">
                      <div className="text-xs font-black text-orange-950">Giỏ A</div>
                      <div className="text-[10px] font-bold text-orange-600">6 quả cam</div>
                    </div>
                    <div className="flex items-center gap-0.5 text-xl">
                      <span>🍊</span><span>🍊</span><span>🍊</span>
                      <span>🍊</span><span>🍊</span><span>🍊</span>
                    </div>
                  </div>

                  <span className="text-sm font-black text-slate-400">VS</span>

                  {/* Basket B: 4 oranges */}
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border-2 border-slate-300 shadow-xs">
                    <div className="text-left">
                      <div className="text-xs font-black text-slate-800">Giỏ B</div>
                      <div className="text-[10px] font-bold text-slate-500">4 quả cam</div>
                    </div>
                    <div className="flex items-center gap-0.5 text-xl">
                      <span>🍊</span><span>🍊</span><span>🍊</span><span>🍊</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Question 5: Sum 6 carrots + 4 carrots = 10 */}
              {currentQ.type === 'sum_carrots' && (
                <div className="flex items-center justify-center gap-3 sm:gap-6 bg-emerald-50/80 px-4 py-1 rounded-xl border border-emerald-200">
                  {/* Crate A: 6 */}
                  <div className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300">
                    <span className="text-xs font-black text-emerald-800 mr-1">6 củ:</span>
                    <span className="text-xl">🥕🥕🥕🥕🥕🥕</span>
                  </div>

                  <span className="text-base font-black text-emerald-700">➕</span>

                  {/* Crate B: 4 */}
                  <div className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300">
                    <span className="text-xs font-black text-amber-800 mr-1">4 củ:</span>
                    <span className="text-xl">🥕🥕🥕🥕</span>
                  </div>
                </div>
              )}
            </div>

            {/* THREE CHOICE BUTTONS (Clean, Large, Mouse & Touch friendly) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
              {currentOptions.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isWrong = wrongOption === opt;

                return (
                  <button
                    key={`${qIndex}-${idx}-${opt}`}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    disabled={isPulling}
                    className={`h-11 sm:h-13 rounded-2xl font-black text-base sm:text-xl transition-all cursor-pointer flex items-center justify-center active:scale-95 border-2 shadow-xs ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-102'
                        : isWrong
                        ? 'bg-rose-100 text-rose-950 border-rose-400 ring-2 ring-rose-300 animate-shake'
                        : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200 hover:border-emerald-400 hover:shadow-md'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 ml-2 text-white animate-scaleIn" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* --- 3. VICTORY SCREEN --- */
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-100 text-center select-none overflow-hidden">
          {/* Confetti & Castle Harvest Emojis */}
          <div className="text-5xl sm:text-6xl animate-bounce mb-2">
            🎉🌱🥕🚚✨
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 font-heading mb-1">
            HOAN HÔ BÉ!
          </h3>
          <h4 className="text-base sm:text-xl md:text-2xl font-black text-amber-600 mb-1">
            THU HOẠCH THÀNH CÔNG!
          </h4>
          <p className="text-xs sm:text-sm font-bold text-emerald-800 mb-4">
            “Congratulations! You did it!” Củ cải khổng lồ đã được chở đến Siêu Thị Toán Học!
          </p>

          {/* Character Celebration Row */}
          <div className="flex items-center justify-center gap-3 text-3xl sm:text-4xl bg-white/90 p-3 rounded-2xl border-2 border-amber-300 shadow-md mb-5">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>👴</span>
            <span className="animate-bounce" style={{ animationDelay: '100ms' }}>👵</span>
            <span className="animate-bounce" style={{ animationDelay: '200ms' }}>👧</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🐕</span>
            <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🐱</span>
            <span className="animate-bounce" style={{ animationDelay: '500ms' }}>🐭</span>
            <span className="text-4xl sm:text-5xl">🌱</span>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md w-full mb-5">
            <div className="bg-white p-2.5 rounded-2xl border border-emerald-200 shadow-xs">
              <div className="text-2xl">🌱</div>
              <div className="text-[11px] text-slate-500 font-bold">Củ cải</div>
              <div className="text-base font-black text-emerald-600">100% Thu hoạch</div>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-amber-200 shadow-xs">
              <div className="text-2xl">⭐</div>
              <div className="text-[11px] text-slate-500 font-bold">Ngôi sao</div>
              <div className="text-base font-black text-yellow-500">+25 Sao</div>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-orange-200 shadow-xs">
              <div className="text-2xl">🎖️</div>
              <div className="text-[11px] text-slate-500 font-bold">Huy hiệu</div>
              <div className="text-xs font-black text-amber-600 truncate">Nông Dân Thu Hoạch</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-600 hover:to-amber-600 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-yellow-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHƠI LẠI</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-sm sm:text-base shadow-sm hover:shadow-md border border-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>QUAY LẠI</span>
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
