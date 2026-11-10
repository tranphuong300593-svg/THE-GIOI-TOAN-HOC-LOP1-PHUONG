/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import confetti from 'canvas-confetti';
import { BilingualQuestionBox } from '../common/BilingualQuestionBox';
import { FullscreenStage } from '../common/FullscreenStage';
import { StandardGeometricShape } from '../common/Standard2DShapes';
import { ArrowLeft, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface ShapeBuilderGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type ShapeType = 'triangle' | 'square' | 'rectangle' | 'circle';

interface HouseSlot {
  id: string;
  nameVi: string;
  nameEn: string;
  shape: ShapeType;
  color: string;
  isFilled: boolean;
}

const INITIAL_SLOTS: HouseSlot[] = [
  { id: 'roof', nameVi: 'Mái nhà', nameEn: 'Roof', shape: 'triangle', color: 'bg-rose-500', isFilled: false },
  { id: 'body', nameVi: 'Thân nhà', nameEn: 'House Walls', shape: 'rectangle', color: 'bg-amber-400', isFilled: false },
  { id: 'door', nameVi: 'Cửa ra vào', nameEn: 'Door', shape: 'rectangle', color: 'bg-emerald-500', isFilled: false },
  { id: 'window', nameVi: 'Cửa sổ', nameEn: 'Window', shape: 'square', color: 'bg-sky-400', isFilled: false },
  { id: 'sun', nameVi: 'Mặt trời', nameEn: 'Sun', shape: 'circle', color: 'bg-yellow-400', isFilled: false },
  { id: 'tree', nameVi: 'Tán cây', nameEn: 'Tree crown', shape: 'triangle', color: 'bg-teal-500', isFilled: false },
];

export const ShapeBuilderGame: React.FC<ShapeBuilderGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [slots, setSlots] = useState<HouseSlot[]>(INITIAL_SLOTS);
  const [activeSlotId, setActiveSlotId] = useState<string>('roof');
  const [isCompleted, setIsCompleted] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeSlot = slots.find((s) => s.id === activeSlotId && !s.isFilled) || slots.find((s) => !s.isFilled);

  const handlePickShape = (chosenShape: ShapeType) => {
    if (!activeSlot || isCompleted) return;

    if (chosenShape === activeSlot.shape) {
      // Correct!
      soundService.playCorrect();
      const nextSlots = slots.map((s) => (s.id === activeSlot.id ? { ...s, isFilled: true } : s));
      setSlots(nextSlots);
      setFeedback(`Tuyệt vời! Đã lắp đúng ${activeSlot.nameVi} (${chosenShape})!`);

      // Find next unfilled slot
      const nextUnfilled = nextSlots.find((s) => !s.isFilled);
      if (nextUnfilled) {
        setActiveSlotId(nextUnfilled.id);
      } else {
        // Complete construction!
        setLightsOn(true);
        setTimeout(() => setDoorOpen(true), 600);
        setTimeout(() => {
          setIsCompleted(true);
          soundService.praiseVictory(langMode);
          confetti({ particleCount: 150, spread: 90 });

          StorageService.recordActivity(student.id, {
            type: 'game',
            targetId: 'shape-builder',
            targetName: 'Ngôi Nhà Hình Học',
            score: 6,
            totalQuestions: 6,
            starsEarned: 20,
            timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          const updated = StorageService.getCurrentStudent();
          if (updated) onUpdateStudent(updated);
        }, 1200);
      }
    } else {
      // Wrong
      soundService.playIncorrect();
      setFeedback(`Chưa chính xác rồi. ${activeSlot.nameVi} cần một ${activeSlot.nameVi.includes('Mái') || activeSlot.nameVi.includes('Tán') ? 'hình tam giác' : activeSlot.shape === 'circle' ? 'hình tròn' : activeSlot.shape === 'square' ? 'hình vuông' : 'hình chữ nhật'} nhé!`);
    }
  };

  const restartGame = () => {
    setSlots(INITIAL_SLOTS);
    setActiveSlotId('roof');
    setIsCompleted(false);
    setDoorOpen(false);
    setLightsOn(false);
    setFeedback(null);
    soundService.playClick();
  };

  return (
    <FullscreenStage
      titleVi="Ngôi Nhà Hình Học"
      titleEn="Shape Builder House"
      categoryBadge="Hình Phẳng SGK Toán 1"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          <div className="bg-rose-100 border border-rose-300 text-rose-900 px-3 py-1 rounded-xl font-bold text-xs">
            {slots.filter((s) => s.isFilled).length} / 6 Chi tiết
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
      {!isCompleted && activeSlot ? (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 gap-2">
          {/* KHU VỰC TRÊN: CÂU HỎI & NHIỆM VỤ (15-20%) */}
          <div className="shrink-0 bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-rose-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                  Nhiệm vụ: {activeSlot.nameVi}
                </span>
                <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading truncate">
                  Bé hãy chọn hình thích hợp để ghép vào {activeSlot.nameVi}!
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 italic truncate">
                Pick the correct shape to build the {activeSlot.nameEn}
              </p>
            </div>

            <button
              onClick={() => soundService.speakEn(`Pick the correct shape to build the ${activeSlot.nameEn}`)}
              className="p-2 sm:p-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Phát âm tiếng Anh"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* KHU VỰC GIỮA: MẶT BẰNG NGÔI NHÀ HÌNH HỌC (PHÓNG TO 1.5-2X) (50-55%) */}
          <div className="flex-1 min-h-0 relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 md:border-4 border-rose-300 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 select-none flex items-center justify-center">
            {/* Grass ground */}
            <div className="absolute inset-x-0 bottom-0 h-20 md:h-24 bg-gradient-to-t from-emerald-600 to-green-500 border-t-4 border-emerald-700" />

            {/* Sun slot (Top-Right, Enlarged) */}
            <div
              onClick={() => !slots.find((s) => s.id === 'sun')?.isFilled && setActiveSlotId('sun')}
              className={`absolute top-4 sm:top-6 right-6 sm:right-12 w-18 h-18 sm:w-22 sm:h-22 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                slots.find((s) => s.id === 'sun')?.isFilled
                  ? 'bg-yellow-400 border-yellow-600 shadow-lg shadow-yellow-400/50 scale-110 animate-pulse-subtle'
                  : activeSlot?.id === 'sun'
                  ? 'border-dashed border-amber-600 bg-amber-200/50 animate-pulse ring-4 ring-yellow-400'
                  : 'border-dashed border-slate-400 bg-white/40'
              }`}
            >
              {slots.find((s) => s.id === 'sun')?.isFilled ? (
                <span className="text-4xl sm:text-5xl">☀️</span>
              ) : (
                <span className="text-xs font-bold text-slate-500 text-center">Hình tròn</span>
              )}
            </div>

            {/* Tree on the Left (Enlarged) */}
            <div className="absolute left-6 sm:left-14 bottom-10 flex flex-col items-center">
              <div
                onClick={() => !slots.find((s) => s.id === 'tree')?.isFilled && setActiveSlotId('tree')}
                className={`w-0 h-0 border-l-[44px] sm:border-l-[54px] border-l-transparent border-r-[44px] sm:border-r-[54px] border-r-transparent transition-all cursor-pointer ${
                  slots.find((s) => s.id === 'tree')?.isFilled
                    ? 'border-b-[76px] sm:border-b-[92px] border-b-teal-600 filter drop-shadow'
                    : activeSlot?.id === 'tree'
                    ? 'border-b-[76px] sm:border-b-[92px] border-b-teal-400/70 animate-pulse'
                    : 'border-b-[76px] sm:border-b-[92px] border-b-slate-400/50'
                }`}
              />
              <div className="w-7 sm:w-9 h-14 sm:h-18 bg-amber-800 rounded-b-md" />
            </div>

            {/* Central House Blueprint Construction (Enlarged 1.5-2x) */}
            <div className="relative flex flex-col items-center bottom-2 z-10">
              {/* 1. Roof (Triangle) */}
              <div
                onClick={() => !slots.find((s) => s.id === 'roof')?.isFilled && setActiveSlotId('roof')}
                className={`w-0 h-0 border-l-[130px] sm:border-l-[160px] md:border-l-[190px] border-l-transparent border-r-[130px] sm:border-r-[160px] md:border-r-[190px] border-r-transparent transition-all cursor-pointer ${
                  slots.find((s) => s.id === 'roof')?.isFilled
                    ? 'border-b-[95px] sm:border-b-[110px] md:border-b-[130px] border-b-rose-500 drop-shadow-lg'
                    : activeSlot?.id === 'roof'
                    ? 'border-b-[95px] sm:border-b-[110px] md:border-b-[130px] border-b-rose-300 animate-pulse ring-4 ring-rose-400'
                    : 'border-b-[95px] sm:border-b-[110px] md:border-b-[130px] border-b-slate-400/40'
                }`}
              >
                {!slots.find((s) => s.id === 'roof')?.isFilled && (
                  <span className="absolute -top-12 -left-16 text-xs sm:text-sm font-black text-slate-700 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full">
                    Mái nhà (Tam giác)
                  </span>
                )}
              </div>

              {/* 2. Main House Walls (Rectangle) */}
              <div
                onClick={() => !slots.find((s) => s.id === 'body')?.isFilled && setActiveSlotId('body')}
                className={`relative w-56 sm:w-72 md:w-84 h-40 sm:h-48 md:h-54 border-4 transition-all rounded-b-2xl flex items-center justify-between p-4 sm:p-6 cursor-pointer ${
                  slots.find((s) => s.id === 'body')?.isFilled
                    ? 'bg-amber-100 border-amber-600 shadow-lg'
                    : activeSlot?.id === 'body'
                    ? 'border-dashed border-amber-500 bg-amber-50/70 animate-pulse ring-4 ring-amber-300'
                    : 'border-dashed border-slate-400 bg-white/40'
                }`}
              >
                {/* 3. Window (Square) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!slots.find((s) => s.id === 'window')?.isFilled) setActiveSlotId('window');
                  }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 sm:border-4 flex items-center justify-center transition-all ${
                    slots.find((s) => s.id === 'window')?.isFilled
                      ? lightsOn
                        ? 'bg-yellow-300 border-yellow-500 shadow-md shadow-yellow-400 animate-pulse-subtle'
                        : 'bg-sky-200 border-sky-400'
                      : activeSlot?.id === 'window'
                      ? 'border-dashed border-sky-600 bg-sky-100 animate-pulse ring-2 ring-sky-400'
                      : 'border-dashed border-slate-400 bg-white/60'
                  }`}
                >
                  {slots.find((s) => s.id === 'window')?.isFilled ? (
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1 sm:p-1.5">
                      <div className="bg-sky-100/70 rounded-xs" />
                      <div className="bg-sky-100/70 rounded-xs" />
                      <div className="bg-sky-100/70 rounded-xs" />
                      <div className="bg-sky-100/70 rounded-xs" />
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500 text-center">Hình vuông</span>
                  )}
                </div>

                {/* 4. Door (Rectangle) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!slots.find((s) => s.id === 'door')?.isFilled) setActiveSlotId('door');
                  }}
                  className={`relative w-18 sm:w-22 md:w-24 h-32 sm:h-38 md:h-42 rounded-t-xl border-2 sm:border-4 flex items-center justify-center overflow-hidden transition-all ${
                    slots.find((s) => s.id === 'door')?.isFilled
                      ? 'bg-emerald-600 border-emerald-800'
                      : activeSlot?.id === 'door'
                      ? 'border-dashed border-emerald-600 bg-emerald-100 animate-pulse ring-2 ring-emerald-400'
                      : 'border-dashed border-slate-400 bg-white/60'
                  }`}
                >
                  {slots.find((s) => s.id === 'door')?.isFilled ? (
                    doorOpen ? (
                      <div className="relative w-full h-full bg-amber-900/40 flex items-center justify-center">
                        <RobotMathChibi expression="cheering" size="sm" className="animate-hop" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-emerald-700 flex items-center justify-end pr-1.5">
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-xs" />
                      </div>
                    )
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500 text-center">Chữ nhật</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KHU VỰC DƯỚI: 4 HÌNH HỌC LỚN ĐỂ CHỌN (20-25%) */}
          <div className="shrink-0 bg-white/95 rounded-2xl p-2.5 sm:p-4 border border-rose-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-black text-slate-700 shrink-0">
              Chạm vào hình đúng để ghép vào nhà:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 flex-1 max-w-xl">
              {/* 1. Hình tròn - Đỏ */}
              <button
                onClick={() => handlePickShape('circle')}
                title="Hình tròn"
                className="h-16 sm:h-20 flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <StandardGeometricShape type="circle" size={44} color="#ef4444" />
                <span className="text-[10px] text-slate-400 font-bold mt-1">A</span>
              </button>

              {/* 2. Hình tam giác - Vàng */}
              <button
                onClick={() => handlePickShape('triangle')}
                title="Hình tam giác"
                className="h-16 sm:h-20 flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <StandardGeometricShape type="triangle" size={44} color="#eab308" />
                <span className="text-[10px] text-slate-400 font-bold mt-1">B</span>
              </button>

              {/* 3. Hình vuông - Xanh lá */}
              <button
                onClick={() => handlePickShape('square')}
                title="Hình vuông"
                className="h-16 sm:h-20 flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <StandardGeometricShape type="square" size={44} color="#22c55e" />
                <span className="text-[10px] text-slate-400 font-bold mt-1">C</span>
              </button>

              {/* 4. Hình chữ nhật - Xanh dương */}
              <button
                onClick={() => handlePickShape('rectangle')}
                title="Hình chữ nhật"
                className="h-16 sm:h-20 flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <StandardGeometricShape type="rectangle" size={32} color="#3b82f6" />
                <span className="text-[10px] text-slate-400 font-bold mt-1">D</span>
              </button>
            </div>

            {feedback && (
              <div className="text-xs sm:text-sm font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 shrink-0 animate-pulse">
                {feedback}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VICTORY CARD (Zero Scroll) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-pink-100 text-center space-y-4">
          <div className="text-6xl animate-bounce">🏰✨🤖</div>
          <h3 className="text-2xl md:text-3xl font-black text-rose-900 font-heading">
            NGÔI NHÀ HÌNH HỌC ĐÃ HOÀN THÀNH!
          </h3>
          <p className="text-base font-bold text-rose-700">
            “Shape Master Architect! Đèn đã sáng và cửa mở đón Robot!”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full py-2">
            <div className="bg-white p-3 rounded-2xl border border-rose-200">
              <div className="text-2xl">🧩</div>
              <div className="text-xs text-slate-500 font-bold">Mảnh ghép</div>
              <div className="text-lg font-black text-rose-600">6 / 6 chuẩn</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-rose-200">
              <div className="text-2xl">⭐</div>
              <div className="text-xs text-slate-500 font-bold">Số sao thưởng</div>
              <div className="text-lg font-black text-amber-500">+20 Sao</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-rose-200">
              <div className="text-2xl">🏅</div>
              <div className="text-xs text-slate-500 font-bold">Huy hiệu mới</div>
              <div className="text-xs font-black text-purple-700">Kiến Trúc Sư Nhí</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-rose-200">
              <div className="text-2xl">🏠</div>
              <div className="text-xs text-slate-500 font-bold">Công trình</div>
              <div className="text-lg font-black text-emerald-600">Lâu Đài Cổ Tích</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={restartGame}
              className="py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold rounded-2xl shadow-md hover:from-rose-600 hover:to-pink-600 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Xây lại mẫu mới</span>
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
