/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { StudentProfile, LanguageMode, Question } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { MathQuestionVisual } from '../common/MathQuestionVisual';
import { BilingualQuestionBox } from '../common/BilingualQuestionBox';
import {
  EXAM_PERIODS,
  ALL_16_EXAMS,
  ExamPackage,
  ExamQuestion,
  ExamPeriodInfo,
  CognitiveLevel,
} from '../../data/examReviewData';
import confetti from 'canvas-confetti';
import {
  FileCheck,
  Award,
  RotateCcw,
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Trophy,
  Star,
  BookOpen,
  Sparkles,
  ChevronRight,
  Check,
} from 'lucide-react';

interface MathReviewViewProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onUpdateStudent: (student: StudentProfile) => void;
  onBack: () => void;
  onFinishReview?: () => void;
}

export const MathReviewView: React.FC<MathReviewViewProps> = ({
  student,
  langMode,
  onUpdateStudent,
  onBack,
  onFinishReview,
}) => {
  // Navigation State
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [activeExam, setActiveExam] = useState<ExamPackage | null>(null);

  // Exam Taking State
  const [qIndex, setQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [filterReview, setFilterReview] = useState<'all' | 'correct' | 'incorrect'>('all');

  // Load student records to show best score on test cards
  const studentRecords = useMemo(() => {
    try {
      const all = StorageService.getAllRecords();
      return all.filter((r) => r.studentId === student.id && r.type === 'review');
    } catch {
      return [];
    }
  }, [student.id, isSubmitted]);

  const getBestScore = (testId: string): number | null => {
    const testRecords = studentRecords.filter((r) => r.targetId === testId);
    if (testRecords.length === 0) return null;
    return Math.max(...testRecords.map((r) => r.score || 0));
  };

  // Start Exam
  const handleStartExam = (exam: ExamPackage) => {
    setActiveExam(exam);
    setQIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowSubmitConfirm(false);
    setFilterReview('all');
    setStartTime(Date.now());
    soundService.playClick();
  };

  // Option selection during exam (silent, no instant right/wrong feedback)
  const handleSelectOption = (opt: any) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: opt }));
    soundService.playClick();
  };

  // Check unanswered questions
  const unansweredIndices = useMemo(() => {
    if (!activeExam) return [];
    const unanswered: number[] = [];
    activeExam.questions.forEach((_, idx) => {
      if (userAnswers[idx] === undefined || userAnswers[idx] === null || userAnswers[idx] === '') {
        unanswered.push(idx);
      }
    });
    return unanswered;
  }, [activeExam, userAnswers]);

  const answeredCount = activeExam ? activeExam.questions.length - unansweredIndices.length : 0;

  // Submit trigger
  const handleRequestSubmit = () => {
    if (unansweredIndices.length > 0) {
      setShowSubmitConfirm(true);
      soundService.playPop();
    } else {
      executeSubmit();
    }
  };

  // Execute Submission
  const executeSubmit = () => {
    if (!activeExam) return;
    setShowSubmitConfirm(false);

    let correctCount = 0;
    activeExam.questions.forEach((q, idx) => {
      const userAns = String(userAnswers[idx] ?? '').trim().toLowerCase();
      const correctAns = String(q.answer).trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount++;
      }
    });

    const scaledScore = Math.round((correctCount / activeExam.questions.length) * 10 * 10) / 10;
    const starsEarned = correctCount * 4;
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    setIsSubmitted(true);

    // Save record
    StorageService.recordActivity(student.id, {
      type: 'review',
      targetId: activeExam.testId,
      targetName: `${activeExam.periodTitleVi} - ${activeExam.titleVi}`,
      score: scaledScore,
      totalQuestions: activeExam.questions.length,
      starsEarned,
      timeSpentSeconds,
    });

    const updated = StorageService.getCurrentStudent();
    if (updated) onUpdateStudent(updated);

    // Play victory sound & confetti
    soundService.praiseVictory(langMode);
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  const selectedPeriod = useMemo(() => {
    return EXAM_PERIODS.find((p) => p.id === selectedPeriodId) || null;
  }, [selectedPeriodId]);

  const periodExams = useMemo(() => {
    if (!selectedPeriodId) return [];
    return ALL_16_EXAMS.filter((e) => e.periodId === selectedPeriodId);
  }, [selectedPeriodId]);

  // Level Badge Renderer
  const renderLevelBadge = (level?: CognitiveLevel) => {
    switch (level) {
      case 'nhan_biet':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-700 border border-blue-200">
            Mức 1: Nhận biết
          </span>
        );
      case 'thong_hieu':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200">
            Mức 2: Thông hiểu
          </span>
        );
      case 'van_dung':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-800 border border-purple-200">
            Mức 3: Vận dụng
          </span>
        );
      default:
        return null;
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: 4 EXAM PERIODS SELECTION SCREEN
  // -------------------------------------------------------------
  if (!selectedPeriodId) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-pink-100">
              <FileCheck className="w-4 h-4" /> Hệ Thống Kiểm Tra Đánh Giá Năng Lực Toán Lớp 1
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight drop-shadow-md">
              ÔN TẬP VÀ KIỂM TRA ĐỊNH KỲ
            </h1>
            <p className="text-sm md:text-base text-pink-100 font-medium max-w-2xl leading-relaxed">
              Chuẩn hóa theo 2 tập Sách Giáo Khoa Toán 1 (Kết nối tri thức với cuộc sống). Hệ thống gồm 4 đợt kiểm tra lớn, 16 đề thi chuẩn hóa và 240 câu hỏi trắc nghiệm sinh động!
            </p>
          </div>

          <div className="relative z-10 bg-white/95 text-slate-800 p-5 rounded-2xl shadow-lg text-center shrink-0 border-2 border-white/60">
            <div className="text-xs font-bold text-slate-500 uppercase">Tổng cộng</div>
            <div className="text-3xl font-black text-purple-700">16 ĐỀ THI</div>
            <div className="text-xs font-bold text-emerald-600 mt-1">240 Câu Hỏi Chuẩn SGK</div>
          </div>
        </div>

        {/* 4 Period Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EXAM_PERIODS.map((period, index) => {
            const exams = ALL_16_EXAMS.filter((e) => e.periodId === period.id);
            const completedCount = exams.filter((e) => getBestScore(e.testId) !== null).length;

            return (
              <div
                key={period.id}
                onClick={() => {
                  setSelectedPeriodId(period.id);
                  soundService.playClick();
                }}
                className="group bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-purple-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs">
                    {period.badge} · 4 ĐỀ CHUẨN
                  </span>
                  <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Đã hoàn thành: {completedCount} / 4 đề
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    {period.titleVi}
                  </h3>
                  <div className="text-xs font-bold text-purple-600 tracking-wide">
                    {period.titleEn}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <strong className="text-slate-800">Phạm vi SGK:</strong> {period.scopeVi}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    15 câu / đề · Thang điểm 10
                  </span>
                  <div className="flex items-center gap-2 text-sm font-black text-purple-700 group-hover:translate-x-1 transition-transform">
                    <span>Vào chọn đề</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: EXAM LIST (4 TESTS PER PERIOD)
  // -------------------------------------------------------------
  if (selectedPeriod && !activeExam) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedPeriodId(null);
              soundService.playClick();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm font-black text-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại 4 Đợt kiểm tra</span>
          </button>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            Học sinh: <strong className="text-purple-700">{student.fullName}</strong> ({student.className})
          </span>
        </div>

        {/* Period Banner */}
        <div className={`bg-gradient-to-r ${selectedPeriod.gradient} rounded-3xl p-6 text-white shadow-lg space-y-2`}>
          <div className="inline-block px-3 py-0.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
            {selectedPeriod.badge} · 4 ĐỀ KIỂM TRA CHUẨN SGK
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading">{selectedPeriod.titleVi}</h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-3xl">
            {selectedPeriod.scopeVi}
          </p>
        </div>

        {/* 4 Tests Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {periodExams.map((test) => {
            const best = getBestScore(test.testId);

            return (
              <div
                key={test.testId}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-purple-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-purple-100 text-purple-800">
                      Đề số {test.testNumber}
                    </span>
                    {best !== null ? (
                      <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <Trophy className="w-3.5 h-3.5" /> Điểm cao nhất: {best}/10
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Chưa làm</span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-1">{test.titleVi}</h3>
                  <div className="text-xs font-bold text-slate-500 mb-3">{test.titleEn}</div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-2xl text-[11px] font-bold text-slate-600 mb-4 text-center">
                    <div>
                      <span className="block text-blue-600 font-black text-xs">6 câu</span>
                      Nhận biết
                    </div>
                    <div>
                      <span className="block text-amber-600 font-black text-xs">6 câu</span>
                      Thông hiểu
                    </div>
                    <div>
                      <span className="block text-purple-600 font-black text-xs">3 câu</span>
                      Vận dụng
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Thời gian: {test.timeMinutes} phút
                  </span>
                  <button
                    onClick={() => handleStartExam(test)}
                    className="py-2.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs md:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span>{best !== null ? 'Làm lại đề thi' : 'Bắt đầu làm bài'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3 & 4: EXAM TAKING & EXAM RESULT SCREEN
  // -------------------------------------------------------------
  if (!activeExam) return null;

  const currentQ = activeExam.questions[qIndex];
  const isSelected = (opt: any) => userAnswers[qIndex] === opt;

  return (
    <div className="w-full aspect-[16/9] max-w-[calc((100dvh-1rem)*16/9)] max-h-[calc(100dvh-1rem)] mx-auto flex flex-col justify-between p-2 sm:p-3 overflow-hidden select-none bg-white rounded-2xl md:rounded-3xl border-2 border-purple-200 shadow-2xl animate-fadeIn">
      {/* 1. Header Bar: Compact & Full Context */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-xs border border-purple-200 shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isSubmitted || Object.keys(userAnswers).length === 0) {
                setActiveExam(null);
              } else {
                if (window.confirm('Bé có chắc muốn thoát bài kiểm tra này không? Kết quả đang làm sẽ không được lưu.')) {
                  setActiveExam(null);
                }
              }
              soundService.playClick();
            }}
            className="text-xs font-extrabold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Thoát đề</span>
          </button>

          <div className="hidden sm:block">
            <span className="text-xs font-black text-purple-900">
              {activeExam.periodTitleVi} · {activeExam.titleVi}
            </span>
          </div>
        </div>

        {/* Question Counter & SGK Info */}
        <div className="flex items-center gap-2">
          {!isSubmitted && (
            <>
              {renderLevelBadge(currentQ.level)}
              {currentQ.sgk && (
                <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {currentQ.sgk}
                </span>
              )}
            </>
          )}

          <div className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            {!isSubmitted ? `Câu ${qIndex + 1} / 15` : 'Đã nộp bài'}
          </div>

          {!isSubmitted && (
            <button
              onClick={handleRequestSubmit}
              className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Nộp bài
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Body: Taking Exam (Zero scroll 16:9 layout) OR Result Board */}
      {!isSubmitted ? (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          {/* Question & Visual Box */}
          <div className="space-y-3">
            <BilingualQuestionBox
              promptVi={currentQ.promptVi}
              promptEn={currentQ.promptEn}
              langMode={langMode}
              badgeText={`Câu ${qIndex + 1} / 15 · ${
                currentQ.level === 'nhan_biet'
                  ? 'Mức 1: Nhận biết'
                  : currentQ.level === 'thong_hieu'
                  ? 'Mức 2: Thông hiểu'
                  : 'Mức 3: Vận dụng'
              }`}
            >
              {currentQ.visualConfig && (
                <div className="mt-1 p-2 bg-white/90 rounded-2xl border border-sky-200/80 max-h-48 flex items-center justify-center overflow-hidden">
                  <MathQuestionVisual question={currentQ as unknown as Question} />
                </div>
              )}
            </BilingualQuestionBox>

            {/* Answer Options Grid: 3 or 4 choices */}
            {currentQ.options && (
              <div
                className={`grid gap-2.5 ${
                  currentQ.options.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {currentQ.options.map((opt, i) => {
                  const active = isSelected(opt);
                  const optLabels = ['A', 'B', 'C', 'D'];
                  const label = optLabels[i] || String(i + 1);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`relative p-3 sm:p-4 rounded-2xl border-2 font-black transition-all cursor-pointer text-left flex items-center gap-3 active:scale-[0.98] ${
                        active
                          ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300 shadow-md scale-[1.01]'
                          : 'bg-white hover:bg-purple-50/60 border-slate-200 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shrink-0 transition-colors ${
                          active
                            ? 'bg-white text-purple-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-base sm:text-lg md:text-xl font-bold flex-1 leading-snug">
                        {opt}
                      </span>
                      {active && (
                        <Check className="w-5 h-5 text-white shrink-0 animate-scaleIn" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Bottom Controls: Question Palette 1-15 & Navigation */}
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200 shrink-0 space-y-2 mt-2">
            {/* Palette: 15 buttons */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
              {activeExam.questions.map((_, idx) => {
                const isCurrent = idx === qIndex;
                const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== null && userAnswers[idx] !== '';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQIndex(idx);
                      soundService.playClick();
                    }}
                    title={`Câu ${idx + 1}${isAnswered ? ' (Đã chọn đáp án)' : ' (Chưa làm)'}`}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300 scale-105 shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav: Previous / Next / Submit */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setQIndex(Math.max(0, qIndex - 1));
                  soundService.playClick();
                }}
                disabled={qIndex === 0}
                className="py-2 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Câu trước</span>
              </button>

              <div className="text-xs font-bold text-slate-500">
                Đã hoàn thành: <strong className="text-emerald-700">{answeredCount}</strong> / 15 câu
              </div>

              {qIndex + 1 < activeExam.questions.length ? (
                <button
                  type="button"
                  onClick={() => {
                    setQIndex(qIndex + 1);
                    soundService.playClick();
                  }}
                  className="py-2 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs md:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Câu tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestSubmit}
                  className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs md:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Nộp bài & Chấm điểm</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* -------------------------------------------------------------
           VIEW 4: EXAM RESULT & COMPREHENSIVE ANSWER REVIEW
           ------------------------------------------------------------- */
        <div className="space-y-6 pb-6 animate-fadeIn">
          {/* Digital Certificate & Score Card */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-6 md:p-8 shadow-xl border-4 border-amber-300 text-center space-y-4">
            <div className="text-5xl animate-bounce">📜🎖️⭐</div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                KẾT QUẢ ĐÁNH GIÁ NĂNG LỰC TOÁN HỌC LỚP 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
                {activeExam.titleVi}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-800">
                {activeExam.periodTitleVi} · SGK Kết nối tri thức với cuộc sống
              </p>
            </div>

            {/* Certificate Box */}
            <div className="bg-white p-6 rounded-3xl border-4 border-double border-amber-300 max-w-xl mx-auto shadow-md space-y-4">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                CHỨNG NHẬN THÀNH TÍCH TOÁN HỌC
              </div>
              <p className="text-sm font-bold text-slate-700">
                Chúc mừng nhà toán học nhí:{' '}
                <strong className="text-purple-700 text-base">{student.fullName}</strong> – Lớp{' '}
                <strong className="text-purple-700 text-base">{student.className}</strong>
              </p>

              {/* Score Display (10-point scale) */}
              {(() => {
                let correct = 0;
                activeExam.questions.forEach((q, idx) => {
                  if (String(userAnswers[idx] ?? '').trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
                    correct++;
                  }
                });
                const scaled = Math.round((correct / activeExam.questions.length) * 10 * 10) / 10;
                const stars = correct * 4;

                let feedback = '';
                if (scaled === 10) {
                  feedback = 'Xuất sắc tuyệt đối! Bé là thiên tài Toán học lớp 1!';
                } else if (scaled >= 9) {
                  feedback = 'Giỏi lắm! Bé nắm rất vững toàn bộ kiến thức!';
                } else if (scaled >= 7) {
                  feedback = 'Khá lắm! Bé chỉ cần chú ý thêm một chút nữa là đạt điểm 10!';
                } else {
                  feedback = 'Cố gắng lên nhé! Bé hãy xem lại lời giải chi tiết bên dưới nhé!';
                }

                return (
                  <div className="py-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <div className="text-xs font-black text-amber-800 uppercase tracking-wider">
                      ĐIỂM SỐ ĐẠT ĐƯỢC
                    </div>
                    <div className="text-4xl sm:text-5xl font-black text-rose-600 font-heading">
                      {scaled} / 10 ĐIỂM
                    </div>
                    <div className="text-xs font-bold text-slate-600">
                      Trả lời đúng: <strong className="text-emerald-700">{correct}</strong> / 15 câu
                    </div>
                    <div className="text-xs font-black text-amber-600 mt-1">
                      ⭐ Thưởng +{stars} Sao Toán Học
                    </div>
                    <p className="text-xs font-bold text-purple-700 pt-1 italic">
                      "{feedback}"
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleStartExam(activeExam)}
                className="py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại đề thi này</span>
              </button>
              <button
                onClick={() => {
                  setActiveExam(null);
                  soundService.playClick();
                }}
                className="py-3 px-6 bg-white hover:bg-slate-100 text-slate-800 font-black text-xs sm:text-sm rounded-2xl border-2 border-slate-300 transition-all cursor-pointer"
              >
                Chọn đề khác trong đợt này
              </button>
              <button
                onClick={() => {
                  setActiveExam(null);
                  setSelectedPeriodId(null);
                  soundService.playClick();
                }}
                className="py-3 px-6 bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-xs sm:text-sm rounded-2xl transition-all cursor-pointer"
              >
                Danh sách 4 Đợt thi
              </button>
              {onFinishReview && (
                <button
                  onClick={onFinishReview}
                  className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>🏁 Về Trang chủ</span>
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question by Question Review */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  XEM LẠI CHI TIẾT 15 CÂU HỎI VÀ ĐÁP ÁN
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Đối chiếu đáp án của bé và lời giải thích chính xác theo SGK Kết nối tri thức
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-black">
                <button
                  onClick={() => setFilterReview('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterReview === 'all' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tất cả (15)
                </button>
                <button
                  onClick={() => setFilterReview('correct')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterReview === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Đúng
                </button>
                <button
                  onClick={() => setFilterReview('incorrect')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterReview === 'incorrect' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Chưa đúng
                </button>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {activeExam.questions
                .map((q, idx) => {
                  const userAns = userAnswers[idx];
                  const isCorrect = String(userAns ?? '').trim().toLowerCase() === String(q.answer).trim().toLowerCase();
                  return { q, idx, userAns, isCorrect };
                })
                .filter(({ isCorrect }) => {
                  if (filterReview === 'correct') return isCorrect;
                  if (filterReview === 'incorrect') return !isCorrect;
                  return true;
                })
                .map(({ q, idx, userAns, isCorrect }) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 ${
                      isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white ${
                            isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-extrabold text-slate-700">
                          Câu hỏi {idx + 1}
                        </span>
                        {renderLevelBadge(q.level)}
                        {q.sgk && (
                          <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {q.sgk}
                          </span>
                        )}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đúng (+1 câu)
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Chưa đúng
                          </>
                        )}
                      </span>
                    </div>

                    {/* Question Prompts */}
                    <div className="space-y-0.5 bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        {q.promptVi}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-2">
                        <span>{q.promptEn}</span>
                        <button
                          type="button"
                          onClick={() => soundService.speak(q.promptEn, 'en', { rate: 0.88 })}
                          className="text-purple-600 hover:text-purple-800 cursor-pointer"
                          title="Nghe câu hỏi tiếng Anh"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Answer Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Bé đã chọn:</span>
                        <span className={`text-sm font-black ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {userAns !== undefined && userAns !== null && userAns !== '' ? String(userAns) : '(Chưa chọn đáp án)'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-300">
                        <span className="text-slate-500 block text-[11px]">Đáp án đúng:</span>
                        <span className="text-sm font-black text-emerald-700">
                          {String(q.answer)}
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    {q.explanationVi && (
                      <div className="text-xs font-medium text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-purple-900 font-bold">Giải thích:</strong> {q.explanationVi}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal if unanswered questions exist */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-purple-200 space-y-4 text-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Bé còn {unansweredIndices.length} câu chưa làm!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bé chưa chọn đáp án cho các câu:{' '}
                <strong className="text-purple-700">
                  {unansweredIndices.map((i) => `Câu ${i + 1}`).join(', ')}
                </strong>
                . Bé có muốn quay lại hoàn thành nốt không?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  // Jump to first unanswered question
                  if (unansweredIndices.length > 0) {
                    setQIndex(unansweredIndices[0]);
                  }
                  soundService.playClick();
                }}
                className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer"
              >
                Làm tiếp câu chưa xong
              </button>

              <button
                type="button"
                onClick={executeSubmit}
                className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                Vẫn nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
