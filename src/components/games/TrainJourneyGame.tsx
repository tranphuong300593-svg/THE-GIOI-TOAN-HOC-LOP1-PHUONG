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
import { ArrowLeft, RotateCcw, Volume2, Sparkles, Award } from 'lucide-react';

interface TrainJourneyGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface StationQuest {
  stationNumber: number;
  stationNameVi: string;
  stationNameEn: string;
  taskType: 'ascending' | 'descending' | 'missing' | 'neighbors' | 'grand_express';
  taskTitleVi: string;
  taskTitleEn: string;
  expectedCarriages: number[]; // Correct sequence in order from head
  initialPlaced: (number | null)[];
  availableCarriages: number[];
}

const STATIONS = [
  { vi: 'Ga Hoa Hồng', en: 'Rose Station', bg: 'from-pink-500 to-rose-600' },
  { vi: 'Ga Rừng Xanh', en: 'Greenwood Station', bg: 'from-emerald-500 to-teal-600' },
  { vi: 'Ga Cầu Vồng', en: 'Rainbow Station', bg: 'from-sky-500 to-indigo-600' },
  { vi: 'Ga Thác Nước', en: 'Waterfall Station', bg: 'from-cyan-500 to-blue-600' },
  { vi: 'Ga Lâu Đài', en: 'Castle Central Station', bg: 'from-purple-500 to-amber-500' },
];

export const TrainJourneyGame: React.FC<TrainJourneyGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [stationIdx, setStationIdx] = useState(0);
  const [quests, setQuests] = useState<StationQuest[]>([]);
  const [trackSlots, setTrackSlots] = useState<(number | null)[]>([]);
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [isDeparting, setIsDeparting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Generate 5 station quests
  const generateQuests = (diff: DifficultyLevel): StationQuest[] => {
    const list: StationQuest[] = [];

    for (let s = 0; s < 5; s++) {
      let expected: number[] = [];
      let taskType: StationQuest['taskType'] = 'ascending';
      let taskTitleVi = '';
      let taskTitleEn = '';

      if (s === 0) {
        // Quest 1: Ascending order (bé đến lớn)
        taskType = 'ascending';
        taskTitleVi = 'Ghép các toa tàu theo thứ tự từ BÉ đến LỚN';
        taskTitleEn = 'Arrange carriages in ASCENDING order (Smallest to Largest)';
        const count = 4;
        let nums: number[] = [];
        if (diff === 'easy') {
          const start = Math.floor(Math.random() * 6) + 1; // 1..6
          nums = [start, start + 1, start + 2, start + 3];
        } else if (diff === 'medium') {
          const start = Math.floor(Math.random() * 10) + 10;
          nums = [start, start + 1, start + 2, start + 3];
        } else {
          const start = (Math.floor(Math.random() * 6) + 1) * 10; // 10, 20...
          nums = [start, start + 10, start + 20, start + 30];
        }
        expected = nums;
      } else if (s === 1) {
        // Quest 2: Descending order (lớn đến bé)
        taskType = 'descending';
        taskTitleVi = 'Ghép các toa tàu theo thứ tự từ LỚN đến BÉ';
        taskTitleEn = 'Arrange carriages in DESCENDING order (Largest to Smallest)';
        if (diff === 'easy') {
          const start = Math.floor(Math.random() * 4) + 6; // 6..9
          expected = [start, start - 1, start - 2, start - 3];
        } else if (diff === 'medium') {
          const start = Math.floor(Math.random() * 6) + 14;
          expected = [start, start - 1, start - 2, start - 3];
        } else {
          const start = (Math.floor(Math.random() * 4) + 5) * 10; // 50, 60, 70, 80
          expected = [start, start - 10, start - 20, start - 30];
        }
      } else if (s === 2) {
        // Quest 3: Missing carriages in train
        taskType = 'missing';
        taskTitleVi = 'Điền các toa số còn thiếu vào vị trí trên đường ray';
        taskTitleEn = 'Place missing carriages into blank train slots';
        let nums: number[] = [];
        if (diff === 'easy') {
          const start = Math.floor(Math.random() * 5) + 1;
          nums = [start, start + 1, start + 2, start + 3, start + 4];
        } else if (diff === 'medium') {
          const start = Math.floor(Math.random() * 8) + 10;
          nums = [start, start + 1, start + 2, start + 3, start + 4];
        } else {
          const start = Math.floor(Math.random() * 50) + 20;
          nums = [start, start + 1, start + 2, start + 3, start + 4];
        }
        expected = nums;
      } else if (s === 3) {
        // Quest 4: Predecessor and successor (Số liền trước và số liền sau)
        taskType = 'neighbors';
        const center = diff === 'easy'
          ? Math.floor(Math.random() * 7) + 2
          : diff === 'medium'
          ? Math.floor(Math.random() * 15) + 3
          : Math.floor(Math.random() * 70) + 15;
        taskTitleVi = `Tìm số liền trước và số liền sau của toa số ${center}`;
        taskTitleEn = `Find the number before and after carriage #${center}`;
        expected = [center - 1, center, center + 1];
      } else {
        // Quest 5: Grand Express 5 carriages
        taskType = 'grand_express';
        taskTitleVi = 'Ghép đoàn tàu tốc hành hoàn chỉnh 5 toa vượt đèo';
        taskTitleEn = 'Assemble the 5-car Grand Express train!';
        const start = diff === 'easy'
          ? Math.floor(Math.random() * 5) + 1
          : diff === 'medium'
          ? Math.floor(Math.random() * 10) + 10
          : (Math.floor(Math.random() * 5) + 1) * 10;
        const step = diff === 'hard' ? 10 : 1;
        expected = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
      }

      // Initial track slots (some empty, some prefilled depending on task)
      let initialSlots: (number | null)[] = [];
      let available: number[] = [];

      if (taskType === 'missing') {
        // 2 slots empty
        initialSlots = expected.map((v, idx) => (idx === 1 || idx === 3 ? null : v));
        available = [expected[1], expected[3]];
        // Add 2 distractors
        available.push(expected[1] + 2);
        available.push(Math.max(0, expected[3] - 1));
      } else if (taskType === 'neighbors') {
        // Middle is fixed, 0 and 2 are empty
        initialSlots = [null, expected[1], null];
        available = [expected[0], expected[2], expected[0] - 1, expected[2] + 2];
      } else {
        // All empty
        initialSlots = expected.map(() => null);
        available = [...expected];
      }

      // Shuffle available
      const shuffledAvail = Array.from(new Set(available)).sort(() => Math.random() - 0.5);

      list.push({
        stationNumber: s + 1,
        stationNameVi: STATIONS[s].vi,
        stationNameEn: STATIONS[s].en,
        taskType,
        taskTitleVi,
        taskTitleEn,
        expectedCarriages: expected,
        initialPlaced: initialSlots,
        availableCarriages: shuffledAvail,
      });
    }

    return list;
  };

  const handleStartGame = (selectedDiff: DifficultyLevel) => {
    setLevel(selectedDiff);
    const generated = generateQuests(selectedDiff);
    setQuests(generated);
    setStationIdx(0);
    setTrackSlots([...generated[0].initialPlaced]);
    setSelectedCar(null);
    setIsDeparting(false);
    setFeedback(null);
    setIsCompleted(false);
    setStartTime(Date.now());
    setGameStarted(true);
    soundService.playClick();
  };

  const currentQuest = quests[stationIdx];

  const handlePickCarriage = (carNum: number) => {
    soundService.playClick();
    setSelectedCar(carNum);
    setFeedback(null);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (!currentQuest || selectedCar === null || isDeparting || isCompleted) return;

    // Check if slot is empty
    if (trackSlots[slotIdx] !== null) return;

    const expected = currentQuest.expectedCarriages[slotIdx];

    if (selectedCar === expected) {
      // Correct! Locking carriage
      soundService.playCorrect();
      soundService.playMagicChime();
      const nextSlots = [...trackSlots];
      nextSlots[slotIdx] = selectedCar;
      setTrackSlots(nextSlots);
      setSelectedCar(null);
      setFeedback(`Móc nối tự khóa! Toa số ${selectedCar} đã vào đúng vị trí!`);

      // Check if train is fully assembled
      const isCompleteTrain = nextSlots.every((s) => s !== null);
      if (isCompleteTrain) {
        // Train departs!
        setIsDeparting(true);
        soundService.playJump();
        soundService.praiseCorrect(langMode);
        setFeedback('Tu tu xình xịch! Đoàn tàu lăn bánh rời ga!');

        setTimeout(() => {
          if (stationIdx + 1 < quests.length) {
            const nextIdx = stationIdx + 1;
            setStationIdx(nextIdx);
            setTrackSlots([...quests[nextIdx].initialPlaced]);
            setSelectedCar(null);
            setIsDeparting(false);
            setFeedback(null);
          } else {
            // Reached Castle Central Station!
            setIsCompleted(true);
            soundService.praiseVictory(langMode);
            confetti({ particleCount: 160, spread: 90 });

            StorageService.recordActivity(student.id, {
              type: 'game',
              targetId: 'train-journey',
              targetName: 'Đoàn Tàu Số Học Xuyên Vương Quốc',
              score: 5,
              totalQuestions: 5,
              starsEarned: 20,
              timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
            });

            const updated = StorageService.getCurrentStudent();
            if (updated) onUpdateStudent(updated);
          }
        }, 1600);
      }
    } else {
      // Wrong carriage
      soundService.playIncorrect();
      setFeedback(`Toa số ${selectedCar} chưa đúng thứ tự ở vị trí này. Bé thử lại nhé!`);
      setSelectedCar(null);
    }
  };

  // --- START SCREEN ---
  if (!gameStarted) {
    return (
      <FullscreenStage
        titleVi="LÂU ĐÀI NHỮNG CON SỐ • ĐOÀN TÀU SỐ HỌC XUYÊN VƯƠNG QUỐC"
        titleEn="NUMBER TRAIN ADVENTURE"
        categoryBadge="Khu 1: Lâu đài những con số"
        onBack={onBack}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-4 max-w-4xl mx-auto text-center space-y-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xl flex items-center justify-center text-5xl sm:text-6xl border-4 border-yellow-300 animate-bounce">
            🚂
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Be_Vietnam_Pro'] text-slate-800">
              ĐOÀN TÀU SỐ HỌC XUYÊN VƯƠNG QUỐC
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-xl mx-auto">
              Bác lái tàu đang cần các kỹ sư nhí ghép đúng thứ tự các toa tàu số để tàu khởi hành qua 5 nhà ga cổ tích!
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border-2 border-amber-200 shadow-md w-full max-w-md space-y-4">
            <div className="text-xs font-black uppercase text-amber-700 tracking-wider">
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

  // --- VICTORY SCREEN ---
  if (isCompleted) {
    return (
      <FullscreenStage
        titleVi="LÂU ĐÀI NHỮNG CON SỐ • ĐOÀN TÀU VỀ ĐÍCH AN TOÀN!"
        categoryBadge="Khu 1: Lâu đài những con số"
        onBack={onBack}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-amber-400 border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              Hoàn thành chuyến hành trình 5/5 Nhà ga
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Be_Vietnam_Pro'] text-slate-900">
              ĐOÀN TÀU ĐÃ CẬP BẾN TRUNG TÂM!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
              Chúc mừng <strong>{student.fullName}</strong>! Bé đã hoàn thành xuất sắc nhiệm vụ bác lái tàu giao phó, đưa đoàn tàu số vượt qua cả 5 nhà ga an toàn!
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
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHƠI LẠI CHUYẾN MỚI</span>
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

  // --- GAMEPLAY TRAIN STATION SCREEN ---
  return (
    <FullscreenStage
      titleVi={`ĐOÀN TÀU SỐ HỌC • ${currentQuest.stationNameVi.toUpperCase()}`}
      titleEn={currentQuest.stationNameEn}
      categoryBadge={`Khu 1 • Nhà ga ${currentQuest.stationNumber}/5`}
      onBack={onBack}
      topRightControls={
        <button
          type="button"
          onClick={() => handleStartGame(level)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Xếp lại</span>
        </button>
      }
    >
      <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 max-w-5xl mx-auto select-none">
        {/* Progress Header */}
        <div className="flex items-center justify-between gap-2 bg-white/90 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-900 uppercase">Hành trình:</span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all ${
                    idx < stationIdx
                      ? 'bg-emerald-500 text-white'
                      : idx === stationIdx
                      ? 'bg-amber-500 text-white ring-2 ring-yellow-400 scale-105'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {idx < stationIdx ? '✓' : idx + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs font-bold text-slate-600">
            {currentQuest.stationNameVi}
          </div>
        </div>

        {/* Central Stage: The Railway Track & Train Cars */}
        <div className="bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden flex flex-col items-center justify-center space-y-6 border-3 border-sky-300">
          {/* Clouds */}
          <div className="absolute top-3 left-10 text-white/80 text-3xl">☁️</div>
          <div className="absolute top-6 right-16 text-white/80 text-2xl">☁️</div>

          {/* Task Instructions */}
          <div className="bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full shadow-xs border border-amber-300 text-center">
            <span className="text-xs sm:text-sm font-black text-amber-900">
              🎯 {currentQuest.taskTitleVi}
            </span>
          </div>

          {/* Train Assembly Row with Railway Track */}
          <div className={`relative flex items-end justify-center gap-1 sm:gap-2 pb-6 transition-all duration-700 ${
            isDeparting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}>
            {/* Locomotive (Đầu tàu) */}
            <div className="flex flex-col items-center shrink-0">
              <div className="text-4xl sm:text-6xl filter drop-shadow animate-wiggle">
                🚂
              </div>
              <div className="text-[10px] font-black text-slate-700 bg-yellow-300 px-2 py-0.5 rounded-full mt-1">
                ĐẦU TÀU
              </div>
            </div>

            {/* Móc nối & Carriages */}
            {trackSlots.map((val, slotIdx) => {
              const isFilled = val !== null;

              return (
                <React.Fragment key={slotIdx}>
                  {/* Coupler link */}
                  <div className="w-3 sm:w-4 h-1.5 bg-slate-700 rounded-full my-auto shrink-0" />

                  {isFilled ? (
                    /* Placed Carriage */
                    <div className="w-13 h-16 sm:w-16 sm:h-20 rounded-2xl bg-gradient-to-t from-amber-500 to-yellow-400 text-yellow-950 border-3 border-yellow-200 shadow-md flex flex-col items-center justify-between p-1.5 shrink-0 transform hover:scale-105 transition-all">
                      <div className="w-full flex justify-between px-1 text-[10px] text-yellow-800 font-bold">
                        <span>●</span>
                        <span>●</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-black">{val}</span>
                      <div className="w-full flex justify-around text-slate-800 text-xs">
                        <span>⚙️</span>
                        <span>⚙️</span>
                      </div>
                    </div>
                  ) : (
                    /* Empty Track Slot */
                    <button
                      type="button"
                      onClick={() => handleSlotClick(slotIdx)}
                      className={`w-13 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 border-dashed flex flex-col items-center justify-center p-1 shrink-0 transition-all cursor-pointer ${
                        selectedCar !== null
                          ? 'border-amber-500 bg-amber-400/30 scale-105 shadow-md animate-pulse'
                          : 'border-slate-400/60 bg-white/40 hover:bg-white/70'
                      }`}
                    >
                      <span className="text-2xl font-black text-amber-700">?</span>
                      <span className="text-[9px] font-bold text-slate-600">Toa {slotIdx + 1}</span>
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Railway Tracks Ground Line */}
          <div className="w-full h-3 bg-stone-700 rounded-full relative overflow-hidden flex items-center justify-around px-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-1.5 h-full bg-stone-400" />
            ))}
          </div>

          {/* Feedback Msg */}
          {feedback && (
            <div className="bg-amber-900/90 text-yellow-200 px-4 py-1 rounded-full text-xs font-black shadow-md">
              {feedback}
            </div>
          )}
        </div>

        {/* Bottom Platform: Available Carriages in Yard */}
        <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-3.5 sm:p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-700 uppercase">
              🚉 Các toa tàu đang chờ tại sân ga:
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Chạm chọn một toa, rồi chạm vào ô đường ray
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            {currentQuest.availableCarriages.map((num, idx) => {
              const isSelected = selectedCar === num;
              const isUsed = trackSlots.includes(num);

              if (isUsed) {
                return (
                  <div
                    key={idx}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-slate-100 text-slate-300 border border-slate-200 flex items-center justify-center font-black text-lg opacity-40 cursor-not-allowed"
                  >
                    {num}
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handlePickCarriage(num)}
                  className={`w-12 h-14 sm:w-15 sm:h-17 rounded-2xl font-black text-xl sm:text-2xl shadow-md transition-all cursor-pointer flex flex-col items-center justify-center active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-t from-orange-500 to-amber-400 text-white ring-4 ring-yellow-400 scale-110 shadow-lg'
                      : 'bg-gradient-to-t from-sky-500 to-blue-400 hover:from-sky-600 hover:to-blue-500 text-white hover:scale-105'
                  }`}
                >
                  <span>{num}</span>
                  <span className="text-[10px] opacity-80">🚃</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FullscreenStage>
  );
};
