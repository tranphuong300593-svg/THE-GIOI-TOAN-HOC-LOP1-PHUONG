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
  Volume2
} from 'lucide-react';

interface HoneyBeeGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface BeeTask {
  id: number;
  targetCellNumber: number;
  correctExpr: string;
  flowers: { id: number; expr: string; color: string; icon: string }[];
}

export const HoneyBeeGame: React.FC<HoneyBeeGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
  const [taskIndex, setTaskIndex] = useState(0);
  const [tasks, setTasks] = useState<BeeTask[]>([]);
  const [selectedFlowerId, setSelectedFlowerId] = useState<number | null>(null);
  const [beeFlying, setBeeFlying] = useState(false);
  const [filledCells, setFilledCells] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const flowerStyles = [
    { color: 'from-pink-400 to-rose-500', icon: '🌸' },
    { color: 'from-amber-400 to-orange-500', icon: '🌻' },
    { color: 'from-violet-400 to-purple-500', icon: '🪻' },
  ];

  const generateTasks = (diff: Difficulty): BeeTask[] => {
    const list: BeeTask[] = [];

    for (let i = 0; i < 5; i++) {
      let target = 5;
      let correctExpr = '';

      if (diff === 'easy') {
        target = Math.floor(Math.random() * 4) + 2; // 2..5
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          const a = Math.floor(Math.random() * (target - 1)) + 1;
          const b = target - a;
          correctExpr = `${a} + ${b}`;
        } else {
          const b = Math.floor(Math.random() * 2) + 1;
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
          const b = Math.floor(Math.random() * 3) + 1;
          const a = target + b;
          correctExpr = `${a} - ${b}`;
        }
      } else {
        // Within 100 no-carry
        const tens = (Math.floor(Math.random() * 5) + 2) * 10;
        const ones = Math.floor(Math.random() * 6) + 1;
        target = tens + ones;
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
          const partTens = Math.floor(Math.random() * 3 + 1) * 10;
          const partA = partTens + ones;
          const partB = target - partA;
          correctExpr = `${partA} + ${partB}`;
        } else {
          const sub = 10;
          correctExpr = `${target + sub} - ${sub}`;
        }
      }

      // 2 distractors
      const expressions = [correctExpr];
      while (expressions.length < 3) {
        const offset = (Math.random() > 0.5 ? 1 : -1) * (diff === 'hard' ? 10 : (Math.floor(Math.random() * 2) + 1));
        const wrongTarget = Math.max(1, target + offset);
        if (wrongTarget !== target) {
          let dist = `${wrongTarget - 1} + 1`;
          if (!expressions.includes(dist)) {
            expressions.push(dist);
          }
        }
      }

      const shuffled = expressions.sort(() => Math.random() - 0.5);
      const flws = shuffled.map((expr, idx) => ({
        id: idx + 1,
        expr,
        color: flowerStyles[idx % flowerStyles.length].color,
        icon: flowerStyles[idx % flowerStyles.length].icon,
      }));

      list.push({
        id: i + 1,
        targetCellNumber: target,
        correctExpr,
        flowers: flws,
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
    setFilledCells([]);
    setSelectedFlowerId(null);
    setBeeFlying(false);
    setShowHint(false);
    setFeedback(null);
    setGameState('playing');
  };

  const currentTask = tasks[taskIndex];

  const handleSelectFlower = (flower: { id: number; expr: string }) => {
    if (beeFlying) return;
    soundService.playClick();
    setSelectedFlowerId(flower.id);
    setBeeFlying(true);
    setShowHint(false);

    if (flower.expr === currentTask.correctExpr) {
      soundService.playCorrect();
      setFeedback(`Ong chăm chỉ hút mật ngọt từ hoa "${flower.expr}" bay về tổ!`);

      setTimeout(() => {
        setBeeFlying(false);
        setFilledCells((prev) => [...prev, taskIndex]);
        soundService.playApplause();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });

        const praises = ['Sweet honey!', 'Great job!', 'Busy bee!', 'Fantastic!'];
        soundService.speakEn(praises[Math.floor(Math.random() * praises.length)]);
      }, 1200);
    } else {
      soundService.playIncorrect();
      setFeedback(`Hoa này chưa đủ mật cho ô số ${currentTask.targetCellNumber}! Bé hãy tính lại nhé.`);
      setShowHint(true);
      setTimeout(() => {
        setBeeFlying(false);
        setSelectedFlowerId(null);
      }, 1000);
    }
  };

  const handleNextCell = () => {
    soundService.playClick();
    if (taskIndex < 4) {
      setTaskIndex((prev) => prev + 1);
      setSelectedFlowerId(null);
      setBeeFlying(false);
      setShowHint(false);
      setFeedback(null);
    } else {
      setGameState('victory');
      soundService.playVictory();
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.5 },
      });
      StorageService.recordActivity(student.id, {
        type: 'game',
        targetId: 'honey-bee',
        targetName: 'Ong Vàng Mang Mật Về Tổ',
        score: 5,
        totalQuestions: 5,
        starsEarned: 20,
        timeSpentSeconds: 60,
      });
      const updated = StorageService.getCurrentStudent();
      if (updated) onUpdateStudent(updated);
    }
  };

  const isCurrentCellFilled = filledCells.includes(taskIndex);

  return (
    <FullscreenStage
      titleVi="Ong Vàng Mang Mật Về Tổ"
      titleEn="Honey Bee Math Nectar Adventure"
      onBack={onBack}
      categoryBadge="Khu Rừng Phép Tính"
    >
      {/* Intro Screen */}
      {gameState === 'intro' && (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl flex items-center justify-center text-5xl shadow-xl border-4 border-white mb-4 animate-bounce">
            🐝
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            Ong Vàng Mang Mật Về Tổ
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md">
            Mỗi ngăn tổ ong thần kỳ cần một lượng mật có giá trị nhất định. Bé hãy hướng dẫn chú ong vàng bay đến đúng bông hoa mang phép tính phù hợp để mang giọt mật vàng về tổ nhé!
          </p>

          <div className="w-full bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-amber-200 shadow-md mb-6">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
              Chọn mức độ lấy mật:
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleStartGame('easy')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-green-400 to-emerald-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>🌸 DỄ</span>
                <span className="text-[10px] opacity-90">Phép tính đến 5</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartGame('medium')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-amber-400 to-orange-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>🐝 VỪA</span>
                <span className="text-[10px] opacity-90">Phép tính đến 10</span>
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
              <span className="text-2xl">🍯</span>
              <div>
                <div className="text-xs sm:text-sm font-black text-amber-950">
                  Tổ ong thần kỳ: Ngăn {taskIndex + 1}/5 (Cần số {currentTask.targetCellNumber})
                </div>
                <div className="text-[10px] text-slate-500">
                  {langMode !== 'vi' && `Target Cell: ${currentTask.targetCellNumber}`}
                </div>
              </div>
            </div>

            {/* Honey Cells Tracker */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isFilled = filledCells.includes(idx);
                const isCurrent = idx === taskIndex;
                return (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isFilled
                        ? 'bg-amber-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-yellow-300 text-slate-900 ring-2 ring-yellow-400 scale-110 shadow-md animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isFilled ? '🍯' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Meadow & Honeycomb Stage Area */}
          <div className="relative flex-1 my-2 bg-gradient-to-b from-sky-100 via-yellow-50 to-emerald-100 rounded-3xl border-4 border-amber-300/60 p-4 shadow-inner flex flex-col items-center justify-between overflow-hidden">
            {/* Top Center: Honeycomb with 5 Hexagonal Cells */}
            <div className="z-10 flex flex-col items-center">
              <div className="bg-amber-100/90 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-300 shadow-xs text-xs font-bold text-amber-900 mb-2">
                Tổ ong 5 ngăn lấp lánh 🍯
              </div>
              <div className="flex items-center justify-center gap-2">
                {[0, 1, 2, 3, 4].map((cellIdx) => {
                  const isFilled = filledCells.includes(cellIdx);
                  const isCurrent = cellIdx === taskIndex;
                  const task = tasks[cellIdx];

                  return (
                    <div
                      key={cellIdx}
                      className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 flex flex-col items-center justify-center p-1 transition-all ${
                        isFilled
                          ? 'bg-gradient-to-b from-amber-400 to-yellow-500 border-amber-300 text-white shadow-md scale-100'
                          : isCurrent
                          ? 'bg-amber-200/90 border-dashed border-3 border-amber-600 shadow-lg scale-110 animate-pulse'
                          : 'bg-white/60 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isFilled ? (
                        <>
                          <span className="text-xl sm:text-2xl animate-bounce">🍯</span>
                          <span className="text-[10px] font-black">{task?.targetCellNumber}</span>
                        </>
                      ) : isCurrent ? (
                        <>
                          <span className="text-[10px] font-bold text-amber-900">Cần số</span>
                          <span className="text-lg sm:text-xl font-black text-amber-950">
                            {currentTask.targetCellNumber}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs opacity-50">🔒 {cellIdx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle: Busy Bee Flying Animation */}
            <div className="relative my-auto z-10 flex flex-col items-center">
              <div
                className={`text-5xl sm:text-6xl transition-all duration-700 ${
                  beeFlying
                    ? 'scale-125 -translate-y-6 rotate-12 animate-pulse'
                    : isCurrentCellFilled
                    ? 'scale-110 translate-y-[-10px] animate-bounce'
                    : 'hover:scale-110'
                }`}
              >
                🐝
                {isCurrentCellFilled && (
                  <span className="absolute -top-3 -right-2 text-2xl animate-ping">✨</span>
                )}
              </div>
              <div className="text-[10px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-full shadow-xs mt-1">
                {beeFlying ? 'Đang bay hút mật bzzz... 💨' : isCurrentCellFilled ? 'Mật đã về tổ! 🎉' : 'Bấm vào hoa để ong bay đến'}
              </div>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="bg-amber-100/95 border-2 border-amber-400 rounded-xl px-4 py-1.5 text-xs text-amber-900 font-semibold shadow-md flex items-center gap-2 animate-bounce z-10">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Gợi ý: Tìm bông hoa có phép tính bằng đúng {currentTask.targetCellNumber}!
                </span>
              </div>
            )}

            {/* Bottom: 3 Meadow Flowers (Options) */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-6 z-10">
              {currentTask.flowers.map((flw) => {
                const isSelected = selectedFlowerId === flw.id;
                const isCorrect = flw.expr === currentTask.correctExpr;

                return (
                  <button
                    key={flw.id}
                    type="button"
                    disabled={isCurrentCellFilled || beeFlying}
                    onClick={() => handleSelectFlower(flw)}
                    className={`relative p-3 sm:p-5 rounded-3xl transition-all flex flex-col items-center border-4 ${
                      isSelected && isCorrect
                        ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-xl'
                        : isSelected && !isCorrect
                        ? 'bg-rose-100 border-rose-400 shadow-md'
                        : `bg-gradient-to-b ${flw.color} border-white hover:border-yellow-200 text-white shadow-lg hover:scale-105 active:scale-95`
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl animate-pulse">{flw.icon}</div>
                    <div className="mt-1 px-3 py-1 rounded-xl bg-white/20 backdrop-blur-xs font-black text-xl sm:text-2xl shadow-xs">
                      {flw.expr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Button */}
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="text-xs sm:text-sm font-bold text-slate-700">
              {feedback || 'Chọn bông hoa có kết quả đúng để ong hút mật về tổ!'}
            </div>

            {isCurrentCellFilled && (
              <button
                type="button"
                onClick={handleNextCell}
                className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 animate-bounce"
              >
                <span>{taskIndex < 4 ? 'Hút mật ô tiếp theo' : 'Gặp Ong Chúa!'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {gameState === 'victory' && (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-gradient-to-tr from-yellow-300 to-amber-500 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-4 border-white mb-4 animate-bounce">
            👑
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
            TỔ ONG ĐẦY MẬT NGỌT!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Ong Chúa đội vương miện xuất hiện chúc mừng bé! Cả 5 ngăn tổ ong đều đã tràn ngập mật ngọt lấp lánh nhờ tài tính toán của bé.
          </p>

          <div className="flex justify-center gap-3 text-3xl mb-4 animate-pulse">
            <span>🐝</span>
            <span>🍯</span>
            <span>👑</span>
            <span>🍯</span>
            <span>🐝</span>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-amber-200 shadow-md w-full mb-6 flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl">🍯</div>
              <div className="text-xs font-bold text-slate-600">Ngăn mật</div>
              <div className="text-lg font-black text-amber-600">5 / 5 ngăn</div>
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
              <div className="text-xs font-black text-purple-600">Hiệp Sĩ Mật Ngọt</div>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => handleStartGame(difficulty)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
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
