/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { BilingualQuestionBox } from '../common/BilingualQuestionBox';
import { FullscreenStage } from '../common/FullscreenStage';
import { ArrowLeft, RotateCcw, Volume2, Key, Sparkles } from 'lucide-react';

interface TreasureIslandGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface IslandMilestone {
  id: number;
  nameVi: string;
  nameEn: string;
  icon: string;
  questionVi: string;
  questionEn: string;
  options: number[];
  answer: number;
}

const MILESTONES: IslandMilestone[] = [
  {
    id: 1,
    nameVi: 'Bờ biển Vỏ Sò',
    nameEn: 'Seashell Beach',
    icon: '🐚',
    questionVi: 'Số liền sau của số 19 là số nào?',
    questionEn: 'What number comes right after 19?',
    options: [18, 20, 21, 22],
    answer: 20,
  },
  {
    id: 2,
    nameVi: 'Cầu Khỉ Rừng Dừa',
    nameEn: 'Palm Rope Bridge',
    icon: '🌴',
    questionVi: 'Tính: 30 + 20 = ?',
    questionEn: 'Calculate: 30 + 20 = ?',
    options: [40, 50, 60, 70],
    answer: 50,
  },
  {
    id: 3,
    nameVi: 'Hang Động Pha Lê',
    nameEn: 'Crystal Cave',
    icon: '💎',
    questionVi: 'Số 75 gồm mấy chục và 5 đơn vị?',
    questionEn: '75 consists of how many tens and 5 ones?',
    options: [5, 6, 7, 8],
    answer: 7,
  },
  {
    id: 4,
    nameVi: 'Đỉnh Rương Vàng',
    nameEn: 'Treasure Chest Summit',
    icon: '🏴‍☠️',
    questionVi: 'Tính: 58 - 8 = ?',
    questionEn: 'Calculate: 58 - 8 = ?',
    options: [48, 50, 52, 60],
    answer: 50,
  },
];

export const TreasureIslandGame: React.FC<TreasureIslandGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [keysCollected, setKeysCollected] = useState(0);
  const [chestOpened, setChestOpened] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentStone = MILESTONES[currentIdx];

  const handleAnswer = (val: number) => {
    if (chestOpened || isCompleted || !currentStone) return;

    if (val === currentStone.answer) {
      // Key found!
      soundService.playMagicChime();
      soundService.playCorrect();
      const nextKeys = keysCollected + 1;
      setKeysCollected(nextKeys);
      setFeedback(`Chúc mừng bé! Đã nhận được Chìa Khóa Vàng số ${nextKeys}!`);

      setTimeout(() => {
        if (currentIdx + 1 < MILESTONES.length) {
          setCurrentIdx(currentIdx + 1);
          setFeedback(null);
        } else {
          // All 4 keys found! Unlock chest!
          setChestOpened(true);
          soundService.playMagicChime();
          soundService.praiseVictory(langMode);
          confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 } });

          setTimeout(() => {
            setIsCompleted(true);
            StorageService.recordActivity(student.id, {
              type: 'game',
              targetId: 'treasure-island',
              targetName: 'Đảo Kho Báu',
              score: 4,
              totalQuestions: 4,
              starsEarned: 25,
              timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
            });

            const updated = StorageService.getCurrentStudent();
            if (updated) onUpdateStudent(updated);
          }, 1200);
        }
      }, 900);
    } else {
      soundService.playIncorrect();
      setFeedback('Chưa đúng rồi! Bé hãy suy nghĩ lại để tìm chìa khóa nhé!');
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  const restartGame = () => {
    setCurrentIdx(0);
    setKeysCollected(0);
    setChestOpened(false);
    setIsCompleted(false);
    setFeedback(null);
    soundService.playClick();
  };

  return (
    <FullscreenStage
      titleVi="Đảo Kho Báu"
      titleEn="Treasure Island Explorer"
      categoryBadge="Khám Phá Toán Học Lớp 1"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl font-bold text-xs border border-amber-300">
            <Key className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            {keysCollected} / 4 Chìa khóa
          </div>
          <button
            onClick={restartGame}
            title="Làm lại từ đầu"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
    >
      {!isCompleted && !chestOpened && currentStone ? (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 gap-2">
          {/* KHU VỰC TRÊN: CÂU HỎI & CHẶNG ĐẢO (15-20%) */}
          <div className="shrink-0 bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-amber-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentStone.icon}</span>
                <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Chặng {currentIdx + 1}: {currentStone.nameVi}
                </span>
                <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading truncate">
                  {currentStone.questionVi}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 italic truncate">
                {currentStone.questionEn}
              </p>
            </div>

            <button
              onClick={() => soundService.speakEn(currentStone.questionEn)}
              className="p-2 sm:p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Phát âm tiếng Anh"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* KHU VỰC GIỮA: BẢN ĐỒ ĐẢO KHO BÁU (PHÓNG TO 1.5-2X) (50-55%) */}
          <div className="flex-1 min-h-0 relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 md:border-4 border-amber-400 bg-gradient-to-b from-sky-300 via-amber-200 to-emerald-300 select-none p-4 sm:p-6 flex items-center justify-center">
            {/* Pirate Ship and Parrot */}
            <div className="absolute bottom-4 left-6 text-4xl sm:text-5xl animate-float">⛵</div>
            <div className="absolute top-4 left-10 text-3xl sm:text-4xl opacity-80 animate-wiggle">🦜</div>

            {/* The 4 Checkpoints */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl">
              {MILESTONES.map((stone, idx) => {
                const isUnlocked = keysCollected > idx;
                const isCurrent = currentIdx === idx && !chestOpened;

                return (
                  <div
                    key={stone.id}
                    className={`relative p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                      isUnlocked
                        ? 'bg-amber-100/95 border-amber-400 shadow-md scale-95'
                        : isCurrent
                        ? 'bg-white/95 border-amber-500 ring-4 ring-yellow-400 shadow-xl scale-105 animate-pulse-subtle'
                        : 'bg-white/40 border-slate-300 opacity-60'
                    }`}
                  >
                    <div className="text-4xl sm:text-5xl">{stone.icon}</div>
                    <div className="text-xs sm:text-sm font-black text-amber-950 mt-1">
                      {stone.nameVi}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">
                      {stone.nameEn}
                    </div>

                    <div className="mt-2">
                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          <Key className="w-3 h-3 fill-amber-500" /> Đã có chìa
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[11px] sm:text-xs font-black text-white bg-amber-600 px-3 py-0.5 rounded-full animate-pulse">
                          Đang mở
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">Chưa mở</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Golden Chest on Top Right (Enlarged) */}
            <div className="absolute top-3 sm:top-5 right-6 sm:right-10 flex flex-col items-center z-20">
              <div
                className={`text-5xl sm:text-6xl transition-all ${
                  chestOpened ? 'scale-125 animate-bounce' : 'animate-pulse-subtle'
                }`}
              >
                {chestOpened ? '👑💎⭐' : '🎁'}
              </div>
              <span className="text-[11px] font-black text-amber-900 bg-yellow-300/90 px-2.5 py-0.5 rounded-full mt-1 border border-yellow-500 shadow-xs">
                {chestOpened ? 'Kho báu mở rồi!' : 'Rương cổ tích'}
              </span>
            </div>
          </div>

          {/* KHU VỰC DƯỚI: NÚT ĐÁP ÁN LỚN (20-25%) */}
          <div className="shrink-0 bg-white/95 rounded-2xl p-2.5 sm:p-4 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-black text-slate-700 shrink-0">
              Chạm chọn đáp án để nhận chìa khóa:
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 flex-1 max-w-xl">
              {currentStone.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="h-14 sm:h-16 md:h-20 text-2xl sm:text-3xl font-black rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300 hover:border-amber-500 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <div className="text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0 animate-pulse">
                {feedback}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VICTORY CELEBRATION (Zero Scroll) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-100 text-center space-y-4">
          <div className="text-6xl animate-bounce">🗝️🎁👑💎</div>
          <h3 className="text-2xl md:text-3xl font-black text-amber-950 font-heading">
            KHO BÁU ĐÃ ĐƯỢC KHAI MỞ!
          </h3>
          <p className="text-base font-bold text-amber-800">
            “Treasure Hunter Master! Vàng và ngọc sáng rực cả hòn đảo!”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full py-2">
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🗝️</div>
              <div className="text-xs text-slate-500 font-bold">Chìa khóa vàng</div>
              <div className="text-lg font-black text-amber-600">4 / 4 Chìa</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">⭐</div>
              <div className="text-xs text-slate-500 font-bold">Số sao nhận</div>
              <div className="text-lg font-black text-amber-500">+25 Sao</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🏅</div>
              <div className="text-xs text-slate-500 font-bold">Huy hiệu mới</div>
              <div className="text-xs font-black text-purple-700">Thợ Săn Kho Báu</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">💎</div>
              <div className="text-xs text-slate-500 font-bold">Rương vàng</div>
              <div className="text-lg font-black text-emerald-600">+1 Rương Báu</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={restartGame}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold rounded-2xl shadow-md hover:from-amber-600 hover:to-yellow-600 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khám phá lại đảo</span>
            </button>
            <button
              onClick={onBack}
              className="py-3 px-6 bg-white hover:bg-slate-100 text-slate-800 font-extrabold rounded-2xl border-2 border-slate-300 cursor-pointer active:scale-95"
            >
              Về kho trò chơi
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
