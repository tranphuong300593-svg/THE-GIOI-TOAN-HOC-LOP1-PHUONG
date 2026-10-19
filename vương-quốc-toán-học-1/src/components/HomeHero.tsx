import React, { useState } from 'react';
import { Student, Lesson } from '../types';
import { soundManager } from '../utils/audio';
import {
  BookOpen,
  Gamepad2,
  Trophy,
  Award,
  Star,
  Sparkles,
  Volume2,
  Play,
  ArrowRight
} from 'lucide-react';
import { StudentAchievementsModal } from './StudentAchievementsModal';
import { FixedImage } from './FixedImage';

interface Props {
  activeStudent: Student | null;
  onNavigate: (tab: 'home' | 'lessons' | 'games' | 'library' | 'dashboard' | 'super_vip') => void;
  onSelectLesson: (lesson: Lesson) => void;
  recentLessons: Lesson[];
}

export const HomeHero: React.FC<Props> = ({
  activeStudent,
  onNavigate,
  onSelectLesson,
  recentLessons
}) => {
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  const studentName = activeStudent ? activeStudent.name : 'Bé yêu';
  const studentClass = activeStudent?.classId || '1/1';
  const stars = activeStudent ? activeStudent.stars : 20;

  const handleVoiceGreeting = () => {
    soundManager.unlockAudio();
    soundManager.playPop();
    soundManager.speakVietnamese(
      `Chào mừng bé ${studentName}, lớp ${studentClass} đến với Thế giới Toán học lớp 1. Cô Phượng chúc em học Toán thật vui và đạt thật nhiều ngôi sao nhé!`
    );
  };

  return (
    <div className="space-y-12">
      {/* ========================================================
          PHẦN ĐẦU TRANG CHỦ – MAGICAL MATH WORLD & ẢNH ĐẦU TRANG CÔ PHƯỢNG
         ======================================================== */}
      <section className="relative rounded-[2.5rem] bg-gradient-to-b from-sky-300 via-sky-200 to-amber-50/80 p-6 sm:p-8 md:p-12 text-slate-900 shadow-2xl overflow-hidden border-4 border-white/80">
        {/* Soft Background Clouds, Rainbow & Magical Glows */}
        <div className="absolute top-6 left-12 w-40 h-40 bg-yellow-200/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-20 w-72 h-72 bg-pink-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-52 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Pastel Rainbow in Background */}
        <div className="absolute -top-16 left-1/4 w-96 h-48 opacity-40 pointer-events-none">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <path d="M20 200 A180 180 0 0 1 380 200" fill="none" stroke="#F43F5E" strokeWidth="12" strokeLinecap="round" />
            <path d="M40 200 A160 160 0 0 1 360 200" fill="none" stroke="#FBBF24" strokeWidth="12" strokeLinecap="round" />
            <path d="M60 200 A140 140 0 0 1 340 200" fill="none" stroke="#34D399" strokeWidth="12" strokeLinecap="round" />
            <path d="M80 200 A120 120 0 0 1 320 200" fill="none" stroke="#38BDF8" strokeWidth="12" strokeLinecap="round" />
            <path d="M100 200 A100 100 0 0 1 300 200" fill="none" stroke="#A855F7" strokeWidth="12" strokeLinecap="round" />
          </svg>
        </div>

        {/* Floating Playful Math Numbers (0 to 9) Around the World */}
        <div className="absolute top-6 right-8 text-2xl font-black text-rose-500/70 select-none animate-bounce delay-100">
          7
        </div>
        <div className="absolute top-28 left-6 text-3xl font-black text-amber-500/70 select-none animate-bounce delay-300">
          3
        </div>
        <div className="absolute bottom-12 left-16 text-2xl font-black text-emerald-500/70 select-none animate-pulse">
          9
        </div>
        <div className="absolute bottom-8 right-1/3 text-3xl font-black text-purple-500/70 select-none animate-bounce delay-200">
          5
        </div>
        <div className="absolute top-4 left-1/2 text-xl font-black text-sky-500/60 select-none">
          8
        </div>

        {/* 1. TIÊU ĐỀ CHÍNH TRÊN CÙNG */}
        <div className="relative z-10 text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm text-xs sm:text-sm font-extrabold text-sky-900 border border-sky-100 mb-3 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Chương trình Giáo dục phổ thông 2018 · Toán lớp 1</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-sky-950 tracking-tight leading-tight">
            THẾ GIỚI TOÁN HỌC{' '}
            <span className="text-amber-500 underline decoration-amber-300 decoration-wavy">
              LỚP 1
            </span>
          </h1>

          <p className="text-sky-850 font-black text-base sm:text-lg md:text-xl mt-2 tracking-wide">
            “Học vui mỗi ngày – Khám phá Toán hay!”
          </p>
        </div>

        {/* 2. ẢNH ĐẦU TRANG – ẢNH THỨ NHẤT CỐ ĐỊNH NGUYÊN VẸN, KHÔNG MÉO, KHÔNG KÉO DÃN */}
        <div className="relative z-10 max-w-4xl mx-auto mb-8">
          <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-5 shadow-2xl border-4 border-amber-200 overflow-hidden">
            <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50/70 to-pink-50/70 min-h-[260px] sm:min-h-[340px]">
              <FixedImage
                candidates={[
                  '/assets/hinh-trang-bia.jpg',
                  '/assets/anh-trang-bia-co-phuong.jpg',
                  '/assets/co-phuong-hero.jpg',
                  '/assets/hình trang bìa.jpg',
                  '/hinh-trang-bia.jpg'
                ]}
                alt="Cùng học Toán với cô Phượng"
                className="w-full h-auto object-contain mx-auto select-none rounded-2xl transition-all shadow-sm"
                fallbackIcon="👩‍🏫"
              />
            </div>
          </div>
        </div>

        {/* 3. KHUNG CHÀO MỪNG BÉ VÀ 4 NÚT HỌC TẬP TƯƠNG TÁC CHÍNH */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          {/* Lời chào cá nhân hóa học sinh kèm nút giọng nói */}
          <div className="p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-sky-100 shadow-sm flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{activeStudent?.avatar || '👦'}</span>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Bé đang học
                </span>
                <p className="text-base sm:text-lg font-black text-slate-800">
                  {studentName} – Lớp {studentClass}
                </p>
                <span className="text-xs font-bold text-amber-600">
                  ⭐ Đã tích lũy: {stars} ngôi sao
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleVoiceGreeting}
                className="py-2.5 px-3 sm:px-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Nghe lời chào của Cô Phượng"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe cô chào</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.unlockAudio();
                  soundManager.playRobotGreeting();
                  soundManager.speakVietnamese('Xin chào bạn nhỏ! Tớ là rô-bốt Robi, chúng mình cùng khám phá thế giới Toán học nhé!');
                }}
                className="py-2.5 px-3 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs border border-sky-300 shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Rô-bốt Robi chào bé"
              >
                <span className="text-base">🤖</span>
                <span className="hidden sm:inline">Bạn Robi</span>
              </button>
            </div>
          </div>

          {/* BANNER SIÊU VIP – ĐẠI HỘI GAME TOÁN HỌC */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 p-4 sm:p-5 text-white shadow-xl shadow-orange-500/25 border-2 border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
                👑
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-yellow-300 text-slate-950 font-black text-[11px] uppercase tracking-wider mb-1 shadow-xs">
                  <span>✨ ĐẶC BIỆT MỚI</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  🌟 SIÊU VIP – ĐẠI HỘI GAME TOÁN HỌC 🌟
                </h3>
                <p className="text-xs sm:text-sm text-amber-100 font-bold mt-0.5">
                  “Chơi thật vui – Giỏi Toán mỗi ngày!” · 5 Đấu trường Game tương tác thực sự!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playFanfare();
                onNavigate('super_vip');
              }}
              className="py-3 px-6 rounded-2xl bg-white text-orange-600 hover:bg-amber-50 hover:scale-105 active:scale-95 font-black text-sm sm:text-base tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>VÀO ĐẠI HỘI NGAY</span>
              <span className="text-lg font-bold">➔</span>
            </button>
          </div>

          {/* 4 NÚT CHỨC NĂNG CHÍNH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
            {/* Nút 1: HỌC BÀI */}
            <button
              onClick={() => {
                soundManager.playPop();
                onNavigate('lessons');
              }}
              className="py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base shadow-lg shadow-emerald-500/25 hover:scale-103 active:scale-95 transition-all flex items-center gap-3 border-2 border-emerald-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block leading-none font-black">HỌC BÀI</span>
                <span className="text-[11px] font-semibold text-emerald-100 flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> 41 bài SGK
                </span>
              </div>
            </button>

            {/* Nút 2: CHƠI TOÁN */}
            <button
              onClick={() => {
                soundManager.playPop();
                onNavigate('games');
              }}
              className="py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-lg shadow-orange-500/25 hover:scale-103 active:scale-95 transition-all flex items-center gap-3 border-2 border-amber-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block leading-none font-black">CHƠI TOÁN</span>
                <span className="text-[11px] font-semibold text-amber-100 flex items-center gap-1 mt-1">
                  🌈 38 trò chơi 3D
                </span>
              </div>
            </button>

            {/* Nút 3: THỬ THÁCH TOÁN HỌC */}
            <button
              onClick={() => {
                soundManager.playPop();
                onNavigate('games');
              }}
              className="py-4 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-black text-base shadow-lg shadow-indigo-500/25 hover:scale-103 active:scale-95 transition-all flex items-center gap-3 border-2 border-purple-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-left">
                <span className="block leading-none font-black">THỬ THÁCH</span>
                <span className="text-[11px] font-semibold text-purple-100 flex items-center gap-1 mt-1">
                  🏆 Thách đấu tổng hợp
                </span>
              </div>
            </button>

            {/* Nút 4: THÀNH TÍCH CỦA EM */}
            <button
              onClick={() => {
                soundManager.playPop();
                setIsAchievementsOpen(true);
              }}
              className="py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-base shadow-lg shadow-pink-500/25 hover:scale-103 active:scale-95 transition-all flex items-center gap-3 border-2 border-pink-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="text-left">
                <span className="block leading-none font-black">THÀNH TÍCH</span>
                <span className="text-[11px] font-semibold text-pink-100 flex items-center gap-1 mt-1">
                  ⭐ Xem sao & huy hiệu
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          CÁC BÀI HỌC VÀ KHU VỰC TRÒ CHƠI TIÊU BIỂU
         ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" /> Bài Học Mới Nhất
            </h3>
            <p className="text-xs text-slate-500">
              Chương trình môn Toán lớp 1 – Sách Kết nối tri thức với cuộc sống
            </p>
          </div>
          <button
            onClick={() => onNavigate('lessons')}
            className="text-xs font-extrabold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            Xem tất cả bài học <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentLessons.slice(0, 3).map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => {
                soundManager.playPop();
                onSelectLesson(lesson);
              }}
              className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Bài {lesson.lessonNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Học kỳ {lesson.semester}
                  </span>
                </div>
                <h4 className="font-black text-base text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">
                  {lesson.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {lesson.coreKnowledge}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>{lesson.exercises.length} câu luyện tập</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Học ngay <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8 TRÒ CHƠI ÔN TẬP TOÁN HỌC */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-amber-500" /> 8 Trò Chơi Ôn Tập Nổi Bật
            </h3>
            <p className="text-xs text-slate-500">
              Vừa chơi vừa học, phát triển tư duy logic và kỹ năng tính nhẩm nhanh
            </p>
          </div>
          <button
            onClick={() => onNavigate('games')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            Vào sân chơi đầy đủ <Play className="w-3.5 h-3.5 fill-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Săn Số Bí Ẩn', icon: '🕵️‍♂️', color: 'from-amber-400 to-orange-500' },
            { title: 'Siêu Nhân Cộng Trừ', icon: '🦸‍♂️', color: 'from-rose-500 to-red-600' },
            { title: 'Ghép Đôi Thần Tốc', icon: '⚡', color: 'from-emerald-400 to-teal-600' },
            { title: 'Đường Đua Toán Học', icon: '🏎️', color: 'from-teal-500 to-emerald-600' }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('games')}
              className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm hover:scale-102 transition-transform cursor-pointer flex items-center gap-3"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl text-white shadow-sm shrink-0`}>
                {item.icon}
              </div>
              <span className="font-extrabold text-xs text-slate-800 line-clamp-1">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          V. THIẾT KẾ PHẦN CUỐI TRANG CHỦ – KHU VỰC TÁC GIẢ CÔ PHƯỢNG
         ======================================================== */}
      <section className="relative rounded-[2.5rem] bg-gradient-to-b from-white via-pink-50/40 to-sky-50 p-6 sm:p-10 text-center border-4 border-amber-100 shadow-xl overflow-hidden">
        {/* Decorative Top Rainbow & Star Border */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-400 via-amber-400 via-emerald-400 via-sky-400 to-purple-400" />

        {/* Floating Stars & Flowers Background */}
        <div className="absolute top-4 left-8 text-amber-400 opacity-60 text-xl animate-pulse">⭐</div>
        <div className="absolute top-8 right-12 text-pink-400 opacity-60 text-lg animate-bounce">🌸</div>
        <div className="absolute bottom-6 left-16 text-sky-400 opacity-60 text-lg">✨</div>
        <div className="absolute bottom-8 right-16 text-rose-400 opacity-60 text-xl animate-pulse">💖</div>

        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          {/* Badge Tác giả */}
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-xs font-black shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" /> Tác giả sáng tạo ứng dụng
          </div>

          {/* ẢNH CUỐI TRANG – ẢNH THỨ HAI CỐ ĐỊNH NGUYÊN VẸN, KHÔNG MÉO, KHÔNG KÉO DÃN */}
          <div className="relative mx-auto max-w-xl bg-white rounded-3xl p-3 sm:p-4 shadow-xl border-4 border-rose-200 overflow-hidden">
            <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-pink-50/50 to-sky-50/50 min-h-[220px]">
              <FixedImage
                candidates={[
                  '/assets/hinh-chan-trang.jpg',
                  '/assets/anh-trang-cuoi-co-phuong.jpg',
                  '/assets/co-phuong-footer.jpg',
                  '/assets/hình chân trang.jpg',
                  '/hinh-chan-trang.jpg'
                ]}
                alt="Cô giáo Trần Thị Phượng - Tác giả sáng tạo ứng dụng"
                className="w-full h-auto object-contain mx-auto select-none rounded-2xl transition-all shadow-sm"
                fallbackIcon="👩‍🏫"
              />
            </div>
          </div>

          {/* DÒNG GHI CÔNG TÁC GIẢ CHÍNH XÁC 100% */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xl sm:text-2xl font-black text-slate-900">
              Cô giáo Trần Thị Phượng
            </h4>

            {/* DÒNG NỘI DUNG CHÍNH XÁC 100%:
                Website này được sáng tạo bởi cô giáo Trần Thị Phượng – Trường Tiểu học Trần Đại Nghĩa, phường Hòa Xuân, thành phố Đà Nẵng. */}
            <p className="text-sm sm:text-base md:text-lg font-bold text-sky-950 leading-relaxed max-w-xl mx-auto px-2">
              Website này được sáng tạo bởi{' '}
              <span className="text-rose-600 underline decoration-rose-300 decoration-wavy">
                cô giáo Trần Thị Phượng
              </span>{' '}
              – Trường Tiểu học Trần Đại Nghĩa, phường Hòa Xuân, thành phố Đà Nẵng.
            </p>
          </div>

          {/* Thông điệp giáo dục ý nghĩa */}
          <p className="text-xs sm:text-sm text-slate-600 font-semibold italic max-w-lg mx-auto">
            “Gửi trọn tình yêu thương và niềm đam mê Toán học đến tất cả các em học sinh thân yêu!”
          </p>
        </div>
      </section>

      {/* Modal Bảng Thành Tích của Em (Button 4) */}
      <StudentAchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        student={activeStudent}
        allLessons={recentLessons}
        onOpenLessons={() => onNavigate('lessons')}
        onOpenGames={() => onNavigate('games')}
      />
    </div>
  );
};
