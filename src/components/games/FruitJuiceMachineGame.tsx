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
  Cog,
  CheckCircle
} from 'lucide-react';

interface FruitJuiceMachineGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface JuiceTask {
  id: number;
  part1: number | '?';
  op: '+' | '-';
  part2: number | '?';
  result: number;
  missingValue: number;
  options: number[];
  fruit: { nameVi: string; nameEn: string; icon: string; juiceColor: string };
}

export const FruitJuiceMachineGame: React.FC<FruitJuiceMachineGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
  const [taskIndex, setTaskIndex] = useState(0);
  const [tasks, setTasks] = useState<JuiceTask[]>([]);
  const [selectedGear, setSelectedGear] = useState<number | null>(null);
  const [isJuicing, setIsJuicing] = useState(false);
  const [glassFilled, setGlassFilled] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [filledGlasses, setFilledGlasses] = useState<number[]>([]);

  const fruitTypes = [
    { nameVi: 'Nước Ép Dâu Tây', nameEn: 'Strawberry Juice', icon: '🍓', juiceColor: 'from-rose-500 to-red-600' },
    { nameVi: 'Nước Ép Cam Tươi', nameEn: 'Orange Juice', icon: '🍊', juiceColor: 'from-amber-400 to-orange-500' },
    { nameVi: 'Nước Ép Táo Xanh', nameEn: 'Green Apple Juice', icon: '🍏', juiceColor: 'from-lime-400 to-green-500' },
    { nameVi: 'Nước Ép Dưa Hấu', nameEn: 'Watermelon Juice', icon: '🍉', juiceColor: 'from-red-400 to-pink-500' },
    { nameVi: 'Nước Ép Nho Thần Kỳ', nameEn: 'Magic Grape Juice', icon: '🍇', juiceColor: 'from-purple-500 to-indigo-600' },
  ];

  const generateTasks = (diff: Difficulty): JuiceTask[] => {
    const list: JuiceTask[] = [];

    for (let i = 0; i < 5; i++) {
      let a = 2;
      let b = 1;
      let op: '+' | '-' = Math.random() > 0.4 ? '+' : '-';
      let res = 3;
      let missingPos: 'part1' | 'part2' = Math.random() > 0.5 ? 'part1' : 'part2';
      let missingValue = 1;

      if (diff === 'easy') {
        if (op === '+') {
          res = Math.floor(Math.random() * 4) + 2; // 2..5
          a = Math.floor(Math.random() * (res - 1)) + 1;
          b = res - a;
        } else {
          a = Math.floor(Math.random() * 4) + 2; // 2..5
          b = Math.floor(Math.random() * (a - 1)) + 1;
          res = a - b;
        }
      } else if (diff === 'medium') {
        if (op === '+') {
          res = Math.floor(Math.random() * 6) + 5; // 5..10
          a = Math.floor(Math.random() * (res - 1)) + 1;
          b = res - a;
        } else {
          a = Math.floor(Math.random() * 6) + 5; // 5..10
          b = Math.floor(Math.random() * (a - 2)) + 1;
          res = a - b;
        }
      } else {
        // Within 100 no-carry
        const tens = (Math.floor(Math.random() * 5) + 3) * 10;
        const ones = Math.floor(Math.random() * 5) + 2;
        if (op === '+') {
          res = tens + ones;
          const aTens = Math.floor(Math.random() * 3 + 1) * 10;
          const aOnes = Math.floor(Math.random() * (ones - 1)) + 1;
          a = aTens + aOnes;
          b = res - a;
        } else {
          a = tens + ones;
          const bTens = 10;
          const bOnes = 1;
          b = bTens + bOnes;
          res = a - b;
        }
      }

      missingValue = missingPos === 'part1' ? a : b;

      // Distractors
      const opts = new Set<number>([missingValue]);
      while (opts.size < 3) {
        const offset = (Math.random() > 0.5 ? 1 : -1) * (diff === 'hard' ? 10 : (Math.floor(Math.random() * 3) + 1));
        const val = missingValue + offset;
        if (val >= 0 && val !== missingValue) {
          opts.add(val);
        }
      }

      list.push({
        id: i + 1,
        part1: missingPos === 'part1' ? '?' : a,
        op,
        part2: missingPos === 'part2' ? '?' : b,
        result: res,
        missingValue,
        options: Array.from(opts).sort(() => Math.random() - 0.5),
        fruit: fruitTypes[i],
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
    setFilledGlasses([]);
    setSelectedGear(null);
    setIsJuicing(false);
    setGlassFilled(false);
    setShowHint(false);
    setFeedback(null);
    setGameState('playing');
  };

  const currentTask = tasks[taskIndex];

  const handlePullLever = () => {
    if (selectedGear === null || isJuicing || glassFilled) return;
    soundService.playClick();
    setShowHint(false);

    if (selectedGear === currentTask.missingValue) {
      // Correct! Gear fits, machine whirrs, juice pours
      setIsJuicing(true);
      soundService.playCorrect();
      setFeedback(`Bánh răng số ${selectedGear} ăn khớp hoàn hảo! Cỗ máy đang ép ${currentTask.fruit.nameVi}!`);

      setTimeout(() => {
        setIsJuicing(false);
        setGlassFilled(true);
        setFilledGlasses((prev) => [...prev, taskIndex]);
        soundService.playApplause();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });

        const praises = ['Delicious juice!', 'Perfect calculation!', 'Super barista!', 'Great job!'];
        soundService.speakEn(praises[Math.floor(Math.random() * praises.length)]);
      }, 1400);
    } else {
      soundService.playIncorrect();
      setFeedback(`Bánh răng số ${selectedGear} chưa khớp với cỗ máy! Bé hãy tính lại ô trống [ ? ] nhé.`);
      setShowHint(true);
    }
  };

  const handleNextOrder = () => {
    soundService.playClick();
    if (taskIndex < 4) {
      setTaskIndex((prev) => prev + 1);
      setSelectedGear(null);
      setIsJuicing(false);
      setGlassFilled(false);
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
        targetId: 'fruit-juice-machine',
        targetName: 'Cỗ Máy Trái Cây Phép Thuật',
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
      titleVi="Cỗ Máy Trái Cây Phép Thuật"
      titleEn="Magic Fruit Juice Machine"
      onBack={onBack}
      categoryBadge="Khu Rừng Phép Tính"
    >
      {/* Intro Screen */}
      {gameState === 'intro' && (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-3xl flex items-center justify-center text-5xl shadow-xl border-4 border-white mb-4 animate-bounce">
            🥤
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            Cỗ Máy Trái Cây Phép Thuật
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md">
            Cỗ máy nước ép thần kỳ bị thiếu một bánh răng mang số để hoạt động. Bé hãy tìm số còn thiếu trong phép tính, lắp bánh răng và gạt cần để ép 5 ly nước trái cây thơm ngon nhé!
          </p>

          <div className="w-full bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-rose-200 shadow-md mb-6">
            <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3">
              Chọn mức độ pha chế:
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleStartGame('easy')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-green-400 to-emerald-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>🍓 DỄ</span>
                <span className="text-[10px] opacity-90">Phạm vi 5</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartGame('medium')}
                className="py-3 px-2 rounded-xl bg-gradient-to-b from-amber-400 to-orange-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex flex-col items-center gap-1"
              >
                <span>🍊 VỪA</span>
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
          {/* Top Bar */}
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl border border-rose-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTask.fruit.icon}</span>
              <div>
                <div className="text-xs sm:text-sm font-black text-rose-950">
                  Đơn hàng: {currentTask.fruit.nameVi} (Ly {taskIndex + 1}/5)
                </div>
                <div className="text-[10px] text-slate-500">
                  {langMode !== 'vi' && currentTask.fruit.nameEn}
                </div>
              </div>
            </div>

            {/* Glasses Tracker */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isFilled = filledGlasses.includes(idx);
                const isCurrent = idx === taskIndex;
                return (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isFilled
                        ? 'bg-rose-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 scale-110 shadow-md animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isFilled ? '🥤' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Machine Factory Stage Area */}
          <div className="relative flex-1 my-2 bg-gradient-to-b from-slate-100 via-rose-50 to-amber-100 rounded-3xl border-4 border-rose-300/60 p-4 shadow-inner flex flex-col items-center justify-between overflow-hidden">
            {/* Top: Fruit Conveyor Belt */}
            <div className="w-full bg-slate-800 rounded-2xl p-2 flex items-center justify-around border-2 border-slate-700 shadow-md">
              <span className="text-xs font-bold text-slate-300">Băng chuyền trái cây:</span>
              <div className="flex gap-4 text-2xl animate-pulse">
                <span>{currentTask.fruit.icon}</span>
                <span>{currentTask.fruit.icon}</span>
                <span>{currentTask.fruit.icon}</span>
              </div>
            </div>

            {/* Center: Machine Body with Equation & Lever */}
            <div className="w-full max-w-xl bg-white/95 backdrop-blur-xs rounded-3xl border-4 border-rose-400 p-4 shadow-xl flex flex-col items-center my-auto z-10">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                Bảng Điều Khiển Cỗ Máy Phép Thuật
              </span>

              {/* Math Equation with Missing Gear Slot */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 my-2">
                {/* Part 1 */}
                {currentTask.part1 === '?' ? (
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 border-dashed flex items-center justify-center font-black text-2xl sm:text-3xl transition-all ${
                      selectedGear !== null
                        ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-105'
                        : 'bg-slate-100 border-rose-400 text-rose-400 animate-pulse'
                    }`}
                  >
                    {selectedGear !== null ? selectedGear : '?'}
                  </div>
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-black text-2xl sm:text-3xl text-slate-800 shadow-xs">
                    {currentTask.part1}
                  </div>
                )}

                {/* Operator (+ or -) */}
                <div className="text-2xl sm:text-3xl font-black text-rose-600">
                  {currentTask.op}
                </div>

                {/* Part 2 */}
                {currentTask.part2 === '?' ? (
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 border-dashed flex items-center justify-center font-black text-2xl sm:text-3xl transition-all ${
                      selectedGear !== null
                        ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-105'
                        : 'bg-slate-100 border-rose-400 text-rose-400 animate-pulse'
                    }`}
                  >
                    {selectedGear !== null ? selectedGear : '?'}
                  </div>
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-black text-2xl sm:text-3xl text-slate-800 shadow-xs">
                    {currentTask.part2}
                  </div>
                )}

                {/* Equals */}
                <div className="text-2xl sm:text-3xl font-black text-slate-500">=</div>

                {/* Result */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white border-2 border-rose-300 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md">
                  {currentTask.result}
                </div>
              </div>

              {/* Lever & Glass Area */}
              <div className="w-full flex items-center justify-between border-t-2 border-slate-100 pt-3 mt-2">
                {/* Juice Glass */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-16 sm:w-14 sm:h-20 border-3 border-slate-400 rounded-b-2xl overflow-hidden bg-slate-50 flex items-end justify-center shadow-inner">
                    {/* Liquid Animation */}
                    <div
                      className={`w-full bg-gradient-to-t ${currentTask.fruit.juiceColor} transition-all duration-1000 ${
                        glassFilled
                          ? 'h-full'
                          : isJuicing
                          ? 'h-3/4 animate-pulse'
                          : 'h-0'
                      }`}
                    />
                    <div className="absolute top-1 text-xs">🧃</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {glassFilled ? 'Ly nước đã đầy! 😋' : isJuicing ? 'Đang ép nước... ⚙️' : 'Ly nước rỗng'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">
                      {currentTask.fruit.nameVi}
                    </div>
                  </div>
                </div>

                {/* Lever Button */}
                <button
                  type="button"
                  disabled={selectedGear === null || isJuicing || glassFilled}
                  onClick={handlePullLever}
                  className={`py-3 px-5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all ${
                    selectedGear !== null && !glassFilled
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:scale-105 active:scale-95 animate-bounce'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Cog className={`w-5 h-5 ${isJuicing ? 'animate-spin' : ''}`} />
                  <span>{isJuicing ? 'Đang ép...' : 'GẠT CẦN ÉP'}</span>
                </button>
              </div>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="bg-amber-100/95 border-2 border-amber-400 rounded-xl px-4 py-1.5 text-xs text-amber-900 font-semibold shadow-md flex items-center gap-2 animate-bounce z-10">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Gợi ý: Hãy nhẩm tính số nào thay vào [ ? ] để phép tính có kết quả đúng bằng {currentTask.result}!
                </span>
              </div>
            )}

            {/* Bottom: 3 Gear Options */}
            <div className="w-full flex items-center justify-center gap-4 sm:gap-8 z-10">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                Chọn bánh răng số:
              </span>
              {currentTask.options.map((val) => {
                const isSelected = selectedGear === val;

                return (
                  <button
                    key={val}
                    type="button"
                    disabled={glassFilled || isJuicing}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedGear(val);
                      setShowHint(false);
                    }}
                    className={`relative p-3 sm:p-4 rounded-full border-4 transition-all flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ${
                      isSelected
                        ? 'bg-amber-400 border-amber-600 text-slate-900 scale-110 shadow-xl ring-4 ring-yellow-300'
                        : 'bg-white hover:bg-amber-50 border-slate-300 hover:border-amber-400 text-slate-800 shadow-md hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Cog className="w-4 h-4 text-slate-400 absolute top-1" />
                    <span className="text-xl sm:text-2xl font-black mt-2">{val}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Button */}
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="text-xs sm:text-sm font-bold text-slate-700">
              {feedback || 'Chọn bánh răng số thích hợp rồi bấm "GẠT CẦN ÉP"!'}
            </div>

            {glassFilled && (
              <button
                type="button"
                onClick={handleNextOrder}
                className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 animate-bounce"
              >
                <span>{taskIndex < 4 ? 'Ly tiếp theo' : 'Mở Quầy Nước Ép!'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {gameState === 'victory' && (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-amber-400 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-4 border-white mb-4 animate-bounce">
            🍹
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
            QUẦY NƯỚC ÉP ĐÃ KHAI TRƯƠNG!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Hoan hô bé! 5 ly nước ép thơm ngon rực rỡ sắc màu đã được ép thành công. Các bạn nhỏ trong vương quốc đang háo hức thưởng thức!
          </p>

          <div className="flex justify-center gap-3 text-3xl mb-4 animate-pulse">
            <span>🍓</span>
            <span>🍊</span>
            <span>🍏</span>
            <span>🍉</span>
            <span>🍇</span>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-rose-200 shadow-md w-full mb-6 flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl">🥤</div>
              <div className="text-xs font-bold text-slate-600">Nước ép</div>
              <div className="text-lg font-black text-rose-600">5 / 5 ly</div>
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
              <div className="text-xs font-black text-purple-600">Vua Pha Chế Phép Thuật</div>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => handleStartGame(difficulty)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
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
