/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ALL_CLASSES, GradeClass, StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { TOPICS, LESSONS } from '../../data/curriculumData';
import {
  Users,
  Download,
  Lock,
  Unlock,
  Settings,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Search,
  BookOpen
} from 'lucide-react';

interface TeacherDashboardProps {
  onBack: () => void;
  langMode: LanguageMode;
  onSetLangMode: (mode: LanguageMode) => void;
  onOpenPronunciationStudio?: () => void;
  onOpenVisualAudit?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onBack,
  langMode,
  onSetLangMode,
  onOpenPronunciationStudio,
  onOpenVisualAudit,
}) => {
  // Simple Teacher PIN Gate (default: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Class Selection (1/1 to 1/26)
  const [selectedClass, setSelectedClass] = useState<GradeClass>('1/1');
  const [searchName, setSearchName] = useState('');

  // Teacher Settings
  const [questionsPerRound, setQuestionsPerRound] = useState(10);
  const [audioSettings, setAudioSettings] = useState(soundService.getSettings());

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError('');
      soundService.playCorrect();
    } else {
      setPinError('Mã PIN không đúng! (Mã mặc định dành cho giáo viên: 1234)');
      soundService.playIncorrect();
    }
  };

  const students = StorageService.getClassStudents(selectedClass).filter((s) =>
    s.fullName.toLowerCase().includes(searchName.toLowerCase().trim())
  );
  const allRecords = StorageService.getAllRecords();

  const handleExportCSV = () => {
    soundService.playClick();
    const csvContent = StorageService.exportClassToCSV(selectedClass);
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_cao_hoc_tap_Lop_${selectedClass.replace('/', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleSfx = () => {
    const next = !audioSettings.sfxEnabled;
    const updated = { ...audioSettings, sfxEnabled: next };
    setAudioSettings(updated);
    soundService.updateSettings(updated);
  };

  const handleToggleSpeech = () => {
    const next = !audioSettings.speechEnabled;
    const updated = { ...audioSettings, speechEnabled: next };
    setAudioSettings(updated);
    soundService.updateSettings(updated);
  };

  const handleToggleBgm = () => {
    const next = !audioSettings.bgmEnabled;
    const updated = { ...audioSettings, bgmEnabled: next };
    setAudioSettings(updated);
    soundService.updateSettings(updated);
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto my-12 bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-200 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 font-heading">
            CỔNG QUẢN LÝ DÀNH CHO GIÁO VIÊN
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Vui lòng nhập mã bảo vệ để truy cập hệ thống báo cáo và cài đặt lớp học.
          </p>
        </div>

        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (pinError) setPinError('');
              }}
              placeholder="Nhập mã PIN (Mặc định: 1234)"
              className="w-full text-center px-4 py-3 text-xl font-mono tracking-widest font-bold rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-rose-600 font-bold mt-2">{pinError}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-400">
          Gợi ý: Mã PIN mặc định là <strong>1234</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ học sinh</span>
          </button>
          <h2 className="text-lg md:text-xl font-black text-indigo-900 font-heading">
            Trang Quản Lý Giáo Viên – 26 Lớp Học
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenVisualAudit && (
            <button
              onClick={() => {
                onOpenVisualAudit();
                soundService.playClick();
              }}
              className="flex items-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Trung tâm kiểm định học liệu trực quan & hình ảnh Toán"
            >
              <span>🔬</span>
              <span>Kiểm định hình ảnh Toán</span>
            </button>
          )}
          {onOpenPronunciationStudio && (
            <button
              onClick={() => {
                onOpenPronunciationStudio();
                soundService.playClick();
              }}
              className="flex items-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Mở phòng kiểm tra và cấu hình phát âm tiếng Anh"
            >
              <span>🎙️</span>
              <span>Kiểm tra phát âm tiếng Anh</span>
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo CSV lớp {selectedClass}</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
          >
            Khóa lại
          </button>
        </div>
      </div>

      {/* Class Selector & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Class picker & search */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 lg:col-span-1">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Chọn Lớp Học (1/1 đến 1/26):
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value as GradeClass);
                soundService.playClick();
              }}
              className="w-full p-2.5 rounded-xl border-2 border-indigo-200 text-sm font-black text-indigo-950 bg-indigo-50/50 cursor-pointer focus:outline-none focus:border-indigo-500"
            >
              {ALL_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  Lớp {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Tìm kiếm học sinh:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Tên học sinh..."
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Quick Class Summary */}
          <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-100 text-xs text-indigo-950 space-y-1">
            <div className="font-bold flex justify-between">
              <span>Sĩ số đã tạo hồ sơ:</span>
              <strong className="text-indigo-700">{students.length} em</strong>
            </div>
            <div className="flex justify-between">
              <span>Tổng bài học hoàn thành:</span>
              <strong>{allRecords.filter((r) => r.type === 'lesson').length}</strong>
            </div>
            <div className="flex justify-between">
              <span>Tổng lượt chơi trò chơi:</span>
              <strong>{allRecords.filter((r) => r.type === 'game').length}</strong>
            </div>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-black text-slate-900 font-heading">
                Danh Sách Học Sinh Lớp {selectedClass} ({students.length} học sinh)
              </h3>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-semibold">
              Chưa có học sinh nào thuộc lớp {selectedClass} đăng nhập trên thiết bị này.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2">Học sinh</th>
                    <th className="pb-2 text-center">Tổng sao ⭐</th>
                    <th className="pb-2 text-center">Bài học</th>
                    <th className="pb-2 text-center">Trò chơi</th>
                    <th className="pb-2 text-center">Huy hiệu</th>
                    <th className="pb-2 text-right">Lần vào cuối</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => {
                    const stRecs = allRecords.filter((r) => r.studentId === st.id);
                    const lessonCount = stRecs.filter((r) => r.type === 'lesson').length;
                    const gameCount = stRecs.filter((r) => r.type === 'game').length;

                    return (
                      <tr key={st.id} className="hover:bg-indigo-50/40">
                        <td className="py-3 font-black text-slate-900 flex items-center gap-2">
                          <span className="text-lg">{st.avatar || '🤖'}</span>
                          <span>{st.fullName}</span>
                        </td>
                        <td className="py-3 text-center font-black text-amber-500">
                          {st.totalStars}
                        </td>
                        <td className="py-3 text-center font-bold text-sky-700">
                          {lessonCount} bài
                        </td>
                        <td className="py-3 text-center font-bold text-purple-700">
                          {gameCount} lượt
                        </td>
                        <td className="py-3 text-center font-black text-slate-600">
                          {st.badges.length}
                        </td>
                        <td className="py-3 text-right text-slate-400 text-xs">
                          {new Date(st.lastLoginAt).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Global Settings Deck */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" />
          <h3 className="text-base font-black text-slate-900 font-heading">
            Cấu Hình Phương Pháp Giảng Dạy & Tùy Chọn Lớp Học
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Questions per practice round */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase">
              Số câu hỏi mỗi lượt luyện tập:
            </span>
            <div className="flex items-center gap-2">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionsPerRound(cnt)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    questionsPerRound === cnt
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cnt} câu
                </button>
              ))}
            </div>
          </div>

          {/* Default Language Setting */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase">
              Chế độ ngôn ngữ mặc định:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSetLangMode('bilingual')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  langMode === 'bilingual'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Song ngữ (Chuẩn)
              </button>
              <button
                onClick={() => onSetLangMode('vi')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  langMode === 'vi'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Thuần Việt
              </button>
              <button
                onClick={() => onSetLangMode('en')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  langMode === 'en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                English Only
              </button>
            </div>
          </div>

          {/* Audio toggles */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase">
              Âm thanh & Giọng đọc Robot:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSpeech}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  audioSettings.speechEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                Giọng đọc: {audioSettings.speechEnabled ? 'Bật' : 'Tắt'}
              </button>
              <button
                onClick={handleToggleSfx}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  audioSettings.sfxEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                Hiệu ứng: {audioSettings.sfxEnabled ? 'Bật' : 'Tắt'}
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated English Pronunciation & Voice Testing Card for Teachers */}
        {onOpenPronunciationStudio && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-2 border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-black text-purple-950">
                <span className="text-xl">🎙️</span>
                <span>Phòng Kiểm Tra & Cấu Hình Phát Âm Tiếng Anh Chuẩn (en-US)</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Kiểm tra phát âm số đếm (0-100), phân biệt cặp từ dễ nhầm (<em>Three/Tree</em>, <em>Thirteen/Thirty</em>), đọc phép tính và chọn giọng nữ tự nhiên phù hợp cho học sinh lớp 1.
              </p>
            </div>
            <button
              onClick={() => {
                onOpenPronunciationStudio();
                soundService.playClick();
              }}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Mở Studio Phát Âm 🎙️
            </button>
          </div>
        )}

        {/* Dedicated Math & Visual Audit Center Card for Teachers */}
        {onOpenVisualAudit && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-black text-emerald-950">
                <span className="text-xl">🔬</span>
                <span>Trung Tâm Kiểm Định Học Liệu Trực Quan & Toán Học Lớp 1</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Chạy bộ kiểm thử tự động 100% câu hỏi qua 41 bài học: Kiểm tra đúng loại đối tượng (táo, cá, vịt, hoa, bút chì...), đúng số lượng, đúng phép cộng trừ, thước đo và đồng hồ kim.
              </p>
            </div>
            <button
              onClick={() => {
                onOpenVisualAudit();
                soundService.playClick();
              }}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Mở Kiểm Định Trực Quan 🔬
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
