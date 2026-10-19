import React from 'react';
import { Student } from '../types';
import { soundManager } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, User, Shield } from 'lucide-react';

interface Props {
  activeTab: 'home' | 'lessons' | 'games' | 'library' | 'dashboard' | 'super_vip';
  onNavigate: (tab: 'home' | 'lessons' | 'games' | 'library' | 'dashboard' | 'super_vip') => void;
  activeStudent: Student | null;
  onOpenStudentSwitch: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onNavigate,
  activeStudent,
  onOpenStudentSwitch,
  isSoundOn,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => {
            soundManager.playPop();
            onNavigate('home');
          }}
          className="flex items-center gap-2 text-sky-950 font-black text-lg md:text-xl tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-lg shadow-sm">
            ⭐
          </span>
          <span>Thế Giới Toán 1</span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links + VIP */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-bold text-slate-600">
          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('home');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'home'
                ? 'text-sky-600 border-sky-500 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Trang chủ
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('lessons');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'lessons'
                ? 'text-sky-600 border-sky-500 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Học bài
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('games');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'games'
                ? 'text-sky-600 border-sky-500 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Sân chơi Toán
          </button>

          {/* SIÊU VIP Highlighted Tab */}
          <button
            onClick={() => {
              soundManager.playFanfare();
              onNavigate('super_vip');
            }}
            className={`whitespace-nowrap shrink-0 transition-all px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm ${
              activeTab === 'super_vip'
                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 font-black shadow-md scale-105'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
            }`}
          >
            <span>🌟</span>
            <span>SIÊU VIP</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('library');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'library'
                ? 'text-sky-600 border-sky-500 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Thư viện sách
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('dashboard');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'dashboard'
                ? 'text-sky-600 border-sky-500 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Lớp học & Tiến độ
          </button>
        </nav>

        {/* Zone 3: 1 primary action: Student / Teacher Profile Switcher + Audio */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundManager.unlockAudio();
              onToggleSound();
            }}
            className="p-2.5 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 active:scale-90 transition-all cursor-pointer"
            title={isSoundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {isSoundOn ? (
              <Volume2 className="w-5 h-5 text-sky-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-rose-500" />
            )}
          </button>

          <button
            onClick={() => {
              soundManager.unlockAudio();
              soundManager.playPop();
              onOpenStudentSwitch();
            }}
            className="px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 cursor-pointer shadow-2xs"
            title="Đổi học sinh hoặc đăng xuất"
          >
            <span>{activeStudent?.avatar || '👦'}</span>
            <span className="hidden sm:inline">
              {activeStudent?.name || 'Học sinh'} (Lớp {activeStudent?.classId || '1/1'})
            </span>
            <span className="bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md text-[10px]">
              ⭐ {activeStudent?.stars || 0}
            </span>
            <span className="text-[10px] text-sky-700 bg-white/80 px-1.5 py-0.5 rounded font-bold hover:bg-white ml-1">
              Đổi
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for easy thumb tap on phones (min 44px ergonomics) */}
      <nav aria-label="Điều hướng di động" className="flex md:hidden items-center justify-around py-2 border-t border-sky-100 bg-white/95 px-2 text-xs font-bold text-slate-600 overflow-x-auto gap-1">
        <button
          onClick={() => {
            soundManager.unlockAudio();
            soundManager.playPop();
            onNavigate('home');
          }}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-xl shrink-0 transition-all active:scale-95 flex items-center justify-center ${activeTab === 'home' ? 'bg-sky-500 text-white shadow-xs' : 'hover:bg-slate-100'}`}
        >
          Trang chủ
        </button>
        <button
          onClick={() => {
            soundManager.unlockAudio();
            soundManager.playPop();
            onNavigate('lessons');
          }}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-xl shrink-0 transition-all active:scale-95 flex items-center justify-center ${activeTab === 'lessons' ? 'bg-sky-500 text-white shadow-xs' : 'hover:bg-slate-100'}`}
        >
          Học bài
        </button>
        <button
          onClick={() => {
            soundManager.unlockAudio();
            soundManager.playPop();
            onNavigate('games');
          }}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-xl shrink-0 transition-all active:scale-95 flex items-center justify-center ${activeTab === 'games' ? 'bg-amber-500 text-white shadow-xs' : 'hover:bg-slate-100'}`}
        >
          Sân chơi
        </button>
        <button
          onClick={() => {
            soundManager.unlockAudio();
            soundManager.playFanfare();
            onNavigate('super_vip');
          }}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-xl shrink-0 font-black flex items-center gap-1 transition-all active:scale-95 shadow-xs ${
            activeTab === 'super_vip'
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-sm'
              : 'text-amber-800 bg-amber-100 border border-amber-300'
          }`}
        >
          <span>🌟</span>
          <span>SIÊU VIP</span>
        </button>
        <button
          onClick={() => {
            soundManager.unlockAudio();
            soundManager.playPop();
            onNavigate('library');
          }}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-xl shrink-0 transition-all active:scale-95 flex items-center justify-center ${activeTab === 'library' ? 'bg-sky-500 text-white shadow-xs' : 'hover:bg-slate-100'}`}
        >
          Thư viện
        </button>
        <button
          onClick={() => {
            soundManager.unlockAudio();
            soundManager.playPop();
            onNavigate('dashboard');
          }}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-xl shrink-0 transition-all active:scale-95 flex items-center justify-center ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100'}`}
        >
          Lớp học
        </button>
      </nav>
    </header>
  );
};
