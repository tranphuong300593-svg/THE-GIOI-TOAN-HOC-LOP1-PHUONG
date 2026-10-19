import React, { useState } from 'react';
import { OFFICIAL_CLASSES } from '../data/curriculumData';
import { soundManager } from '../utils/audio';
import { FloatingAudioControl } from './FloatingAudioControl';
import { Sparkles, ArrowRight, User, School, Check, Star } from 'lucide-react';

interface Props {
  onLogin: (fullName: string, className: string, avatar: string) => void;
}

const AVATAR_OPTIONS = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🦊', '🐻', '🐰', '🦁'];

export const StudentLoginPortal: React.FC<Props> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👦');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.unlockAudio();
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setErrorMessage('Bé hãy nhập họ và tên của mình nhé!');
      soundManager.playTryAgain();
      return;
    }

    if (!selectedClass) {
      setErrorMessage('Bé hãy chọn đúng lớp học của mình từ 1/1 đến 1/26 nhé!');
      soundManager.playTryAgain();
      return;
    }

    setErrorMessage(null);
    soundManager.playSuccess();
    onLogin(trimmedName, selectedClass, selectedAvatar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Soft 3D Glows & Clouds */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 left-1/4 w-80 h-40 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border-4 border-white/80 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Whimsical Header Lockup */}
        <div className="text-center mb-6">
          {/* Mascot Robot Robi Avatar */}
          <div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-sky-100 to-amber-100 rounded-full flex items-center justify-center text-5xl shadow-md border-4 border-amber-300/80">
            🤖
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" /> Cổng Đăng Nhập Học Sinh Lớp 1
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight leading-tight">
            CHÀO MỪNG BÉ ĐẾN VỚI <br />
            <span className="text-amber-500 underline decoration-amber-300 decoration-wavy">
              THẾ GIỚI TOÁN HỌC LỚP 1
            </span>
          </h1>

          <p className="text-sky-800 font-extrabold text-sm sm:text-base mt-2">
            “Học vui mỗi ngày – Khám phá Toán hay!”
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input 1: Student Full Name */}
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-600" /> Họ và tên học sinh: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Nhập họ và tên của em"
              className="w-full py-3.5 px-4 bg-sky-50/60 border-2 border-sky-200 focus:border-amber-400 focus:bg-white rounded-2xl text-base font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-amber-200/50 transition-all"
            />
          </div>

          {/* Input 2: Choose Class (Strictly 1/1 to 1/26) */}
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <School className="w-4 h-4 text-emerald-600" /> Chọn lớp học của em: <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                (Từ lớp 1/1 đến 1/26)
              </span>
            </label>

            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              required
              className="w-full py-3.5 px-4 bg-emerald-50/60 border-2 border-emerald-200 focus:border-amber-400 focus:bg-white rounded-2xl text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-200/50 transition-all cursor-pointer"
            >
              <option value="" disabled>-- Nhấp để chọn lớp của em --</option>
              {OFFICIAL_CLASSES.map((cls) => (
                <option key={cls} value={cls} className="py-1">
                  Lớp {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Optional: Avatar Selection */}
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
              Chọn hình đại diện yêu thích:
            </label>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedAvatar(av);
                  }}
                  className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                    selectedAvatar === av
                      ? 'bg-amber-300 border-2 border-amber-500 scale-110 shadow-md ring-2 ring-amber-200'
                      : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl text-center animate-shake">
              {errorMessage}
            </div>
          )}

          {/* Big Prominent Action Button: BẮT ĐẦU KHÁM PHÁ */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xl shadow-xl shadow-orange-500/30 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-amber-300 cursor-pointer"
          >
            <Sparkles className="w-6 h-6" />
            <span>BẮT ĐẦU KHÁM PHÁ</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        {/* Note */}
        <p className="text-center text-[11px] text-slate-400 font-medium mt-4">
          Không yêu cầu mật khẩu · Dữ liệu được lưu trữ tự động trên thiết bị của em
        </p>
      </div>

      {/* Floating Audio Control on Login screen */}
      <FloatingAudioControl studentName={fullName || 'Bé yêu'} />
    </div>
  );
};
