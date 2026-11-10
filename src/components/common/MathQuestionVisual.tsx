/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Question, VisualItemConfig, VisualObjectType } from '../../types';
import { isShapeOptionsList, StandardGeometricShape, StandardShapeType } from './Standard2DShapes';

interface MathQuestionVisualProps {
  question: Question;
  interactive?: boolean;
}

// Visual icons and colors mapping for countable objects
const OBJECT_MAP: Record<VisualObjectType, { emoji: string; nameVi: string; nameEn: string; color: string; bg: string }> = {
  apple: { emoji: '🍎', nameVi: 'quả táo đỏ', nameEn: 'red apple', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  orange: { emoji: '🍊', nameVi: 'quả cam vàng', nameEn: 'orange', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  fish: { emoji: '🐟', nameVi: 'con cá', nameEn: 'fish', color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
  duck: { emoji: '🦆', nameVi: 'con vịt', nameEn: 'duck', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  flower: { emoji: '🌸', nameVi: 'bông hoa', nameEn: 'flower', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200' },
  flower_red: { emoji: '🌺', nameVi: 'bông hoa đỏ', nameEn: 'red flower', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  flower_yellow: { emoji: '🌼', nameVi: 'bông hoa vàng', nameEn: 'yellow flower', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  pencil: { emoji: '✏️', nameVi: 'chiếc bút chì', nameEn: 'pencil', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  crayon: { emoji: '🖍️', nameVi: 'bút sáp màu', nameEn: 'crayon', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200' },
  ball: { emoji: '⚽', nameVi: 'quả bóng', nameEn: 'ball', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  ball_red: { emoji: '🔴', nameVi: 'quả bóng đỏ', nameEn: 'red ball', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  ball_blue: { emoji: '🔵', nameVi: 'quả bóng xanh', nameEn: 'blue ball', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  cat: { emoji: '🐱', nameVi: 'chú mèo', nameEn: 'cat', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  bird: { emoji: '🐦', nameVi: 'chú chim', nameEn: 'bird', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
  carrot: { emoji: '🥕', nameVi: 'củ cà rốt', nameEn: 'carrot', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  candy: { emoji: '🍬', nameVi: 'viên kẹo', nameEn: 'candy', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  star: { emoji: '⭐', nameVi: 'ngôi sao', nameEn: 'star', color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
  car: { emoji: '🚗', nameVi: 'chiếc ô tô', nameEn: 'car', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  bus: { emoji: '🚌', nameVi: 'chiếc xe buýt', nameEn: 'bus', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  rabbit: { emoji: '🐰', nameVi: 'chú thỏ', nameEn: 'rabbit', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
  chick: { emoji: '🐥', nameVi: 'chú gà con', nameEn: 'chick', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  cube: { emoji: '🧊', nameVi: 'khối lập phương', nameEn: 'cube', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200' },
  balloon: { emoji: '🎈', nameVi: 'quả bóng bay', nameEn: 'balloon', color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
};

/**
 * Intelligent deduction of visual configuration if not explicitly provided
 */
export function resolveVisualConfig(question: Question): VisualItemConfig | null {
  if (question.visualConfig) {
    // Strictly enforce: No object illustrations for addition/subtraction beyond 10!
    if (question.visualConfig.mode === 'addition') {
      const a = question.visualConfig.groupA?.count ?? 0;
      const b = question.visualConfig.groupB?.count ?? 0;
      if (a + b > 10) return null;
    }
    if (question.visualConfig.mode === 'subtraction') {
      const init = question.visualConfig.initialCount ?? 0;
      if (init > 10) return null;
    }
    if (question.visualConfig.mode === 'count' && (question.visualConfig.count ?? 0) > 10) {
      return null;
    }
    return question.visualConfig;
  }

  const prompt = question.promptVi.toLowerCase();

  // 1. Clock detection
  if (prompt.includes('đồng hồ') || prompt.includes('mấy giờ') || prompt.includes('giờ đúng')) {
    const hourMatch = prompt.match(/(\d+)\s*giờ/);
    let hour = hourMatch ? parseInt(hourMatch[1], 10) : 7;
    if (typeof question.answer === 'number') hour = question.answer;
    else if (typeof question.answer === 'string') {
      const ansMatch = question.answer.match(/(\d+)/);
      if (ansMatch) hour = parseInt(ansMatch[1], 10);
    }
    return {
      mode: 'clock',
      hour: Math.min(12, Math.max(1, hour)),
      minute: 0,
    };
  }

  // 2. Ruler & Measurement detection
  if (prompt.includes('thước') || prompt.includes('cm') || prompt.includes('xăng-ti-mét')) {
    const cmMatch = prompt.match(/(\d+)\s*cm/);
    let cm = cmMatch ? parseInt(cmMatch[1], 10) : 6;
    if (typeof question.answer === 'number') cm = question.answer;
    else if (typeof question.answer === 'string') {
      const ansMatch = question.answer.match(/(\d+)/);
      if (ansMatch) cm = parseInt(ansMatch[1], 10);
    }
    let objectName = 'Bút sáp màu';
    if (prompt.includes('tẩy') || prompt.includes('gôm')) objectName = 'Cục tẩy';
    else if (prompt.includes('ô tô') || prompt.includes('xe')) objectName = 'Ô tô đồ chơi';
    else if (prompt.includes('mực') || prompt.includes('bút bi')) objectName = 'Bút mực';
    else if (prompt.includes('thìa') || prompt.includes('muỗng')) objectName = 'Chiếc thìa nhỏ';
    else if (prompt.includes('khối') || prompt.includes('gỗ')) objectName = 'Khối gỗ';
    else if (prompt.includes('lược')) objectName = 'Chiếc lược';
    else if (prompt.includes('thẻ')) objectName = 'Thẻ học tập';
    else if (prompt.includes('hộp bút')) objectName = 'Hộp bút nhỏ';
    else if (prompt.includes('khóa')) objectName = 'Chiếc chìa khóa';
    else if (prompt.includes('que')) objectName = 'Que tính';
    else if (prompt.includes('chì')) objectName = 'Bút chì';
    else if (prompt.includes('lá')) objectName = 'Chiếc lá';
    return {
      mode: 'ruler',
      lengthCm: cm,
      startCm: 0,
      objectName,
    };
  }

  // 3. Traffic Signs & Traffic Light (Biển báo & Đèn giao thông thực tế chuẩn xác)
  if (prompt.includes('đèn giao thông') || prompt.includes('traffic light')) {
    return {
      mode: 'traffic-light',
    };
  }

  if (prompt.includes('biển báo') || prompt.includes('traffic sign')) {
    const ans = String(question.answer).toLowerCase();
    const full = (prompt + ' ' + ans).toLowerCase();

    let signType: 'warning_triangle' | 'prohibition_circle' | 'guide_square' | 'guide_rectangle' = 'warning_triangle';
    let shapeType: 'triangle' | 'circle' | 'square' | 'rectangle' = 'triangle';

    if (full.includes('tròn') || full.includes('circle') || full.includes('cấm')) {
      signType = 'prohibition_circle';
      shapeType = 'circle';
    } else if (full.includes('vuông') || full.includes('square') || full.includes('đỗ xe')) {
      signType = 'guide_square';
      shapeType = 'square';
    } else if (full.includes('chữ nhật') || full.includes('rectangle')) {
      signType = 'guide_rectangle';
      shapeType = 'rectangle';
    } else {
      signType = 'warning_triangle';
      shapeType = 'triangle';
    }

    return {
      mode: 'traffic-sign',
      signType,
      shapeType,
    };
  }

  // 4. Geometry & Shapes detection
  if (isShapeOptionsList(question.options) && (prompt.includes('hình nào') || prompt.includes('which shape'))) {
    return null;
  }

  if (prompt.includes('hình vuông') || prompt.includes('hình tròn') || prompt.includes('hình tam giác') || prompt.includes('hình chữ nhật') || prompt.includes('khối lập phương') || prompt.includes('khối hộp chữ nhật')) {
    let shapeType: 'circle' | 'square' | 'triangle' | 'rectangle' | 'cube' | 'cuboid' = 'circle';
    const ans = String(question.answer).toLowerCase();
    const targetStr = ans || prompt;
    if (targetStr.includes('hình vuông') || targetStr === 'square') shapeType = 'square';
    else if (targetStr.includes('hình tam giác') || targetStr === 'triangle') shapeType = 'triangle';
    else if (targetStr.includes('hình chữ nhật') || targetStr === 'rectangle') shapeType = 'rectangle';
    else if (targetStr.includes('khối lập phương') || targetStr === 'cube') shapeType = 'cube';
    else if (targetStr.includes('khối hộp chữ nhật') || targetStr === 'cuboid') shapeType = 'cuboid';
    else if (targetStr.includes('hình tròn') || targetStr === 'circle') shapeType = 'circle';
    return {
      mode: 'shape',
      shapeType,
    };
  }

  // 4. Tens and ones detection (Place value tool)
  if (prompt.includes('chục và') || prompt.includes('mấy chục và mấy đơn vị')) {
    const numMatch = prompt.match(/số\s*(\d+)/i);
    if (numMatch) {
      const num = parseInt(numMatch[1], 10);
      return {
        mode: 'tens-ones',
        tens: Math.floor(num / 10),
        ones: num % 10,
        itemType: 'apple',
      };
    }
  }

  // 4.5 Number sequence detection (Số liền trước / liền sau)
  const afterMatch = prompt.match(/số liền sau của (\d+)/i);
  if (afterMatch) {
    const num = parseInt(afterMatch[1], 10);
    return {
      mode: 'equation',
      equationText: `${num} ➡️ ?`,
      equation: { left: num, op: '➡️', right: '?', label: 'Tìm số liền sau (thêm 1)' },
    };
  }
  const beforeMatch = prompt.match(/số liền trước của (\d+)/i);
  if (beforeMatch) {
    const num = parseInt(beforeMatch[1], 10);
    return {
      mode: 'equation',
      equationText: `? ⬅️ ${num}`,
      equation: { left: '?', op: '⬅️', right: num, label: 'Tìm số liền trước (bớt 1)' },
    };
  }

  // 5. Addition detection (A + B = ?) - CHỈ MINH HỌA ĐỒ VẬT TRONG PHẠM VI 10 (a + b <= 10)
  const addMatch = prompt.match(/(\d+)\s*\+\s*(\d+)/);
  if (addMatch) {
    const a = parseInt(addMatch[1], 10);
    const b = parseInt(addMatch[2], 10);

    // BẮT BUỘC: Nếu vượt quá phạm vi 10 (phạm vi 20, 100), hiển thị THẺ PHÉP TÍNH LỚN, KHÔNG vẽ đồ vật đếm
    if (a + b > 10) {
      return {
        mode: 'equation',
        equationText: `${a} + ${b} = ?`,
        equation: { left: a, op: '+', right: b, label: 'Thẻ phép tính phạm vi 20 – 100' },
      };
    }

    let itemA: VisualObjectType = 'apple';
    let itemB: VisualObjectType = 'orange';

    if (prompt.includes('hoa') || prompt.includes('flower')) {
      itemA = 'flower_red';
      itemB = 'flower_yellow';
    } else if (prompt.includes('bút') || prompt.includes('pencil') || prompt.includes('sáp')) {
      itemA = 'pencil';
      itemB = 'crayon';
    } else if (prompt.includes('thỏ') || prompt.includes('gà') || prompt.includes('rabbit') || prompt.includes('chick') || prompt.includes('con vật')) {
      itemA = 'rabbit';
      itemB = 'chick';
    } else if (prompt.includes('bóng') || prompt.includes('ball')) {
      itemA = 'ball_red';
      itemB = 'ball_blue';
    } else if (prompt.includes('ô tô') || prompt.includes('xe') || prompt.includes('car') || prompt.includes('bus')) {
      itemA = 'car';
      itemB = 'bus';
    }

    return {
      mode: 'addition',
      groupA: { count: a, itemType: itemA, labelVi: `Nhóm ${OBJECT_MAP[itemA]?.nameVi || '1'}` },
      groupB: { count: b, itemType: itemB, labelVi: `Nhóm ${OBJECT_MAP[itemB]?.nameVi || '2'}` },
    };
  }

  // 6. Subtraction detection (A - B = ?) - CHỈ MINH HỌA ĐỒ VẬT TRONG PHẠM VI 10 (a <= 10)
  const subMatch = prompt.match(/(\d+)\s*-\s*(\d+)/);
  if (subMatch) {
    const a = parseInt(subMatch[1], 10);
    const b = parseInt(subMatch[2], 10);

    // BẮT BUỘC: Nếu vượt quá phạm vi 10 (phạm vi 20, 100), hiển thị THẺ PHÉP TÍNH LỚN, KHÔNG vẽ đồ vật đếm
    if (a > 10) {
      return {
        mode: 'equation',
        equationText: `${a} - ${b} = ?`,
        equation: { left: a, op: '-', right: b, label: 'Thẻ phép tính phạm vi 20 – 100' },
      };
    }

    let itemType: VisualObjectType = 'fish';
    if (prompt.includes('táo') || prompt.includes('apple')) itemType = 'apple';
    else if (prompt.includes('vịt') || prompt.includes('duck')) itemType = 'duck';
    else if (prompt.includes('chim') || prompt.includes('bird')) itemType = 'bird';
    else if (prompt.includes('hoa') || prompt.includes('flower')) itemType = 'flower';
    else if (prompt.includes('bóng') || prompt.includes('ball')) itemType = 'ball';

    return {
      mode: 'subtraction',
      itemType,
      initialCount: a,
      removedCount: b,
    };
  }

  // 7. More / Less Comparison detection
  if (prompt.includes('nhóm nào') || prompt.includes('nhiều hơn') || prompt.includes('ít hơn')) {
    const compMatch = prompt.match(/nhóm a có (\d+).*?nhóm b có (\d+)/i);
    if (compMatch) {
      const a = parseInt(compMatch[1], 10);
      const b = parseInt(compMatch[2], 10);
      return {
        mode: 'compare',
        compareA: { count: a, nameVi: 'Nhóm A', itemType: 'ball' },
        compareB: { count: b, nameVi: 'Nhóm B', itemType: 'ball' },
      };
    }
  }

  // 8. Simple Countable items detection
  let targetCount: number | undefined = question.visualCount;
  if (targetCount === undefined && question.type === 'count' && typeof question.answer === 'number') {
    targetCount = question.answer;
  }

  if (targetCount !== undefined) {
    let itemType: VisualObjectType = 'apple';
    if (prompt.includes('cá') || prompt.includes('fish') || question.visualType === 'fish') itemType = 'fish';
    else if (prompt.includes('vịt') || prompt.includes('duck')) itemType = 'duck';
    else if (prompt.includes('hoa') || prompt.includes('flower')) itemType = 'flower';
    else if (prompt.includes('bút') || prompt.includes('pencil')) itemType = 'pencil';
    else if (prompt.includes('bóng') || prompt.includes('ball')) itemType = 'ball';
    else if (prompt.includes('mèo') || prompt.includes('cat')) itemType = 'cat';
    else if (prompt.includes('chim') || prompt.includes('bird')) itemType = 'bird';
    else if (prompt.includes('cà rốt') || prompt.includes('carrot')) itemType = 'carrot';
    else if (prompt.includes('kẹo') || prompt.includes('candy')) itemType = 'candy';
    else if (prompt.includes('ô tô') || prompt.includes('car')) itemType = 'car';
    else if (prompt.includes('sao') || prompt.includes('star')) itemType = 'star';

    return {
      mode: 'count',
      count: targetCount,
      itemType,
    };
  }

  return null;
}

export const MathQuestionVisual: React.FC<MathQuestionVisualProps> = ({ question }) => {
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const config = resolveVisualConfig(question);

  if (!config) return null;

  const handleTap = (idx: number) => {
    if (tappedIndices.includes(idx)) {
      setTappedIndices(tappedIndices.filter((i) => i !== idx));
    } else {
      setTappedIndices([...tappedIndices, idx]);
    }
  };

  // -------------------------------------------------------------
  // 1. SIMPLE COUNTABLE OBJECTS (Đếm đồ vật từ 0 đến N)
  // -------------------------------------------------------------
  if (config.mode === 'count' && config.count !== undefined) {
    const count = config.count;
    const itemType = config.itemType || 'apple';
    const info = OBJECT_MAP[itemType];

    // Special Case: 0 items (Trống)
    if (count === 0) {
      return (
        <div className="px-4 py-2 bg-gradient-to-b from-amber-50 to-white rounded-2xl border border-amber-200 text-center shadow-2xs">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-dashed border-amber-300 bg-white flex items-center justify-center text-2xl shadow-inner">
            🍽️
          </div>
          <div className="text-xs font-black text-amber-900 mt-1">
            Đĩa trống (Có 0 {info.nameVi})
          </div>
        </div>
      );
    }

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-2xl border border-sky-200 shadow-2xs">
        <div className="text-center text-xs font-bold text-sky-900 mb-1">
          Có đúng <strong>{count} {info.nameVi}</strong> (chạm vào hình để đếm):
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 py-0.5">
          {Array.from({ length: count }).map((_, idx) => {
            const isTapped = tappedIndices.includes(idx);
            return (
              <button
                type="button"
                key={idx}
                onClick={() => handleTap(idx)}
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isTapped
                    ? 'bg-emerald-100 border-2 border-emerald-500 scale-105 shadow-2xs'
                    : 'bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 shadow-2xs'
                }`}
              >
                <span className="text-2xl sm:text-3xl select-none">
                  {info.emoji}
                </span>
                {isTapped && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black bg-emerald-600 text-white flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ADDITION GROUPS (Phép cộng: Hai nhóm đối tượng KHÁC NHAU, học sinh tự đếm)
  // -------------------------------------------------------------
  if (config.mode === 'addition' && config.groupA && config.groupB) {
    const a = config.groupA.count;
    const b = config.groupB.count;
    const itemA = config.groupA.itemType || 'apple';
    const itemB = config.groupB.itemType || (itemA === 'apple' ? 'orange' : 'apple');
    const infoA = OBJECT_MAP[itemA] || OBJECT_MAP.apple;
    const infoB = OBJECT_MAP[itemB] || OBJECT_MAP.orange;

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-rose-50/40 via-white to-amber-50/40 rounded-2xl border border-indigo-100 shadow-2xs">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Group A */}
          <div className="p-1.5 sm:p-2 bg-white rounded-xl border border-rose-200 text-center">
            <div className="text-[11px] font-black text-rose-800 mb-1">
              {infoA.nameVi}: <strong>{a}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {Array.from({ length: a }).map((_, i) => (
                <div key={`a-${i}`} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-xl">
                  {infoA.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Plus sign badge */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
            +
          </div>

          {/* Group B */}
          <div className="p-1.5 sm:p-2 bg-white rounded-xl border border-amber-200 text-center">
            <div className="text-[11px] font-black text-amber-800 mb-1">
              {infoB.nameVi}: <strong>{b}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {Array.from({ length: b }).map((_, i) => (
                <div key={`b-${i}`} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-xl">
                  {infoB.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. SUBTRACTION (Phép trừ: Ban đầu - Bớt đi = Còn lại)
  // -------------------------------------------------------------
  if (config.mode === 'subtraction' && config.initialCount !== undefined && config.removedCount !== undefined) {
    const total = config.initialCount;
    const removed = config.removedCount;
    const remaining = Math.max(0, total - removed);
    const itemType = config.itemType || 'fish';
    const info = OBJECT_MAP[itemType];

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-50/40 via-white to-rose-50/40 rounded-2xl border border-sky-200 shadow-2xs">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Active remaining items */}
          <div className="p-1.5 sm:p-2 bg-white rounded-xl border border-emerald-200 text-center">
            <div className="text-[11px] font-black text-emerald-800 mb-1">
              Còn lại: <strong>{remaining}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {remaining === 0 ? (
                <span className="text-[10px] text-slate-400 italic">(0 con)</span>
              ) : (
                Array.from({ length: remaining }).map((_, i) => (
                  <div key={i} className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-50 rounded-lg border border-emerald-300 flex items-center justify-center text-xl">
                    {info.emoji}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Minus sign badge */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-600 text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
            -
          </div>

          {/* Removed items */}
          <div className="p-1.5 sm:p-2 bg-rose-50/70 rounded-xl border border-dashed border-rose-300 text-center">
            <div className="text-[11px] font-black text-rose-800 mb-1">
              Bớt đi: <strong>{removed}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {Array.from({ length: removed }).map((_, i) => (
                <div key={i} className="relative w-8 h-8 sm:w-9 sm:h-9 bg-white/80 rounded-lg border border-rose-300 flex items-center justify-center text-xl opacity-60">
                  <span>{info.emoji}</span>
                  <span className="absolute inset-0 flex items-center justify-center text-rose-600 font-black text-base">
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. COMPARISON (So sánh số lượng: Nhóm A vs Nhóm B)
  // -------------------------------------------------------------
  if (config.mode === 'compare' && config.compareA && config.compareB) {
    const a = config.compareA.count;
    const b = config.compareB.count;
    const itemA = config.compareA.itemType || 'ball';
    const itemB = config.compareB.itemType || 'ball';
    const infoA = OBJECT_MAP[itemA];
    const infoB = OBJECT_MAP[itemB];

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
        {/* Row A */}
        <div className="flex items-center gap-2 px-2 py-1 bg-sky-50 rounded-xl border border-sky-200">
          <div className="w-20 text-[11px] font-black text-sky-900 shrink-0">
            {config.compareA.nameVi}: <strong>{a}</strong>
          </div>
          <div className="flex flex-wrap items-center gap-1 flex-1">
            {Array.from({ length: a }).map((_, i) => (
              <div key={i} className="w-7 h-7 bg-white rounded-md border border-sky-300 flex items-center justify-center text-base">
                {infoA.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Row B */}
        <div className="flex items-center gap-2 px-2 py-1 bg-amber-50 rounded-xl border border-amber-200">
          <div className="w-20 text-[11px] font-black text-amber-900 shrink-0">
            {config.compareB.nameVi}: <strong>{b}</strong>
          </div>
          <div className="flex flex-wrap items-center gap-1 flex-1">
            {Array.from({ length: b }).map((_, i) => (
              <div key={i} className="w-7 h-7 bg-white rounded-md border border-amber-300 flex items-center justify-center text-base">
                {infoB.emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4.6 TRAFFIC SIGNS (Biển báo giao thông thực tế: Tam giác, Tròn, Vuông, Chữ nhật)
  // -------------------------------------------------------------
  if (config.mode === 'traffic-sign') {
    const signType = config.signType || 'warning_triangle';

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-sky-50 to-slate-50 rounded-2xl border border-sky-200 text-center select-none shadow-2xs">
        <div className="flex justify-center items-center py-0.5">
          {signType === 'warning_triangle' && (
            <svg width="125" height="125" viewBox="0 0 200 200" className="drop-shadow-md">
              {/* Metal Pole */}
              <rect x="96" y="138" width="8" height="55" fill="#94a3b8" stroke="#64748b" strokeWidth="1" rx="1" />
              {/* Base Stand */}
              <ellipse cx="100" cy="193" rx="32" ry="5" fill="#64748b" />
              {/* Outer Red Triangle */}
              <polygon points="100,14 18,142 182,142" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" strokeLinejoin="round" />
              {/* Inner Yellow Warning Triangle */}
              <polygon points="100,30 32,134 168,134" fill="#facc15" stroke="#eab308" strokeWidth="1" strokeLinejoin="round" />
              {/* Pedestrian Silhouette */}
              <g fill="#0f172a">
                <circle cx="100" cy="65" r="8" />
                <path d="M 97 76 L 103 76 L 107 98 L 115 118 L 109 121 L 102 103 L 95 120 L 89 117 L 95 96 Z" />
                <line x1="75" y1="126" x2="125" y2="126" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              </g>
            </svg>
          )}

          {signType === 'prohibition_circle' && (
            <svg width="125" height="125" viewBox="0 0 200 200" className="drop-shadow-md">
              {/* Metal Pole */}
              <rect x="96" y="140" width="8" height="52" fill="#94a3b8" stroke="#64748b" strokeWidth="1" rx="1" />
              {/* Base Stand */}
              <ellipse cx="100" cy="192" rx="30" ry="5" fill="#64748b" />
              {/* Outer Red Circle */}
              <circle cx="100" cy="78" r="62" fill="#dc2626" stroke="#b91c1c" strokeWidth="2.5" />
              {/* Inner White Ring */}
              <circle cx="100" cy="78" r="58" fill="none" stroke="#ffffff" strokeWidth="1.5" />
              {/* Horizontal White Bar (Biển P.102: Cấm đi ngược chiều) */}
              <rect x="52" y="68" width="96" height="20" rx="3" fill="#ffffff" />
            </svg>
          )}

          {signType === 'guide_square' && (
            <svg width="125" height="125" viewBox="0 0 200 200" className="drop-shadow-md">
              {/* Metal Pole */}
              <rect x="96" y="142" width="8" height="50" fill="#94a3b8" stroke="#64748b" strokeWidth="1" rx="1" />
              {/* Base Stand */}
              <ellipse cx="100" cy="192" rx="30" ry="5" fill="#64748b" />
              {/* Blue Square (Biển I.408: Nơi đỗ xe) */}
              <rect x="42" y="20" width="116" height="116" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2.5" rx="4" />
              {/* Inner White Border */}
              <rect x="48" y="26" width="104" height="104" fill="none" stroke="#ffffff" strokeWidth="2" rx="2" />
              {/* Letter P */}
              <text x="100" y="103" textAnchor="middle" fill="#ffffff" fontSize="72" fontWeight="900" fontFamily="system-ui, sans-serif">
                P
              </text>
            </svg>
          )}

          {signType === 'guide_rectangle' && (
            <svg width="145" height="125" viewBox="0 0 230 200" className="drop-shadow-md">
              {/* Metal Pole */}
              <rect x="111" y="142" width="8" height="50" fill="#94a3b8" stroke="#64748b" strokeWidth="1" rx="1" />
              {/* Base Stand */}
              <ellipse cx="115" cy="192" rx="32" ry="5" fill="#64748b" />
              {/* Blue Rectangle */}
              <rect x="25" y="30" width="180" height="105" fill="#0284c7" stroke="#0369a1" strokeWidth="2.5" rx="4" />
              {/* Inner White Border */}
              <rect x="31" y="36" width="168" height="93" fill="none" stroke="#ffffff" strokeWidth="2" rx="2" />
              {/* Cross symbol */}
              <g fill="#ffffff">
                <rect x="108" y="55" width="14" height="55" rx="2" />
                <rect x="87" y="75" width="56" height="14" rx="2" />
              </g>
            </svg>
          )}
        </div>
        <div className="text-[11px] font-bold text-slate-700">
          Biển báo giao thông đường bộ Việt Nam
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4.7 TRAFFIC LIGHT (Cột đèn giao thông 3 màu thực tế)
  // -------------------------------------------------------------
  if (config.mode === 'traffic-light') {
    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-300 text-center select-none shadow-2xs">
        <div className="flex justify-center items-center py-0.5">
          <svg width="105" height="135" viewBox="0 0 160 220" className="drop-shadow-md">
            {/* Pole */}
            <rect x="75" y="150" width="10" height="60" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            {/* Base Stand */}
            <ellipse cx="80" cy="210" rx="30" ry="5" fill="#475569" />
            {/* Casing */}
            <rect x="50" y="12" width="60" height="140" rx="14" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            {/* Visors */}
            <path d="M 54 34 Q 80 20 106 34" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M 54 78 Q 80 64 106 78" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M 54 122 Q 80 108 106 122" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            {/* RED (Top) */}
            <circle cx="80" cy="40" r="16" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
            <circle cx="75" cy="35" r="4" fill="#ffffff" opacity="0.6" />
            {/* YELLOW (Middle) */}
            <circle cx="80" cy="84" r="16" fill="#eab308" stroke="#ca8a04" strokeWidth="2" opacity="0.85" />
            <circle cx="75" cy="79" r="4" fill="#ffffff" opacity="0.5" />
            {/* GREEN (Bottom) */}
            <circle cx="80" cy="128" r="16" fill="#22c55e" stroke="#15803d" strokeWidth="2" opacity="0.85" />
            <circle cx="75" cy="123" r="4" fill="#ffffff" opacity="0.5" />
          </svg>
        </div>
        <div className="text-[11px] font-bold text-slate-700">
          Cột đèn tín hiệu giao thông (Đỏ ở trên, Vàng ở giữa, Xanh ở dưới)
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4.8 EQUATION CARD (Thẻ phép tính phạm vi 20 & 100 to, rõ ràng)
  // -------------------------------------------------------------
  if (config.mode === 'equation') {
    const eq = config.equation || { left: '', op: '', right: '?' };

    return (
      <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-sky-50 via-white to-indigo-50/60 rounded-2xl border border-indigo-200 text-center select-none shadow-2xs">
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
          {/* Left operand */}
          <div className="min-w-[55px] sm:min-w-[70px] h-11 sm:h-13 bg-white rounded-xl border-2 border-indigo-300 shadow-xs flex items-center justify-center px-2.5">
            <span className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl md:text-3xl text-slate-900">
              {eq.left}
            </span>
          </div>

          {/* Operator */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-600 text-white font-black text-lg sm:text-xl flex items-center justify-center shadow-xs">
            {eq.op}
          </div>

          {/* Right operand */}
          <div className="min-w-[55px] sm:min-w-[70px] h-11 sm:h-13 bg-white rounded-xl border-2 border-indigo-300 shadow-xs flex items-center justify-center px-2.5">
            <span className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl md:text-3xl text-slate-900">
              {eq.right}
            </span>
          </div>

          {/* Equals and result placeholder (if standard math operator) */}
          {eq.op !== '➡️' && eq.op !== '⬅️' && (
            <>
              <div className="text-xl sm:text-2xl font-black text-indigo-700">=</div>
              <div className="min-w-[55px] sm:min-w-[70px] h-11 sm:h-13 bg-amber-100 rounded-xl border-2 border-dashed border-amber-400 shadow-xs flex items-center justify-center px-2.5 animate-pulse">
                <span className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl text-amber-800">
                  ?
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. GEOMETRIC SHAPES (Hình phẳng & Hình khối chuẩn)
  // -------------------------------------------------------------
  if (config.mode === 'shape') {
    const shape = config.shapeType || 'circle';

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-50/80 rounded-2xl border border-slate-200 text-center shadow-2xs">
        <div className="flex justify-center items-center py-1">
          {(shape === 'circle' || shape === 'square' || shape === 'rectangle' || shape === 'triangle') && (
            <StandardGeometricShape type={shape as StandardShapeType} size={95} />
          )}

          {shape === 'cube' && (
            <svg width="105" height="105" viewBox="0 0 190 190" className="drop-shadow-md">
              {/* Isometric Cube */}
              <polygon points="95,25 155,60 95,95 35,60" fill="#a78bfa" stroke="#6d28d9" strokeWidth="3" />
              <polygon points="35,60 95,95 95,165 35,130" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="3" />
              <polygon points="95,95 155,60 155,130 95,165" fill="#7c3aed" stroke="#6d28d9" strokeWidth="3" />
            </svg>
          )}

          {shape === 'cuboid' && (
            <svg width="135" height="95" viewBox="0 0 230 170" className="drop-shadow-md">
              {/* Isometric Cuboid */}
              <polygon points="105,20 205,45 125,85 25,60" fill="#38bdf8" stroke="#0369a1" strokeWidth="3" />
              <polygon points="25,60 125,85 125,150 25,125" fill="#0284c7" stroke="#0369a1" strokeWidth="3" />
              <polygon points="125,85 205,45 205,110 125,150" fill="#0369a1" stroke="#0369a1" strokeWidth="3" />
            </svg>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. RULER & LENGTH (Độ dài & Đo độ dài bằng thước cm chuẩn)
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 6. RULER & LENGTH (Độ dài & Đo độ dài bằng thước cm chuẩn)
  // -------------------------------------------------------------
  if (config.mode === 'ruler') {
    const lengthCm = config.lengthCm ?? 7;
    const startCm = config.startCm ?? 0;
    const objectName = config.objectName || 'Chiếc bút sáp';
    const totalRulerCm = Math.max(12, Math.min(20, lengthCm + 2));

    // Determine specific object type based on objectName
    const objLower = objectName.toLowerCase();
    let objType = 'crayon';
    if (objLower.includes('tẩy')) objType = 'eraser';
    else if (objLower.includes('mực') || objLower.includes('bút bi')) objType = 'pen';
    else if (objLower.includes('chì')) objType = 'pencil';
    else if (objLower.includes('sáp') || objLower.includes('màu')) objType = 'crayon';
    else if (objLower.includes('thìa') || objLower.includes('muỗng')) objType = 'spoon';
    else if (objLower.includes('ô tô') || objLower.includes('xe')) objType = 'toy_car';
    else if (objLower.includes('khóa')) objType = 'key';
    else if (objLower.includes('gỗ') || objLower.includes('khối')) objType = 'block';
    else if (objLower.includes('que') || objLower.includes('tính')) objType = 'stick';
    else if (objLower.includes('lược')) objType = 'comb';
    else if (objLower.includes('thẻ') || objLower.includes('card')) objType = 'card';
    else if (objLower.includes('hộp bút')) objType = 'pencil_case';

    // SVG sizing: 24px per cm
    const cmWidth = 24;
    const rulerPaddingLeft = 24;
    const rulerWidth = rulerPaddingLeft + totalRulerCm * cmWidth + 24;
    const objWidth = Math.max(12, lengthCm * cmWidth);

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200 shadow-2xs select-none max-w-full">
        <div className="flex items-center justify-between text-[11px] font-black text-amber-950 border-b border-amber-200/70 pb-1 mb-1">
          <span className="flex items-center gap-1">
            <span>📏 Thước đo cm chuẩn:</span>
            <strong className="text-amber-800">{objectName}</strong>
          </span>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
            Đặt từ vạch 0 cm ➔ {lengthCm} cm
          </span>
        </div>

        <div className="py-0.5 flex justify-center overflow-x-auto max-w-full">
          <svg
            viewBox={`0 0 ${rulerWidth} 76`}
            className="w-full max-w-[420px] h-auto drop-shadow-xs select-none overflow-visible"
            style={{ maxHeight: '82px' }}
          >
            {/* Object being measured */}
            <g transform={`translate(${rulerPaddingLeft + startCm * cmWidth}, 0)`}>
              {objType === 'eraser' && (
                <g>
                  <rect x="0" y="7" width={objWidth} height="24" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                  <path d={`M 0,7 L ${Math.max(6, objWidth * 0.45)},7 L ${Math.max(4, objWidth * 0.45 - 6)},31 L 0,31 Z`} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                  <text x={objWidth / 2} y="22" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="900">
                    TẨY
                  </text>
                </g>
              )}
              {objType === 'toy_car' && (
                <g>
                  <rect x="1" y="14" width={objWidth - 2} height="13" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
                  <path
                    d={`M ${Math.max(5, objWidth * 0.22)},14 L ${Math.max(8, objWidth * 0.38)},6 L ${Math.max(12, objWidth * 0.72)},6 L ${Math.max(16, objWidth * 0.85)},14 Z`}
                    fill="#dc2626"
                    stroke="#991b1b"
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M ${Math.max(7, objWidth * 0.25)},13 L ${Math.max(10, objWidth * 0.4)},8 L ${Math.max(12, objWidth * 0.52)},8 L ${Math.max(12, objWidth * 0.52)},13 Z`}
                    fill="#bae6fd"
                  />
                  <path
                    d={`M ${Math.max(14, objWidth * 0.56)},13 L ${Math.max(14, objWidth * 0.56)},8 L ${Math.max(16, objWidth * 0.7)},8 L ${Math.max(18, objWidth * 0.82)},13 Z`}
                    fill="#bae6fd"
                  />
                  <circle cx={Math.max(7, objWidth * 0.2)} cy="27" r="4" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
                  <circle cx={Math.max(15, objWidth * 0.8)} cy="27" r="4" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
                  <circle cx={objWidth - 2} cy="18" r="2" fill="#fef08a" />
                </g>
              )}
              {objType === 'pen' && (
                <g>
                  <rect x="0" y="10" width={Math.max(8, objWidth - 12)} height="15" rx="3" fill="#1e40af" stroke="#172554" strokeWidth="1.5" />
                  <rect x={Math.max(4, objWidth - 16)} y="10" width="4" height="15" fill="#fbbf24" />
                  <rect x="5" y="7" width={Math.max(8, (objWidth - 12) * 0.4)} height="3" rx="1" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                  <polygon points={`${Math.max(8, objWidth - 12)},10 ${objWidth},17.5 ${Math.max(8, objWidth - 12)},25`} fill="#e2e8f0" stroke="#64748b" strokeWidth="1.2" />
                  <line x1={Math.max(8, objWidth - 12)} y1="17.5" x2={objWidth - 2} y2="17.5" stroke="#0f172a" strokeWidth="0.8" />
                  <text x={(objWidth - 12) / 2} y="21" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    BÚT MỰC
                  </text>
                </g>
              )}
              {objType === 'pencil' && (
                <g>
                  <rect x="0" y="9" width="9" height="15" rx="2" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
                  <rect x="7" y="9" width="4" height="15" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
                  <rect x="11" y="9" width={Math.max(8, objWidth - 23)} height="15" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                  <line x1="11" y1="13.5" x2={Math.max(8, objWidth - 12)} y2="13.5" stroke="#eab308" strokeWidth="1" />
                  <line x1="11" y1="19.5" x2={Math.max(8, objWidth - 12)} y2="19.5" stroke="#eab308" strokeWidth="1" />
                  <polygon points={`${Math.max(19, objWidth - 12)},9 ${objWidth},16.5 ${Math.max(19, objWidth - 12)},24`} fill="#fed7aa" stroke="#f97316" strokeWidth="1" />
                  <polygon points={`${objWidth - 4},14 ${objWidth},16.5 ${objWidth - 4},19`} fill="#0f172a" />
                </g>
              )}
              {objType === 'spoon' && (
                <g>
                  <ellipse cx="12" cy="17" rx="11" ry="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                  <ellipse cx="12" cy="17" rx="8" ry="5.5" fill="#f8fafc" />
                  <path d={`M 22,15 L ${objWidth - 3},14 Q ${objWidth},17 ${objWidth - 3},20 L 22,19 Z`} fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                </g>
              )}
              {objType === 'block' && (
                <g>
                  <rect x="0" y="7" width={objWidth} height="22" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
                  <line x1="6" y1="13" x2={objWidth - 6} y2="13" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 3" />
                  <line x1="10" y1="21" x2={objWidth - 10} y2="21" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="8 4" />
                  <text x={objWidth / 2} y="19" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="900">
                    KHỐI GỖ
                  </text>
                </g>
              )}
              {objType === 'stick' && (
                <g>
                  <rect x="0" y="11" width={objWidth} height="12" rx="3" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
                  <text x={objWidth / 2} y="20" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    QUE TÍNH
                  </text>
                </g>
              )}
              {objType === 'card' && (
                <g>
                  <rect x="0" y="6" width={objWidth} height="23" rx="4" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
                  <rect x="3" y="9" width={objWidth - 6} height="17" rx="2" fill="#ffffff" />
                  <text x={objWidth / 2} y="21" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="900">
                    ★ THẺ HỌC
                  </text>
                </g>
              )}
              {objType === 'pencil_case' && (
                <g>
                  <rect x="0" y="7" width={objWidth} height="22" rx="6" fill="#818cf8" stroke="#4338ca" strokeWidth="2" />
                  <line x1="5" y1="11" x2={objWidth - 5} y2="11" stroke="#e0e7ff" strokeWidth="2" strokeDasharray="2 2" />
                  <circle cx="9" cy="11" r="2.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
                  <text x={objWidth / 2} y="22" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    HỘP BÚT
                  </text>
                </g>
              )}
              {objType === 'key' && (
                <g>
                  <circle cx="10" cy="17" r="8" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                  <circle cx="10" cy="17" r="3.5" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
                  <rect x="18" y="15" width={Math.max(6, objWidth - 24)} height="4" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                  <rect x={objWidth - 6} y="15" width="4" height="8" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                  <rect x={objWidth - 12} y="15" width="3" height="6" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                </g>
              )}
              {objType === 'comb' && (
                <g>
                  <rect x="0" y="7" width={objWidth} height="9" rx="3" fill="#c084fc" stroke="#7e22ce" strokeWidth="1.2" />
                  {Array.from({ length: Math.max(4, Math.floor(objWidth / 5)) }).map((_, idx) => (
                    <line
                      key={idx}
                      x1={4 + idx * 5}
                      y1="16"
                      x2={4 + idx * 5}
                      y2="28"
                      stroke="#9333ea"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  ))}
                </g>
              )}
              {objType === 'crayon' && (
                <g>
                  <rect x="0" y="8" width={Math.max(8, objWidth - 12)} height="17" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                  <rect x={Math.max(3, (objWidth - 12) * 0.25)} y="8" width={Math.max(6, (objWidth - 12) * 0.5)} height="17" fill="#fbbf24" />
                  <polygon points={`${Math.max(8, objWidth - 12)},8 ${objWidth},16.5 ${Math.max(8, objWidth - 12)},25`} fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" />
                  <text x={(objWidth - 12) / 2} y="20" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">
                    {objectName.replace(/Chiếc |Bút /gi, '')}
                  </text>
                </g>
              )}
            </g>

            {/* Red alignment guide lines at start and end */}
            <line
              x1={rulerPaddingLeft + startCm * cmWidth}
              y1="5"
              x2={rulerPaddingLeft + startCm * cmWidth}
              y2="34"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <line
              x1={rulerPaddingLeft + (startCm + lengthCm) * cmWidth}
              y1="5"
              x2={rulerPaddingLeft + (startCm + lengthCm) * cmWidth}
              y2="34"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />

            {/* Ruler Body */}
            <rect
              x="6"
              y="34"
              width={rulerWidth - 12}
              height="38"
              rx="5"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="2"
            />

            {/* Ruler Markings */}
            {Array.from({ length: totalRulerCm + 1 }).map((_, cm) => {
              const x = rulerPaddingLeft + cm * cmWidth;
              return (
                <g key={cm}>
                  {/* Major tick (Centimeter) */}
                  <line x1={x} y1="34" x2={x} y2="49" stroke="#78350f" strokeWidth="1.8" />
                  {/* Half-cm tick */}
                  {cm < totalRulerCm && (
                    <line x1={x + cmWidth / 2} y1="34" x2={x + cmWidth / 2} y2="43" stroke="#b45309" strokeWidth="1.2" />
                  )}
                  {/* Millimeter ticks */}
                  {cm < totalRulerCm && [1, 2, 3, 4, 6, 7, 8, 9].map((mm) => (
                    <line key={mm} x1={x + (cmWidth / 10) * mm} y1="34" x2={x + (cmWidth / 10) * mm} y2="39" stroke="#d97706" strokeWidth="0.7" />
                  ))}
                  {/* Centimeter number label */}
                  <text x={x} y="64" textAnchor="middle" fill="#451a03" fontSize="11" fontWeight="900" fontFamily="sans-serif">
                    {cm}
                  </text>
                </g>
              );
            })}

            {/* Ruler unit label */}
            <text x={rulerWidth - 22} y="64" fill="#92400e" fontSize="10" fontWeight="bold">
              cm
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 7. ANALOG CLOCK (Đồng hồ kim chuẩn SVG: Tuyệt đối không che chữ số)
  // Quy chuẩn: Tâm số ở 0.82R, kim phút dài 0.66R, kim giờ dài 0.48R
  // -------------------------------------------------------------
  if (config.mode === 'clock') {
    const hour = config.hour ?? 7;
    const minute = config.minute ?? 0;
    // R = 90 in viewBox 0 0 200 200 (center 100, 100)
    // Angles in degrees
    const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;
    const minuteAngle = minute * 6; // 0 degrees for exact hour (points to 12)

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-sky-50 to-indigo-50/70 rounded-2xl border border-indigo-200 text-center select-none shadow-2xs">
        <div className="flex justify-center items-center py-0.5">
          <svg
            viewBox="0 0 200 200"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 drop-shadow-md select-none overflow-visible"
          >
            {/* Outer Rim */}
            <circle cx="100" cy="100" r="95" fill="#f8fafc" stroke="#4338ca" strokeWidth="4.5" />
            <circle cx="100" cy="100" r="89" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="#f1f5f9" strokeWidth="3" />

            {/* 60 Minute ticks around the dial */}
            {Array.from({ length: 60 }).map((_, i) => {
              if (i % 5 === 0) return null; // 5-minute ticks have numbers
              const rad = ((i * 6 - 90) * Math.PI) / 180;
              const x1 = 100 + 84 * Math.cos(rad);
              const y1 = 100 + 84 * Math.sin(rad);
              const x2 = 100 + 87 * Math.cos(rad);
              const y2 = 100 + 87 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1.2" />;
            })}

            {/* 12 Clock Numbers: Centers at 0.82 * R = 73.8px */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
              const rad = ((num * 30 - 90) * Math.PI) / 180;
              const x = 100 + 73.8 * Math.cos(rad);
              const y = 100 + 73.8 * Math.sin(rad);
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#1e1b4b"
                  fontSize="13.5"
                  fontWeight="900"
                  fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
                >
                  {num}
                </text>
              );
            })}

            {/* Long Minute Hand (Kim phút / Kim dài):
                Length = 0.66 * R = 59.4px. Tip stops at radius 59.
                Number 12 center is at 73.8px (bottom at ~33px).
                Hand tip stops at 100 - 59 = 41px -> 8px SAFE GAP from number 12!
            */}
            <g transform={`rotate(${minuteAngle}, 100, 100)`}>
              {/* Counter-tail */}
              <line x1="100" y1="100" x2="100" y2="109" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
              {/* Main hand shaft */}
              <line x1="100" y1="100" x2="100" y2="43" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
              {/* Arrowhead stopping safely before number zone at radius 59 (y=41) */}
              <polygon points="100,41 96,47 104,47" fill="#0284c7" />
            </g>

            {/* Short Hour Hand (Kim giờ / Kim ngắn):
                Length = 0.48 * R = 43.2px. Tip stops at radius 43.
                Leaves 30.8px wide clearance from all digits!
            */}
            <g transform={`rotate(${hourAngle}, 100, 100)`}>
              {/* Counter-tail */}
              <line x1="100" y1="100" x2="100" y2="107" stroke="#e11d48" strokeWidth="4.5" strokeLinecap="round" />
              {/* Main hand shaft */}
              <line x1="100" y1="100" x2="100" y2="59" stroke="#e11d48" strokeWidth="5.5" strokeLinecap="round" />
              {/* Arrowhead stopping at radius 43 (y=57) */}
              <polygon points="100,57 95,64 105,64" fill="#e11d48" />
            </g>

            {/* Center Pivot Nut & Pin */}
            <circle cx="100" cy="100" r="5.5" fill="#1e1b4b" stroke="#ffffff" strokeWidth="2" />
            <circle cx="100" cy="100" r="1.8" fill="#f59e0b" />
          </svg>
        </div>

        <div className="text-[11px] font-bold text-indigo-950">
          Đồng hồ chỉ: <strong className="text-rose-600">{hour} giờ đúng</strong> (Kim ngắn chỉ số {hour}, kim dài chỉ số 12)
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 8. TENS AND ONES (Chục và đơn vị)
  // -------------------------------------------------------------
  if (config.mode === 'tens-ones' && config.tens !== undefined && config.ones !== undefined) {
    const tens = config.tens;
    const ones = config.ones;
    const total = tens * 10 + ones;

    return (
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-2xl border border-indigo-200 shadow-2xs">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {/* Cột Bó Chục */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-black text-amber-950 shrink-0">
              {tens} Bó chục ({tens * 10} que):
            </span>
            <div className="flex items-center gap-1.5">
              {tens === 0 ? (
                <span className="text-[10px] text-amber-600 italic">(0 bó)</span>
              ) : (
                Array.from({ length: tens }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <svg width="36" height="40" viewBox="0 0 68 72" className="select-none">
                      {[5, 11, 17, 23, 29, 35, 41, 47, 53, 59].map((x, sIdx) => (
                        <rect key={sIdx} x={x} y="4" width="4" height="64" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
                      ))}
                      <rect x="2" y="28" width="64" height="16" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                      <text x="34" y="40" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                        10 QUE
                      </text>
                    </svg>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cột Que Tính Rời */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-black text-emerald-950 shrink-0">
              {ones} Que rời:
            </span>
            <div className="flex items-center gap-1">
              {ones === 0 ? (
                <span className="text-[10px] text-emerald-600 italic">(0 que)</span>
              ) : (
                Array.from({ length: ones }).map((_, i) => (
                  <svg key={i} width="6" height="40" viewBox="0 0 12 72" className="select-none">
                    <rect x="3" y="4" width="6" height="64" rx="2" fill="#10b981" stroke="#047857" strokeWidth="0.8" />
                  </svg>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
