/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface AnimalBridgeGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface BridgeTask {
  id: number;
  targetNumber: number;
  correctExpr: string;
  options: { expr: string; result: number }[];
  animal: { nameVi: string; nameEn: string; icon: string };
}

export const AnimalBridgeGame: React.FC<AnimalBridgeGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
  const [taskIndex, setTaskIndex] = useState(0);
  const [tasks, setTasks] = useState<BridgeTask[]>([]);
  const [selectedPlank, setSelectedPlank] = useState<string | null>(null);
  const [installedSpans, setInstalledSpans] = useState<number[]>([]);
  const [isHammering, setIsHammering] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const animals = [
    { nameVi: 'Bạn Thỏ Trắng', nameEn: 'White Bunny', icon: '🐰' },
    { nameVi: 'Bạn Sóc Nâu', nameEn: 'Brown Squirrel', icon: '🐿️' },
    { nameVi: 'Bạn Hươu Sao', nameEn: 'Little Deer', icon: '🦌' },
    { nameVi: 'Bạn Gấu Con', nameEn: 'Baby Bear', icon: '🐻' },
    { nameVi: 'Bạn Nhím Xù', nameEn: 'Cute Hedgehog', icon: '🦔' },
  ];

  const generateTasks = (diff: Difficulty): BridgeTask[] => {
    const list: BridgeTask[] = [];

    for (let i = 0; i < 5; i++) {
      let target = 4;
      let correctExpr = '';

      if (diff === 'easy') {
        target = Math.floor(Math.random() * 4) + 2; // 2..5
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          const a = Math.floor(Math.random() * (target - 1)) + 1;
          const b = target - a;
          correctExpr = `${a} + ${b}`;
        } else {
          const b = Math.floor(Math.random() * 3) + 1;
          const a = target + b;
          correctExpr = `${a} - ${b}`;
        }
      } else if (diff === 'medium') {
        target = Math.floor(Math.random() * 6) + 5; // 5..10
        const isAdd = Math.random() > 0.4;
        if (isAdd) {
          const a = Math.floor(Math.random() * (target - 1)) + 1;
          const b = target - a;
          correctExpr = `${a} + ${b}`;
        } else {
          const b = Math.floor(Math.random() * 4) + 1;
          const a = target + b;
          correctExpr = `${a} - ${b}`;
        }
      } else {
        // Within 100 no carry
        const tens = (Math.floor(Math.random() * 5) + 2) * 10;
        const ones = Math.floor(Math.random() * 6) + 2;
        target = tens + ones; // e.g. 45
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          const partTens = Math.floor(Math.random() * 3 + 1) * 10;
          const partOnes = Math.floor(Math.random() * (ones - 1)) + 1;
          const partA = partTens + partOnes;
          const partB = target - partA;
          correctExpr = `${partA} + ${partB}`;
        } else {
          const subTens = 10;
          const subOnes = 1;
          const big = target + subTens + subOnes;
          correctExpr = `${big} - ${subTens + subOnes}`;
        }
      }

      // Generate 2 distractors
      const plankOptions: { expr: string; result: number }[] = [
        { expr: correctExpr, result: target },
      ];

      while (plankOptions.length < 3) {
        const offset = (Math.random() > 0.5 ? 1 : -1) * (diff === 'hard' ? 10 : (Math.floor(Math.random() * 2) + 1));
        const wrongTarget = Math.max(1, target + offset);
        if (wrongTarget !== target && !plankOptions.some((p) => p.result === wrongTarget)) {
          let distExpr = '';
          if (wrongTarget > 3) {
            distExpr = `${wrongTarget - 2} + 2`;
          } else {
            distExpr = `${wrongTarget + 1} - 1`;
          }
          plankOptions.push({ expr: distExpr, result: wrongTarget });
        }
      }

      list.push({
        id: i + 1,
        targetNumber: target,
        correctExpr,
        options: plankOptions.sort(() => Math.random() - 0.5),
        animal: animals[i],
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
    setInstalledSpans([]);
    setSelectedPlank(null);
    setIsHammering(false);
    setShowHint(false);
    setFeedback(null);
    setGameState('playing');
  };

  const currentTask = tasks[taskIndex];

  const handleSelectPlank = (expr: string) => {
    if (isHammering) return;
    soundService.playClick();
    setSelectedPlank(expr);
    setShowHint(false);

    if (expr === currentTask.correctExpr) {
      // Correct! Hammer plank
      setIsHammering(true);
      soundService.playCorrect();
      setFeedback(`Tuyệt vời! Tấm ván "${expr}" vừa khít vào nhịp cầu số ${currentTask.targetNumber}!`);

      setTimeout(() => {
        setIsHammering(false);
        setInstalledSpans((prev) => [...prev, taskIndex]);
        soundService.playApplause();
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 },
        });

        // Bilingual encouragement
        const praises = ['Well done!', 'Strong bridge!', 'You got it!', 'Super engineer!'];
        soundService.speakEn(praises[Math.floor(Math.random() * praises.length)]);
      }, 1000);
    } else {
      soundService.playIncorrect();
      setFeedback(`Chưa khớp rồi! Hãy tính xem phép tính "${expr}" có kết quả bằng ${currentTask.targetNumber} không nhé.`);
      setShowHint(true);
    }
  };

  const handleNextSpan = () => {
    soundService.playClick();
    if (taskIndex < 4) {
      setTaskIndex((prev) => prev + 1);
      setSelectedPlank(null);
      setIsHammering(false);
      setShowHint(false);
      setFeedback(null);
    } else {
      setGameState('victory');
      soundService.playVictory();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
      StorageService.recordActivity(student.id, {
        type: 'game',
        targetId: 'animal-bridge',
        targetName: 'Xây Cầu Cứu Các Bạn Thú',
        score: 5,
        totalQuestions: 5,
        starsEarned: 20,
        timeSpentSeconds: 60,
      });
      const updated = StorageService.getCurrentStudent();
      if (updated) onUpdateStudent(updated);
    }
  };

  const isCurrentSpanDone = installedSpans.includes(taskIndex);

  return (
    <FullscreenStage
      titleVi="Xây Cầu Cứu Các Bạn Thú"
      titleEn="Animal Rescue Bridge Builder"
      onBack={onBack}
      categoryBadge="Khu Rừng Phép Tính"
    >
      {/* Intro Screen */}
      {gameState === 'intro' && (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-3xl flex items-center justify-center text-5xl shadow-xl border-4 border-white mb-4 animate-bounce">
            🪵
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            Xây Cầu Cứu Các Bạn Thú
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md">
            Dòng suối rừng sâu chảy xiết làm 5 bạn thú nhỏ bị kẹt bên bờ suối. Bé hãy ghép các tấm ván mang phép tính đúng vào từng nhịp cầu để cứu các bạn ấy qua sông nhé!
          </p>

          <div className="w-full bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-amber-200 shadow-md mb-6">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
              Chọn cấp độ xây cầu:
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleStartGame('easy')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-green-400 to-emerald-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>🌱 DỄ</span>
                <span className="text-[10px] opacity-90">Cộng trừ đến 5</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartGame('medium')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-amber-500 to-orange-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>🪵 VỪA</span>
                <span className="text-[10px] opacity-90">Cộng trừ đến 10</span>
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
          {/* Top Bar */}
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl border border-amber-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTask.animal.icon}</span>
              <div>
                <div className="text-xs sm:text-sm font-black text-amber-950">
                  Đang cứu: {currentTask.animal.nameVi} (Nhịp {taskIndex + 1}/5)
                </div>
                <div className="text-[10px] text-slate-500">
                  {langMode !== 'vi' && `Rescuing ${currentTask.animal.nameEn}`}
                </div>
              </div>
            </div>

            {/* Bridge Progress Indicator */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isInstalled = installedSpans.includes(idx);
                const isCurrent = idx === taskIndex;
                return (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isInstalled
                        ? 'bg-amber-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-yellow-400 text-slate-900 ring-2 ring-yellow-300 scale-110 shadow-md animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isInstalled ? '🪵' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bridge Across River Area */}
          <div className="relative flex-1 my-2 bg-gradient-to-b from-sky-200 via-sky-100 to-teal-200 rounded-3xl border-4 border-amber-300/60 p-4 shadow-inner flex flex-col items-center justify-between overflow-hidden">
            {/* Water Waves animation */}
            <div className="absolute inset-x-0 bottom-6 h-16 bg-teal-400/30 blur-xs animate-pulse" />
            <div className="absolute top-2 left-6 text-3xl opacity-80">🌳</div>
            <div className="absolute top-3 right-8 text-3xl opacity-80">🌲</div>

            {/* Instruction Banner */}
            <div className="bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full border border-amber-200 shadow-xs text-center z-10">
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                🌉 Chọn tấm ván có phép tính tạo ra kết quả{' '}
                <span className="text-amber-700 font-black text-base">{currentTask.targetNumber}</span> để hoàn thiện nhịp cầu:
              </span>
            </div>

            {/* Central River & 5-span Wooden Suspension Bridge */}
            <div className="relative w-full max-w-2xl my-auto flex items-center justify-between px-2 sm:px-6 z-10">
              {/* Left Bank: Waiting Animals */}
              <div className="flex flex-col items-center gap-1 bg-amber-800/80 p-2 sm:p-3 rounded-2xl border-2 border-amber-600 text-white shadow-lg">
                <div className="text-2xl sm:text-3xl animate-bounce">
                  {currentTask.animal.icon}
                </div>
                <span className="text-[10px] font-bold">Bờ Rừng Sâu</span>
              </div>

              {/* Suspension Bridge Body */}
              <div className="flex-1 mx-2 sm:mx-4 relative flex items-center justify-center">
                {/* Bridge Ropes */}
                <div className="absolute inset-x-0 -top-3 h-1 border-t-2 border-dashed border-amber-800 opacity-60" />
                <div className="absolute inset-x-0 -bottom-3 h-1 border-b-2 border-dashed border-amber-800 opacity-60" />

                {/* 5 Bridge Spans */}
                <div className="grid grid-cols-5 gap-1.5 w-full">
                  {[0, 1, 2, 3, 4].map((spanIdx) => {
                    const isDone = installedSpans.includes(spanIdx);
                    const isCurrent = spanIdx === taskIndex;
                    const task = tasks[spanIdx];

                    return (
                      <div
                        key={spanIdx}
                        className={`h-24 sm:h-28 rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all ${
                          isDone
                            ? 'bg-gradient-to-b from-amber-700 to-amber-900 border-amber-600 text-amber-100 shadow-md scale-100'
                            : isCurrent
                            ? 'bg-amber-100/90 border-dashed border-4 border-amber-500 shadow-lg scale-105 animate-pulse'
                            : 'bg-white/40 border-dashed border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <span className="text-xs">🪵</span>
                            <span className="text-[10px] sm:text-xs font-black text-amber-200 mt-1">
                              {task?.correctExpr}
                            </span>
                            <span className="text-[9px] bg-amber-800/80 px-1 rounded-sm text-yellow-300 font-bold mt-1">
                              = {task?.targetNumber}
                            </span>
                          </>
                        ) : isCurrent ? (
                          <>
                            <span className="text-[10px] font-bold text-amber-800 uppercase">
                              Nhịp Cần Lắp
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-amber-900 my-0.5">
                              {currentTask.targetNumber}
                            </div>
                            <span className="text-[9px] text-amber-700 font-semibold">
                              {isHammering ? '🔨 Đang đóng đinh...' : 'Đang đợi ván'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs opacity-50">🔒</span>
                            <span className="text-[10px] font-bold mt-1">Nhịp {spanIdx + 1}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Bank: Safe Meadow */}
              <div className="flex flex-col items-center gap-1 bg-emerald-700/80 p-2 sm:p-3 rounded-2xl border-2 border-emerald-500 text-white shadow-lg">
                <div className="text-2xl sm:text-3xl">🏡</div>
                <span className="text-[10px] font-bold">Bờ An Toàn</span>
              </div>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="bg-amber-100/95 border-2 border-amber-400 rounded-xl px-4 py-1.5 text-xs text-amber-900 font-semibold shadow-md flex items-center gap-2 animate-bounce z-10">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Gợi ý: Tìm phép tính nào có kết quả đúng bằng {currentTask.targetNumber}!
                </span>
              </div>
            )}

            {/* 3 Wooden Planks (Options) */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-6 z-10">
              {currentTask.options.map((opt) => {
                const isSelected = selectedPlank === opt.expr;
                const isCorrect = opt.expr === currentTask.correctExpr;

                return (
                  <button
                    key={opt.expr}
                    type="button"
                    disabled={isCurrentSpanDone || isHammering}
                    onClick={() => handleSelectPlank(opt.expr)}
                    className={`relative px-4 py-3 sm:px-6 sm:py-4 rounded-2xl transition-all flex flex-col items-center border-4 ${
                      isSelected && isCorrect
                        ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-xl text-emerald-900'
                        : isSelected && !isCorrect
                        ? 'bg-rose-100 border-rose-400 text-rose-900 shadow-md'
                        : 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 border-amber-400 hover:border-yellow-300 text-white shadow-lg hover:scale-105 active:scale-95'
                    }`}
                  >
                    <div className="text-xs uppercase font-bold tracking-wider opacity-80 mb-0.5">
                      Tấm Ván Gỗ
                    </div>
                    <div className="text-xl sm:text-2xl font-black tracking-wider">
                      {opt.expr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Button */}
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="text-xs sm:text-sm font-bold text-slate-700">
              {feedback || 'Chọn tấm ván phù hợp để lắp vào nhịp cầu đang sáng!'}
            </div>

            {isCurrentSpanDone && (
              <button
                type="button"
                onClick={handleNextSpan}
                className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 animate-bounce"
              >
                <span>{taskIndex < 4 ? 'Xây nhịp tiếp theo' : 'Qua Cầu Ăn Mừng!'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {gameState === 'victory' && (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-4 border-white mb-4 animate-bounce">
            🌉
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
            CÂY CẦU ĐÃ HOÀN TẤT!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Tuyệt vời! Cả 5 nhịp cầu đã được ghép chắc chắn. Thỏ, Sóc, Hươu, Gấu và Nhím đã cùng nhau qua sông an toàn!
          </p>

          <div className="flex justify-center gap-3 text-3xl mb-4 animate-pulse">
            <span>🐰</span>
            <span>🐿️</span>
            <span>🦌</span>
            <span>🐻</span>
            <span>🦔</span>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-amber-200 shadow-md w-full mb-6 flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl">🪵</div>
              <div className="text-xs font-bold text-slate-600">Nhịp cầu</div>
              <div className="text-lg font-black text-amber-700">5 / 5 ván</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl">⭐</div>
              <div className="text-xs font-bold text-slate-600">Ngôi sao</div>
              <div className="text-lg font-black text-yellow-500">+5 Sao</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl">🏅</div>
              <div className="text-xs font-bold text-slate-600">Huy hiệu</div>
              <div className="text-xs font-black text-emerald-600">Kỹ Sư Xây Cầu Rừng</div>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => handleStartGame(difficulty)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
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
