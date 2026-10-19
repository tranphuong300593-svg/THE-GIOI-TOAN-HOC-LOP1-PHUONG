/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookDocument, Classroom, Student, Lesson, GameId, DifficultyLevel, ExerciseAttempt, TeacherCustomization } from './types';
import { INITIAL_BOOKS, INITIAL_CLASSES, OFFICIAL_CLASSES } from './data/curriculumData';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { BookLibrary } from './components/BookLibrary';
import { LessonsList } from './components/LessonsList';
import { LessonPractice } from './components/LessonPractice';
import { GamesHub } from './components/GamesHub';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentLoginPortal } from './components/StudentLoginPortal';
import { SuperVipHub } from './components/super_vip/SuperVipHub';
import { FloatingAudioControl } from './components/FloatingAudioControl';
import { safeFetchJson, getPhotoFromIndexedDb } from './utils/safeApi';
import { User, Sparkles, Check, Star, Shield, Lock, LogOut } from 'lucide-react';

export default function App() {
  // Load books with check to ensure all 41 lessons, 10 topics, and all 246 verified exercises are present
  const [books, setBooks] = useState<BookDocument[]>(() => {
    try {
      const saved = localStorage.getItem('the_gioi_toan_1_books');
      if (saved) {
        const parsed = JSON.parse(saved);
        const totalLessons = (parsed as BookDocument[])
          .flatMap(b => b.topics || [])
          .flatMap(t => t.lessons || []).length;
        const totalExercises = (parsed as BookDocument[])
          .flatMap(b => b.topics || [])
          .flatMap(t => t.lessons || [])
          .flatMap(l => l.exercises || []).length;
        if (totalLessons >= 40 && totalExercises >= 246) {
          // Merge latest lesson exercises and illustrations so updated illustrations take effect immediately
          const merged = (parsed as BookDocument[]).map(book => {
            const initBook = INITIAL_BOOKS.find(b => b.id === book.id);
            if (!initBook) return book;
            return {
              ...book,
              topics: book.topics.map(topic => {
                const initTopic = initBook.topics.find(t => t.id === topic.id);
                if (!initTopic) return topic;
                return {
                  ...topic,
                  lessons: topic.lessons.map(lesson => {
                    const initLesson = initTopic.lessons.find(l => l.id === lesson.id);
                    if (!initLesson) return lesson;
                    return {
                      ...lesson,
                      exercises: initLesson.exercises,
                      examples: initLesson.examples
                    };
                  })
                };
              })
            };
          });
          return merged;
        }
      }
    } catch (e) {
      console.warn('Could not read books from localStorage', e);
    }
    return INITIAL_BOOKS;
  });

  // Load classrooms and students
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    try {
      const saved = localStorage.getItem('the_gioi_toan_1_classes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read classes from localStorage', e);
    }
    return INITIAL_CLASSES;
  });

  // Active student & Login session state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('the_gioi_toan_1_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('the_gioi_toan_1_active_student_id');
      if (saved) return saved;
    } catch (e) {}
    return INITIAL_CLASSES[0]?.students[0]?.id || 'hs_lop_1_1_nam';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'lessons' | 'practice' | 'games' | 'library' | 'dashboard' | 'super_vip'>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(() => {
    return INITIAL_BOOKS[0]?.topics[0]?.lessons[0];
  });
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isStudentSwitchOpen, setIsStudentSwitchOpen] = useState(false);

  // Teacher PIN lock modal
  const [isTeacherPinModalOpen, setIsTeacherPinModalOpen] = useState(false);
  const [teacherPinInput, setTeacherPinInput] = useState('');
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState(false);
  const [teacherPinError, setTeacherPinError] = useState(false);

  // Teacher Profile Information (Fixed on Home Page)
  const [teacherCustomization, setTeacherCustomization] = useState<TeacherCustomization>(() => {
    return {
      heroPhoto: '/assets/co-phuong-hero.webp',
      footerPhoto: '/assets/co-phuong-footer.webp',
      zoom: 1,
      posX: 0,
      posY: 0,
      teacherName: 'Trần Thị Phượng',
      schoolName: 'Trường Tiểu học Trần Đại Nghĩa, phường Hòa Xuân, thành phố Đà Nẵng',
      hasRealPhoto: true
    };
  });

  const refreshTeacherProfile = async () => {
    // 1. First check IndexedDB for any custom high-res photos
    try {
      const idbHero = await getPhotoFromIndexedDb('teacher_hero');
      const idbFooter = await getPhotoFromIndexedDb('teacher_footer');
      if (idbHero || idbFooter) {
        setTeacherCustomization(prev => ({
          ...prev,
          heroPhoto: idbHero || prev.heroPhoto || '/assets/co-phuong.webp',
          footerPhoto: idbFooter || prev.footerPhoto || '/assets/co-phuong.webp',
          hasRealPhoto: true
        }));
      }
    } catch (idbErr) {
      console.warn('IndexedDB photo check skipped:', idbErr);
    }

    // 2. Safe call to server endpoint (no crash on Vercel static 404 HTML)
    try {
      const res = await safeFetchJson('/api/teacher/profile');
      if (res.ok && res.data?.success && res.data.profile) {
        const p = res.data.profile;
        setTeacherCustomization(prev => ({
          ...prev,
          ...p,
          heroPhoto: p.heroPhoto || prev.heroPhoto || '/assets/co-phuong.webp',
          footerPhoto: p.footerPhoto || p.heroPhoto || prev.footerPhoto || '/assets/co-phuong.webp',
          hasRealPhoto: true
        }));
      }
    } catch (err) {
      console.warn('Server teacher profile sync skipped, using local cache', err);
    }
  };

  // Sync books to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('the_gioi_toan_1_books', JSON.stringify(books));
    } catch (e) {}
  }, [books]);

  // Sync classrooms to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('the_gioi_toan_1_classes', JSON.stringify(classrooms));
    } catch (e) {}
  }, [classrooms]);

  // Sync active student ID and login state
  useEffect(() => {
    try {
      localStorage.setItem('the_gioi_toan_1_active_student_id', activeStudentId);
      localStorage.setItem('the_gioi_toan_1_logged_in', String(isLoggedIn));
    } catch (e) {}
  }, [activeStudentId, isLoggedIn]);

  // Fetch persistent teacher profile from server on startup and setup mobile audio unlock
  useEffect(() => {
    refreshTeacherProfile();
    soundManager.setupGlobalUnlock();
  }, []);

  // Sync teacher customization to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('the_gioi_toan_1_teacher_customization', JSON.stringify(teacherCustomization));
    } catch (e) {}
  }, [teacherCustomization]);

  // Flatten all lessons from books
  const allLessons: Lesson[] = [];
  const allTopics = books.flatMap(b => b.topics || []);
  allTopics.forEach(t => {
    (t.lessons || []).forEach(l => allLessons.push(l));
  });

  // Find active student object
  const activeStudent: Student | null = classrooms
    .flatMap(c => c.students)
    .find(s => s.id === activeStudentId) || classrooms[0]?.students[0] || null;

  // Handle Student Login from Login Portal
  const handleStudentLogin = (fullName: string, className: string, avatar: string) => {
    // Generate normalized unique ID for this student
    const studentUniqueId = `hs_${className.replace('/', '_')}_${encodeURIComponent(fullName.trim().toLowerCase())}`;

    // Check if student exists in that classroom
    let studentFound: Student | null = null;
    let targetClass = classrooms.find(c => c.name === `Lớp ${className}` || c.id === `lop_${className.replace('/', '_')}`);

    if (targetClass) {
      studentFound = targetClass.students.find(s => s.name.toLowerCase() === fullName.trim().toLowerCase()) || null;
    }

    if (studentFound) {
      setActiveStudentId(studentFound.id);
    } else {
      // Create new student record
      const studentCode = `${className}-${String((targetClass?.students.length || 0) + 1).padStart(2, '0')}`;
      const newStudent: Student = {
        id: studentUniqueId,
        classId: className,
        code: studentCode,
        name: fullName.trim(),
        avatar: avatar || '👦',
        stars: 10,
        completedLessons: [],
        gameHighScores: {},
        history: []
      };

      setClassrooms(prev => {
        const classExists = prev.some(c => c.name === `Lớp ${className}`);
        if (classExists) {
          return prev.map(c => {
            if (c.name === `Lớp ${className}`) {
              return { ...c, students: [...c.students, newStudent] };
            }
            return c;
          });
        } else {
          const newClass: Classroom = {
            id: `lop_${className.replace('/', '_')}`,
            name: `Lớp ${className}`,
            schoolYear: '2025 - 2026',
            students: [newStudent]
          };
          return [...prev, newClass];
        }
      });

      setActiveStudentId(studentUniqueId);
    }

    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsStudentSwitchOpen(false);
    try {
      localStorage.setItem('the_gioi_toan_1_logged_in', 'false');
    } catch {}
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('practice');
  };

  // Record an exercise attempt for the active student
  const handleRecordAttempt = (
    lessonId: string,
    exerciseId: string,
    question: string,
    chosenAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    level: DifficultyLevel,
    topicName: string
  ) => {
    if (!activeStudent) return;

    const newAttempt: ExerciseAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      lessonId,
      exerciseId,
      question,
      chosenAnswer,
      correctAnswer,
      isCorrect,
      timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      level,
      topicName
    };

    setClassrooms(prev =>
      prev.map(cls => ({
        ...cls,
        students: cls.students.map(st => {
          if (st.id !== activeStudent!.id) return st;

          const updatedHistory = [newAttempt, ...(st.history || [])];
          const newStars = st.stars + (isCorrect ? 2 : 0);
          const completedSet = new Set(st.completedLessons || []);
          completedSet.add(lessonId);

          return {
            ...st,
            history: updatedHistory,
            stars: newStars,
            completedLessons: Array.from(completedSet)
          };
        })
      }))
    );
  };

  // Record high score for games
  const handleRecordGameScore = (gameId: GameId, score: number) => {
    if (!activeStudent) return;

    setClassrooms(prev =>
      prev.map(cls => ({
        ...cls,
        students: cls.students.map(st => {
          if (st.id !== activeStudent!.id) return st;

          const currentBest = st.gameHighScores?.[gameId] || 0;
          const newHighScores = {
            ...(st.gameHighScores || {}),
            [gameId]: Math.max(currentBest, score)
          };

          return {
            ...st,
            stars: st.stars + 5,
            gameHighScores: newHighScores
          };
        })
      }))
    );
  };

  // Add student from Teacher Dashboard
  const handleAddStudent = (classId: string, name: string, code: string) => {
    const avatars = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🦊', '🐻', '🐰', '🦁'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const cleanClass = classId.replace(/^Lớp\s*/i, '').trim();

    const newStudent: Student = {
      id: `hs_${cleanClass.replace('/', '_')}_${Date.now()}`,
      classId: cleanClass,
      code: code.trim() || `${cleanClass}-${Date.now().toString().slice(-2)}`,
      name: name.trim(),
      avatar: randomAvatar,
      stars: 10,
      completedLessons: [],
      gameHighScores: {},
      history: []
    };

    setClassrooms(prev => {
      const matchIndex = prev.findIndex(
        c => c.name === `Lớp ${cleanClass}` || c.id === `lop_${cleanClass.replace('/', '_')}` || c.name === classId || c.id === classId
      );
      if (matchIndex >= 0) {
        return prev.map((c, i) => (i === matchIndex ? { ...c, students: [...c.students, newStudent] } : c));
      } else {
        const newClass: Classroom = {
          id: `lop_${cleanClass.replace('/', '_')}`,
          name: `Lớp ${cleanClass}`,
          schoolYear: '2025 - 2026',
          students: [newStudent]
        };
        return [...prev, newClass];
      }
    });
  };

  const handleAddBook = (book: BookDocument) => {
    setBooks(prev => [book, ...prev]);
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const handleUpdateBook = (updated: BookDocument) => {
    setBooks(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  };

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setSelectedLesson(updatedLesson);
    setBooks(prev =>
      prev.map(b => ({
        ...b,
        topics: b.topics.map(t => ({
          ...t,
          lessons: t.lessons.map(l => (l.id === updatedLesson.id ? updatedLesson : l))
        }))
      }))
    );
  };

  // Export JSON backup
  const handleExportData = () => {
    const backup = {
      app: 'TheGioiToanHocLop1',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      classrooms,
      books
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TheGioiToan1_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    soundManager.playStar();
  };

  // Import JSON backup
  const handleImportData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.classrooms && parsed.books) {
        setClassrooms(parsed.classrooms);
        setBooks(parsed.books);
        soundManager.playSuccess();
      } else {
        soundManager.playTryAgain();
      }
    } catch (e: any) {
      soundManager.playTryAgain();
      console.warn('Lỗi khi đọc tệp JSON:', e);
    }
  };

  const handleToggleSound = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    soundManager.soundEnabled = nextState;
  };

  const handleUpdateStudentStars = (starsToAdd: number) => {
    if (!activeStudent) return;
    setClassrooms(prev =>
      prev.map(cls => ({
        ...cls,
        students: cls.students.map(st => {
          if (st.id !== activeStudent.id) return st;
          return {
            ...st,
            stars: st.stars + starsToAdd
          };
        })
      }))
    );
  };

  const handleNavigate = (tab: 'home' | 'lessons' | 'games' | 'library' | 'dashboard' | 'super_vip') => {
    // If student clicks on teacher dashboard, verify PIN
    if (tab === 'dashboard' && !isTeacherUnlocked) {
      setIsTeacherPinModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyTeacherPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherPinInput === '1234' || teacherPinInput === '2026') {
      setIsTeacherUnlocked(true);
      setIsTeacherPinModalOpen(false);
      setTeacherPinError(false);
      setTeacherPinInput('');
      soundManager.playSuccess();
      setActiveTab('dashboard');
    } else {
      setTeacherPinError(true);
      soundManager.playTryAgain();
    }
  };

  // If student is not logged in, show student login portal (YÊU CẦU 1)
  if (!isLoggedIn) {
    return <StudentLoginPortal onLogin={handleStudentLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50/40 flex flex-col font-sans text-slate-800">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab === 'practice' ? 'lessons' : activeTab}
        onNavigate={handleNavigate}
        activeStudent={activeStudent}
        onOpenStudentSwitch={() => setIsStudentSwitchOpen(true)}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'home' && (
          <HomeHero
            activeStudent={activeStudent}
            onNavigate={handleNavigate}
            onSelectLesson={handleSelectLesson}
            recentLessons={allLessons.slice(0, 6)}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsList
            topics={allTopics}
            allLessons={allLessons}
            activeStudent={activeStudent}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {activeTab === 'practice' && selectedLesson && (
          <LessonPractice
            lesson={selectedLesson}
            activeStudent={activeStudent}
            onRecordAttempt={handleRecordAttempt}
            onUpdateLesson={handleUpdateLesson}
            onOpenGames={() => {
              setActiveTab('games');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNextLesson={() => {
              const all = books.flatMap(b => b.topics || []).flatMap(t => t.lessons || []);
              const idx = all.findIndex(l => l.id === selectedLesson.id);
              if (idx !== -1 && idx + 1 < all.length) {
                setSelectedLesson(all[idx + 1]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        )}

        {activeTab === 'games' && (
          <GamesHub
            onRecordGameScore={handleRecordGameScore}
            studentHighScores={activeStudent?.gameHighScores || {}}
          />
        )}

        {activeTab === 'super_vip' && (
          <SuperVipHub
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            activeStudent={activeStudent}
            onUpdateStars={handleUpdateStudentStars}
          />
        )}

        {activeTab === 'library' && (
          <BookLibrary
            books={books}
            onSelectLesson={handleSelectLesson}
            onAddBook={handleAddBook}
            onDeleteBook={handleDeleteBook}
            onUpdateBook={handleUpdateBook}
          />
        )}

        {activeTab === 'dashboard' && (
          <TeacherDashboard
            classrooms={classrooms}
            activeStudent={activeStudent}
            onSelectStudent={(st) => {
              setActiveStudentId(st.id);
              setIsStudentSwitchOpen(false);
            }}
            onAddStudent={handleAddStudent}
            onExportData={handleExportData}
            onImportData={handleImportData}
            allLessons={allLessons}
            teacherCustomization={teacherCustomization}
            onRefreshProfile={refreshTeacherProfile}
          />
        )}
      </main>

      {/* Student Profile Switcher & Logout Modal */}
      {isStudentSwitchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-sky-600">Hồ sơ học sinh hiện tại</span>
                <h3 className="text-lg font-black text-slate-900">
                  {activeStudent?.name} · Lớp {activeStudent?.classId || '1/1'}
                </h3>
              </div>
              <button
                onClick={() => setIsStudentSwitchOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-4 mb-4">
              <span className="text-4xl">{activeStudent?.avatar || '👦'}</span>
              <div>
                <span className="font-black text-base text-slate-900 block">{activeStudent?.name}</span>
                <span className="text-xs font-semibold text-sky-700">Lớp {activeStudent?.classId} · Mã: {activeStudent?.code}</span>
                <span className="text-xs font-bold text-amber-600 block mt-1">⭐ {activeStudent?.stars || 0} ngôi sao đã đạt</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <LogOut className="w-4 h-4" /> Đăng xuất / Đổi bạn học khác
              </button>
              <button
                onClick={() => {
                  setIsStudentSwitchOpen(false);
                  setIsTeacherPinModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-indigo-600" /> Vào khu vực quản lý Giáo viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher PIN Verification Modal (YÊU CẦU 1 Security Protection) */}
      {isTeacherPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-indigo-100 animate-in zoom-in-95">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-2 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Xác thực Giáo viên</h3>
              <p className="text-xs text-slate-500 mt-1">
                Khu vực quản lý dành riêng cho Thầy/Cô. Nhập mã bảo vệ để tiếp tục (Mã mặc định: <strong>1234</strong>):
              </p>
            </div>

            <form onSubmit={handleVerifyTeacherPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  maxLength={6}
                  placeholder="Nhập mã 1234"
                  value={teacherPinInput}
                  onChange={(e) => {
                    setTeacherPinInput(e.target.value);
                    setTeacherPinError(false);
                  }}
                  className="w-full text-center tracking-widest text-xl font-black py-3 px-4 bg-slate-50 border-2 border-indigo-200 focus:border-indigo-500 rounded-2xl focus:outline-none"
                />
                {teacherPinError && (
                  <p className="text-xs font-bold text-rose-600 text-center mt-2">
                    Mã bảo vệ chưa đúng! Vui lòng thử lại với 1234.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherPinModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Mở khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="mt-auto border-t border-sky-100 bg-white/90 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-left">
            <span className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center text-sm font-black shrink-0">
              🌸
            </span>
            <div>
              <span className="font-extrabold text-sky-950 block">THẾ GIỚI TOÁN HỌC LỚP 1 · CÔ TRẦN THỊ PHƯỢNG</span>
              <span className="text-[11px] text-slate-500">Trường Tiểu học Trần Đại Nghĩa, phường Hòa Xuân, thành phố Đà Nẵng</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span>Đang học: <strong>{activeStudent?.name}</strong> (Lớp {activeStudent?.classId})</span>
            <span>·</span>
            <button
              onClick={() => {
                if (!isTeacherUnlocked) {
                  setIsTeacherPinModalOpen(true);
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Khu vực Giáo viên
            </button>
          </div>
        </div>
      </footer>

      {/* Global Floating Audio Control for Mobile & Desktop */}
      <FloatingAudioControl studentName={activeStudent?.name} />
    </div>
  );
}
