/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { LessonCertificate } from '../../types';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import { soundService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { Star, Printer, X, Sparkles, RotateCcw, Check } from 'lucide-react';

interface LessonCertificateModalProps {
  certificate: LessonCertificate;
  isOpen: boolean;
  onClose: () => void;
  isNewAward?: boolean;
  onReviewLesson?: () => void;
}

export const LessonCertificateModal: React.FC<LessonCertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  isNewAward = false,
  onReviewLesson,
}) => {
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  useEffect(() => {
    if (isOpen && isNewAward && !hasPlayedIntro) {
      setHasPlayedIntro(true);

      // 1. Play gentle applause
      soundService.playApplause();

      // 2. Play soft sparkle confetti
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#38BDF8', '#10B981', '#EC4899'],
      });

      // 3. Play American English praise
      const praises = ['Congratulations!', 'Great job!', "You're a star!"];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setTimeout(() => {
        soundService.speakEn(randomPraise, { rate: 0.92, pitch: 1.1 });
      }, 350);
    }
  }, [isOpen, isNewAward, hasPlayedIntro]);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundService.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col max-h-[95vh] overflow-hidden">
        {/* Close button in top-right for normal UI */}
        <button
          type="button"
          onClick={onClose}
          className="no-print absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable container for UI if screen is very small, but printable area will format cleanly */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 flex flex-col items-center justify-center">
          {/* THE PRINTABLE CERTIFICATE ITSELF */}
          <div
            id="printable-certificate-area"
            className="w-full relative bg-gradient-to-br from-amber-50/80 via-white to-sky-50/70 rounded-2xl border-4 sm:border-6 border-dashed border-amber-400 p-4 sm:p-6 text-center flex flex-col justify-between items-center shadow-inner"
          >
            {/* Corner Decorative Stars */}
            <div className="absolute top-2 left-2 text-amber-400 text-lg sm:text-2xl select-none animate-pulse">
              ⭐
            </div>
            <div className="absolute top-2 right-2 text-amber-400 text-lg sm:text-2xl select-none animate-pulse">
              ⭐
            </div>
            <div className="absolute bottom-2 left-2 text-amber-400 text-lg sm:text-2xl select-none animate-pulse">
              ⭐
            </div>
            <div className="absolute bottom-2 right-2 text-amber-400 text-lg sm:text-2xl select-none animate-pulse">
              ⭐
            </div>

            {/* Header: School name & Title */}
            <div className="space-y-1 sm:space-y-1.5 w-full">
              <div className="text-[11px] sm:text-xs font-black text-blue-900 tracking-wider uppercase font-['Be_Vietnam_Pro']">
                TRƯỜNG TIỂU HỌC TRẦN ĐẠI NGHĨA • TP. ĐÀ NẴNG
              </div>

              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 sm:px-4 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                VƯƠNG QUỐC TOÁN HỌC SONG NGỮ – LỚP 1
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              </div>

              <h2 className="font-['Be_Vietnam_Pro'] font-black text-2xl sm:text-3xl md:text-4xl text-amber-600 tracking-tight drop-shadow-xs">
                GIẤY CHỨNG NHẬN
              </h2>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase">
                MATH ADVENTURE GRADE 1 • CERTIFICATE OF COMPLETION
              </p>
            </div>

            {/* Body: Student name, class, lesson name, encouragement */}
            <div className="my-3 sm:my-4 space-y-2 sm:space-y-2.5 max-w-lg w-full">
              <div className="font-['Be_Vietnam_Pro'] text-sm sm:text-base md:text-lg text-slate-700">
                Chúc mừng bé:{' '}
                <span className="font-black text-slate-900 text-base sm:text-xl md:text-2xl text-purple-700 underline decoration-purple-300 decoration-2 underline-offset-4">
                  {certificate.studentName}
                </span>
              </div>

              <div className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm md:text-base font-bold text-slate-600">
                Lớp: <span className="font-black text-slate-900 text-sm sm:text-base">{certificate.className}</span>
              </div>

              <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl py-2 px-3 sm:px-4 my-1">
                <div className="text-[11px] sm:text-xs text-amber-800 font-bold uppercase tracking-wide">
                  Đã hoàn thành xuất sắc bài học:
                </div>
                <div className="font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base md:text-lg text-amber-950 mt-0.5">
                  {certificate.lessonTitle}
                </div>
              </div>

              <div className="font-['Be_Vietnam_Pro'] font-black text-base sm:text-lg md:text-xl text-emerald-600 tracking-tight animate-bounce">
                🎉 Con thật tuyệt vời! 🎉
              </div>
            </div>

            {/* Mascot & Star Reward Area */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 my-1 sm:my-2">
              <div className="flex flex-col items-center">
                <RobotMathChibi expression="cheering" size="sm" className="scale-110 sm:scale-125 drop-shadow-sm" />
                <span className="text-[10px] font-black text-sky-700 mt-1">Rô-bốt Toán Học</span>
              </div>

              {/* Gold Star Badge */}
              <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-2xl p-2.5 sm:p-3 shadow-md border-2 border-yellow-200 flex flex-col items-center justify-center min-w-[100px] sm:min-w-[110px]">
                <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-yellow-200 text-white animate-spin-slow drop-shadow" />
                <span className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm mt-0.5">
                  1 Ngôi Sao Vàng
                </span>
                <span className="text-[9px] font-bold text-amber-100">Math Star</span>
              </div>
            </div>

            {/* Date line */}
            <div className="w-full flex items-center justify-between border-t border-amber-200/80 pt-2 px-2 text-[10px] sm:text-xs font-bold text-slate-600">
              <span>Mã giấy: #{certificate.id}</span>
              <span>
                Ngày hoàn thành: <strong className="text-slate-900">{certificate.formattedDate}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS (Hidden when printing via no-print class) */}
        <div className="no-print shrink-0 bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5">
          {/* Review / Re-learn button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onClose();
                if (onReviewLesson) onReviewLesson();
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Xem lại</span>
            </button>
          </div>

          {/* Print button & OK button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>In giấy chứng nhận</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Xong</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
