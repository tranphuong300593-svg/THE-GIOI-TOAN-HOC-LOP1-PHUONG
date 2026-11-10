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
import { ArrowLeft, RotateCcw, Volume2, Sparkles, Key, CheckCircle2, Award, HelpCircle } from 'lucide-react';

interface LostNumbersGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface RoomStage {
  roomNumber: number;
  roomNameVi: string;
  roomNameEn: string;
  roomTheme: string;
  sequence: (number | null)[]; // null represents the missing numbers
  fullSequence: number[];
  options: number[];
  hint: string;
}

const ROOM_NAMES = [
  { vi: 'Phòng Tinh Tú', en: 'Starlight Room', color: 'from-blue-600 to-indigo-700' },
  { vi: 'Phòng Pha Lê', en: 'Crystal Room', color: 'from-cyan-600 to-blue-700' },
  { vi: 'Phòng Vương Miện', en: 'Crown Room', color: 'from-amber-500 to-yellow-600' },
  { vi: 'Phòng Bích Ngọc', en: 'Emerald Room', color: 'from-emerald-600 to-teal-700' },
  { vi: 'Phòng Kim Cương', en: 'Diamond Room', color: 'from-purple-600 to-pink-700' },
];

export const LostNumbersGame: React.FC<LostNumbersGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const [rooms, setRooms] = useState<RoomStage[]>([]);
  const [placedSlots, setPlacedSlots] = useState<{ [index: number]: number }>({});
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [starsUnlocked, setStarsUnlocked] = useState<number[]>([]);

  // Generate 5 rooms based on difficulty
  const generateRooms = (diff: DifficultyLevel): RoomStage[] => {
    const list: RoomStage[] = [];

    for (let r = 0; r < 5; r++) {
      let fullSeq: number[] = [];
      let missingCount = 1;

      if (diff === 'easy') {
        // Numbers 0 to 10 ascending, sequence length 5
        const start = Math.floor(Math.random() * 6); // 0..5
        fullSeq = [start, start + 1, start + 2, start + 3, start + 4];
        missingCount = 1;
      } else if (diff === 'medium') {
        // Numbers within 20, ascending or descending
        const isDescending = Math.random() > 0.5;
        const start = isDescending
          ? Math.floor(Math.random() * 6) + 15 // 15..20
          : Math.floor(Math.random() * 11) + 5; // 5..15
        fullSeq = isDescending
          ? [start, start - 1, start - 2, start - 3, start - 4]
          : [start, start + 1, start + 2, start + 3, start + 4];
        missingCount = r >= 2 ? 2 : 1;
      } else {
        // Challenge: up to 100, skip by 1, 5, or 10
        const stepType = r % 3; // 0: skip 1, 1: skip 10, 2: skip 5
        const step = stepType === 1 ? 10 : stepType === 2 ? 5 : 1;
        const start = step === 10
          ? (Math.floor(Math.random() * 5) + 1) * 10 // 10, 20, 30...
          : step === 5
          ? (Math.floor(Math.random() * 10) + 2) * 5
          : Math.floor(Math.random() * 80) + 10;

        fullSeq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
        missingCount = r >= 2 ? 2 : 1;
      }

      // Pick missing indices (avoid picking all)
      const possibleIndices = [1, 2, 3];
      const shuffledIndices = [...possibleIndices].sort(() => Math.random() - 0.5);
      const chosenMissing = shuffledIndices.slice(0, missingCount);

      const displaySeq: (number | null)[] = fullSeq.map((val, idx) =>
        chosenMissing.includes(idx) ? null : val
      );

      const targetNumbers = chosenMissing.map((idx) => fullSeq[idx]);

      // Distractors
      const distractors: number[] = [];
      while (distractors.length < 3) {
        const randDelta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const candidate = Math.max(0, targetNumbers[0] + randDelta);
        if (!fullSeq.includes(candidate) && !distractors.includes(candidate)) {
          distractors.push(candidate);
        }
      }

      const options = [...targetNumbers, ...distractors].sort(() => Math.random() - 0.5);

      list.push({
        roomNumber: r + 1,
        roomNameVi: ROOM_NAMES[r].vi,
        roomNameEn: ROOM_NAMES[r].en,
        roomTheme: ROOM_NAMES[r].color,
        sequence: displaySeq,
        fullSequence: fullSeq,
        options,
        hint: `Quan sát dãy số: ${fullSeq[0]}, ${fullSeq[1]}... hãy xem số liền trước hoặc liền sau nhé!`,
      });
    }

    return list;
  };

  const handleStartGame = (selectedDiff: DifficultyLevel) => {
    setLevel(selectedDiff);
    const generated = generateRooms(selectedDiff);
    setRooms(generated);
    setCurrentRoomIdx(0);
    setPlacedSlots({});
    setSelectedNumber(null);
    setFeedback(null);
    setIsCompleted(false);
    setStarsUnlocked([]);
    setStartTime(Date.now());
    setGameStarted(true);
    soundService.playClick();
  };

  const currentRoom = rooms[currentRoomIdx];

  const handleNumberSelect = (num: number) => {
    soundService.playClick();
    setSelectedNumber(num);
    setFeedback(null);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (!currentRoom || selectedNumber === null || isCompleted) return;

    // Check if slot is empty
    if (currentRoom.sequence[slotIdx] !== null) return;
    if (placedSlots[slotIdx] !== undefined) return;

    const expectedValue = currentRoom.fullSequence[slotIdx];

    if (selectedNumber === expectedValue) {
      // Correct number placed
      soundService.playCorrect();
      soundService.playMagicChime();
      const newPlaced = { ...placedSlots, [slotIdx]: selectedNumber };
      setPlacedSlots(newPlaced);
      setSelectedNumber(null);
      setFeedback({ text: `Xuất sắc! Số ${selectedNumber} đã về đúng vị trí!`, isCorrect: true });

      // Check if all missing numbers in current room are placed
      const missingIndices = currentRoom.sequence
        .map((val, idx) => (val === null ? idx : null))
        .filter((v): v is number => v !== null);

      const allSolved = missingIndices.every((idx) => newPlaced[idx] !== undefined);

      if (allSolved) {
        soundService.praiseCorrect(langMode);
        setStarsUnlocked((prev) => [...prev, currentRoomIdx]);

        setTimeout(() => {
          if (currentRoomIdx + 1 < rooms.length) {
            setCurrentRoomIdx((prev) => prev + 1);
            setPlacedSlots({});
            setFeedback(null);
            setShowHint(false);
          } else {
            // Completed all 5 rooms!
            setIsCompleted(true);
            soundService.praiseVictory(langMode);
            confetti({ particleCount: 160, spread: 90 });

            StorageService.recordActivity(student.id, {
              type: 'game',
              targetId: 'lost-numbers',
              targetName: 'Giải Cứu Những Con Số Bị Mất Tích',
              score: 5,
              totalQuestions: 5,
              starsEarned: 20,
              timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
            });

            const updated = StorageService.getCurrentStudent();
            if (updated) onUpdateStudent(updated);
          }
        }, 1200);
      }
    } else {
      // Incorrect
      soundService.playIncorrect();
      setFeedback({
        text: `Số ${selectedNumber} chưa chính xác cho ô này. Bé thử quan sát lại dãy số nhé!`,
        isCorrect: false,
      });
      setSelectedNumber(null);
    }
  };

  // --- SCREEN 1: START SCREEN WITH DIFFICULTY SELECTION ---
  if (!gameStarted) {
    return (
      <FullscreenStage
        titleVi="LÂU ĐÀI NHỮNG CON SỐ • GIẢI CỨU NHỮNG CON SỐ BỊ MẤT TÍCH"
        titleEn="RESCUE THE LOST NUMBERS"
        categoryBadge="Khu 1: Lâu đài những con số"
        onBack={onBack}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-4 max-w-4xl mx-auto text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-xl flex items-center justify-center text-5xl sm:text-6xl border-4 border-yellow-300 animate-bounce">
              🏰
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-spin">✨</div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Be_Vietnam_Pro'] text-slate-800">
              GIẢI CỨU NHỮNG CON SỐ BỊ MẤT TÍCH
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-xl mx-auto">
              Một cơn gió phép thuật đã thổi bay các con số khỏi 5 căn phòng lâu đài! Bé hãy tìm và đưa các con số về đúng ô trống để thắp sáng lâu đài nhé!
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border-2 border-blue-200 shadow-md w-full max-w-md space-y-4">
            <div className="text-xs font-black uppercase text-blue-700 tracking-wider">
              Chọn mức độ thử thách
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleStartGame('easy')}
                className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                🌱 DỄ
                <div className="text-[10px] font-medium opacity-90">Phạm vi 10</div>
              </button>

              <button
                type="button"
                onClick={() => handleStartGame('medium')}
                className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                ⭐ VỪA
                <div className="text-[10px] font-medium opacity-90">Phạm vi 20</div>
              </button>

              <button
                type="button"
                onClick={() => handleStartGame('hard')}
                className="py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                🔥 THỬ THÁCH
                <div className="text-[10px] font-medium opacity-90">Phạm vi 100</div>
              </button>
            </div>
          </div>
        </div>
      </FullscreenStage>
    );
  }

  // --- SCREEN 2: VICTORY SCREEN ---
  if (isCompleted) {
    return (
      <FullscreenStage
        titleVi="LÂU ĐÀI NHỮNG CON SỐ • CHIẾN THẮNG!"
        categoryBadge="Khu 1: Lâu đài những con số"
        onBack={onBack}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-yellow-400 border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-bounce">
            👑
          </div>

          <div className="space-y-2">
            <span className="bg-yellow-100 text-yellow-900 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              Hoàn thành 5/5 căn phòng
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Be_Vietnam_Pro'] text-slate-900">
              CỔNG LÂU ĐÀI ĐÃ MỞ TOANG!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
              Chúc mừng hiệp sĩ nhí <strong>{student.fullName}</strong>! Bé đã xuất sắc giải cứu toàn bộ những con số bị mất tích và thắp sáng rực rỡ cả 5 căn phòng lâu đài!
            </p>
          </div>

          <div className="bg-white/95 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-around w-full max-w-md">
            <div className="text-center">
              <div className="text-xs text-slate-500 font-bold">Thời gian</div>
              <div className="text-lg font-black text-blue-600">
                {Math.round((Date.now() - startTime) / 1000)}s
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-xs text-slate-500 font-bold">Thưởng sao</div>
              <div className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 fill-amber-400" /> +20 Sao
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-xs text-slate-500 font-bold">Độ khó</div>
              <div className="text-lg font-black text-purple-600 uppercase">{level}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-md">
            <button
              type="button"
              onClick={() => handleStartGame(level)}
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHƠI LẠI VÒNG MỚI</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VỀ KHU VUI CHƠI</span>
            </button>
          </div>
        </div>
      </FullscreenStage>
    );
  }

  // --- SCREEN 3: GAMEPLAY ROOM SCREEN ---
  return (
    <FullscreenStage
      titleVi={`GIẢI CỨU NHỮNG CON SỐ • ${currentRoom.roomNameVi.toUpperCase()}`}
      titleEn={currentRoom.roomNameEn}
      categoryBadge={`Khu 1 • Phòng ${currentRoom.roomNumber}/5`}
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Gợi ý</span>
          </button>
          <button
            type="button"
            onClick={() => handleStartGame(level)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Làm lại</span>
          </button>
        </div>
      }
    >
      <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 max-w-5xl mx-auto select-none">
        {/* Top: 5-room visual progress bar */}
        <div className="flex items-center justify-between gap-2 bg-white/90 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-black text-blue-900 uppercase">Tiến trình:</span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isPassed = starsUnlocked.includes(idx);
                const isCurrent = currentRoomIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-yellow-400 scale-105'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500 hidden sm:block">
            Mức độ: <span className="text-blue-600 font-black uppercase">{level}</span>
          </div>
        </div>

        {/* Middle Stage: The 5-Room Magic Sequence Display */}
        <div className="bg-gradient-to-br from-blue-900/90 via-indigo-900/95 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col items-center justify-center space-y-6 border-3 border-blue-400/50">
          {/* Subtle starry background sparks */}
          <div className="absolute top-4 left-6 text-yellow-300 text-xl animate-pulse">✨</div>
          <div className="absolute bottom-4 right-8 text-cyan-300 text-xl animate-pulse">⭐</div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl" />

          {/* Room Title */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-xs font-bold text-yellow-300 border border-yellow-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PHÒNG {currentRoom.roomNumber}: {currentRoom.roomNameVi}</span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 font-medium">
              Chạm chọn một số ngôi sao ở dưới, rồi chạm vào ô dấu hỏi trống để giải cứu số!
            </p>
          </div>

          {/* Sequence Slots Row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 z-10">
            {currentRoom.sequence.map((fixedVal, slotIdx) => {
              const isMissing = fixedVal === null;
              const filledVal = placedSlots[slotIdx];

              if (!isMissing) {
                // Fixed number in sequence
                return (
                  <div
                    key={slotIdx}
                    className="w-14 h-16 sm:w-18 sm:h-22 rounded-2xl bg-white text-slate-900 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-blue-300 transform"
                  >
                    {fixedVal}
                  </div>
                );
              }

              // Missing slot
              if (filledVal !== undefined) {
                // Successfully placed!
                return (
                  <div
                    key={slotIdx}
                    className="w-14 h-16 sm:w-18 sm:h-22 rounded-2xl bg-gradient-to-tr from-emerald-400 to-green-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl border-3 border-yellow-300 animate-scale-up"
                  >
                    {filledVal}
                  </div>
                );
              }

              // Empty slot waiting for number
              return (
                <button
                  type="button"
                  key={slotIdx}
                  onClick={() => handleSlotClick(slotIdx)}
                  className={`w-14 h-16 sm:w-18 sm:h-22 rounded-2xl border-3 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedNumber !== null
                      ? 'border-yellow-400 bg-yellow-400/20 shadow-lg scale-105 animate-pulse'
                      : 'border-white/50 bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl font-black text-yellow-300">?</span>
                  <span className="text-[10px] text-white/80 font-bold mt-0.5">Đặt vào</span>
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                feedback.isCorrect
                  ? 'bg-emerald-500/90 text-white shadow-md'
                  : 'bg-rose-500/90 text-white shadow-md'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Visual Hint */}
          {showHint && (
            <div className="bg-amber-400/20 border border-amber-300/40 rounded-2xl p-2.5 text-xs text-amber-200 max-w-lg text-center font-medium">
              💡 {currentRoom.hint}
            </div>
          )}
        </div>

        {/* Bottom Area: Star Bubbles (Available Number Options to Pick) */}
        <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-700 uppercase flex items-center gap-1.5">
              <span>🌟 Các con số ngôi sao đang bay lơ lửng:</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Chạm vào số bé muốn chọn
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            {currentRoom.options.map((optVal, idx) => {
              const isSelected = selectedNumber === optVal;
              // Check if already placed in one of the slots
              const isUsed = Object.values(placedSlots).includes(optVal);

              if (isUsed) {
                return (
                  <div
                    key={idx}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 text-slate-300 border border-slate-200 flex items-center justify-center font-black text-xl opacity-40 cursor-not-allowed"
                  >
                    {optVal}
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleNumberSelect(optVal)}
                  className={`w-12 h-12 sm:w-15 sm:h-15 rounded-2xl font-black text-xl sm:text-2xl shadow-md transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-yellow-950 ring-4 ring-yellow-300 scale-110 shadow-lg'
                      : 'bg-gradient-to-tr from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white hover:scale-105'
                  }`}
                >
                  {optVal}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FullscreenStage>
  );
};
