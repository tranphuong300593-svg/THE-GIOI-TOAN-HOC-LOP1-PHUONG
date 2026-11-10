/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { soundService } from '../../services/audioService';
import { StorageService } from '../../services/storageService';
import confetti from 'canvas-confetti';
import { FullscreenStage } from '../common/FullscreenStage';
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
  Play,
  Volume2,
  Heart,
  Carrot
} from 'lucide-react';

interface RadishFarmGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface RadishTask {
  id: number;
  expression: string;
  answer: number;
  options: number[];
  radishType: 'normal' | 'big' | 'giant' | 'golden' | 'rainbow';
  titleVi: string;
  titleEn: string;
}

export const RadishFarmGame: React.FC<RadishFarmGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
  const [taskIndex, setTaskIndex] = useState(0);
  const [tasks, setTasks] = useState<RadishTask[]>([]);
  const [selectedBasket, setSelectedBasket] = useState<number | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pulledSuccess, setPulledSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [starsEarned, setStarsEarned] = useState(0);

  // Generate 5 tasks based on difficulty
  const generateTasks = (diff: Difficulty): RadishTask[] => {
    const list: RadishTask[] = [];
    const types: RadishTask['radishType'][] = ['normal', 'normal', 'big', 'giant', 'golden'];

    for (let i = 0; i < 5; i++) {
      let a = 1;
      let b = 1;
      let isAdd = Math.random() > 0.4;
      let answer = 2;
      let expr = '';

      if (diff === 'easy') {
        // Up to 5
        if (isAdd) {
          a = Math.floor(Math.random() * 3) + 1; // 1..3
          b = Math.floor(Math.random() * (5 - a)) + 1;
          answer = a + b;
          expr = `${a} + ${b}`;
        } else {
          a = Math.floor(Math.random() * 4) + 2; // 2..5
          b = Math.floor(Math.random() * a) + 1;
          answer = a - b;
          expr = `${a} - ${b}`;
        }
      } else if (diff === 'medium') {
        // Up to 10
        if (isAdd) {
          a = Math.floor(Math.random() * 6) + 1; // 1..6
          b = Math.floor(Math.random() * (10 - a)) + 1;
          answer = a + b;
          expr = `${a} + ${b}`;
        } else {
          a = Math.floor(Math.random() * 8) + 3; // 3..10
          b = Math.floor(Math.random() * a) + 1;
          answer = a - b;
          expr = `${a} - ${b}`;
        }
      } else {
        // Within 100 (tens & 2-digits, no carry)
        const isTens = Math.random() > 0.5;
        if (isTens) {
          if (isAdd) {
            const tenA = (Math.floor(Math.random() * 5) + 1) * 10;
            const tenB = (Math.floor(Math.random() * (9 - tenA / 10)) + 1) * 10;
            answer = tenA + tenB;
            expr = `${tenA} + ${tenB}`;
          } else {
            const tenA = (Math.floor(Math.random() * 6) + 4) * 10;
            const tenB = (Math.floor(Math.random() * (tenA / 10 - 1)) + 1) * 10;
            answer = tenA - tenB;
            expr = `${tenA} - ${tenB}`;
          }
        } else {
          // 2-digit without carry
          const t1 = Math.floor(Math.random() * 4) + 2; // tens 2..5
          const u1 = Math.floor(Math.random() * 5) + 2; // units 2..6
          if (isAdd) {
            const t2 = Math.floor(Math.random() * 3) + 1;
            const u2 = Math.floor(Math.random() * (9 - u1));
            const num1 = t1 * 10 + u1;
            const num2 = t2 * 10 + u2;
            answer = num1 + num2;
            expr = `${num1} + ${num2}`;
          } else {
            const t2 = Math.floor(Math.random() * (t1 - 1)) + 1;
            const u2 = Math.floor(Math.random() * u1);
            const num1 = t1 * 10 + u1;
            const num2 = t2 * 10 + u2;
            answer = num1 - num2;
            expr = `${num1} - ${num2}`;
          }
        }
      }

      // Generate 3 options (1 correct, 2 distractors)
      const opts = new Set<number>([answer]);
      while (opts.size < 3) {
        let offset = (Math.random() > 0.5 ? 1 : -1) * (diff === 'hard' ? (Math.random() > 0.5 ? 10 : 2) : (Math.floor(Math.random() * 3) + 1));
        let candidate = answer + offset;
        if (candidate >= 0 && candidate !== answer) {
          opts.add(candidate);
        }
      }

      const shuffledOpts = Array.from(opts).sort(() => Math.random() - 0.5);

      const radTitles = [
        { vi: 'Luống 1: Củ cải trắng nhỏ xinh', en: 'Plot 1: Sweet Little Radish' },
        { vi: 'Luống 2: Củ cải tím giòn ngọt', en: 'Plot 2: Crunchy Purple Radish' },
        { vi: 'Luống 3: Củ cải to béo tốt', en: 'Plot 3: Big Plump Radish' },
        { vi: 'Luống 4: Củ cải khổng lồ kỳ diệu', en: 'Plot 4: Giant Magic Radish' },
        { vi: 'Luống 5: CỦ CẢI HOÀNG KIM VÔ ĐỊCH!', en: 'Plot 5: GOLDEN RADISH MASTER!' },
      ];

      list.push({
        id: i + 1,
        expression: expr,
        answer,
        options: shuffledOpts,
        radishType: types[i],
        titleVi: radTitles[i].vi,
        titleEn: radTitles[i].en,
      });
    }

    return list;
  };

  const handleStartGame = (diff: Difficulty) => {
    soundService.playClick();
    setDifficulty(diff);
    const newTasks = generateTasks(diff);
    setTasks(newTasks);
    setTaskIndex(0);
    setSelectedBasket(null);
    setIsPulling(false);
    setPulledSuccess(false);
    setShowHint(false);
    setFeedback(null);
    setGameState('playing');
  };

  const currentTask = tasks[taskIndex];

  const handleSelectBasket = (basketVal: number) => {
    if (pulledSuccess || isPulling) return;
    soundService.playClick();
    setSelectedBasket(basketVal);
    setShowHint(false);

    if (basketVal === currentTask.answer) {
      // Correct! Trigger radish pulling animation
      setIsPulling(true);
      soundService.playCorrect();
      setFeedback('Bé chọn đúng rồi! Đang nhổ củ cải lên nào!');

      setTimeout(() => {
        setIsPulling(false);
        setPulledSuccess(true);
        soundService.playApplause();
        setStarsEarned((prev) => prev + 1);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });

        // American English cheer
        const praises = ['Great job!', 'Awesome!', 'Delicious radish!', 'You did it!'];
        const p = praises[Math.floor(Math.random() * praises.length)];
        soundService.speakEn(p);
      }, 1200);
    } else {
      // Wrong
      soundService.playIncorrect();
      setFeedback('Chưa đúng rồi! Bé hãy đếm lại để chọn giỏ có kết quả đúng nhé!');
      setShowHint(true);
    }
  };

  const handleNextTask = () => {
    soundService.playClick();
    if (taskIndex < 4) {
      setTaskIndex((prev) => prev + 1);
      setSelectedBasket(null);
      setIsPulling(false);
      setPulledSuccess(false);
      setShowHint(false);
      setFeedback(null);
    } else {
      // Finish 5 tasks!
      setGameState('victory');
      soundService.playVictory();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
      StorageService.recordActivity(student.id, {
        type: 'game',
        targetId: 'radish-farm',
        targetName: 'Nông Trại Nhổ Củ Cải Thần Kỳ',
        score: 5,
        totalQuestions: 5,
        starsEarned: 20,
        timeSpentSeconds: 60,
      });
      const updated = StorageService.getCurrentStudent();
      if (updated) onUpdateStudent(updated);
    }
  };

  return (
    <FullscreenStage
      titleVi="Nông Trại Nhổ Củ Cải Thần Kỳ"
      titleEn="Magic Radish Farm Adventure"
      onBack={onBack}
      categoryBadge="Khu Rừng Phép Tính"
    >
      {/* Intro Screen */}
      {gameState === 'intro' && (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-5xl shadow-xl border-4 border-white mb-4 animate-bounce">
            🥕
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            Nông Trại Nhổ Củ Cải Thần Kỳ
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md">
            Mỗi củ cải trong vườn mang một phép tính bí ẩn. Bé hãy tính đúng kết quả và chọn giỏ tương ứng để giúp thỏ con nhổ củ cải khổng lồ vào giỏ nhé!
          </p>

          <div className="w-full bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-emerald-100 shadow-md mb-6">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
              Chọn mức độ thử thách:
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleStartGame('easy')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-green-400 to-emerald-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>🌱 DỄ</span>
                <span className="text-[10px] opacity-90">Phạm vi 5</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartGame('medium')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-amber-400 to-orange-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>🥕 VỪA</span>
                <span className="text-[10px] opacity-90">Phạm vi 10</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartGame('hard')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>⭐ THỬ THÁCH</span>
                <span className="text-[10px] opacity-90">Phạm vi 100</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playing Screen */}
      {gameState === 'playing' && currentTask && (
        <div className="h-full flex flex-col justify-between p-2 sm:p-4 max-w-4xl mx-auto">
          {/* Top Bar: Progress & Plot Info */}
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐰</span>
              <div>
                <div className="text-xs sm:text-sm font-black text-emerald-900">
                  {currentTask.titleVi}
                </div>
                <div className="text-[10px] text-slate-500">
                  {langMode !== 'vi' && currentTask.titleEn}
                </div>
              </div>
            </div>

            {/* 5-step radish tracker */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    idx < taskIndex
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : idx === taskIndex
                      ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 scale-110 shadow-md'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {idx < taskIndex ? '✓' : idx + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Farm Stage Area */}
          <div className="relative flex-1 my-2 bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 rounded-3xl border-4 border-emerald-300/60 p-4 shadow-inner flex flex-col items-center justify-between overflow-hidden">
            {/* Background elements: Sun, clouds, wooden fence */}
            <div className="absolute top-2 left-6 text-3xl opacity-80 animate-pulse">☀️</div>
            <div className="absolute top-4 right-12 text-2xl opacity-60">☁️</div>
            <div className="absolute bottom-16 inset-x-0 h-4 border-t-2 border-dashed border-amber-600/30 flex justify-around opacity-40">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="text-xs">🪵</span>
              ))}
            </div>

            {/* Instruction banner */}
            <div className="bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full border border-emerald-200 shadow-xs text-center z-10">
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                🌱 Hãy tính phép tính trên củ cải và chọn giỏ có đáp án đúng:
              </span>
            </div>

            {/* Center: The Radish Mound with Animation */}
            <div className="relative flex flex-col items-center my-auto z-10">
              {/* Bunny helper */}
              <div
                className={`absolute -left-20 sm:-left-28 bottom-4 text-4xl sm:text-5xl transition-all duration-500 ${
                  isPulling
                    ? 'scale-110 -rotate-12 translate-x-2'
                    : pulledSuccess
                    ? 'scale-125 translate-y-[-10px] animate-bounce'
                    : 'hover:scale-105'
                }`}
              >
                🐰
                {pulledSuccess && (
                  <span className="absolute -top-4 -right-2 text-xl animate-ping">✨</span>
                )}
              </div>

              {/* Radish Plant */}
              <div
                className={`flex flex-col items-center transition-all duration-700 ${
                  isPulling
                    ? 'animate-bounce -translate-y-4'
                    : pulledSuccess
                    ? '-translate-y-24 scale-110 rotate-6 opacity-95'
                    : 'hover:scale-105'
                }`}
              >
                {/* Green Leaves */}
                <div className="flex gap-1 text-2xl sm:text-3xl animate-pulse">
                  <span>🌿</span>
                  <span>🌱</span>
                  <span>🌿</span>
                </div>

                {/* Radish Body with Math Problem */}
                <div
                  className={`relative px-6 py-4 rounded-3xl shadow-xl border-4 border-white flex flex-col items-center justify-center transition-all ${
                    currentTask.radishType === 'golden'
                      ? 'bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 text-slate-900 ring-4 ring-yellow-300 animate-pulse'
                      : currentTask.radishType === 'giant'
                      ? 'bg-gradient-to-b from-purple-400 via-pink-500 to-rose-500 text-white scale-110'
                      : 'bg-gradient-to-b from-orange-400 to-rose-500 text-white'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                    Phép Tính Bí Ẩn
                  </span>
                  <div className="text-3xl sm:text-4xl font-black tracking-wider my-1 drop-shadow-md">
                    {currentTask.expression} = ?
                  </div>
                  <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                    {currentTask.radishType === 'golden' ? '⭐ CỦ CẢI HOÀNG KIM' : 'CỦ CẢI THẦN KỲ'}
                  </span>
                </div>
              </div>

              {/* Mound of Earth */}
              <div className="w-48 sm:w-64 h-10 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-t-full shadow-lg border-t-4 border-amber-600 flex items-center justify-center text-xs font-bold text-amber-200">
                {isPulling ? 'Đất đang nứt ra... 💨' : pulledSuccess ? 'Đã nhổ thành công! 🎉' : 'Luống đất màu mỡ 🌱'}
              </div>
            </div>

            {/* Visual Hint when needed */}
            {showHint && (
              <div className="bg-amber-100/95 border-2 border-amber-400 rounded-xl px-4 py-2 text-xs text-amber-900 font-semibold shadow-md flex items-center gap-2 animate-bounce z-10">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Gợi ý: Hãy nhẩm tính từng bước nhé! {currentTask.expression} thì bằng mấy?
                </span>
              </div>
            )}

            {/* Bottom: 3 Harvest Baskets (Options) */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-6 z-10">
              {currentTask.options.map((val) => {
                const isSelected = selectedBasket === val;
                const isCorrect = val === currentTask.answer;

                return (
                  <button
                    key={val}
                    type="button"
                    disabled={pulledSuccess || isPulling}
                    onClick={() => handleSelectBasket(val)}
                    className={`relative group flex flex-col items-center p-2.5 sm:p-4 rounded-2xl transition-all ${
                      isSelected && isCorrect
                        ? 'bg-emerald-100 border-4 border-emerald-500 scale-105 shadow-xl'
                        : isSelected && !isCorrect
                        ? 'bg-rose-100 border-4 border-rose-400 shadow-md'
                        : 'bg-white/95 hover:bg-amber-50 border-3 border-amber-300 hover:border-amber-400 shadow-lg hover:scale-105 active:scale-95'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                      🧺
                    </div>
                    <div className="mt-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xl sm:text-2xl shadow-xs">
                      {val}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      Giỏ số {val}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Button */}
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="text-xs sm:text-sm font-bold text-slate-700">
              {feedback || 'Chọn chiếc giỏ có kết quả đúng để nhổ củ cải!'}
            </div>

            {pulledSuccess && (
              <button
                type="button"
                onClick={handleNextTask}
                className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 animate-bounce"
              >
                <span>{taskIndex < 4 ? 'Luống tiếp theo' : 'Xem chiến thắng'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {gameState === 'victory' && (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-4 border-white mb-4 animate-bounce">
            🏆
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
            NÔNG DÂN NHÍ XUẤT SẮC!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Bé đã giải đúng cả 5 phép tính và giúp bạn Thỏ thu hoạch trọn vẹn 5 củ cải thần kỳ vào giỏ!
          </p>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-emerald-200 shadow-md w-full mb-6 flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl">🥕</div>
              <div className="text-xs font-bold text-slate-600">Đã thu hoạch</div>
              <div className="text-lg font-black text-emerald-600">5 củ cải</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl">⭐</div>
              <div className="text-xs font-bold text-slate-600">Ngôi sao</div>
              <div className="text-lg font-black text-amber-500">+5 Sao</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl">🏅</div>
              <div className="text-xs font-bold text-slate-600">Huy hiệu</div>
              <div className="text-xs font-black text-purple-600">Bác Nông Dân Tài Ba</div>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => handleStartGame(difficulty)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 transition-all text-sm"
            >
              Quay lại Khu Rừng
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
