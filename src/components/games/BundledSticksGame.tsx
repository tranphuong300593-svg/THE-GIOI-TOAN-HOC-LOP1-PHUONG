/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { FullscreenStage } from '../common/FullscreenStage';
import { ArrowLeft, RotateCcw, Volume2, Sparkles, Box, CheckCircle2, Plus, Minus } from 'lucide-react';

interface BundledSticksGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface StickOrder {
  orderNumber: number;
  targetNumber: number;
  tens: number;
  ones: number;
}

export const BundledSticksGame: React.FC<BundledSticksGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [orderIdx, setOrderIdx] = useState(0);
  const [orders, setOrders] = useState<StickOrder[]>([]);
  const [placedTens, setPlacedTens] = useState(0);
  const [placedOnes, setPlacedOnes] = useState(0);
  const [isPackaging, setIsPackaging] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Generate 5 orders based on level
  const generateOrders = (diff: DifficultyLevel): StickOrder[] => {
    const list: StickOrder[] = [];
    const usedNumbers = new Set<number>();

    while (list.length < 5) {
      let num = 0;
      if (diff === 'easy') {
        // Up to 30
        num = Math.floor(Math.random() * 20) + 11; // 11..30
      } else if (diff === 'medium') {
        // Up to 60
        num = Math.floor(Math.random() * 30) + 31; // 31..60
      } else {
        // Up to 100
        const isRoundTen = Math.random() > 0.6;
        num = isRoundTen
          ? (Math.floor(Math.random() * 4) + 6) * 10 // 60, 70, 80, 90
          : Math.floor(Math.random() * 40) + 61; // 61..100
      }

      if (!usedNumbers.has(num)) {
        usedNumbers.add(num);
        list.push({
          orderNumber: list.length + 1,
          targetNumber: num,
          tens: Math.floor(num / 10),
          ones: num % 10,
        });
      }
    }

    return list;
  };

  const handleStartGame = (selectedDiff: DifficultyLevel) => {
    setLevel(selectedDiff);
    const gen = generateOrders(selectedDiff);
    setOrders(gen);
    setOrderIdx(0);
    setPlacedTens(0);
    setPlacedOnes(0);
    setIsPackaging(false);
    setFeedback(null);
    setIsCompleted(false);
    setStartTime(Date.now());
    setGameStarted(true);
    soundService.playClick();
  };

  const currentOrder = orders[orderIdx];

  const handleAddTen = () => {
    if (isPackaging || placedTens >= 10) return;
    soundService.playClick();
    setPlacedTens((t) => t + 1);
    setFeedback(null);
  };

  const handleRemoveTen = () => {
    if (isPackaging || placedTens <= 0) return;
    soundService.playClick();
    setPlacedTens((t) => t - 1);
    setFeedback(null);
  };

  const handleAddOne = () => {
    if (isPackaging || placedOnes >= 10) return;
    soundService.playClick();
    setPlacedOnes((o) => o + 1);
    setFeedback(null);
  };

  const handleRemoveOne = () => {
    if (isPackaging || placedOnes <= 0) return;
    soundService.playClick();
    setPlacedOnes((o) => o - 1);
    setFeedback(null);
  };

  const handlePack = () => {
    if (!currentOrder || isPackaging || isCompleted) return;

    setIsPackaging(true);

    if (placedTens === currentOrder.tens && placedOnes === currentOrder.ones) {
      // Correct!
      soundService.playCorrect();
      soundService.playMagicChime();
      soundService.praiseCorrect(langMode);
      setFeedback({
        text: `Tuyệt đỉnh! Số ${currentOrder.targetNumber} gồm đúng ${currentOrder.tens} chục và ${currentOrder.ones} đơn vị!`,
        isCorrect: true,
      });

      setTimeout(() => {
        setIsPackaging(false);
        setPlacedTens(0);
        setPlacedOnes(0);
        setFeedback(null);

        if (orderIdx + 1 < orders.length) {
          setOrderIdx((i) => i + 1);
        } else {
          // Finished all 5 orders
          setIsCompleted(true);
          soundService.praiseVictory(langMode);
          confetti({ particleCount: 160, spread: 90 });

          StorageService.recordActivity(student.id, {
            type: 'game',
            targetId: 'bundled-sticks',
            targetName: 'Nhà Máy Bó Que Tính Thần Kỳ',
            score: 5,
            totalQuestions: 5,
            starsEarned: 20,
            timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          const updated = StorageService.getCurrentStudent();
          if (updated) onUpdateStudent(updated);
        }
      }, 1500);
    } else {
      // Incorrect
      soundService.playIncorrect();
      setIsPackaging(false);
      setFeedback({
        text: `Chưa khớp rồi! Số ${currentOrder.targetNumber} cần ${currentOrder.tens} bó chục và ${currentOrder.ones} que đơn nhé!`,
        isCorrect: false,
      });
    }
  };

  // --- START SCREEN ---
  if (!gameStarted) {
    return (
      <FullscreenStage
        titleVi="LÂU ĐÀI NHỮNG CON SỐ • NHÀ MÁY BÓ QUE TÍNH THẦN KỲ"
        titleEn="MAGIC STICK BUNDLE FACTORY"
        categoryBadge="Khu 1: Lâu đài những con số"
        onBack={onBack}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-4 max-w-4xl mx-auto text-center space-y-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-xl flex items-center justify-center text-5xl sm:text-6xl border-4 border-amber-200 animate-bounce">
            🥢
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Be_Vietnam_Pro'] text-slate-800">
              NHÀ MÁY BÓ QUE TÍNH THẦN KỲ
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-xl mx-auto">
              Bé hãy giúp Robot đóng gói que tính thành các bó <strong>CHỤC</strong> (10 que) và que <strong>ĐƠN VỊ</strong> để hoàn thành các đơn hàng nhé!
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
                <div className="text-[10px] font-medium opacity-90">Số đến 30</div>
              </button>

              <button
                type="button"
                onClick={() => handleStartGame('medium')}
                className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                ⭐ VỪA
                <div className="text-[10px] font-medium opacity-90">Số đến 60</div>
              </button>

              <button
                type="button"
                onClick={() => handleStartGame('hard')}
                className="py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                🔥 THỬ THÁCH
                <div className="text-[10px] font-medium opacity-90">Số đến 100</div>
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
        titleVi="LÂU ĐÀI NHỮNG CON SỐ • NHÀ MÁY HOÀN THÀNH ĐƠN HÀNG!"
        categoryBadge="Khu 1: Lâu đài những con số"
        onBack={onBack}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-amber-400 border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-bounce">
            📦
          </div>

          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              Hoàn thành 5/5 Đơn Hàng Đóng Gói
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Be_Vietnam_Pro'] text-slate-900">
              XUẤT SẮC! ĐÃ GIAO ĐỦ CÁC KIỆN HÀNG!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
              Chúc mừng kỹ sư nhí <strong>{student.fullName}</strong>! Bé đã nắm vững cấu tạo số chục và đơn vị, đóng gói hoàn hảo tất cả các đơn hàng cho nhà máy!
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
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ĐÓNG GÓI ĐỢT MỚI</span>
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

  // --- GAMEPLAY SCREEN ---
  return (
    <FullscreenStage
      titleVi={`NHÀ MÁY BÓ QUE TÍNH • ĐƠN HÀNG SỐ ${currentOrder.orderNumber}/5`}
      titleEn="MAGIC STICK BUNDLE FACTORY"
      categoryBadge={`Khu 1 • Đơn hàng ${currentOrder.orderNumber}/5`}
      onBack={onBack}
      topRightControls={
        <button
          type="button"
          onClick={() => {
            setPlacedTens(0);
            setPlacedOnes(0);
            setFeedback(null);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Làm lại</span>
        </button>
      }
    >
      <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 max-w-5xl mx-auto select-none">
        {/* Progress header & Target Order Box */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-900 uppercase">Đơn hàng:</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                    i < orderIdx
                      ? 'bg-emerald-500 text-white'
                      : i === orderIdx
                      ? 'bg-amber-500 text-white ring-2 ring-yellow-400'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {i < orderIdx ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Current Target Order Banner */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-2xl shadow-sm">
            <Box className="w-4 h-4 text-yellow-200" />
            <span className="text-xs font-bold uppercase">Cần đóng gói số:</span>
            <span className="text-2xl font-black text-yellow-100 px-2 bg-black/20 rounded-lg">
              {currentOrder.targetNumber}
            </span>
          </div>
        </div>

        {/* Packing Machine Stage with 2 Trays: TENS & ONES */}
        <div className="bg-gradient-to-br from-slate-800 via-amber-950 to-slate-900 rounded-3xl p-5 sm:p-7 shadow-xl border-3 border-amber-400/40 relative overflow-hidden flex flex-col items-center justify-center space-y-5">
          {/* Machine gears & decor */}
          <div className="absolute top-3 left-4 text-2xl text-amber-400/30 animate-spin">⚙️</div>
          <div className="absolute bottom-3 right-4 text-3xl text-amber-400/30 animate-spin">⚙️</div>

          <div className="text-center text-xs text-amber-200 font-semibold">
            Bấm nút cộng (+) hoặc trừ (-) để xếp các bó chục và que tính đơn lẻ vào khay đóng gói:
          </div>

          {/* 2 Trays Row: CHỤC (Bó 10) vs ĐƠN VỊ (Que lẻ) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl z-10">
            {/* Khay CHỤC */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border-2 border-amber-400/60 flex flex-col items-center space-y-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                  <span>🎗️ Khay CHỤC:</span>
                  <span className="text-lg font-black text-white bg-amber-500/80 px-2 py-0.5 rounded-lg">
                    {placedTens} bó ({placedTens * 10})
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleRemoveTen}
                    disabled={placedTens <= 0}
                    className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-30 text-white font-black text-base flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={handleAddTen}
                    disabled={placedTens >= 10}
                    className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 text-white font-black text-base flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Bundles Visual Container */}
              <div className="w-full min-h-24 bg-black/30 rounded-xl p-2.5 flex flex-wrap items-center justify-center gap-2 border border-white/10">
                {placedTens === 0 ? (
                  <span className="text-xs text-white/40 italic">Chưa có bó chục nào</span>
                ) : (
                  Array.from({ length: placedTens }).map((_, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 bg-gradient-to-t from-amber-600 to-yellow-500 rounded-lg border-2 border-red-500 shadow-sm flex items-center gap-1 text-white animate-scale-up"
                    >
                      <span className="text-xs">🥢</span>
                      <span className="text-[11px] font-black">10</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Khay ĐƠN VỊ */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border-2 border-yellow-400/60 flex flex-col items-center space-y-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black uppercase text-yellow-300 flex items-center gap-1.5">
                  <span>🥢 Khay ĐƠN VỊ:</span>
                  <span className="text-lg font-black text-white bg-yellow-500/80 px-2 py-0.5 rounded-lg">
                    {placedOnes} que
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleRemoveOne}
                    disabled={placedOnes <= 0}
                    className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-30 text-white font-black text-base flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={handleAddOne}
                    disabled={placedOnes >= 10}
                    className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 text-white font-black text-base flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Single Sticks Visual Container */}
              <div className="w-full min-h-24 bg-black/30 rounded-xl p-2.5 flex flex-wrap items-center justify-center gap-1.5 border border-white/10">
                {placedOnes === 0 ? (
                  <span className="text-xs text-white/40 italic">Chưa có que lẻ nào</span>
                ) : (
                  Array.from({ length: placedOnes }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-14 bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 rounded-sm shadow-xs border border-yellow-200 animate-scale-up"
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Feedback Msg */}
          {feedback && (
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-black shadow-md ${
                feedback.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Pack Button */}
          <button
            type="button"
            onClick={handlePack}
            disabled={isPackaging}
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-yellow-950 font-black text-base shadow-xl border-2 border-yellow-200 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Box className="w-5 h-5 text-yellow-950" />
            <span>ĐÓNG GÓI KIỆN HÀNG NÀY 📦</span>
          </button>
        </div>

        {/* Bottom Helper Bar */}
        <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3 border border-slate-200 text-center text-xs text-slate-600 font-medium">
          💡 Ghi nhớ: Cứ <strong>10 que tính</strong> rời được bó lại thành <strong>1 chục</strong>!
        </div>
      </div>
    </FullscreenStage>
  );
};
