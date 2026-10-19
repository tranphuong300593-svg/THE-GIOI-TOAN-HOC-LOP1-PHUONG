import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';
import { Trophy, Star, Sparkles, Volume2, VolumeX, RotateCcw, ArrowLeft, Home, Award } from 'lucide-react';
import { Student } from '../../types';

interface Props {
  activeStudent: Student | null;
  onBackToHub: () => void;
  onBackToHome: () => void;
  onResetProgress?: () => void;
}

export const GrandTrophyScreen: React.FC<Props> = ({
  activeStudent,
  onBackToHub,
  onBackToHome,
  onResetProgress
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const confettiIntervalRef = useRef<any>(null);

  const studentDisplayName = activeStudent?.name 
    ? activeStudent.name.trim() 
    : 'Bé Yêu Thông Thái';

  // Play grand victory fanfare and blast multi-color confetti loops on mount
  useEffect(() => {
    // 1. Play music
    soundManager.playVictoryGrandMusic();
    setIsPlayingMusic(true);

    // 2. Confetti burst immediately
    const blastConfetti = () => {
      try {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.25 },
          colors: ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#FBBF24']
        });
      } catch {}
    };

    blastConfetti();
    const t1 = setTimeout(blastConfetti, 1200);
    const t2 = setTimeout(blastConfetti, 3000);
    const t3 = setTimeout(blastConfetti, 6500);

    // Continuous soft confetti falling
    confettiIntervalRef.current = setInterval(() => {
      try {
        confetti({
          particleCount: 25,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.4 }
        });
        confetti({
          particleCount: 25,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.4 }
        });
      } catch {}
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
      soundManager.stopVictoryGrandMusic();
    };
  }, []);

  const handleToggleSound = () => {
    if (isPlayingMusic) {
      soundManager.stopVictoryGrandMusic();
      setIsPlayingMusic(false);
      setIsMuted(true);
    } else {
      soundManager.playVictoryGrandMusic();
      setIsPlayingMusic(true);
      setIsMuted(false);
    }
  };

  const handleReplayMusic = () => {
    soundManager.stopVictoryGrandMusic();
    setTimeout(() => {
      soundManager.playVictoryGrandMusic();
      setIsPlayingMusic(true);
      setIsMuted(false);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950 flex items-center justify-center p-1 sm:p-2 lg:p-3 select-none">
      {/* 16:9 Grand Presentation Box */}
      <div className="relative w-full max-w-5xl h-full max-h-[98dvh] aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400/80 bg-gradient-to-b from-blue-950 via-purple-950 to-indigo-950 flex flex-col justify-between text-white">
        
        {/* ========================================================= */}
        {/* SÂN KHẤU HOẠT HÌNH 3D: ÁNH ĐÈN LUNG LINH & HIỆU ỨNG PHÔNG NỀN */}
        {/* ========================================================= */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Sàn sân khấu ánh vàng óng ánh (Golden Stage Floor Glow) */}
          <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-amber-500/25 via-purple-600/20 to-transparent" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[720px] h-[220px] bg-gradient-to-t from-amber-400/30 to-yellow-300/5 blur-3xl rounded-full" />

          {/* Đèn rọi sân khấu (Crisscrossing Spotlights) */}
          {/* Spotlight Left */}
          <div 
            className="absolute -top-10 left-12 w-64 h-[650px] bg-gradient-to-b from-yellow-200/40 via-amber-300/15 to-transparent blur-xl origin-top -rotate-[24deg] animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          {/* Spotlight Right */}
          <div 
            className="absolute -top-10 right-12 w-64 h-[650px] bg-gradient-to-b from-yellow-200/40 via-pink-400/15 to-transparent blur-xl origin-top rotate-[24deg] animate-pulse"
            style={{ animationDuration: '4.5s', animationDelay: '1s' }}
          />
          {/* Center Halo Spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 blur-3xl rounded-full" />

          {/* BÓNG BAY 3D CHUYỂN ĐỘNG NHẸ (Floating 3D Balloons Left & Right) */}
          {/* Left Balloon Cluster */}
          <div className="absolute left-4 sm:left-8 bottom-28 flex flex-col items-center gap-1 opacity-90 animate-bounce" style={{ animationDuration: '3.5s' }}>
            <div className="flex -space-x-3">
              <div className="w-12 h-16 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 shadow-lg shadow-pink-500/40 relative border border-white/40">
                <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[0.5px]" />
              </div>
              <div className="w-14 h-18 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 shadow-lg shadow-yellow-500/40 relative border border-white/40 -mt-3">
                <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[0.5px]" />
              </div>
              <div className="w-12 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-300 shadow-lg shadow-sky-500/40 relative border border-white/40">
                <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[0.5px]" />
              </div>
            </div>
            <div className="w-0.5 h-14 bg-white/40" />
          </div>

          {/* Right Balloon Cluster */}
          <div className="absolute right-4 sm:right-8 bottom-28 flex flex-col items-center gap-1 opacity-90 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.8s' }}>
            <div className="flex -space-x-3">
              <div className="w-12 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-violet-400 shadow-lg shadow-purple-500/40 relative border border-white/40">
                <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[0.5px]" />
              </div>
              <div className="w-14 h-18 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-lg shadow-emerald-500/40 relative border border-white/40 -mt-3">
                <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[0.5px]" />
              </div>
              <div className="w-12 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 shadow-lg shadow-orange-500/40 relative border border-white/40">
                <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[0.5px]" />
              </div>
            </div>
            <div className="w-0.5 h-14 bg-white/40" />
          </div>

          {/* NHỮNG NGÔI SAO VÀNG BAY XUNG QUANH (Twinkling floating stars) */}
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 animate-ping"
              style={{
                top: `${8 + (i * 13) % 78}%`,
                left: `${5 + (i * 17) % 90}%`,
                fontSize: `${12 + (i % 4) * 6}px`,
                animationDuration: `${1.8 + (i % 3) * 0.8}s`,
                animationDelay: `${(i * 0.3) % 2}s`
              }}
            >
              ✦
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* TOP BAR: DẢI RUY BĂNG CHÚC MỪNG HOÀNG GIA & NÚT ÂM THANH */}
        {/* ========================================================= */}
        <div className="relative z-20 pt-4 px-6 flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={() => {
              soundManager.stopVictoryGrandMusic();
              onBackToHub();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Đấu Trường</span>
          </button>

          {/* DẢI RUY BĂNG CHÚC MỪNG PHÍA TRÊN (Festive Grand Ribbon) */}
          <div className="relative inline-flex items-center justify-center">
            <div className="px-6 sm:px-12 py-2 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border-2 border-yellow-300 shadow-xl shadow-amber-500/40 text-center transform -rotate-1 hover:rotate-0 transition-transform">
              <span className="text-xs sm:text-sm md:text-base font-black tracking-widest uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>🎉 LỄ TRAO GIẢI ĐẠI HỘI TOÁN HỌC LỚP 1 🎉</span>
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
              </span>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplayMusic}
              title="Phát lại nhạc chiến thắng"
              className="p-2 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-xs font-bold transition-all hover:scale-105 active:scale-95"
            >
              🎵 Nghe lại
            </button>
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105 active:scale-95"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NỘI DUNG CHÍNH: TIÊU ĐỀ LỚN & CÚP VÀNG 3D & 2 BẠN NHỎ VỖ TAY */}
        {/* ========================================================= */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center py-2 sm:py-4">
          
          {/* TIÊU ĐỀ LỚN: 🏆 CÚP VINH QUANG 🏆 - ĐẠI HỘI TOÁN HỌC */}
          <div className="mb-2">
            <div className="inline-flex items-center gap-2 text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
              <span>🏆</span>
              <span>CÚP VINH QUANG</span>
              <span>🏆</span>
            </div>
            <div className="text-sm sm:text-lg md:text-xl font-black text-amber-300 tracking-wider uppercase mt-0.5">
              ĐẠI HỘI TOÁN HỌC
            </div>
          </div>

          {/* DÒNG CHÚC MỪNG TRANG TRỌNG */}
          <div className="max-w-2xl mx-auto space-y-1 mb-3">
            <p className="text-base sm:text-xl md:text-2xl font-black text-white drop-shadow-md">
              “CHÚC MỪNG NHÀ VÔ ĐỊCH TOÁN HỌC NHÍ: <span className="text-yellow-300 underline decoration-amber-400 decoration-wavy underline-offset-4">{studentDisplayName}</span>!”
            </p>
            <p className="text-xs sm:text-sm md:text-base font-extrabold text-amber-200/90 tracking-wide">
              “CON ĐÃ XUẤT SẮC VƯỢT QUA CẢ 5 VÒNG THỬ THÁCH!”
            </p>
          </div>

          {/* ======================================================= */}
          {/* SÂN KHẤU TRUNG TÂM: 2 BẠN NHỎ VỖ TAY & CHIẾC CÚP VÀNG 3D */}
          {/* ======================================================= */}
          <div className="relative w-full max-w-4xl flex items-center justify-around gap-2 my-1">

            {/* BẠN NHỎ HOẠT HÌNH BÊN TRÁI (Bé gái vỗ tay hoan hô) */}
            <div className="hidden sm:flex flex-col items-center animate-wiggle origin-bottom" style={{ animationDuration: '1.2s' }}>
              <div className="relative">
                {/* Speech Bubble */}
                <div className="absolute -top-10 -right-2 bg-white text-indigo-950 font-black text-[11px] px-2.5 py-1 rounded-2xl shadow-lg border-2 border-pink-300 whitespace-nowrap animate-bounce">
                  Hoan hô bạn {studentDisplayName}! 👏
                </div>
                {/* SVG Chibi Student Girl */}
                <svg width="110" height="150" viewBox="0 0 110 150" fill="none" className="filter drop-shadow-xl">
                  {/* Hair */}
                  <circle cx="55" cy="45" r="26" fill="#451a03" />
                  <ellipse cx="32" cy="48" rx="8" ry="14" fill="#451a03" />
                  <ellipse cx="78" cy="48" rx="8" ry="14" fill="#451a03" />
                  {/* Ribbons */}
                  <circle cx="32" cy="38" r="4" fill="#ec4899" />
                  <circle cx="78" cy="38" r="4" fill="#ec4899" />
                  {/* Face */}
                  <circle cx="55" cy="46" r="21" fill="#fed7aa" />
                  {/* Eyes happy closed */}
                  <path d="M 46 45 Q 49 41 52 45" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 58 45 Q 61 41 64 45" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Blush */}
                  <ellipse cx="45" cy="52" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />
                  <ellipse cx="65" cy="52" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />
                  {/* Smile */}
                  <path d="M 50 54 Q 55 60 60 54" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="#fff" />
                  {/* Dress */}
                  <path d="M 40 70 L 70 70 L 80 115 L 30 115 Z" fill="#ec4899" />
                  <path d="M 48 70 L 55 80 L 62 70 Z" fill="#ffffff" />
                  {/* Clapping Hands (Raised with sparkle) */}
                  <path d="M 36 78 Q 48 68 53 72" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 74 78 Q 62 68 57 72" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="55" cy="71" r="5" fill="#fbbf24" className="animate-ping" />
                  {/* Legs */}
                  <rect x="42" y="115" width="8" height="22" rx="4" fill="#fed7aa" />
                  <rect x="60" y="115" width="8" height="22" rx="4" fill="#fed7aa" />
                  {/* Shoes */}
                  <ellipse cx="45" cy="138" rx="8" ry="5" fill="#be185d" />
                  <ellipse cx="65" cy="138" rx="8" ry="5" fill="#be185d" />
                </svg>
              </div>
              <span className="text-[11px] font-black text-pink-300 mt-1">Bé Mai</span>
            </div>

            {/* ======================================================= */}
            {/* CHIẾC CÚP VÀNG 3D THẬT LỚN, SÁNG BÓNG, CÓ NGÔI SAO Ở GIỮA */}
            {/* ĐẾ CÚP GHI: “NHÀ VÔ ĐỊCH SIÊU VIP”                        */}
            {/* HOẠT ẢNH XUẤT HIỆN TỪ DƯỚI LÊN, XOAY NHẸ VÀ TỎA HÀO QUANG */}
            {/* ======================================================= */}
            <div className="relative flex flex-col items-center justify-center">
              
              {/* Vầng hào quang ánh vàng tỏa sáng lung linh */}
              <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-yellow-400/40 via-amber-300/30 to-yellow-500/40 blur-3xl animate-pulse" />
              
              {/* Rotating golden sunburst rays background */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-yellow-300/20 opacity-60 animate-spin" style={{ animationDuration: '24s' }}>
                <div className="w-full h-full bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              {/* 3D TROPHY SVG CONTAINER WITH FLOATING & ROTATING SHEEN */}
              <div className="relative z-10 transition-transform duration-700 hover:scale-105 filter drop-shadow-[0_20px_30px_rgba(245,158,11,0.5)]">
                <svg width="240" height="260" viewBox="0 0 240 260" fill="none" className="w-48 sm:w-64 h-auto">
                  <defs>
                    {/* 3D Gold Gradient for Cup Body */}
                    <linearGradient id="gold3d" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFBEB" />
                      <stop offset="25%" stopColor="#FDE047" />
                      <stop offset="50%" stopColor="#EAB308" />
                      <stop offset="75%" stopColor="#CA8A04" />
                      <stop offset="100%" stopColor="#854D0E" />
                    </linearGradient>

                    {/* Gloss Sheen Highlighting */}
                    <linearGradient id="cupSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    {/* Dark Gold Base Gradient */}
                    <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#451a03" />
                      <stop offset="30%" stopColor="#78350f" />
                      <stop offset="70%" stopColor="#451a03" />
                      <stop offset="100%" stopColor="#1f1005" />
                    </linearGradient>

                    {/* Gold Plaque Gradient */}
                    <linearGradient id="plaqueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FEF08A" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>

                  {/* Left Cup Handle 3D */}
                  <path 
                    d="M 55 45 C 10 45, 10 115, 65 125" 
                    stroke="url(#gold3d)" 
                    strokeWidth="14" 
                    strokeLinecap="round" 
                    fill="none" 
                  />
                  <path 
                    d="M 55 45 C 18 45, 18 115, 65 125" 
                    stroke="#FFFBEB" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    fill="none" 
                    opacity="0.7" 
                  />

                  {/* Right Cup Handle 3D */}
                  <path 
                    d="M 185 45 C 230 45, 230 115, 175 125" 
                    stroke="url(#gold3d)" 
                    strokeWidth="14" 
                    strokeLinecap="round" 
                    fill="none" 
                  />
                  <path 
                    d="M 185 45 C 222 45, 222 115, 175 125" 
                    stroke="#FFFBEB" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    fill="none" 
                    opacity="0.7" 
                  />

                  {/* Cup Chalice Rim */}
                  <ellipse cx="120" cy="35" rx="65" ry="16" fill="url(#gold3d)" stroke="#FEF08A" strokeWidth="3" />
                  <ellipse cx="120" cy="35" rx="55" ry="11" fill="#78350f" opacity="0.6" />

                  {/* Main Cup Chalice Body */}
                  <path 
                    d="M 55 35 C 55 120, 85 155, 120 155 C 155 155, 185 120, 185 35 Z" 
                    fill="url(#gold3d)" 
                    stroke="#FEF08A" 
                    strokeWidth="2.5" 
                  />

                  {/* High Gloss Left Sheen Overlay */}
                  <path 
                    d="M 62 38 C 62 105, 85 140, 105 148 C 88 135, 74 100, 74 38 Z" 
                    fill="url(#cupSheen)" 
                  />

                  {/* Cup Neck & Stem */}
                  <path d="M 106 155 L 134 155 L 138 185 L 102 185 Z" fill="url(#gold3d)" stroke="#CA8A04" strokeWidth="2" />
                  <ellipse cx="120" cy="185" rx="28" ry="8" fill="url(#gold3d)" stroke="#FEF08A" strokeWidth="2" />

                  {/* STAR AT THE CENTER OF THE TROPHY */}
                  <g transform="translate(120, 90)">
                    <circle cx="0" cy="0" r="26" fill="#78350f" opacity="0.4" />
                    <circle cx="0" cy="0" r="24" fill="url(#plaqueGrad)" stroke="#ffffff" strokeWidth="2" />
                    {/* Big sparkling star */}
                    <path 
                      d="M 0 -16 L 4.5 -4.5 L 16.5 -3.5 L 7.5 5 L 10.5 16.5 L 0 10.5 L -10.5 16.5 L -7.5 5 L -16.5 -3.5 L -4.5 -4.5 Z" 
                      fill="#FFFFFF" 
                      stroke="#F59E0B" 
                      strokeWidth="1.5" 
                    />
                  </g>

                  {/* PEDESTAL / BASE (ĐẾ CÚP 3D HOÀNG GIA) */}
                  <path d="M 70 190 L 170 190 L 180 248 L 60 248 Z" fill="url(#baseGrad)" stroke="#92400e" strokeWidth="2.5" />
                  <rect x="52" y="246" width="136" height="12" rx="4" fill="#291305" stroke="#78350f" strokeWidth="2" />

                  {/* GOLDEN PLAQUE ON BASE */}
                  <rect x="72" y="202" width="96" height="36" rx="6" fill="url(#plaqueGrad)" stroke="#FEF08A" strokeWidth="1.5" />
                  
                  {/* TEXT ON BASE: “NHÀ VÔ ĐỊCH SIÊU VIP” */}
                  <text 
                    x="120" 
                    y="218" 
                    textAnchor="middle" 
                    fontSize="9.5" 
                    fontWeight="900" 
                    fontFamily="system-ui, sans-serif" 
                    fill="#451a03" 
                    letterSpacing="0.5"
                  >
                    NHÀ VÔ ĐỊCH
                  </text>
                  <text 
                    x="120" 
                    y="231" 
                    textAnchor="middle" 
                    fontSize="11" 
                    fontWeight="900" 
                    fontFamily="system-ui, sans-serif" 
                    fill="#78350f" 
                    letterSpacing="1"
                  >
                    SIÊU VIP
                  </text>

                  {/* Twinkle sparkle top right */}
                  <g transform="translate(180, 25)">
                    <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#ffffff" />
                  </g>
                  {/* Twinkle sparkle top left */}
                  <g transform="translate(60, 20)">
                    <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#ffffff" />
                  </g>
                </svg>
              </div>

              {/* Huy hiệu 5/5 ngôi sao vinh quang */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/40 border-2 border-yellow-200">
                <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
                <span className="ml-1 tracking-wider">CHINH PHỤC 5/5 VÒNG THI</span>
              </div>
            </div>

            {/* BẠN NHỎ HOẠT HÌNH BÊN PHẢI (Bé trai vỗ tay hoan hô) */}
            <div className="hidden sm:flex flex-col items-center animate-wiggle origin-bottom" style={{ animationDuration: '1.2s', animationDelay: '0.4s' }}>
              <div className="relative">
                {/* Speech Bubble */}
                <div className="absolute -top-10 -left-2 bg-white text-indigo-950 font-black text-[11px] px-2.5 py-1 rounded-2xl shadow-lg border-2 border-sky-300 whitespace-nowrap animate-bounce" style={{ animationDelay: '0.5s' }}>
                  Tuyệt vời lắm bạn ơi! 🏆
                </div>
                {/* SVG Chibi Student Boy */}
                <svg width="110" height="150" viewBox="0 0 110 150" fill="none" className="filter drop-shadow-xl">
                  {/* Hair */}
                  <circle cx="55" cy="45" r="25" fill="#1e1b4b" />
                  <path d="M 32 40 Q 55 20 78 40 Z" fill="#1e1b4b" />
                  {/* Face */}
                  <circle cx="55" cy="48" r="21" fill="#fed7aa" />
                  {/* Eyes happy closed */}
                  <path d="M 46 47 Q 49 43 52 47" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 58 47 Q 61 43 64 47" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Blush */}
                  <ellipse cx="45" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />
                  <ellipse cx="65" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />
                  {/* Smile */}
                  <path d="M 50 56 Q 55 62 60 56" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="#fff" />
                  {/* Shirt */}
                  <rect x="36" y="72" width="38" height="42" rx="6" fill="#3b82f6" />
                  <path d="M 48 72 L 55 82 L 62 72 Z" fill="#ffffff" />
                  {/* Medal ribbon on neck */}
                  <path d="M 46 72 L 55 88 L 64 72" stroke="#f59e0b" strokeWidth="2" fill="none" />
                  <circle cx="55" cy="90" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                  {/* Clapping Hands (Raised with sparkle) */}
                  <path d="M 34 82 Q 46 72 52 76" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 76 82 Q 64 72 58 76" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="55" cy="75" r="5" fill="#fbbf24" className="animate-ping" />
                  {/* Pants */}
                  <rect x="42" y="114" width="11" height="20" rx="3" fill="#1e3a8a" />
                  <rect x="57" y="114" width="11" height="20" rx="3" fill="#1e3a8a" />
                  {/* Shoes */}
                  <ellipse cx="47" cy="138" rx="8" ry="5" fill="#334155" />
                  <ellipse cx="63" cy="138" rx="8" ry="5" fill="#334155" />
                </svg>
              </div>
              <span className="text-[11px] font-black text-sky-300 mt-1">Bé Nam</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FOOTER ACTIONS: CÁC NÚT ĐIỀU HƯỚNG TIỆN ÍCH */}
        {/* ========================================================= */}
        <div className="relative z-20 px-6 py-4 bg-slate-900/80 backdrop-blur-md border-t border-amber-400/30 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-amber-200/80 hidden sm:block">
            👑 Đạt danh hiệu cao quý nhất: <strong className="text-yellow-300">Đại Kiện Tướng Toán Học Lớp 1</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {onResetProgress && (
              <button
                onClick={() => {
                  if (window.confirm('Bé có muốn đặt lại tiến trình để thi đấu lại 5 vòng không?')) {
                    soundManager.stopVictoryGrandMusic();
                    onResetProgress();
                  }
                }}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chinh phục lại</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.stopVictoryGrandMusic();
                onBackToHub();
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
            >
              <Award className="w-4 h-4" />
              <span>Xem Bảng Vàng</span>
            </button>

            <button
              onClick={() => {
                soundManager.stopVictoryGrandMusic();
                onBackToHome();
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-lg"
            >
              <Home className="w-4 h-4" />
              <span>Về Trang Chủ</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
