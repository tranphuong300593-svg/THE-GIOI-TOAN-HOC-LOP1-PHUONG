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
import { ArrowLeft, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface HungryCrocodileGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';
type ComparisonSign = '>' | '<' | '=';

interface GateStage {
  gateNumber: number;
  gateNameVi: string;
  leftVal: number;
  rightVal: number;
  leftItems?: string[]; // Emojis for easy level
  rightItems?: string[];
  correctSign: ComparisonSign;
}

const GATE_NAMES = [
  'Cổng Bến Sậy',
  'Cổng Đầm Sen',
  'Cổng Thác Bạc',
  'Cổng Cây Si',
  'Cổng Lâu Đài',
];

export const HungryCrocodileGame: React.FC<HungryCrocodileGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [gateIdx, setGateIdx] = useState(0);
  const [gates, setGates] = useState<GateStage[]>([]);
  const [selectedSign, setSelectedSign] = useState<ComparisonSign | null>(null);
  const [isGateOpening, setIsGateOpening] = useState(false);
  const [rabbitCrossed, setRabbitCrossed] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Generate 5 gates based on level
  const generateGates = (diff: DifficultyLevel): GateStage[] => {
    const list: GateStage[] = [];
    const itemIcons = ['🍎', '🥕', '🐟', '⭐', '🍓'];

    for (let g = 0; g < 5; g++) {
      let lVal = 0;
      let rVal = 0;

      if (diff === 'easy') {
        // Quantities up to 10
        lVal = Math.floor(Math.random() * 8) + 2;
        rVal = g === 2 ? lVal : Math.floor(Math.random() * 8) + 2;
      } else if (diff === 'medium') {
        // Numbers up to 20
        lVal = Math.floor(Math.random() * 12) + 8;
        rVal = g === 3 ? lVal : Math.floor(Math.random() * 12) + 8;
      } else {
        // Up to 100, including reversed digits (e.g. 47 vs 74) or tens
        if (g === 1) {
          // Reversed digits test
          const tens = Math.floor(Math.random() * 5) + 3;
          const ones = Math.floor(Math.random() * 5) + 2;
          lVal = tens * 10 + ones;
          rVal = ones * 10 + tens;
        } else if (g === 4) {
          // Equal
          lVal = (Math.floor(Math.random() * 8) + 2) * 10;
          rVal = lVal;
        } else {
          lVal = Math.floor(Math.random() * 60) + 20;
          rVal = Math.floor(Math.random() * 60) + 20;
        }
      }

      const correctSign: ComparisonSign = lVal > rVal ? '>' : lVal < rVal ? '<' : '=';
      const icon = itemIcons[g % itemIcons.length];

      list.push({
        gateNumber: g + 1,
        gateNameVi: GATE_NAMES[g],
        leftVal: lVal,
        rightVal: rVal,
        leftItems: diff === 'easy' ? Array.from({ length: lVal }, () => icon) : undefined,
        rightItems: diff === 'easy' ? Array.from({ length: rVal }, () => icon) : undefined,
        correctSign,
      });
    }

    return list;
  };

  const handleStartGame = (selectedDiff: DifficultyLevel) => {
    setLevel(selectedDiff);
    const gen = generateGates(selectedDiff);
    setGates(gen);
    setGateIdx(0);
    setSelectedSign(null);
    setIsGateOpening(false);
    setRabbitCrossed(false);
    setFeedback(null);
    setIsCompleted(false);
    setStartTime(Date.now());
    setGameStarted(true);
    soundService.playClick();
  };

  const currentGate = gates[gateIdx];

  const handleSelectSign = (sign: ComparisonSign) => {
    if (!currentGate || isGateOpening || isCompleted) return;

    soundService.playClick();
    setSelectedSign(sign);

    if (sign === currentGate.correctSign) {
      // Correct! Crocodile opens gate and bridge lowers
      soundService.playCorrect();
      soundService.playMagicChime();
      soundService.praiseCorrect(langMode);
      setIsGateOpening(true);
      setRabbitCrossed(true);

      const signWord = sign === '>' ? 'LỚN HƠN' : sign === '<' ? 'BÉ HƠN' : 'BẰNG NHAU';
      setFeedback({
        text: `Chính xác! ${currentGate.leftVal} ${signWord} ${currentGate.rightVal}! Cá sấu hạ cầu cho thỏ qua!`,
        isCorrect: true,
      });

      setTimeout(() => {
        setIsGateOpening(false);
        setRabbitCrossed(false);
        setSelectedSign(null);
        setFeedback(null);

        if (gateIdx + 1 < gates.length) {
          setGateIdx((g) => g + 1);
        } else {
          // Completed all 5 gates!
          setIsCompleted(true);
          soundService.praiseVictory(langMode);
          confetti({ particleCount: 160, spread: 90 });

          StorageService.recordActivity(student.id, {
            type: 'game',
            targetId: 'hungry-crocodile',
            targetName: 'Cánh Cổng Cá Sấu Tham Ăn',
            score: 5,
            totalQuestions: 5,
            starsEarned: 20,
            timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          const updated = StorageService.getCurrentStudent();
          if (updated) onUpdateStudent(updated);
        }
      }, 1600);
    } else {
      // Wrong sign
      soundService.playIncorrect();
      setFeedback({
        text: `Cá sấu lắc đầu rồi! Hãy nhớ: miệng cá sấu luôn há to về phía số LỚN HƠN nhé!`,
        isCorrect: false,
      });
      setSelectedSign(null);
    }
  };

  // --- START SCREEN ---
  if (!gameStarted) {
    return (
      <FullscreenStage
        titleVi="LÂU ĐÀI NHỮNG CON SỐ • CÁNH CỔNG CÁ SẤU THAM ĂN"
        titleEn="HUNGRY CROCODILE COMPARISON GATES"
        categoryBadge="Khu 1: Lâu đài những con số"
        onBack={onBack}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-4 max-w-4xl mx-auto text-center space-y-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl flex items-center justify-center text-5xl sm:text-6xl border-4 border-emerald-200 animate-bounce">
            🐊
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Be_Vietnam_Pro'] text-slate-800">
              CÁNH CỔNG CÁ SẤU THAM ĂN
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-xl mx-auto">
              Chú cá sấu háu ăn canh giữ dòng sông luôn há miệng to về phía bên có <strong>nhiều hơn</strong>! Bé hãy chọn đúng dấu (&gt;, &lt;, =) để mở cầu cho thỏ con qua sông nhé!
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border-2 border-emerald-200 shadow-md w-full max-w-md space-y-4">
            <div className="text-xs font-black uppercase text-emerald-800 tracking-wider">
              Chọn mức độ thử thách
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleStartGame('easy')}
                className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                🌱 DỄ
                <div className="text-[10px] font-medium opacity-90">So sánh đồ vật ≤ 10</div>
              </button>

              <button
                type="button"
                onClick={() => handleStartGame('medium')}
                className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                ⭐ VỪA
                <div className="text-[10px] font-medium opacity-90">So sánh số ≤ 20</div>
              </button>

              <button
                type="button"
                onClick={() => handleStartGame('hard')}
                className="py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                🔥 THỬ THÁCH
                <div className="text-[10px] font-medium opacity-90">So sánh số ≤ 100</div>
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
        titleVi="LÂU ĐÀI NHỮNG CON SỐ • VƯỢT CẢ 5 CÁNH CỔNG THÀNH CÔNG!"
        categoryBadge="Khu 1: Lâu đài những con số"
        onBack={onBack}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-emerald-400 border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-bounce">
            🎉
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              Hoàn thành 5/5 Cánh Cổng Sông
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Be_Vietnam_Pro'] text-slate-900">
              THỎ CON ĐÃ VỀ LÂU ĐÀI AN TOÀN!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
              Chúc mừng <strong>{student.fullName}</strong>! Bé so sánh số và sử dụng dấu &gt;, &lt;, = cực kỳ chính xác, khiến chú cá sấu vui vẻ hạ cầu cho thỏ con qua cả 5 cánh cổng!
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
              <span>CHƠI LẠI CÁNH CỔNG MỚI</span>
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
      titleVi={`CÁNH CỔNG CÁ SẤU • ${currentGate.gateNameVi.toUpperCase()}`}
      titleEn="HUNGRY CROCODILE COMPARISON GATES"
      categoryBadge={`Khu 1 • Cổng ${currentGate.gateNumber}/5`}
      onBack={onBack}
      topRightControls={
        <button
          type="button"
          onClick={() => handleStartGame(level)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Làm lại</span>
        </button>
      }
    >
      <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 max-w-5xl mx-auto select-none">
        {/* Progress Header */}
        <div className="flex items-center justify-between gap-2 bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-900 uppercase">Cánh cổng:</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all ${
                    i < gateIdx
                      ? 'bg-emerald-500 text-white'
                      : i === gateIdx
                      ? 'bg-teal-600 text-white ring-2 ring-yellow-400'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {i < gateIdx ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs font-bold text-emerald-800">
            {currentGate.gateNameVi}
          </div>
        </div>

        {/* River Stage: Left Bank vs Crocodile Bridge vs Right Bank */}
        <div className="bg-gradient-to-b from-sky-300 via-teal-200 to-emerald-200 rounded-3xl p-5 sm:p-8 shadow-xl border-3 border-teal-400/50 relative overflow-hidden flex flex-col items-center justify-center space-y-6">
          {/* Water waves background decor */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-blue-500/20 backdrop-blur-3xs pointer-events-none" />

          {/* Prompt banner */}
          <div className="bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full shadow-xs border border-teal-300 text-center">
            <span className="text-xs sm:text-sm font-black text-teal-950">
              🐊 Chọn miệng cá sấu đúng: há về bên LỚN HƠN (&gt; hoặc &lt;) hoặc ngậm miệng (=)!
            </span>
          </div>

          {/* Comparison Arena: Left Bank - Crocodile - Right Bank */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center w-full max-w-3xl z-10">
            {/* Bờ bên trái */}
            <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border-3 border-blue-300 shadow-md flex flex-col items-center justify-center space-y-2 min-h-36">
              <span className="text-xs font-black text-blue-700 uppercase">Bờ bên trái</span>
              <span className="text-4xl sm:text-5xl font-black text-blue-900 font-['Be_Vietnam_Pro']">
                {currentGate.leftVal}
              </span>
              {currentGate.leftItems && (
                <div className="flex flex-wrap justify-center gap-1 max-w-32">
                  {currentGate.leftItems.map((icon, idx) => (
                    <span key={idx} className="text-base sm:text-lg">
                      {icon}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Vị trí cá sấu ở giữa (Cầu qua sông) */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-600/20 border-3 border-dashed border-emerald-600 flex items-center justify-center text-4xl sm:text-5xl shadow-inner relative">
                {selectedSign === '>' && <span className="text-emerald-700 font-black">&gt;</span>}
                {selectedSign === '<' && <span className="text-emerald-700 font-black">&lt;</span>}
                {selectedSign === '=' && <span className="text-emerald-700 font-black">=</span>}
                {selectedSign === null && <span className="text-emerald-400 font-black animate-pulse">?</span>}
              </div>

              {/* Thỏ con qua cầu */}
              <div className={`text-2xl transition-all duration-700 ${
                rabbitCrossed ? 'translate-x-12 opacity-100' : 'translate-x-0 opacity-80'
              }`}>
                🐰
              </div>
            </div>

            {/* Bờ bên phải */}
            <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border-3 border-purple-300 shadow-md flex flex-col items-center justify-center space-y-2 min-h-36">
              <span className="text-xs font-black text-purple-700 uppercase">Bờ bên phải</span>
              <span className="text-4xl sm:text-5xl font-black text-purple-900 font-['Be_Vietnam_Pro']">
                {currentGate.rightVal}
              </span>
              {currentGate.rightItems && (
                <div className="flex flex-wrap justify-center gap-1 max-w-32">
                  {currentGate.rightItems.map((icon, idx) => (
                    <span key={idx} className="text-base sm:text-lg">
                      {icon}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-black shadow-md ${
                feedback.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </div>

        {/* Bottom Crocodile Mouth Options: > vs < vs = */}
        <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="text-center text-xs font-black text-slate-700 uppercase">
            👉 Chạm chọn miệng cá sấu thích hợp:
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto pt-1">
            {/* Dấu LỚN HƠN (>) */}
            <button
              type="button"
              onClick={() => handleSelectSign('>')}
              className="py-3 sm:py-4 px-3 rounded-2xl bg-gradient-to-t from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-black shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 group"
            >
              <span className="text-2xl sm:text-3xl">&gt;</span>
              <span className="text-[11px] font-bold text-yellow-200">LỚN HƠN</span>
              <span className="text-[10px] text-white/80 hidden sm:inline">Há sang trái</span>
            </button>

            {/* Dấu BẰNG NHAU (=) */}
            <button
              type="button"
              onClick={() => handleSelectSign('=')}
              className="py-3 sm:py-4 px-3 rounded-2xl bg-gradient-to-t from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-yellow-950 font-black shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 group"
            >
              <span className="text-2xl sm:text-3xl">=</span>
              <span className="text-[11px] font-bold text-yellow-950">BẰNG NHAU</span>
              <span className="text-[10px] text-yellow-900/80 hidden sm:inline">Ngậm miệng</span>
            </button>

            {/* Dấu BÉ HƠN (<) */}
            <button
              type="button"
              onClick={() => handleSelectSign('<')}
              className="py-3 sm:py-4 px-3 rounded-2xl bg-gradient-to-t from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-black shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 group"
            >
              <span className="text-2xl sm:text-3xl">&lt;</span>
              <span className="text-[11px] font-bold text-yellow-200">BÉ HƠN</span>
              <span className="text-[10px] text-white/80 hidden sm:inline">Há sang phải</span>
            </button>
          </div>
        </div>
      </div>
    </FullscreenStage>
  );
};
