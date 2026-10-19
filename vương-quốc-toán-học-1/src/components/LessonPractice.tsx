import React, { useState, useEffect } from 'react';
import { Lesson, ExerciseItem, DifficultyLevel, Student } from '../types';
import { MathSVG } from './MathSVG';
import { FlatShapeRenderer } from './FlatShapeRenderer';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Target,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Edit3,
  Save,
  Check,
  Award,
  ArrowRight,
  Star,
  Trophy,
  HelpCircle,
  Play
} from 'lucide-react';

interface Props {
  lesson: Lesson;
  activeStudent: Student | null;
  onRecordAttempt: (
    lessonId: string,
    exerciseId: string,
    question: string,
    chosenAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    level: DifficultyLevel,
    topicName: string
  ) => void;
  onUpdateLesson: (updated: Lesson) => void;
  onOpenGames: () => void;
  onNextLesson?: () => void;
}

const getPedagogicalLessonHint = (ex: ExerciseItem): string => {
  const qLower = ex.question.toLowerCase();

  // 1. Length measurement
  if (qLower.includes('tẩy')) {
    return 'Con hãy quan sát điểm đầu cục tẩy ở vạch 0 và nhìn xem điểm cuối chạm đúng vạch số mấy trên thước nhé!';
  }
  if (qLower.includes('bút chì') || qLower.includes('chiếc bút')) {
    return 'Con hãy quan sát điểm đầu bút ở vạch 0 và nhìn vạch số mà đầu nhọn bút chạm tới trên thước nhé!';
  }
  if (qLower.includes('kẹp ghim')) {
    return 'Con hãy nhìn điểm đầu của kẹp ghim ở vạch 0 và xem điểm cuối chạm vạch số mấy trên thước nhé!';
  }
  if (qLower.includes('ruy băng')) {
    return 'Con hãy nhìn dải ruy băng trải dài từ vạch 0 đến vạch số nào trên thước nhé!';
  }
  if (qLower.includes('thước') || qLower.includes('xăng-ti-mét') || qLower.includes(' cm')) {
    return 'Con hãy quan sát kỹ các vạch số trên thước thẳng có chia xăng-ti-mét nhé!';
  }

  // 2. Geometry
  if (qLower.includes('hình vuông')) {
    return 'Con hãy tìm hình có bốn cạnh thẳng bằng nhau và bốn góc vuông nhé!';
  }
  if (qLower.includes('hình chữ nhật')) {
    return 'Con hãy tìm hình có bốn góc vuông, hai cạnh dài bằng nhau và hai cạnh ngắn bằng nhau nhé!';
  }
  if (qLower.includes('hình tam giác')) {
    return 'Con hãy tìm hình có đúng ba cạnh thẳng và ba đỉnh nhọn nhé!';
  }
  if (qLower.includes('hình tròn')) {
    return 'Con hãy tìm hình tròn đều và không có góc nào nhé!';
  }
  if (qLower.includes('khối lập phương')) {
    return 'Con hãy tìm khối hình có 6 mặt đều là các hình vuông bằng nhau nhé!';
  }
  if (qLower.includes('khối hộp chữ nhật')) {
    return 'Con hãy tìm khối hình có các mặt là hình chữ nhật nhé!';
  }

  // 3. Time / Calendar
  if (qLower.includes('giờ') || qLower.includes('đồng hồ')) {
    return 'Con hãy nhìn kim ngắn chỉ giờ và kim dài chỉ thẳng vào số 12 nhé!';
  }
  if (qLower.includes('thứ') || qLower.includes('tuần')) {
    return 'Con hãy nhớ lại thứ tự các ngày trong tuần: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ nhật nhé!';
  }

  // 4. Comparison
  if (qLower.includes('nhiều hơn') || qLower.includes('ít hơn') || qLower.includes('lớn hơn') || qLower.includes('bé hơn') || qLower.includes('so sánh')) {
    return 'Con hãy đếm số lượng của từng nhóm đồ vật hoặc so sánh chữ số hàng chục rồi đến hàng đơn vị nhé!';
  }

  // 5. Addition
  if (qLower.includes('+') || qLower.includes('cộng') || qLower.includes('tất cả')) {
    return 'Con hãy giữ số lớn trong đầu rồi đếm thêm số đơn vị còn lại nhé!';
  }

  // 6. Subtraction
  if (qLower.includes('-') || qLower.includes('trừ') || qLower.includes('còn lại') || qLower.includes('bớt')) {
    return 'Con hãy lấy số ban đầu bớt đi và đếm lùi từng bước để tìm kết quả nhé!';
  }

  // 7. Number sequence
  if (qLower.includes('liền sau')) {
    return 'Số liền sau là số ngay sau đó, con chỉ cần đếm thêm 1 đơn vị nhé!';
  }
  if (qLower.includes('liền trước')) {
    return 'Số liền trước là số đứng ngay trước, con hãy bớt đi 1 đơn vị nhé!';
  }

  return 'Con hãy đọc kỹ câu hỏi, quan sát hình minh họa và suy nghĩ cẩn thận trước khi chọn đáp án nhé!';
};

export const LessonPractice: React.FC<Props> = ({
  lesson,
  activeStudent,
  onRecordAttempt,
  onUpdateLesson,
  onOpenGames,
  onNextLesson
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'practice' | 'teacher_edit'>('practice');
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showStarAnim, setShowStarAnim] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Per-question tracking
  const [questionStats, setQuestionStats] = useState<Record<string, { attempts: number; firstTryCorrect: boolean; completed: boolean }>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Teacher editing state
  const [editingLesson, setEditingLesson] = useState<Lesson>(lesson);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const exercises = lesson.exercises || [];
  const totalQuestions = exercises.length || 6;
  const currentEx = exercises[currentExerciseIdx];

  // Stop all celebratory audio and speech synthesis when unmounting lesson practice
  useEffect(() => {
    soundManager.unlockAudio();
    return () => {
      soundManager.stopAll();
    };
  }, []);

  const handleSelectOption = (option: string) => {
    soundManager.unlockAudio();
    if (isChecked && feedback?.isCorrect) return; // Don't allow changing once answered correctly
    setSelectedAnswer(option);
    soundManager.playPop();
  };

  const handleCheckAnswer = () => {
    soundManager.unlockAudio();
    if (!selectedAnswer || !currentEx) return;

    const isCorrect = String(selectedAnswer).trim().toLowerCase() === String(currentEx.correctAnswer).trim().toLowerCase();
    const currentStat = questionStats[currentEx.id] || { attempts: 0, firstTryCorrect: false, completed: false };
    const newAttempts = currentStat.attempts + 1;
    const isFirstTry = newAttempts === 1 && isCorrect;

    setIsChecked(true);

    if (isCorrect) {
      soundManager.playSuccess();
      setShowStarAnim(true);
      setTimeout(() => setShowStarAnim(false), 1200);

      setFeedback({
        isCorrect: true,
        message: `Chính xác rồi! Bé thật thông minh! 🌟\n\n💡 Lời giải: ${currentEx.explanation}`
      });

      // Update question tracking
      setQuestionStats(prev => ({
        ...prev,
        [currentEx.id]: {
          attempts: newAttempts,
          firstTryCorrect: isFirstTry || Boolean(prev[currentEx.id]?.firstTryCorrect),
          completed: true
        }
      }));

      // Record student attempt
      onRecordAttempt(
        lesson.id,
        currentEx.id,
        currentEx.question,
        selectedAnswer,
        String(currentEx.correctAnswer),
        true,
        currentEx.level,
        lesson.topicName
      );
    } else {
      soundManager.playTryAgain();
      setFeedback({
        isCorrect: false,
        message: newAttempts === 1
          ? 'Chưa chính xác rồi! Bé hãy suy nghĩ thêm một chút và thử lại nhé. Bé có thể bấm nút "Gợi ý 💡" ở trên để xem hướng dẫn cách làm.'
          : 'Bé hãy thử lại lần nữa nhé! Con hãy bấm nút "Gợi ý 💡" để đọc hướng dẫn cách tư duy từng bước.'
      });

      setQuestionStats(prev => ({
        ...prev,
        [currentEx.id]: {
          attempts: newAttempts,
          firstTryCorrect: false,
          completed: false
        }
      }));
    }
  };

  const handleNextQuestion = () => {
    soundManager.unlockAudio();
    if (currentExerciseIdx + 1 < exercises.length) {
      setCurrentExerciseIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
      setFeedback(null);
      setShowHint(false);
      soundManager.playPop();
    } else {
      // Completed all questions
      setIsCompleted(true);
      setShowHint(false);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      soundManager.playFanfare();
    }
  };

  const handleRetryQuestion = () => {
    soundManager.unlockAudio();
    setSelectedAnswer(null);
    setIsChecked(false);
    setFeedback(null);
    soundManager.playPop();
  };

  const handleRestart = () => {
    soundManager.unlockAudio();
    setCurrentExerciseIdx(0);
    setSelectedAnswer(null);
    setIsChecked(false);
    setFeedback(null);
    setShowHint(false);
    setQuestionStats({});
    setIsCompleted(false);
    soundManager.playPop();
  };

  const handleSaveTeacherEdit = () => {
    onUpdateLesson(editingLesson);
    soundManager.playSuccess();
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  // Stats calculation for Section VII
  const completedCount = Object.values(questionStats).filter(s => s.completed).length;
  const firstTryCorrectCount = Object.values(questionStats).filter(s => s.firstTryCorrect).length;
  const retryCount = Object.values(questionStats).filter(s => s.attempts > 1).length;
  const earnedStars = firstTryCorrectCount;

  const getEncouragement = () => {
    if (firstTryCorrectCount === totalQuestions) {
      return 'Xuất sắc tuyệt đối! Cô Phượng khen em học Toán siêu đỉnh! 🌟🏆';
    } else if (firstTryCorrectCount >= 4) {
      return 'Rất giỏi! Em đã nắm chắc kiến thức của bài học rồi đấy! 🌸✨';
    } else {
      return 'Cố gắng lên nhé! Em có thể làm lại lần nữa để đạt nhiều ngôi sao hơn! 💪⭐';
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Học kỳ {lesson.semester} · {lesson.topicName}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lesson.pageRange} (Nguồn: {lesson.sourceBook})
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            Bài {lesson.lessonNumber}: {lesson.title}
          </h2>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl shrink-0">
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('practice');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Bé cùng luyện tập ({totalQuestions} câu)
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('theory');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" /> Kiến thức & Ví dụ
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('teacher_edit');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'teacher_edit'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Giáo viên biên tập
          </button>
        </div>
      </div>

      {/* TAB 1: THEORY & EXAMPLES */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Objectives */}
          <div className="bg-sky-50/80 rounded-3xl p-6 border border-sky-200">
            <h3 className="text-base font-extrabold text-sky-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-600" /> Mục tiêu học tập cần đạt:
            </h3>
            <ul className="space-y-2">
              {lesson.learningObjectives.map((obj, i) => (
                <li key={i} className="text-sm text-sky-800 flex items-start gap-2 font-medium">
                  <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Knowledge */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" /> Kiến thức trọng tâm của bài:
            </h3>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 font-medium">
              {lesson.coreKnowledge}
            </p>
          </div>

          {/* Examples */}
          {lesson.examples && lesson.examples.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" /> Ví dụ minh họa trong sách:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40">
                    <h4 className="font-bold text-sm text-slate-800 mb-1">{ex.title}</h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">{ex.description}</p>
                    {ex.calculationText && (
                      <div className="text-xl font-black text-sky-700 bg-white p-2.5 rounded-xl border border-sky-200 text-center mb-2">
                        {ex.calculationText}
                      </div>
                    )}
                    {ex.illustration && <MathSVG illustration={ex.illustration} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt banner to start practice */}
          <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xl font-black mb-1 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" /> BÉ CÙNG LUYỆN TẬP – {totalQuestions} CÂU HỎI
              </h4>
              <p className="text-xs sm:text-sm text-sky-100 font-semibold">
                Thực hành ngay {totalQuestions} câu hỏi tương tác để rèn luyện và giành nhiều ngôi sao lấp lánh!
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('practice');
                soundManager.playPop();
              }}
              className="py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Bắt đầu luyện tập ngay
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE PRACTICE EXERCISES (Section VI & VII) */}
      {activeTab === 'practice' && (
        <div>
          {!isCompleted && currentEx ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sky-200 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
              {/* Star animation popup when correct */}
              {showStarAnim && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-emerald-500/10 backdrop-blur-xs">
                  <div className="text-center animate-bounce">
                    <span className="text-6xl filter drop-shadow-lg">⭐</span>
                    <span className="block text-emerald-700 font-black text-xl mt-2">+1 Ngôi Sao!</span>
                  </div>
                </div>
              )}

              {/* SECTION VI HEADER: BÉ CÙNG LUYỆN TẬP – 6 CÂU HỎI */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center text-xl shadow-md">
                    ✏️
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 block">
                      BÉ CÙNG LUYỆN TẬP – {totalQuestions} CÂU HỎI
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      Bài {lesson.lessonNumber}: {lesson.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-black text-amber-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>Đã đạt: {earnedStars} ⭐</span>
                </div>
              </div>

              {/* Progress and Question Counter */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-black">
                      Câu {currentExerciseIdx + 1} / {totalQuestions}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold ${
                        currentEx.level === 'Cơ bản'
                          ? 'bg-emerald-100 text-emerald-800'
                          : currentEx.level === 'Luyện tập'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      Mức độ: {currentEx.level}
                    </span>
                  </span>
                  <span className="text-slate-400 font-semibold">
                    {Math.round(((currentExerciseIdx + 1) / totalQuestions) * 100)}%
                  </span>
                </div>

                {/* Progress bar with 6 discrete step marks */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentExerciseIdx + 1) / totalQuestions) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="text-center my-4">
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-4 leading-relaxed">
                  {currentEx.question}
                </h3>

                {/* Mathematical SVG Illustration */}
                {currentEx.illustration && (
                  <div className="my-5 p-3 rounded-2xl bg-sky-50/50 border border-sky-100 max-w-lg mx-auto">
                    <MathSVG illustration={currentEx.illustration} className="max-w-md mx-auto" />
                  </div>
                )}

                {/* Nút Gợi ý 💡 (Mặc định ẩn, bấm vào mới hiện hướng dẫn tư duy) */}
                <div className="flex flex-col items-center justify-center my-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setShowHint(prev => !prev);
                    }}
                    className="px-4 py-1.5 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Gợi ý cách tư duy"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>{showHint ? 'Ẩn gợi ý 💡' : 'Gợi ý 💡'}</span>
                  </button>

                  {showHint && (
                    <div className="w-full max-w-lg mt-3 p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-200 text-amber-950 text-xs sm:text-sm font-bold leading-relaxed flex items-start gap-2.5 shadow-sm animate-in fade-in zoom-in-95 text-left">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-black text-amber-800 text-xs uppercase tracking-wider mb-0.5">
                          💡 Hướng dẫn tư duy:
                        </span>
                        <span>{getPedagogicalLessonHint(currentEx)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                {(currentEx.options || []).map((opt) => {
                  const isSelected = selectedAnswer === opt;
                  let btnStyle = 'bg-white border-sky-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50/50 shadow-xs';

                  if (isSelected) {
                    if (isChecked && feedback) {
                      btnStyle = feedback.isCorrect
                        ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-102 font-black'
                        : 'bg-rose-500 border-rose-600 text-white shadow-md scale-98 font-black';
                    } else {
                      btnStyle = 'bg-sky-100 border-sky-500 text-sky-900 shadow-md ring-2 ring-sky-400/50 scale-102 font-black';
                    }
                  }

                  const matchShape = (val: string) => {
                    const norm = (val || '').trim().toLowerCase();
                    if (norm === 'hình vuông') return 'square';
                    if (norm === 'hình chữ nhật') return 'rectangle';
                    if (norm === 'hình tam giác') return 'triangle';
                    if (norm === 'hình tròn') return 'circle';
                    return null;
                  };
                  const optShape = matchShape(opt);

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isChecked && Boolean(feedback?.isCorrect)}
                      className={`p-4 rounded-2xl border-2 font-black text-base md:text-lg transition-all active:scale-95 cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${btnStyle}`}
                    >
                      {optShape && (
                        <div className="w-12 h-12 flex items-center justify-center">
                          <FlatShapeRenderer shape={optShape} size={36} />
                        </div>
                      )}
                      <span className="leading-tight">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert Banner */}
              {feedback && (
                <div
                  className={`my-4 p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm font-bold whitespace-pre-line animate-in zoom-in-95 ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="block font-black text-sm mb-0.5">
                      {feedback.isCorrect ? 'Tuyệt vời!' : 'Chưa chính xác!'}
                    </span>
                    <span>{feedback.message}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons: Kiểm tra / Thử lại / Tiếp tục (Section VI Requirement) */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                {!isChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedAnswer}
                    className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Kiểm tra đáp án
                  </button>
                ) : feedback?.isCorrect ? (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    {currentExerciseIdx + 1 < totalQuestions ? (
                      <>
                        <span>Tiếp tục sang câu tiếp theo</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Xem kết quả luyện tập</span>
                        <Trophy className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleRetryQuestion}
                    className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Thử lại câu này
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================
               SECTION VII: KẾT QUẢ SAU SÁU CÂU (CHÚC MỪNG HOÀN THÀNH)
               ======================================================== */
            <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-amber-300 shadow-2xl max-w-xl mx-auto text-center animate-in zoom-in-95 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400" />

              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-white animate-bounce">
                🌟
              </div>

              <span className="text-xs font-black text-amber-700 uppercase tracking-wider block mb-1">
                Hoàn thành xuất sắc
              </span>

              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                CHÚC MỪNG BÉ ĐÃ HOÀN THÀNH BÀI LUYỆN TẬP!
              </h3>

              <p className="text-sm font-bold text-sky-800 mb-6 bg-sky-50 py-2 px-4 rounded-xl inline-block">
                Bài {lesson.lessonNumber}: {lesson.title}
              </p>

              {/* 4 Detail metric cards */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700 block">Số câu hoàn thành</span>
                  <p className="text-2xl font-black text-emerald-800 mt-0.5">
                    {totalQuestions} / {totalQuestions} câu
                  </p>
                </div>

                <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200">
                  <span className="text-[11px] font-bold text-sky-700 block">Đúng ngay lần đầu</span>
                  <p className="text-2xl font-black text-sky-800 mt-0.5">
                    {firstTryCorrectCount} / {totalQuestions} câu
                  </p>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-700 block">Ngôi sao nhận được</span>
                  <p className="text-2xl font-black text-amber-800 mt-0.5">
                    +{earnedStars} ⭐
                  </p>
                </div>

                <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
                  <span className="text-[11px] font-bold text-purple-700 block">Số câu cần thử lại</span>
                  <p className="text-2xl font-black text-purple-800 mt-0.5">
                    {retryCount} câu
                  </p>
                </div>
              </div>

              {/* Lời động viên ý nghĩa từ cô giáo Phượng */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200 text-pink-950 font-bold text-sm mb-6 leading-relaxed">
                🌸 {getEncouragement()}
              </div>

              {/* Action Buttons as required by Section VII */}
              <div className="space-y-3">
                {onNextLesson && (
                  <button
                    onClick={() => {
                      onNextLesson();
                      handleRestart();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Chuyển bài tiếp theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={onOpenGames}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5" /> Chơi trò chơi ôn tập bài này ngay!
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab('theory')}
                    className="py-3 px-4 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-sky-600" /> Quay về bài học
                  </button>
                  <button
                    onClick={handleRestart}
                    className="py-3 px-4 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-600" /> Làm lại bài này
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEACHER PREVIEW & EDITING (Section VIII Requirement) */}
      {activeTab === 'teacher_edit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-lg text-slate-900">
                Khu Vực Phê Duyệt & Chỉnh Sửa Dành Cho Giáo Viên
              </h3>
              <p className="text-xs text-slate-500">
                Toàn bộ {editingLesson.exercises.length} câu hỏi đã được kiểm định sư phạm chuẩn GDPT 2018. Cô giáo có thể biên tập nếu cần.
              </p>
            </div>
            <button
              onClick={handleSaveTeacherEdit}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Lưu & Phê duyệt bài học
            </button>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã lưu thay đổi và đánh dấu bài học đã được giáo viên kiểm duyệt thành công!</span>
            </div>
          )}

          {/* Edit Lesson Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tên bài học:</label>
              <input
                type="text"
                value={editingLesson.title}
                onChange={e => setEditingLesson({ ...editingLesson, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Số trang tham chiếu:</label>
              <input
                type="text"
                value={editingLesson.pageRange}
                onChange={e => setEditingLesson({ ...editingLesson, pageRange: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Kiến thức cốt lõi:</label>
            <textarea
              rows={3}
              value={editingLesson.coreKnowledge}
              onChange={e => setEditingLesson({ ...editingLesson, coreKnowledge: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium leading-relaxed"
            />
          </div>

          {/* Edit Each Exercise */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-extrabold text-sm text-slate-800">
              Danh sách bài tập ({editingLesson.exercises.length} câu đã kiểm định):
            </h4>

            {editingLesson.exercises.map((ex, idx) => (
              <div key={ex.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Câu {idx + 1} ({ex.level})</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ✓ Đã kiểm định
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nội dung câu hỏi:</label>
                  <input
                    type="text"
                    value={ex.question}
                    onChange={e => {
                      const updatedExs = [...editingLesson.exercises];
                      updatedExs[idx] = { ...ex, question: e.target.value };
                      setEditingLesson({ ...editingLesson, exercises: updatedExs });
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Đáp án đúng:</label>
                    <input
                      type="text"
                      value={String(ex.correctAnswer)}
                      onChange={e => {
                        const updatedExs = [...editingLesson.exercises];
                        updatedExs[idx] = { ...ex, correctAnswer: e.target.value };
                        setEditingLesson({ ...editingLesson, exercises: updatedExs });
                      }}
                      className="w-full p-2 rounded-lg border border-emerald-300 text-xs font-bold text-emerald-800 bg-emerald-50/30"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Lời giải / Giải thích:</label>
                    <input
                      type="text"
                      value={ex.explanation}
                      onChange={e => {
                        const updatedExs = [...editingLesson.exercises];
                        updatedExs[idx] = { ...ex, explanation: e.target.value };
                        setEditingLesson({ ...editingLesson, exercises: updatedExs });
                      }}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
