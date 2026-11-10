/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Volume2, ArrowUp, ArrowDown, ArrowLeft as LeftIcon, ArrowRight as RightIcon, Sparkles } from 'lucide-react';
import { FullscreenStage } from '../common/FullscreenStage';

interface RobotRescueGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface MazeGate {
  r: number;
  c: number;
  question: string;
  questionVi: string;
  questionEn: string;
  options: number[];
  answer: number;
  isUnlocked: boolean;
}

export const RobotRescueGame: React.FC<RobotRescueGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  // 5x5 Grid: (0,0) Start -> (4,4) Home Base
  const [robotPos, setRobotPos] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [stepsCount, setStepsCount] = useState(0);
  const [gates, setGates] = useState<MazeGate[]>([
    { r: 1, c: 2, question: '4 + 3 = ?', questionVi: 'Mở cổng 1: 4 + 3 bằng mấy?', questionEn: 'Unlock gate 1: What is 4 + 3?', options: [6, 7, 8, 9], answer: 7, isUnlocked: false },
    { r: 3, c: 1, question: '9 - 4 = ?', questionVi: 'Mở cổng 2: 9 - 4 bằng mấy?', questionEn: 'Unlock gate 2: What is 9 - 4?', options: [4, 5, 6, 7], answer: 5, isUnlocked: false },
    { r: 3, c: 3, question: '10 - 2 = ?', questionVi: 'Mở cổng 3: 10 - 2 bằng mấy?', questionEn: 'Unlock gate 3: What is 10 - 2?', options: [7, 8, 9, 6], answer: 8, isUnlocked: false },
  ]);
  const [activeGate, setActiveGate] = useState<MazeGate | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  // Obstacle walls
  const obstacles = [
    { r: 0, c: 2 },
    { r: 1, c: 4 },
    { r: 2, c: 1 },
    { r: 2, c: 3 },
    { r: 4, c: 2 },
  ];

  const move = (dr: number, dc: number) => {
    if (activeGate || isCompleted) return;

    const nr = robotPos.r + dr;
    const nc = robotPos.c + dc;

    // Bounds check
    if (nr < 0 || nr > 4 || nc < 0 || nc > 4) {
      soundService.playIncorrect();
      return;
    }

    // Obstacle check
    if (obstacles.some((o) => o.r === nr && o.c === nc)) {
      soundService.playIncorrect();
      setFeedback('Vướng tảng đá rồi! Hãy tìm đường khác nhé!');
      setTimeout(() => setFeedback(null), 1200);
      return;
    }

    // Gate check
    const gate = gates.find((g) => g.r === nr && g.c === nc);
    if (gate && !gate.isUnlocked) {
      setActiveGate(gate);
      soundService.playClick();
      return;
    }

    // Valid move!
    soundService.playClick();
    setRobotPos({ r: nr, c: nc });
    setStepsCount((s) => s + 1);

    // Check Home Base (4, 4)
    if (nr === 4 && nc === 4) {
      setIsCompleted(true);
      soundService.praiseVictory(langMode);
      confetti({ particleCount: 160, spread: 90 });

      StorageService.recordActivity(student.id, {
        type: 'game',
        targetId: 'robot-rescue',
        targetName: 'Giải Cứu Robot',
        score: 3,
        totalQuestions: 3,
        starsEarned: 25,
        timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
      });

      const updated = StorageService.getCurrentStudent();
      if (updated) onUpdateStudent(updated);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGate || isCompleted) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        move(-1, 0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        move(1, 0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move(0, -1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        move(0, 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [robotPos, activeGate, isCompleted]);

  const handleGateAnswer = (val: number) => {
    if (!activeGate) return;

    if (val === activeGate.answer) {
      soundService.playCorrect();
      setGates((prev) =>
        prev.map((g) => (g.r === activeGate.r && g.c === activeGate.c ? { ...g, isUnlocked: true } : g))
      );
      setRobotPos({ r: activeGate.r, c: activeGate.c });
      setStepsCount((s) => s + 1);
      setActiveGate(null);
      setFeedback('Cổng năng lượng đã mở! Robot tiếp tục tiến bước!');
      setTimeout(() => setFeedback(null), 1500);

      if (activeGate.r === 4 && activeGate.c === 4) {
        setIsCompleted(true);
        soundService.praiseVictory(langMode);
      }
    } else {
      soundService.playIncorrect();
      setFeedback('Mật mã chưa chính xác! Bé hãy tính lại nhé!');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const restartGame = () => {
    setRobotPos({ r: 0, c: 0 });
    setStepsCount(0);
    setGates([
      { r: 1, c: 2, question: '4 + 3 = ?', questionVi: 'Mở cổng 1: 4 + 3 bằng mấy?', questionEn: 'Unlock gate 1: What is 4 + 3?', options: [6, 7, 8, 9], answer: 7, isUnlocked: false },
      { r: 3, c: 1, question: '9 - 4 = ?', questionVi: 'Mở cổng 2: 9 - 4 bằng mấy?', questionEn: 'Unlock gate 2: What is 9 - 4?', options: [4, 5, 6, 7], answer: 5, isUnlocked: false },
      { r: 3, c: 3, question: '10 - 2 = ?', questionVi: 'Mở cổng 3: 10 - 2 bằng mấy?', questionEn: 'Unlock gate 3: What is 10 - 2?', options: [7, 8, 9, 6], answer: 8, isUnlocked: false },
    ]);
    setActiveGate(null);
    setIsCompleted(false);
    setFeedback(null);
    soundService.playClick();
  };

  const unlockedCount = gates.filter((g) => g.isUnlocked).length;

  return (
    <FullscreenStage
      titleVi="Giải Cứu Robot"
      titleEn="Robot Maze Rescue"
      categoryBadge="Trò chơi Toán học 16:9"
      onBack={onBack}
    >
      <div className="flex-1 flex flex-col justify-between w-full h-full max-w-6xl mx-auto p-2 sm:p-3 overflow-hidden select-none">
        {/* Top Zone (15%): Header + Status */}
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-sm border border-teal-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-black text-xl shadow">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-teal-950 text-base md:text-lg">
                  {activeGate
                    ? `Giải mã cổng năng lượng: ${activeGate.questionVi}`
                    : 'Điều khiển Robot vượt mê cung về trạm sạc!'}
                </span>
                <button
                  onClick={() => {
                    const text = activeGate
                      ? activeGate.questionEn
                      : 'Navigate Robot through the maze to reach the charging station!';
                    soundService.speakEn(text);
                  }}
                  title="Nghe tiếng Anh chuẩn en-US"
                  className="p-1.5 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-800 cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] hidden sm:inline">en-US</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {activeGate ? activeGate.questionEn : 'Navigate Robot to the Charging Station (⚡🏠)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-teal-100 text-teal-900 px-3 py-1.5 rounded-xl font-bold text-xs">
              {stepsCount} Bước đi
            </div>
            <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl font-bold text-xs">
              🔓 {unlockedCount}/3 Cổng mở
            </div>
            <button
              onClick={restartGame}
              title="Chơi lại"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle Zone (65%): Maze Arena + Side Deck (Controls or Gate Cipher) */}
        <div className="flex-1 flex items-center justify-center gap-6 my-2 min-h-0">
          {/* 5x5 Maze Arena */}
          <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-xl border-4 border-teal-400 flex items-center justify-center">
            <div className="grid grid-cols-5 grid-rows-5 gap-2 p-2 bg-slate-800 rounded-2xl border-2 border-teal-500 shadow-inner">
              {Array.from({ length: 5 }).map((_, r) =>
                Array.from({ length: 5 }).map((_, c) => {
                  const isRobotHere = robotPos.r === r && robotPos.c === c;
                  const isHome = r === 4 && c === 4;
                  const isStart = r === 0 && c === 0;
                  const isRock = obstacles.some((o) => o.r === r && o.c === c);
                  const gate = gates.find((g) => g.r === r && g.c === c);

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center relative transition-all duration-200 ${
                        isRobotHere
                          ? 'bg-sky-400/90 ring-4 ring-yellow-400 shadow-2xl scale-105 z-10'
                          : isHome
                          ? 'bg-emerald-500/85 ring-2 ring-emerald-300'
                          : isRock
                          ? 'bg-slate-700 border-2 border-slate-600'
                          : gate && !gate.isUnlocked
                          ? 'bg-rose-500/80 ring-2 ring-rose-400 animate-pulse'
                          : gate && gate.isUnlocked
                          ? 'bg-emerald-900/70 border border-emerald-400'
                          : isStart
                          ? 'bg-sky-900/60 border border-sky-400'
                          : 'bg-slate-800/90 hover:bg-slate-700/60'
                      }`}
                    >
                      {isRobotHere && (
                        <RobotMathChibi expression={isCompleted ? 'cheering' : 'happy'} size="sm" className="scale-125 drop-shadow" />
                      )}
                      {!isRobotHere && isHome && (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl sm:text-3xl">⚡🏠</span>
                        </div>
                      )}
                      {!isRobotHere && isRock && <span className="text-2xl sm:text-3xl">🪨</span>}
                      {!isRobotHere && gate && !gate.isUnlocked && (
                        <span className="text-2xl sm:text-3xl">🔒</span>
                      )}
                      {!isRobotHere && gate && gate.isUnlocked && (
                        <span className="text-xl sm:text-2xl text-emerald-400">🔓</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Side Panel: Either Active Gate Cipher OR Directional Pad OR Victory */}
          <div className="w-80 md:w-96 flex flex-col items-center justify-center">
            {isCompleted ? (
              /* Victory Card in Middle Zone */
              <div className="w-full bg-gradient-to-br from-teal-50 to-emerald-100 rounded-3xl p-5 shadow-xl border-4 border-teal-400 text-center space-y-3">
                <div className="text-5xl animate-bounce">🤖⚡🏠🎉</div>
                <h3 className="text-xl font-black text-teal-950 font-heading">
                  ROBOT ĐÃ VỀ TRẠM AN TOÀN!
                </h3>
                <p className="text-xs font-bold text-teal-700">
                  Chúc mừng bé đã giải cứu thành công Robot!
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs py-1">
                  <div className="bg-white p-2 rounded-xl border border-teal-200">
                    <span className="text-slate-500">Bước đi: </span>
                    <strong className="text-teal-700">{stepsCount}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-teal-200">
                    <span className="text-slate-500">Phần thưởng: </span>
                    <strong className="text-amber-600">+25 ⭐</strong>
                  </div>
                </div>
                <div className="flex gap-2 justify-center pt-1">
                  <button
                    onClick={restartGame}
                    className="py-2.5 px-4 bg-teal-500 hover:bg-teal-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Chơi lại
                  </button>
                  <button
                    onClick={onBack}
                    className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-extrabold rounded-xl text-xs border border-slate-300 cursor-pointer"
                  >
                    Về kho trò chơi
                  </button>
                </div>
              </div>
            ) : activeGate ? (
              /* Gate Cipher Modal */
              <div className="w-full bg-white rounded-3xl p-5 shadow-xl border-4 border-rose-400 text-center space-y-3 animate-pulse-subtle">
                <div className="flex items-center justify-center gap-2 text-rose-700 font-black text-sm">
                  <span>🔒 CỔNG NĂNG LƯỢNG ĐANG KHÓA!</span>
                </div>
                <div className="text-3xl md:text-4xl font-black text-rose-950 font-heading py-3 bg-rose-50 rounded-2xl border-2 border-rose-200">
                  {activeGate.question}
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {activeGate.questionVi}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {activeGate.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleGateAnswer(opt)}
                      className="py-3 px-4 text-2xl font-black rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-950 border-2 border-rose-300 hover:border-rose-500 shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {feedback && (
                  <p className="text-xs font-bold text-rose-600 animate-pulse">
                    {feedback}
                  </p>
                )}
              </div>
            ) : (
              /* Directional Pad */
              <div className="w-full flex flex-col items-center gap-3 bg-slate-800/90 p-5 rounded-3xl border-2 border-teal-500/50 shadow-lg">
                <span className="text-xs font-black text-teal-300 uppercase tracking-wider">
                  Bấm Mũi Tên Để Di Chuyển
                </span>

                <button
                  onClick={() => move(-1, 0)}
                  disabled={activeGate !== null || isCompleted}
                  className="w-16 h-16 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-black flex items-center justify-center shadow-lg border-b-4 border-teal-700 cursor-pointer disabled:opacity-50"
                >
                  <ArrowUp className="w-8 h-8" />
                </button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => move(0, -1)}
                    disabled={activeGate !== null || isCompleted}
                    className="w-16 h-16 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-black flex items-center justify-center shadow-lg border-b-4 border-teal-700 cursor-pointer disabled:opacity-50"
                  >
                    <LeftIcon className="w-8 h-8" />
                  </button>

                  <button
                    onClick={() => move(1, 0)}
                    disabled={activeGate !== null || isCompleted}
                    className="w-16 h-16 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-black flex items-center justify-center shadow-lg border-b-4 border-teal-700 cursor-pointer disabled:opacity-50"
                  >
                    <ArrowDown className="w-8 h-8" />
                  </button>

                  <button
                    onClick={() => move(0, 1)}
                    disabled={activeGate !== null || isCompleted}
                    className="w-16 h-16 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-black flex items-center justify-center shadow-lg border-b-4 border-teal-700 cursor-pointer disabled:opacity-50"
                  >
                    <RightIcon className="w-8 h-8" />
                  </button>
                </div>

                {feedback && (
                  <p className="text-xs font-bold text-amber-400 text-center animate-pulse mt-1">
                    {feedback}
                  </p>
                )}
                <span className="text-[11px] text-teal-200/70">
                  (Hoặc dùng phím mũi tên trên bàn phím)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Zone (15%): Legend & Navigation */}
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <span className="text-base">🤖</span> Robot
            </span>
            <span className="flex items-center gap-1">
              <span className="text-base">🪨</span> Tảng đá
            </span>
            <span className="flex items-center gap-1">
              <span className="text-base">🔒</span> Cổng khóa
            </span>
            <span className="flex items-center gap-1">
              <span className="text-base">🔓</span> Cổng mở
            </span>
            <span className="flex items-center gap-1">
              <span className="text-base">⚡🏠</span> Trạm sạc đích
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Về kho trò chơi
            </button>
          </div>
        </div>
      </div>
    </FullscreenStage>
  );
};
