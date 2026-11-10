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
import { ArrowLeft, RotateCcw, Volume2, ShoppingCart, Check } from 'lucide-react';

interface MathSupermarketGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface CustomerOrder {
  id: number;
  customerEmoji: string;
  customerNameVi: string;
  customerNameEn: string;
  itemA: { name: string; count: number; emoji: string };
  itemB: { name: string; count: number; emoji: string };
  options: number[];
  totalAnswer: number;
}

const ORDERS: CustomerOrder[] = [
  {
    id: 1,
    customerEmoji: '🐻',
    customerNameVi: 'Bác Gấu Nâu',
    customerNameEn: 'Mr. Brown Bear',
    itemA: { name: 'Quả táo đỏ', count: 4, emoji: '🍎' },
    itemB: { name: 'Hộp sữa tươi', count: 3, emoji: '🥛' },
    options: [6, 7, 8, 9],
    totalAnswer: 7,
  },
  {
    id: 2,
    customerEmoji: '🐰',
    customerNameVi: 'Cô Thỏ Trắng',
    customerNameEn: 'Miss White Rabbit',
    itemA: { name: 'Củ cà rốt', count: 5, emoji: '🥕' },
    itemB: { name: 'Bắp ngô ngọt', count: 4, emoji: '🌽' },
    options: [7, 8, 9, 10],
    totalAnswer: 9,
  },
  {
    id: 3,
    customerEmoji: '🐱',
    customerNameVi: 'Bạn Mèo Con',
    customerNameEn: 'Little Kitten',
    itemA: { name: 'Bánh mì kẹp', count: 20, emoji: '🥪' },
    itemB: { name: 'Hộp bánh quy', count: 10, emoji: '🍪' },
    options: [25, 30, 35, 40],
    totalAnswer: 30,
  },
];

export const MathSupermarketGame: React.FC<MathSupermarketGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [orderIdx, setOrderIdx] = useState(0);
  const [cartItems, setCartItems] = useState<{ emoji: string; name: string }[]>([]);
  const [cashierTotal, setCashierTotal] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentOrder = ORDERS[orderIdx];

  const handleAddItem = (emoji: string, name: string) => {
    soundService.playClick();
    setCartItems((prev) => [...prev, { emoji, name }]);
  };

  const handleCheckout = (val: number) => {
    if (isCompleted || !currentOrder) return;

    setCashierTotal(val);

    if (val === currentOrder.totalAnswer) {
      // Correct!
      soundService.playCorrect();
      setFeedback(`Hóa đơn chính xác: ${currentOrder.itemA.count} + ${currentOrder.itemB.count} = ${val}! Khách hàng rất hài lòng!`);

      setTimeout(() => {
        setCartItems([]);
        setCashierTotal(null);

        if (orderIdx + 1 < ORDERS.length) {
          setOrderIdx(orderIdx + 1);
          setFeedback(null);
        } else {
          // Completed all 3 orders!
          setIsCompleted(true);
          soundService.praiseVictory(langMode);
          confetti({ particleCount: 150, spread: 90 });

          StorageService.recordActivity(student.id, {
            type: 'game',
            targetId: 'math-supermarket',
            targetName: 'Siêu Thị Toán Học',
            score: 3,
            totalQuestions: 3,
            starsEarned: 20,
            timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          const updated = StorageService.getCurrentStudent();
          if (updated) onUpdateStudent(updated);
        }
      }, 1400);
    } else {
      // Wrong total
      soundService.playIncorrect();
      setFeedback(`Tổng tiền chưa chính xác rồi. Bé thử cộng lại ${currentOrder.itemA.count} và ${currentOrder.itemB.count} nhé!`);
    }
  };

  const restartGame = () => {
    setOrderIdx(0);
    setCartItems([]);
    setCashierTotal(null);
    setIsCompleted(false);
    setFeedback(null);
    soundService.playClick();
  };

  return (
    <FullscreenStage
      titleVi="Siêu Thị Toán Học"
      titleEn="Math Supermarket Mart"
      categoryBadge="Phép Tính Đố Vui Lớp 1"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          <div className="bg-sky-100 border border-sky-300 text-sky-900 px-3 py-1 rounded-xl font-bold text-xs">
            Đơn {orderIdx + 1} / 3
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
      {!isCompleted && currentOrder ? (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 gap-2">
          {/* KHU VỰC TRÊN: CÂU HỎI & ĐƠN HÀNG (15-20%) */}
          <div className="shrink-0 bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-sky-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentOrder.customerEmoji}</span>
                <span className="text-xs font-black uppercase text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300">
                  {currentOrder.customerNameVi} ({currentOrder.customerNameEn})
                </span>
                <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading truncate">
                  Mua {currentOrder.itemA.count} {currentOrder.itemA.name} và {currentOrder.itemB.count} {currentOrder.itemB.name}. Tất cả có mấy món?
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 italic truncate">
                Customer bought {currentOrder.itemA.count} {currentOrder.itemA.name} and {currentOrder.itemB.count} {currentOrder.itemB.name}. How many in total?
              </p>
            </div>

            <button
              onClick={() => soundService.speakEn(`What is ${currentOrder.itemA.count} plus ${currentOrder.itemB.count}?`)}
              className="p-2 sm:p-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Phát âm tiếng Anh"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* KHU VỰC GIỮA: QUẦY HÀNG VÀ GIỎ MUA SẮM (PHÓNG TO 1.5-2X) (50-55%) */}
          <div className="flex-1 min-h-0 relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 md:border-4 border-sky-400 bg-gradient-to-b from-amber-50 via-sky-50 to-indigo-50 select-none p-4 sm:p-6 flex flex-col justify-between">
            {/* Customer presentation banner */}
            <div className="flex items-center gap-4 bg-white/95 p-3 rounded-2xl border border-sky-200 shadow-xs">
              <div className="text-5xl sm:text-6xl animate-bounce shrink-0">
                {currentOrder.customerEmoji}
              </div>
              <div>
                <span className="text-xs font-black text-sky-800 uppercase tracking-wider">
                  Khách hàng: {currentOrder.customerNameVi}
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                  “Chào bạn nhỏ! Giúp mình tính xem trong giỏ có tất cả bao nhiêu món nhé!”
                </p>
              </div>
            </div>

            {/* Shelves with enlarged items */}
            <div className="bg-amber-100/90 rounded-2xl p-3 border-2 border-amber-300 flex items-center justify-around gap-4">
              <div className="flex items-center gap-3 bg-white p-2 sm:p-3 rounded-2xl border border-amber-300 shadow-xs">
                <span className="text-4xl sm:text-5xl">{currentOrder.itemA.emoji}</span>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900">{currentOrder.itemA.name}</div>
                  <div className="text-xs font-bold text-rose-600">Số lượng: {currentOrder.itemA.count}</div>
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-amber-900">+</div>

              <div className="flex items-center gap-3 bg-white p-2 sm:p-3 rounded-2xl border border-amber-300 shadow-xs">
                <span className="text-4xl sm:text-5xl">{currentOrder.itemB.emoji}</span>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900">{currentOrder.itemB.name}</div>
                  <div className="text-xs font-bold text-blue-600">Số lượng: {currentOrder.itemB.count}</div>
                </div>
              </div>
            </div>

            {/* Shopping Cart Bar */}
            <div className="bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border-2 border-sky-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-sky-600" />
                <span className="text-xs sm:text-sm font-bold text-slate-700">Hàng trong giỏ:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(10, currentOrder.itemA.count) }).map((_, i) => (
                    <span key={`a-${i}`} className="text-xl sm:text-2xl">{currentOrder.itemA.emoji}</span>
                  ))}
                  {Array.from({ length: Math.min(10, currentOrder.itemB.count) }).map((_, i) => (
                    <span key={`b-${i}`} className="text-xl sm:text-2xl">{currentOrder.itemB.emoji}</span>
                  ))}
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-sky-800 bg-sky-100 px-3 py-1 rounded-xl border border-sky-200">
                {currentOrder.itemA.count} + {currentOrder.itemB.count} = ?
              </span>
            </div>
          </div>

          {/* KHU VỰC DƯỚI: NÚT TÍNH TIỀN LỚN (20-25%) */}
          <div className="shrink-0 bg-white/95 rounded-2xl p-2.5 sm:p-4 border border-sky-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-heading bg-sky-50 px-4 py-2 rounded-xl border border-sky-200 shrink-0">
              {currentOrder.itemA.count} + {currentOrder.itemB.count} = ? món
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 flex-1 max-w-xl">
              {currentOrder.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleCheckout(opt)}
                  className="h-14 sm:h-16 md:h-20 text-2xl sm:text-3xl font-black rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-950 border-2 border-sky-300 hover:border-sky-500 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <div className="text-xs sm:text-sm font-bold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 shrink-0 animate-pulse">
                {feedback}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VICTORY CELEBRATION (Zero Scroll) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-sky-50 to-indigo-100 text-center space-y-4">
          <div className="text-6xl animate-bounce">🛒🐻🐰🐱🎉</div>
          <h3 className="text-2xl md:text-3xl font-black text-sky-950 font-heading">
            TẤT CẢ KHÁCH HÀNG ĐÃ THANH TOÁN VUI VẺ!
          </h3>
          <p className="text-base font-bold text-sky-700">
            “Supermarket Master! Bạn là thu ngân toán học thông thái nhất!”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full py-2">
            <div className="bg-white p-3 rounded-2xl border border-sky-200">
              <div className="text-2xl">🧾</div>
              <div className="text-xs text-slate-500 font-bold">Đơn hoàn thành</div>
              <div className="text-lg font-black text-sky-600">3 / 3 Đơn</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-sky-200">
              <div className="text-2xl">⭐</div>
              <div className="text-xs text-slate-500 font-bold">Số sao nhận</div>
              <div className="text-lg font-black text-amber-500">+20 Sao</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-sky-200">
              <div className="text-2xl">🏅</div>
              <div className="text-xs text-slate-500 font-bold">Huy hiệu mới</div>
              <div className="text-xs font-black text-purple-700">Khách Hàng Thông Thái</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-sky-200">
              <div className="text-2xl">🥰</div>
              <div className="text-xs text-slate-500 font-bold">Độ hài lòng</div>
              <div className="text-lg font-black text-emerald-600">100% Tuyệt đối</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={restartGame}
              className="py-3 px-6 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold rounded-2xl shadow-md hover:from-sky-600 hover:to-indigo-700 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Phục vụ lượt khách mới</span>
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
