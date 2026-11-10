/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Lesson, StudentProfile, LanguageMode, LessonCertificate } from '../../types';
import { getLessonQuestionsPackage } from '../../data/lessonQuestionsData';
import { getLessonVocabulary, MathVocabItem } from '../../data/lessonVocabularyData';
import {
  FeedbackItem,
  getRandomPraise,
  getRandomEncouragement,
} from '../../data/lessonFeedbackData';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { MathQuestionVisual, resolveVisualConfig } from '../common/MathQuestionVisual';
import { LessonCertificateModal } from '../achievements/LessonCertificateModal';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Award,
  Gamepad2,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: Lesson;
  student: StudentProfile;
  langMode?: LanguageMode;
  onBack: () => void;
  onLaunchGame?: (gameId: string) => void;
  onUpdateStudent: (student: StudentProfile) => void;
  onFinishLesson?: () => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  student,
  onBack,
  onLaunchGame,
  onUpdateStudent,
  onFinishLesson,
}) => {
  // Package data for this lesson: exactly 5 questions + conclusion + vocabulary
  const lessonPkg = getLessonQuestionsPackage(lesson.id);
  const vocabList = getLessonVocabulary(lesson.id);

  // States
  const [phase, setPhase] = useState<'question' | 'vocab' | 'conclusion'>('question');
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionResults, setQuestionResults] = useState<Record<number, boolean>>({});
  const [startTime] = useState(Date.now());
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [playingQuestionAudio, setPlayingQuestionAudio] = useState(false);

  // Certificate Modal State & 1-Star Award Tracking
  const [certificate, setCertificate] = useState<LessonCertificate | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isNewCertificate, setIsNewCertificate] = useState(false);

  // English praise & encouragement non-consecutive feedback tracking
  const lastPraiseIndex = useRef<number>(-1);
  const lastEncouragementIndex = useRef<number>(-1);
  const [currentFeedback, setCurrentFeedback] = useState<
    (FeedbackItem & { isCorrect: boolean }) | null
  >(null);

  // Cancel any ongoing audio when mounting/unmounting, switching questions, or changing phase
  useEffect(() => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    return () => {
      soundService.cancelSpeech();
      setPlayingQuestionAudio(false);
    };
  }, [phase, qIndex]);

  const currentQ = lessonPkg.questions[qIndex] || lessonPkg.questions[0];

  // Play English question with standard en-US pronunciation
  const handlePlayQuestionSpeech = (enText: string) => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(true);
    soundService.speakEn(enText, {
      slow: true,
      onEnd: () => setPlayingQuestionAudio(false),
    });
  };

  // Handle student clicking an option directly
  const handleSelectOption = (opt: any) => {
    // If already answered correctly for this question, wait for Next
    if (isCorrect) return;

    // Immediately cancel any preceding speech to avoid overlapping voices
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    soundService.playClick();
    setSelectedOption(opt);

    const match = String(opt).trim().toLowerCase() === String(currentQ.answer).trim().toLowerCase();

    if (match) {
      setIsCorrect(true);
      setQuestionResults((prev) => ({ ...prev, [qIndex]: true }));
      setCorrectCount((prev) => prev + 1);

      // Play joyful sound effect: ting-ting, optionally with light applause
      soundService.playCorrect();
      if (Math.random() > 0.45) {
        setTimeout(() => soundService.playApplause(), 200);
      }

      // Celebratory sparkle stars
      confetti({
        particleCount: 26,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });

      // Pick random non-consecutive English praise
      const { item, index } = getRandomPraise(lastPraiseIndex.current);
      lastPraiseIndex.current = index;
      setCurrentFeedback({ ...item, isCorrect: true });

      // Speak ONLY the English praise in natural, cheerful child-friendly tone
      soundService.speakEn(item.en, { rate: 0.94, pitch: 1.1 });
    } else {
      setIsCorrect(false);
      soundService.playIncorrect();

      // Pick random non-consecutive English encouragement
      const { item, index } = getRandomEncouragement(lastEncouragementIndex.current);
      lastEncouragementIndex.current = index;
      setCurrentFeedback({ ...item, isCorrect: false });

      // Speak ONLY the English encouragement in gentle, supportive tone
      soundService.speakEn(item.en, { rate: 0.9, pitch: 1.05 });
      // Student is allowed to choose again directly!
    }
  };

  // Move to next question or transition to Phase 2 (Vocab)
  const handleNext = () => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    soundService.playClick();
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);

    if (qIndex + 1 < lessonPkg.questions.length) {
      setQIndex(qIndex + 1);
    } else {
      // Completed all 5 questions -> Transition to Phase 2: Luyện đọc Tiếng Anh
      soundService.cancelSpeech();
      setPhase('vocab');
      soundService.playSparkle();
    }
  };

  // Pronounce English vocabulary word with standard en-US pronunciation
  const handlePlayVocabSpeech = (word: string) => {
    soundService.cancelSpeech();
    setPlayingWord(word);
    soundService.speakEn(word, {
      slow: true,
      onEnd: () => setPlayingWord((curr) => (curr === word ? null : curr)),
    });
  };

  // Transition from Phase 2 (Vocab) to Phase 3 (Conclusion)
  const handleProceedToConclusion = () => {
    soundService.playClick();
    soundService.cancelSpeech();
    setPhase('conclusion');

    // Award certificate and strictly 1 gold star if first-time completion
    const result = StorageService.awardLessonCertificate(
      student.id,
      student.fullName,
      student.className,
      lesson.id,
      lesson.title
    );

    setCertificate(result.certificate);
    setIsNewCertificate(result.isNew);
    setShowCertificateModal(true);

    if (result.updatedStudent) {
      onUpdateStudent(result.updatedStudent);
    }

    // Save activity record
    StorageService.recordActivity(student.id, {
      type: 'lesson',
      targetId: lesson.id,
      targetName: lesson.title,
      topicId: lesson.topicId,
      score: correctCount,
      totalQuestions: 5,
      starsEarned: result.isNew ? 1 : 0,
      timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
    });
  };

  // Restart lesson
  const handleRestart = () => {
    soundService.playClick();
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    setPhase('question');
    setQIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);
    setCorrectCount(0);
    setQuestionResults({});
    setPlayingWord(null);
    lastPraiseIndex.current = -1;
    lastEncouragementIndex.current = -1;
  };

  return (
    <div className="w-full aspect-[16/9] max-w-[calc((100dvh-1rem)*16/9)] max-h-[calc(100dvh-1rem)] mx-auto flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-sky-50/80 via-white to-amber-50/50 rounded-2xl md:rounded-3xl border-2 border-slate-200/80 shadow-2xl p-1.5 sm:p-2.5">
      {/* 1. TOP BAR: Navigation, Title & 5-Step Progress Indicator (Clean, No Fullscreen Button) */}
      <div className="shrink-0 bg-white/95 backdrop-blur-xs rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-2xs flex items-center justify-between gap-2.5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-black text-xs sm:text-sm transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách bài</span>
        </button>

        <div className="flex-1 text-center min-w-0 px-2">
          <h2 className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm md:text-base font-black text-slate-900 truncate">
            {lesson.title}
          </h2>
          {phase === 'question' && (
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              {lessonPkg.questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`transition-all rounded-full ${
                    idx < qIndex
                      ? 'w-4 h-1.5 sm:w-5 sm:h-2 bg-emerald-500'
                      : idx === qIndex
                      ? 'w-6 h-2 sm:w-7 sm:h-2.5 bg-sky-500 shadow-sm animate-pulse'
                      : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-slate-200'
                  }`}
                  title={`Câu ${idx + 1}`}
                />
              ))}
              <span className="text-[10px] sm:text-[11px] font-black text-sky-800 ml-1">
                Câu {qIndex + 1}/5
              </span>
            </div>
          )}
          {phase === 'vocab' && (
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-[11px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Phần 2: Luyện đọc Tiếng Anh – Từ ngữ toán học
              </span>
            </div>
          )}
          {phase === 'conclusion' && (
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Phần 3: Kết luận – Chốt kiến thức
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 min-w-[80px] text-right pr-1">
          <span className="text-[11px] sm:text-xs font-black text-sky-800 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100">
            {phase === 'question'
              ? `${qIndex + 1} / 5`
              : phase === 'vocab'
              ? `🔊 ${vocabList.length} từ`
              : 'Chốt kiến thức'}
          </span>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA: 3 PHASES */}

      {/* PHASE 1: 5 INTERACTIVE QUESTIONS (Fluid Viewport 100dvh - Zero Scroll, Perfect Gap Discipline) */}
      {phase === 'question' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between py-1 px-1 sm:px-2 max-w-4xl mx-auto w-full overflow-hidden">
          {/* A. KHUNG CÂU HỎI SONG NGỮ: Dòng 1 Tiếng Việt lớn đậm + Dòng 2 Tiếng Anh nhỏ hơn kèm nút loa 🔊 */}
          <div className="shrink-0 w-full bg-white/95 rounded-2xl sm:rounded-3xl border-2 border-sky-200 px-3 py-1.5 sm:px-4 sm:py-2 text-center shadow-2xs flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all">
            {/* Dòng 1: Câu hỏi tiếng Việt lớn, đậm, rõ ràng */}
            <h3
              className={`font-['Be_Vietnam_Pro'] font-black text-slate-900 leading-snug tracking-tight break-words text-center ${
                currentQ.promptVi.length > 60
                  ? 'text-xs sm:text-sm md:text-base lg:text-lg'
                  : currentQ.promptVi.length > 35
                  ? 'text-sm sm:text-base md:text-lg lg:text-xl'
                  : 'text-base sm:text-lg md:text-xl lg:text-2xl'
              }`}
            >
              {currentQ.promptVi}
            </h3>

            {/* Dòng 2: Câu hỏi tiếng Anh nhỏ hơn, căn giữa, kèm nút loa phát âm en-US */}
            {currentQ.promptEn && (
              <div className="inline-flex items-center justify-center gap-1.5 flex-wrap">
                <span className="font-['Be_Vietnam_Pro'] font-bold text-sky-800 text-xs sm:text-sm md:text-base leading-snug text-center">
                  {currentQ.promptEn}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayQuestionSpeech(currentQ.promptEn);
                  }}
                  className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all cursor-pointer shrink-0 shadow-2xs active:scale-90 ${
                    playingQuestionAudio
                      ? 'bg-sky-600 text-white animate-bounce ring-2 ring-sky-300'
                      : 'bg-sky-100 hover:bg-sky-200 text-sky-700 hover:scale-105'
                  }`}
                  title="Bấm để nghe đọc câu hỏi tiếng Anh chuẩn Mỹ (en-US)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* B. HÌNH MINH HỌA: Tự động co giãn theo chiều cao khả dụng, không đè hoặc đẩy các thành phần khác */}
          {Boolean(resolveVisualConfig(currentQ)) && (
            <div className="flex-1 min-h-0 flex items-center justify-center py-0.5 overflow-hidden shrink-1 my-auto">
              <div className="max-w-full max-h-[22vh] sm:max-h-[25vh] flex items-center justify-center overflow-hidden">
                <MathQuestionVisual question={currentQ} />
              </div>
            </div>
          )}

          {/* C. KHUNG 3 ĐÁP ÁN: Ngay dưới câu hỏi hoặc hình minh họa, 1 hàng ngang 3 ô đều nhau */}
          <div className="shrink-0 w-full grid grid-cols-3 gap-2 sm:gap-3 py-1">
            {currentQ.options?.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const optStr = String(opt);
              const textSizeClass =
                optStr.length > 15
                  ? 'text-xs sm:text-sm md:text-base'
                  : optStr.length > 8
                  ? 'text-sm sm:text-base md:text-lg'
                  : 'text-base sm:text-xl md:text-2xl';

              let cardStyle =
                'bg-white hover:bg-sky-50 border-slate-300 hover:border-sky-400 text-slate-800 shadow-2xs';

              if (isSelected) {
                if (isCorrect) {
                  cardStyle =
                    'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102';
                } else {
                  cardStyle =
                    'bg-amber-100 text-amber-950 border-amber-400 ring-4 ring-amber-200 animate-shake';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className={`relative min-h-[46px] sm:min-h-[52px] md:min-h-[58px] px-2 py-1.5 sm:px-3 sm:py-2 rounded-2xl sm:rounded-3xl border-2 sm:border-3 font-['Be_Vietnam_Pro'] font-black transition-all cursor-pointer flex items-center justify-center text-center active:scale-95 ${cardStyle} ${textSizeClass}`}
                >
                  <span className="break-words leading-tight hyphens-auto w-full text-center px-1">
                    {opt}
                  </span>
                  {isSelected && isCorrect && (
                    <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </span>
                  )}
                  {isSelected && !isCorrect && (
                    <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* D. THANH PHẢN HỒI & NÚT TIẾP TỤC: Cố định vị trí ở dưới cùng, luôn nằm trong viewport */}
          <div className="shrink-0 w-full flex items-center justify-between min-h-[40px] px-1 pt-0.5">
            <div className="flex-1 min-w-0 pr-2">
              {isCorrect === false && currentFeedback && (
                <span className="text-xs sm:text-sm font-black text-amber-950 bg-amber-50 px-3 py-1 rounded-full border-2 border-amber-300 inline-flex items-center gap-1.5 shadow-2xs animate-shake">
                  <span className="text-base">{currentFeedback.emoji}</span>
                  <span className="font-extrabold text-amber-950">{currentFeedback.en}</span>
                  <span className="font-semibold text-amber-800 text-xs hidden sm:inline">– {currentFeedback.vi}</span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full ml-1">Bé chọn lại nhé!</span>
                </span>
              )}
              {isCorrect === true && currentFeedback && (
                <span className="text-xs sm:text-sm font-black text-emerald-950 bg-emerald-50 px-3 py-1 rounded-full border-2 border-emerald-300 inline-flex items-center gap-1.5 shadow-2xs">
                  <span className="text-base">{currentFeedback.emoji}</span>
                  <span className="font-extrabold text-emerald-900">{currentFeedback.en}</span>
                  <span className="font-semibold text-emerald-700 text-xs hidden sm:inline">– {currentFeedback.vi}</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded-full ml-1">Đúng rồi!</span>
                </span>
              )}
            </div>

            <div className="shrink-0">
              {isCorrect === true && (
                <button
                  onClick={handleNext}
                  className="py-1.5 px-4 sm:py-2 sm:px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>{qIndex + 1 < lessonPkg.questions.length ? 'TIẾP TỤC ➡️' : 'LUYỆN ĐỌC TIẾNG ANH 🔊'}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: LUYỆN ĐỌC TIẾNG ANH – TỪ NGỮ TOÁN HỌC */}
      {phase === 'vocab' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between py-1.5 px-2 sm:px-4 max-w-4xl mx-auto w-full overflow-hidden">
          {/* Header Banner */}
          <div className="shrink-0 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 rounded-2xl p-1.5 sm:p-2 text-white shadow-2xs space-y-0.5 text-center">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-purple-100">
              <Volume2 className="w-3.5 h-3.5 text-purple-200" /> PHẦN 2: LUYỆN ĐỌC TIẾNG ANH – TỪ NGỮ TOÁN HỌC
            </div>
            <h3 className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base drop-shadow">
              Bé hãy bấm vào từng chiếc loa 🔊 để nghe phát âm tiếng Anh chuẩn nhé!
            </h3>
          </div>

          {/* Grid of Vocabulary Cards (2 to 3 columns, perfectly fitting screen height without vertical scrolling) */}
          <div className="flex-1 min-h-0 flex items-center justify-center py-1 overflow-hidden my-auto w-full">
            <div
              className={`w-full grid gap-2 sm:gap-2.5 ${
                vocabList.length <= 4
                  ? 'grid-cols-2 max-w-2xl'
                  : 'grid-cols-2 sm:grid-cols-3 max-w-4xl'
              }`}
            >
              {vocabList.map((item, idx) => {
                const isPlaying = playingWord === item.en;
                return (
                  <div
                    key={idx}
                    onClick={() => handlePlayVocabSpeech(item.en)}
                    className={`relative group bg-white rounded-2xl p-2 sm:p-2.5 border-2 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs hover:shadow-md hover:scale-[1.01] active:scale-98 ${
                      isPlaying
                        ? 'border-purple-500 ring-4 ring-purple-200 bg-purple-50/70'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {/* Badge: Number / Symbol / Emoji */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-purple-700 font-['Be_Vietnam_Pro'] font-black text-sm sm:text-lg flex items-center justify-center shrink-0 shadow-2xs">
                      {item.symbol}
                    </div>

                    {/* Word Details */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base text-slate-900 leading-tight truncate">
                        {item.en}
                      </div>
                      <div className="font-semibold text-slate-600 text-[10px] sm:text-xs truncate">
                        {item.vi}
                      </div>
                      {item.ipa && (
                        <div className="font-mono text-[9px] sm:text-[10px] text-purple-600 font-medium truncate">
                          {item.ipa}
                        </div>
                      )}
                    </div>

                    {/* Speaker Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVocabSpeech(item.en);
                      }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-purple-600 text-white shadow-md animate-bounce'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200 group-hover:scale-105'
                      }`}
                      title={`Nghe phát âm: ${item.en}`}
                    >
                      <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Button: Transition to Phase 3 (Conclusion) */}
          <div className="shrink-0 w-full flex items-center justify-center pt-1">
            <button
              onClick={handleProceedToConclusion}
              className="py-1.5 px-6 sm:py-2 sm:px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>TIẾP TỤC ➡️ KẾT LUẬN KIẾN THỨC</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: CONCLUSION SCREEN "GHI NHỚ KIẾN THỨC TRỌNG TÂM" (No illustrations, Large bold font, Viewport-fitted, Zero scroll) */}
      {phase === 'conclusion' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between py-1.5 sm:py-2.5 px-3 sm:px-6 md:px-8 max-w-4xl lg:max-w-5xl mx-auto w-full overflow-hidden">
          {/* A. HEADER: Title centered cleanly at the top */}
          <div className="shrink-0 text-center space-y-0.5 sm:space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full shadow-2xs">
              <span className="font-['Be_Vietnam_Pro'] font-black text-[11px] sm:text-xs tracking-wider uppercase">
                KẾT LUẬN – CHỐT KIẾN THỨC
              </span>
            </div>
            <h3 className="font-['Be_Vietnam_Pro'] font-black text-lg sm:text-xl md:text-2xl text-slate-900 tracking-tight">
              GHI NHỚ KIẾN THỨC TRỌNG TÂM
            </h3>
            <p className="font-bold text-xs sm:text-sm text-slate-600 truncate max-w-xl mx-auto">
              {lessonPkg.title}
            </p>
          </div>

          {/* B. 2-3 KEY TAKEAWAY POINTS: Pure math knowledge, large bold text, no illustrations, balanced cards */}
          <div className="flex-1 min-h-0 flex flex-col justify-center gap-2 sm:gap-2.5 md:gap-3 my-auto w-full py-1">
            {lessonPkg.conclusion.takeawayPoints.map((point, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-amber-300 shadow-2xs hover:border-amber-400 transition-all p-2.5 sm:p-3.5 md:p-4 flex items-center gap-3 sm:gap-4 text-left"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-['Be_Vietnam_Pro'] font-black text-base sm:text-lg md:text-xl flex items-center justify-center shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <p className="font-['Be_Vietnam_Pro'] font-black text-slate-800 text-sm sm:text-base md:text-lg lg:text-xl leading-snug break-words flex-1">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* C. ACTION BUTTONS: Always visible at bottom, clean spacing */}
          <div className="shrink-0 flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
            <button
              onClick={handleRestart}
              className="py-1.5 px-3 sm:py-2 sm:px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Học lại bài này</span>
            </button>

            <button
              onClick={() => {
                soundService.playClick();
                // Ensure certificate exists if re-opening
                if (!certificate) {
                  const existing = StorageService.getLessonCertificates(student.id).find(
                    (c) => Number(c.lessonId) === Number(lesson.id)
                  );
                  if (existing) {
                    setCertificate(existing);
                  }
                }
                setShowCertificateModal(true);
              }}
              className="py-1.5 px-3 sm:py-2 sm:px-5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-400 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Giấy chứng nhận 📜</span>
            </button>

            <button
              onClick={onBack}
              className="py-1.5 px-4 sm:py-2 sm:px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Về danh sách bài học</span>
            </button>

            {lesson.recommendedGameId && onLaunchGame && (
              <button
                onClick={() => onLaunchGame(lesson.recommendedGameId!)}
                className="py-1.5 px-3 sm:py-2 sm:px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Chơi trò chơi</span>
              </button>
            )}

            {onFinishLesson && (
              <button
                onClick={onFinishLesson}
                className="py-1.5 px-4 sm:py-2 sm:px-6 rounded-2xl bg-[#22C55E] hover:bg-emerald-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Hoàn thành 🏁</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pop-up Certificate Modal upon lesson completion */}
      {certificate && (
        <LessonCertificateModal
          certificate={certificate}
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          isNewAward={isNewCertificate}
          onReviewLesson={handleRestart}
        />
      )}
    </div>
  );
};

