import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Trophy, Star, Sparkles, Award, Play, ArrowLeft, 
  Flame, ShieldCheck, Crown, RefreshCw, CheckCircle2, ChevronRight, Zap,
  Lock, ArrowRight, PartyPopper
} from 'lucide-react';
import { SuperVipGameId, SuperVipProgress, SuperVipBadge } from './types';
import { FruitCatcherGame } from './FruitCatcherGame';
import { MathBowlingGame } from './MathBowlingGame';
import { CardMemoryGame } from './CardMemoryGame';
import { GeometryPainterGame } from './GeometryPainterGame';
import { BalloonShooterGame } from './BalloonShooterGame';
import { GrandTrophyScreen } from './GrandTrophyScreen';
import { Student } from '../../types';

interface Props {
  onBackToHome: () => void;
  activeStudent: Student | null;
  onUpdateStars?: (starsToAdd: number) => void;
}

export interface GameCardMeta {
  id: SuperVipGameId;
  number: number;
  title: string;
  badgeName: string;
  icon: string;
  tagline: string;
  description: string;
  badgeTitle: string;
  accentGradient: string;
  badgeColor: string;
  buttonColor: string;
  bgLight: string;
  borderColor: string;
  controlsInfo: string;
}

export const GAMES_LIST: GameCardMeta[] = [
  {
    id: 'fruit_catcher',
    number: 1,
    title: 'Hứng Quả Thần Tốc',
    badgeName: 'SIÊU SAO HỨNG QUẢ',
    icon: '🍎',
    tagline: 'Vòng 1: Điều khiển giỏ hứng quả phép tính!',
    description: 'Bé di chuyển chiếc giỏ thần kỳ của bạn Thỏ để hứng các quả táo, cam mang phép tính đúng hoặc số thỏa mãn thử thách.',
    badgeTitle: 'Huy hiệu Quả Vàng',
    accentGradient: 'from-amber-400 via-orange-500 to-red-500',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    buttonColor: 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/30',
    bgLight: 'bg-gradient-to-br from-orange-50/80 to-amber-50/60',
    borderColor: 'border-orange-200 hover:border-orange-400',
    controlsInfo: 'Phím mũi tên ← →, kéo chuột hoặc chạm vuốt'
  },
  {
    id: 'math_bowling',
    number: 2,
    title: 'Bowling Toán Học',
    badgeName: 'XẠ THỦ BOWLING',
    icon: '🎳',
    tagline: 'Vòng 2: Kéo bóng ngắm bắn đổ chai mục tiêu!',
    description: 'Quan sát chai bowling mang phép tính và số học. Kéo lùi bóng bowling để lấy lực và ngắm bắn chuẩn xác để ghi Strike!',
    badgeTitle: 'Cúp Vàng Bowling',
    accentGradient: 'from-blue-500 via-indigo-500 to-purple-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    buttonColor: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30',
    bgLight: 'bg-gradient-to-br from-blue-50/80 to-indigo-50/60',
    borderColor: 'border-blue-200 hover:border-blue-400',
    controlsInfo: 'Nhấp & kéo lùi bóng để tạo lực rồi thả ra'
  },
  {
    id: 'card_memory',
    number: 3,
    title: 'Thẻ Bài Thông Thái',
    badgeName: 'BẬC THẦY GHI NHỚ',
    icon: '🃏',
    tagline: 'Vòng 3: Lật thẻ tìm hai phép tính có kết quả bằng nhau!',
    description: 'Thử thách trí tuệ siêu đỉnh! Lật mở các thẻ bài bí mật để ghép cặp hai phép tính có kết quả bằng nhau.',
    badgeTitle: 'Ngôi Sao Trí Tuệ',
    accentGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    buttonColor: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30',
    bgLight: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/60',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    controlsInfo: 'Nhấp lật 2 thẻ có kết quả bằng nhau để ghép đôi'
  },
  {
    id: 'geometry_painter',
    number: 4,
    title: 'Họa Sĩ Hình Học',
    badgeName: 'HỌA SĨ TÀI BA',
    icon: '🎨',
    tagline: 'Vòng 4: Tô màu chuẩn hình vuông, tròn, tam giác!',
    description: 'Nhúng cọ vào bảng màu thần kỳ và tô đúng màu sắc vào từng hình học phẳng (tam giác, hình vuông, chữ nhật, hình tròn) để hoàn thiện tác phẩm.',
    badgeTitle: 'Bảng Màu Pha Lê',
    accentGradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    buttonColor: 'from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 shadow-pink-500/30',
    bgLight: 'bg-gradient-to-br from-pink-50/80 to-rose-50/60',
    borderColor: 'border-pink-200 hover:border-pink-400',
    controlsInfo: 'Chọn màu ở bảng pha màu rồi chạm vào hình để tô'
  },
  {
    id: 'balloon_shooter',
    number: 5,
    title: 'Xạ Thủ Bóng Số',
    badgeName: 'VUA BẮN BÓNG',
    icon: '🎈',
    tagline: 'Vòng 5: Ngắm đại bác bắn nổ quả bóng đúng!',
    description: 'Những chùm bóng bay lấp lánh mang theo số và phép tính đang bay lên trời. Xoay đại bác và bắn trúng mục tiêu trước khi bóng bay mất!',
    badgeTitle: 'Huy Chương Xạ Thủ',
    accentGradient: 'from-violet-500 via-purple-500 to-sky-500',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    buttonColor: 'from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-violet-500/30',
    bgLight: 'bg-gradient-to-br from-purple-50/80 to-violet-50/60',
    borderColor: 'border-purple-200 hover:border-purple-400',
    controlsInfo: 'Di chuyển chuột / chạm để ngắm và bắn đại bác'
  }
];

const STORAGE_KEY = 'the_gioi_toan_1_super_vip_progress';

export const SuperVipHub: React.FC<Props> = ({ onBackToHome, activeStudent, onUpdateStars }) => {
  const [activeGameId, setActiveGameId] = useState<SuperVipGameId | null>(null);
  const [showTrophyScreen, setShowTrophyScreen] = useState(false);
  const [roundCelebration, setRoundCelebration] = useState<{
    completedRound: GameCardMeta;
    nextRound: GameCardMeta | null;
  } | null>(null);

  const [progress, setProgress] = useState<SuperVipProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      badges: {
        fruit_catcher: false,
        math_bowling: false,
        card_memory: false,
        geometry_painter: false,
        balloon_shooter: false
      },
      highScores: {
        fruit_catcher: 0,
        math_bowling: 0,
        card_memory: 0,
        geometry_painter: 0,
        balloon_shooter: 0
      },
      totalCompleted: 0,
      isChampion: false
    };
  });

  const [activeBadgeModal, setActiveBadgeModal] = useState<GameCardMeta | null>(null);
  const [lockedMessage, setLockedMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Check if a game round is unlocked according to sequential progression
  const isRoundUnlocked = (roundNumber: number): boolean => {
    if (roundNumber === 1) return true;
    if (roundNumber === 2) return Boolean(progress.badges.fruit_catcher);
    if (roundNumber === 3) return Boolean(progress.badges.math_bowling);
    if (roundNumber === 4) return Boolean(progress.badges.card_memory);
    if (roundNumber === 5) return Boolean(progress.badges.geometry_painter);
    return false;
  };

  const completedCount = Object.values(progress.badges).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 5) * 100);

  const handleGameWin = (gameId: SuperVipGameId, score: number) => {
    soundManager.playCorrect();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const currentMeta = GAMES_LIST.find(g => g.id === gameId);
    const roundNumber = currentMeta?.number || 1;

    let willBeChampion = false;

    setProgress((prev) => {
      const alreadyWon = prev.badges[gameId];
      const newBadges = { ...prev.badges, [gameId]: true };
      const newScores = { 
        ...prev.highScores, 
        [gameId]: Math.max(prev.highScores[gameId] || 0, score) 
      };
      const total = Object.values(newBadges).filter(Boolean).length;
      const champion = total === 5;
      willBeChampion = champion;

      if (!alreadyWon && onUpdateStars) {
        onUpdateStars(10); // Reward 10 stars for completing a Super VIP round!
      }

      return {
        badges: newBadges,
        highScores: newScores,
        totalCompleted: total,
        isChampion: champion
      };
    });

    setActiveGameId(null);

    // If Vòng 5 completed or all 5 rounds are won: AUTOMATICALLY switch to GrandTrophyScreen!
    if (roundNumber === 5 || willBeChampion || completedCount + 1 >= 5) {
      setTimeout(() => {
        setShowTrophyScreen(true);
      }, 300);
    } else {
      // Show short congratulations modal for intermediate rounds with star award & unlock notification
      const nextMeta = GAMES_LIST.find(g => g.number === roundNumber + 1) || null;
      setRoundCelebration({
        completedRound: currentMeta!,
        nextRound: nextMeta
      });
    }
  };

  const handleResetAllProgress = () => {
    const fresh: SuperVipProgress = {
      badges: {
        fruit_catcher: false,
        math_bowling: false,
        card_memory: false,
        geometry_painter: false,
        balloon_shooter: false
      },
      highScores: {
        fruit_catcher: 0,
        math_bowling: 0,
        card_memory: 0,
        geometry_painter: 0,
        balloon_shooter: 0
      },
      totalCompleted: 0,
      isChampion: false
    };
    setProgress(fresh);
    localStorage.removeItem(STORAGE_KEY);
    setShowTrophyScreen(false);
    setRoundCelebration(null);
    soundManager.stopVictoryGrandMusic();
    soundManager.playPop();
  };

  // If Trophy Screen is active, render full-screen 16:9 celebration
  if (showTrophyScreen) {
    return (
      <GrandTrophyScreen
        activeStudent={activeStudent}
        onBackToHub={() => setShowTrophyScreen(false)}
        onBackToHome={() => {
          setShowTrophyScreen(false);
          onBackToHome();
        }}
        onResetProgress={handleResetAllProgress}
      />
    );
  }

  // If a game is active, render that game in a dedicated full-viewport 16:9 arena
  if (activeGameId) {
    return (
      <div className="fixed inset-0 z-40 bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950 flex items-center justify-center p-1 sm:p-2 overflow-hidden select-none">
        {activeGameId === 'fruit_catcher' && (
          <FruitCatcherGame 
            onBack={() => setActiveGameId(null)}
            onWin={(score) => handleGameWin('fruit_catcher', score)}
          />
        )}
        {activeGameId === 'math_bowling' && (
          <MathBowlingGame 
            onBack={() => setActiveGameId(null)}
            onWin={(score) => handleGameWin('math_bowling', score)}
          />
        )}
        {activeGameId === 'card_memory' && (
          <CardMemoryGame 
            onBack={() => setActiveGameId(null)}
            onWin={(score) => handleGameWin('card_memory', score)}
          />
        )}
        {activeGameId === 'geometry_painter' && (
          <GeometryPainterGame 
            onBack={() => setActiveGameId(null)}
            onWin={(score) => handleGameWin('geometry_painter', score)}
          />
        )}
        {activeGameId === 'balloon_shooter' && (
          <BalloonShooterGame 
            onBack={() => setActiveGameId(null)}
            onWin={(score) => handleGameWin('balloon_shooter', score)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950 text-white relative overflow-hidden pb-20 select-none">
      {/* Background Magical Starry Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Floating sparkling stars */}
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 text-xs sm:text-base animate-ping"
            style={{
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 95}%`,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.4) % 2}s`
            }}
          >
            ✦
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-6">
        {/* Top Navigation Bar inside VIP */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => {
              soundManager.playPop();
              onBackToHome();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trở về Trang Chủ</span>
          </button>

          <div className="flex items-center gap-3">
            {activeStudent && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold">
                <span>{activeStudent.avatar}</span>
                <span>{activeStudent.name}</span>
                <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-black text-[10px]">
                  ⭐ {activeStudent.stars}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20">
              <Crown className="w-4 h-4 text-amber-950" />
              <span>ĐẠI HỘI TOÁN HỌC</span>
            </div>
          </div>
        </div>

        {/* CỔNG CHÀO ĐẠI HỘI TOÁN HỌC (GRAND MAGICAL ARCHWAY) */}
        <div className="relative rounded-3xl p-6 sm:p-10 mb-8 overflow-hidden bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 border-2 border-amber-300/40 backdrop-blur-md shadow-2xl text-center">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-sky-400/20 rounded-full blur-2xl" />

          {/* Decorative Arch Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-md mb-4 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>🌟 SIÊU VIP – ĐẠI HỘI TOÁN HỌC 🌟</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-pink-300 drop-shadow-md mb-3">
            ĐẠI HỘI TOÁN HỌC LỚP 1
          </h1>

          <p className="text-lg sm:text-2xl font-black text-amber-200 tracking-wide mb-3">
            “Chơi thật vui – Giỏi Toán mỗi ngày!”
          </p>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
            Thử thách vượt qua 5 Vòng chơi tương tác thực sự! Hoàn thành từng vòng để mở khóa vòng tiếp theo, tích lũy ngôi sao và chinh phục Cúp Vinh Quang danh giá!
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <span className="text-4xl animate-wiggle">🧙‍♂️</span>
              <div className="text-left">
                <div className="text-xs text-amber-300 font-bold">Linh vật Đại Hội</div>
                <div className="text-sm font-extrabold text-white">Thầy Cú Thông Thái</div>
              </div>
            </div>

            {/* If Champion: Show prominent View Trophy button */}
            {progress.isChampion ? (
              <button
                onClick={() => {
                  soundManager.playPop();
                  setShowTrophyScreen(true);
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-base sm:text-lg tracking-wide hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-400/40 flex items-center gap-3 border-2 border-yellow-200 animate-pulse"
              >
                <Trophy className="w-6 h-6 fill-slate-950" />
                <span>🏆 XEM CÚP VINH QUANG ĐẠI HỘI</span>
                <Sparkles className="w-5 h-5 text-amber-950" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.unlockAudio();
                  soundManager.playFanfare();
                  // Start the current highest unlocked unfinished round
                  const nextGame = GAMES_LIST.find(g => isRoundUnlocked(g.number) && !progress.badges[g.id]) || GAMES_LIST[0];
                  setActiveGameId(nextGame.id);
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 font-black text-base sm:text-lg tracking-wide hover:opacity-95 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/40 flex items-center gap-3"
              >
                <Play className="w-6 h-6 fill-slate-950" />
                <span>BẮT ĐẦU VÒNG {completedCount + 1 <= 5 ? completedCount + 1 : 1}!</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TIẾN TRÌNH 5 VÒNG CHƠI: ⭐ 1/5 → ⭐ 2/5 → ⭐ 3/5 → ⭐ 4/5 → ⭐ 5/5        */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 mb-10 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  Tiến Trình Chinh Phục: ⭐ {completedCount} / 5 Vòng Đấu
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {progress.isChampion 
                  ? '🎉 Xuất sắc! Bé đã hoàn thành trọn vẹn cả 5 vòng và nhận Cúp Vinh Quang!' 
                  : `Bé cần vượt qua Vòng ${completedCount + 1} để tiếp tục hành trình giành Cúp Vinh Quang!`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-amber-400">{progressPercent}%</span>
              {progress.isChampion && (
                <button
                  onClick={() => setShowTrophyScreen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow-md animate-bounce hover:scale-105 transition-transform"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>XEM LỄ TRAO CÚP</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700 mb-6">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-amber-500/50"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>

          {/* Visual Step-by-Step Round Indicator: ⭐ 1/5 → ⭐ 2/5 → ⭐ 3/5 → ⭐ 4/5 → ⭐ 5/5 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {GAMES_LIST.map((game) => {
              const unlocked = isRoundUnlocked(game.number);
              const completed = progress.badges[game.id];

              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.unlockAudio();
                    if (unlocked) {
                      soundManager.playPop();
                      setActiveBadgeModal(game);
                    } else {
                      soundManager.playTryAgain();
                      setLockedMessage(`🔒 Vòng ${game.number}: "${game.title}" đang khóa. Bé hãy hoàn thành Vòng ${game.number - 1} trước nhé!`);
                      setTimeout(() => setLockedMessage(null), 3500);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    completed
                      ? 'bg-amber-400/15 border-amber-400/50 text-amber-200 hover:bg-amber-400/25 shadow-md shadow-amber-500/10'
                      : unlocked
                      ? 'bg-blue-500/15 border-blue-400/40 text-blue-200 hover:bg-blue-500/25'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{game.icon}</span>
                    {completed ? (
                      <div className="flex items-center gap-0.5 text-emerald-400 font-black text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>⭐</span>
                      </div>
                    ) : unlocked ? (
                      <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        Đang mở
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                  <div className="text-xs font-black truncate">
                    Vòng {game.number}: {game.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {completed 
                      ? 'Đã hoàn thành ★' 
                      : unlocked 
                      ? 'Sẵn sàng chơi' 
                      : `Khóa (Cần Vòng ${game.number - 1})`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DANH SÁCH 5 VÒNG THI TƯƠNG TÁC THỰC SỰ                                   */}
        {/* ========================================================================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                5 Vòng Thi Đấu Trường Toán Học
              </h2>
            </div>
            <span className="text-xs sm:text-sm text-slate-400 font-medium">
              Lần lượt vượt qua 5 vòng để đoạt Cúp Vinh Quang
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES_LIST.map((game) => {
              const unlocked = isRoundUnlocked(game.number);
              const completed = progress.badges[game.id];
              const highScore = progress.highScores[game.id] || 0;

              return (
                <div
                  key={game.id}
                  className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border-2 bg-slate-900/90 backdrop-blur-md shadow-xl ${
                    completed
                      ? 'border-amber-400/60 shadow-amber-500/10 hover:-translate-y-1'
                      : unlocked
                      ? 'border-sky-400/60 shadow-sky-500/10 hover:-translate-y-1'
                      : 'border-slate-800/80 opacity-75'
                  }`}
                >
                  {/* Top card bar with number and badge status */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl shadow-inner ${
                          completed 
                            ? 'bg-amber-400/20 border-amber-400/40' 
                            : unlocked 
                            ? 'bg-slate-800/80 border-white/10' 
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}>
                          {game.icon}
                        </div>
                        <div>
                          <div className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>VÒNG {game.number}</span>
                            {!unlocked && <Lock className="w-3 h-3 text-slate-400" />}
                          </div>
                          <h3 className="text-xl font-black text-white leading-tight">
                            {game.title}
                          </h3>
                        </div>
                      </div>

                      {completed ? (
                        <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 text-[11px] font-black shrink-0">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>Đã đạt ⭐</span>
                        </div>
                      ) : !unlocked ? (
                        <div className="p-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1 text-[11px] font-bold shrink-0">
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Chưa mở</span>
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1 text-[11px] font-bold shrink-0">
                          <span>Sẵn sàng</span>
                        </div>
                      )}
                    </div>

                    <div className="inline-block px-3 py-1 rounded-xl bg-sky-950/80 text-sky-300 border border-sky-800 text-xs font-bold mb-3">
                      🎯 {game.tagline}
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                      {game.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300 mb-6 flex items-center gap-2">
                      <span className="text-amber-400 font-bold shrink-0">🎮 Thao tác:</span>
                      <span className="truncate">{game.controlsInfo}</span>
                    </div>
                  </div>

                  {/* Bottom Play Action & HighScore */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                      <span>Điểm cao nhất:</span>
                      <span className="font-extrabold text-amber-400 text-sm">
                        {highScore > 0 ? `${highScore} điểm` : 'Chưa thi'}
                      </span>
                    </div>

                    {unlocked ? (
                      <button
                        onClick={() => {
                          soundManager.unlockAudio();
                          soundManager.playPop();
                          setActiveGameId(game.id);
                        }}
                        className={`w-full py-3.5 px-4 rounded-2xl text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 bg-gradient-to-r ${game.buttonColor}`}
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>{completed ? 'CHƠI LẠI ĐỔI ĐIỂM CAO' : `BẮT ĐẦU VÒNG ${game.number}`}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          soundManager.unlockAudio();
                          soundManager.playTryAgain();
                          setLockedMessage(`🔒 Vòng ${game.number} đang khóa. Bé cần vượt qua Vòng ${game.number - 1} để mở khóa nhé!`);
                          setTimeout(() => setLockedMessage(null), 3500);
                        }}
                        className="w-full py-3.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 font-bold text-xs sm:text-sm tracking-wide border border-slate-700/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>Cần hoàn thành Vòng {game.number - 1} để mở</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Special 6th Card: Grand Champion Certificate & Trophy Access */}
            <div className="relative rounded-3xl p-6 border-2 border-dashed border-amber-400/50 bg-gradient-to-br from-amber-500/10 via-purple-500/15 to-slate-900 flex flex-col justify-between text-center backdrop-blur-md shadow-2xl">
              <div>
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-4xl mb-4 shadow-lg animate-bounce">
                  👑
                </div>
                <h3 className="text-xl font-black text-amber-300 mb-2">
                  Cúp Vinh Quang Đại Hội
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Vượt qua đủ cả 5 Vòng thi đấu để nhận <strong className="text-amber-300">Cúp Vàng 3D Nhà Vô Địch Siêu VIP</strong> và bước lên lễ đài vinh danh!
                </p>
                <div className="py-2 px-3 rounded-2xl bg-black/40 border border-amber-400/20 text-xs text-amber-200 font-bold inline-block mb-4">
                  Tiến độ: ⭐ {completedCount} / 5 Vòng
                </div>
              </div>

              {progress.isChampion ? (
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setShowTrophyScreen(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 transition-transform hover:scale-102 active:scale-95 border border-yellow-200"
                >
                  <Trophy className="w-5 h-5 fill-slate-950" />
                  <span>XEM LỄ TRAO CÚP VINH QUANG 🏆</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-800/80 text-slate-500 font-bold text-xs tracking-wide cursor-not-allowed border border-slate-700/80"
                >
                  🔒 Mở khóa khi hoàn thành đủ 5 Vòng
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 text-slate-400 text-xs">
          <div>
            Thế Giới Toán Học Lớp 1 ★ 5 Vòng Thi Đấu Trường Tương Tác Thực Sự (GDPT 2018)
          </div>
          <button
            onClick={() => {
              if (window.confirm('Bé có muốn đặt lại tiến trình 5 vòng SIÊU VIP để chinh phục lại từ đầu không?')) {
                handleResetAllProgress();
              }
            }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Chinh phục lại từ đầu (Reset 5 vòng)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CHÚC MỪNG HOÀN THÀNH VÒNG & MỞ KHÓA VÒNG TIẾP THEO                  */}
      {/* ========================================================================= */}
      {roundCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-md w-full p-6 text-center text-white relative shadow-2xl animate-scale-up">
            
            {/* Round Win Icon */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-5xl mb-4 shadow-inner animate-bounce">
              {roundCelebration.completedRound.icon}
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <PartyPopper className="w-3.5 h-3.5" />
              <span>XUẤT SẮC VƯỢT QUA VÒNG {roundCelebration.completedRound.number}!</span>
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              {roundCelebration.completedRound.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Bé đã chinh phục thử thách thành công, nhận được <strong className="text-amber-300">+1 ⭐ Ngôi Sao</strong> và huy hiệu <strong className="text-yellow-300">{roundCelebration.completedRound.badgeName}</strong>!
            </p>

            {/* Next round unlock info */}
            {roundCelebration.nextRound && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-sky-400/40 text-xs mb-6 text-left flex items-center gap-3">
                <span className="text-3xl">{roundCelebration.nextRound.icon}</span>
                <div>
                  <div className="text-amber-300 font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ĐÃ MỞ KHÓA VÒNG {roundCelebration.nextRound.number}:</span>
                  </div>
                  <div className="text-white font-black text-sm">
                    {roundCelebration.nextRound.title}
                  </div>
                </div>
              </div>
            )}

            {/* Progress Counter ⭐ X/5 */}
            <div className="text-xs font-bold text-amber-200 mb-6 bg-slate-800/80 py-2 rounded-xl border border-slate-700">
              Tiến trình Đại Hội: ⭐ {completedCount} / 5 Vòng
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRoundCelebration(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-xs"
              >
                Về Đấu Trường
              </button>
              {roundCelebration.nextRound && (
                <button
                  onClick={() => {
                    const nextId = roundCelebration.nextRound!.id;
                    setRoundCelebration(null);
                    setActiveGameId(nextId);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/30 hover:opacity-95"
                >
                  <span>Chơi Vòng {roundCelebration.nextRound.number} ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BADGE DETAIL MODAL */}
      {activeBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl max-w-sm w-full p-6 text-center text-white relative shadow-2xl animate-scale-up">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-5xl mb-4 shadow-inner">
              {activeBadgeModal.icon}
            </div>

            <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
              Vòng {activeBadgeModal.number} · Huy Hiệu Danh Dự
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              {activeBadgeModal.badgeName}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeBadgeModal.description}
            </p>

            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs mb-6 text-left">
              <div className="text-amber-300 font-bold mb-1">🎯 Điều kiện vượt qua:</div>
              <div className="text-slate-300">
                Chơi và hoàn thành xuất sắc trò chơi <strong>{activeBadgeModal.title}</strong>!
              </div>
              <div className="text-amber-400 font-bold mt-2">
                Trạng thái:{' '}
                {progress.badges[activeBadgeModal.id] ? (
                  <span className="text-emerald-400 font-black">✓ Đã vượt qua vòng này</span>
                ) : (
                  <span className="text-slate-400">Chưa hoàn thành</span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveBadgeModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs"
              >
                Đóng lại
              </button>
              <button
                onClick={() => {
                  const id = activeBadgeModal.id;
                  setActiveBadgeModal(null);
                  setActiveGameId(id);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs hover:opacity-95"
              >
                Chơi Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locked Round Friendly Toast */}
      {lockedMessage && (
        <div className="fixed top-6 inset-x-4 max-w-md mx-auto z-50 p-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm border-2 border-white shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>{lockedMessage}</span>
          </div>
          <button
            onClick={() => setLockedMessage(null)}
            className="p-1 rounded-full hover:bg-black/10 transition-colors shrink-0 text-base font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
