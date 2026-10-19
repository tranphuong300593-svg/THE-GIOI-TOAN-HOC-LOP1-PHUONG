import React from 'react';
import { Student, Lesson } from '../types';
import { soundManager } from '../utils/audio';
import {
  Trophy,
  Star,
  Award,
  BookOpen,
  Gamepad2,
  X,
  Sparkles,
  CheckCircle2,
  Flame,
  Medal
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  allLessons: Lesson[];
  onOpenLessons: () => void;
  onOpenGames: () => void;
}

export const StudentAchievementsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  student,
  allLessons,
  onOpenLessons,
  onOpenGames
}) => {
  if (!isOpen) return null;

  const stars = student?.stars || 0;
  const completedCount = student?.completedLessons?.length || 0;
  const highScores = student?.gameHighScores || {};
  const totalHighScores = Object.values(highScores).reduce((acc, s) => acc + s, 0);

  // Compute title / badge based on stars
  let titleBadge = 'Bé Chăm Chỉ ⭐';
  if (stars >= 50) titleBadge = 'Hiệp Sĩ Toán Học 🛡️';
  else if (stars >= 30) titleBadge = 'Ngôi Sao Toán Học 🌟';
  else if (stars >= 20) titleBadge = 'Bé Giỏi Toán Nhí 🎓';

  const badges = [
    {
      name: 'Chào Bạn Mới',
      desc: 'Bắt đầu hành trình khám phá Toán lớp 1',
      icon: '🎉',
      unlocked: true
    },
    {
      name: 'Bàn Tay Vàng',
      desc: 'Đạt từ 20 ngôi sao toán học',
      icon: '⭐',
      unlocked: stars >= 20
    },
    {
      name: 'Nhà Thám Hiểm',
      desc: 'Hoàn thành từ 3 bài học',
      icon: '🧭',
      unlocked: completedCount >= 3
    },
    {
      name: 'Cao Thủ Trò Chơi',
      desc: 'Đạt điểm trong các trò chơi ôn tập',
      icon: '🏆',
      unlocked: totalHighScores > 50
    },
    {
      name: 'Vua Tính Nhẩm',
      desc: 'Luyện tập xuất sắc với 50+ sao',
      icon: '👑',
      unlocked: stars >= 50
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border-4 border-amber-300 my-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg border-2 border-white">
              🏅
            </div>
            <div>
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">
                Bảng vinh danh học tập
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">
                THÀNH TÍCH CỦA EM
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Student Profile Lockup */}
        <div className="p-4 bg-gradient-to-r from-amber-100 via-sky-100 to-pink-100 rounded-2xl border-2 border-white shadow-sm flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl border border-amber-200">
            {student?.avatar || '👦'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-black text-slate-900">{student?.name || 'Bé Yêu'}</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black">
                Lớp {student?.classId || '1/1'}
              </span>
            </div>
            <p className="text-xs font-bold text-amber-700 mt-0.5">
              Danh hiệu: <strong>{titleBadge}</strong>
            </p>
            <span className="text-[11px] text-slate-500 font-medium">Mã học sinh: {student?.code || 'HS-01'}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-700 block">Ngôi sao</span>
            <p className="text-2xl font-black text-amber-600 mt-1 flex items-center justify-center gap-1">
              ⭐ {stars}
            </p>
          </div>
          <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 text-center">
            <span className="text-xs font-bold text-sky-700 block">Bài hoàn thành</span>
            <p className="text-2xl font-black text-sky-600 mt-1">
              {completedCount} bài
            </p>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center">
            <span className="text-xs font-bold text-emerald-700 block">Điểm trò chơi</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {totalHighScores}đ
            </p>
          </div>
        </div>

        {/* Badge Collection */}
        <div className="mb-6">
          <h4 className="font-black text-sm text-slate-800 mb-3 flex items-center gap-1.5">
            <Medal className="w-4 h-4 text-amber-500" /> Huy hiệu đã sưu tầm:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  b.unlocked
                    ? 'bg-amber-50/80 border-amber-200 text-slate-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  b.unlocked ? 'bg-amber-200' : 'bg-slate-200'
                }`}>
                  {b.icon}
                </div>
                <div>
                  <h5 className="font-black text-xs">{b.name}</h5>
                  <p className="text-[11px] leading-tight">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouraging Quote from Teacher */}
        <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-900 flex items-center gap-3 mb-6">
          <span className="text-2xl">👩‍🏫</span>
          <p className="font-semibold italic">
            “Cô Phượng rất tự hào về sự chăm chỉ của em! Mỗi bài toán giải đúng là một bước tiến kỳ diệu!”
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenLessons();
            }}
            className="w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" /> Làm bài nhận thêm sao
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenGames();
            }}
            className="w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" /> Chơi trò chơi ngay
          </button>
        </div>
      </div>
    </div>
  );
};
