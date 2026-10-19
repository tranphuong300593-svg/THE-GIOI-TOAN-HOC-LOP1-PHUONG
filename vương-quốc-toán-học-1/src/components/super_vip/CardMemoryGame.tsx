import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Star, Sparkles, RotateCcw, ArrowLeft, Trophy, CheckCircle2, 
  HelpCircle, Zap, Award
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onWin: (score: number) => void;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface CardItem {
  id: number;
  pairId: number;        // Unique identifier for the pair
  targetValue: number;   // The math result (e.g., 5, 8, 12, 50)
  expression: string;    // The arithmetic formula (e.g., "3 + 2", "10 − 2")
  isFlipped: boolean;
  isMatched: boolean;
  isShaking?: boolean;
}

interface PairDefinition {
  targetValue: number;
  exprA: string;
  exprB: string;
}

// ============================================================================
// VERIFIED GRADE 1 EQUATION POOLS FOR EACH DIFFICULTY LEVEL
// 100% Math Accuracy & Conforms to Vietnamese GDPT 2018 (Kết nối tri thức)
// Every pair has two distinct expressions with the EXACT SAME result.
// ============================================================================

// MỨC 1 - DỄ: Phạm vi 10 (3 cặp = 6 thẻ)
const EASY_PAIR_POOL: PairDefinition[] = [
  { targetValue: 5, exprA: '3 + 2', exprB: '4 + 1' },
  { targetValue: 8, exprA: '5 + 3', exprB: '10 − 2' },
  { targetValue: 4, exprA: '9 − 5', exprB: '1 + 3' },
  { targetValue: 7, exprA: '4 + 3', exprB: '9 − 2' },
  { targetValue: 6, exprA: '4 + 2', exprB: '8 − 2' },
  { targetValue: 9, exprA: '7 + 2', exprB: '10 − 1' },
  { targetValue: 10, exprA: '6 + 4', exprB: '8 + 2' },
  { targetValue: 3, exprA: '1 + 2', exprB: '5 − 2' },
  { targetValue: 2, exprA: '1 + 1', exprB: '6 − 4' }
];

// MỨC 2 - VỪA: Phạm vi 20 (4 cặp = 8 thẻ)
const MEDIUM_PAIR_POOL: PairDefinition[] = [
  { targetValue: 12, exprA: '10 + 2', exprB: '15 − 3' },
  { targetValue: 14, exprA: '10 + 4', exprB: '18 − 4' },
  { targetValue: 15, exprA: '10 + 5', exprB: '19 − 4' },
  { targetValue: 16, exprA: '10 + 6', exprB: '20 − 4' },
  { targetValue: 18, exprA: '10 + 8', exprB: '20 − 2' },
  { targetValue: 11, exprA: '10 + 1', exprB: '15 − 4' },
  { targetValue: 13, exprA: '10 + 3', exprB: '17 − 4' },
  { targetValue: 17, exprA: '10 + 7', exprB: '20 − 3' },
  { targetValue: 19, exprA: '10 + 9', exprB: '20 − 1' },
  { targetValue: 20, exprA: '10 + 10', exprB: '15 + 5' }
];

// MỨC 3 - KHÓ: Phạm vi 100 (6 cặp = 12 thẻ)
// Chỉ sử dụng các dạng phép tính học sinh lớp 1 đã học:
// - Phép cộng trừ số tròn chục (ví dụ: 30 + 20 = 50, 70 − 20 = 50)
// - Phép cộng trừ không nhớ trong phạm vi 100 (ví dụ: 25 + 3 = 28, 30 − 2 = 28)
const HARD_PAIR_POOL: PairDefinition[] = [
  { targetValue: 50, exprA: '30 + 20', exprB: '70 − 20' },
  { targetValue: 80, exprA: '50 + 30', exprB: '100 − 20' },
  { targetValue: 40, exprA: '20 + 20', exprB: '60 − 20' },
  { targetValue: 70, exprA: '40 + 30', exprB: '90 − 20' },
  { targetValue: 60, exprA: '40 + 20', exprB: '80 − 20' },
  { targetValue: 90, exprA: '60 + 30', exprB: '100 − 10' },
  { targetValue: 28, exprA: '25 + 3', exprB: '30 − 2' },
  { targetValue: 35, exprA: '32 + 3', exprB: '38 − 3' },
  { targetValue: 46, exprA: '42 + 4', exprB: '49 − 3' },
  { targetValue: 57, exprA: '50 + 7', exprB: '59 − 2' },
  { targetValue: 65, exprA: '60 + 5', exprB: '68 − 3' },
  { targetValue: 78, exprA: '70 + 8', exprB: '79 − 1' }
];

export const CardMemoryGame: React.FC<Props> = ({ onBack, onWin }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [turns, setTurns] = useState(0);
  const [score, setScore] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isLock, setIsLock] = useState(false);

  // Number of pairs per level
  const totalPairs = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6;
  const totalCards = totalPairs * 2;

  // Initialize and shuffle board
  const initGame = (diff: DifficultyLevel) => {
    const pool = diff === 'easy' ? EASY_PAIR_POOL : diff === 'medium' ? MEDIUM_PAIR_POOL : HARD_PAIR_POOL;
    const requiredPairs = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 6;

    // Pick distinct target values so NO two pairs share the same result in one game
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledPool.slice(0, requiredPairs);

    const generatedCards: CardItem[] = [];
    let idCounter = 1;

    selectedPairs.forEach((pair, index) => {
      const pairId = index + 1;
      // First card of pair
      generatedCards.push({
        id: idCounter++,
        pairId,
        targetValue: pair.targetValue,
        expression: pair.exprA,
        isFlipped: false,
        isMatched: false,
        isShaking: false
      });
      // Second card of pair
      generatedCards.push({
        id: idCounter++,
        pairId,
        targetValue: pair.targetValue,
        expression: pair.exprB,
        isFlipped: false,
        isMatched: false,
        isShaking: false
      });
    });

    // Shuffle the deck on the board
    const shuffledCards = generatedCards.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCardIds([]);
    setMatchedPairsCount(0);
    setTurns(0);
    setScore(0);
    setIsWon(false);
    setIsLock(false);
  };

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    soundManager.unlockAudio();
    // 1. Lock check: Prevent 3rd card flip while 2 are being verified
    if (isLock) return;

    const clickedCard = cards.find(c => c.id === cardId);
    // 2. Ignore click if card is not found, or already face-up, or already matched
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    soundManager.playCardFlip();

    // Flip the clicked card
    const nextFlippedIds = [...flippedCardIds, cardId];
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c));
    setFlippedCardIds(nextFlippedIds);

    // If 2 cards are now open, check if they have equal results
    if (nextFlippedIds.length === 2) {
      setTurns(t => t + 1);
      setIsLock(true); // Lock the board so student cannot click a 3rd card

      const firstCard = cards.find(c => c.id === nextFlippedIds[0])!;
      const secondCard = clickedCard;

      // Verification: Check if both math expressions produce the exact same result!
      const isMatch = firstCard.targetValue === secondCard.targetValue;

      if (isMatch) {
        // MATCH FOUND!
        soundManager.playSuccess();
        soundManager.playStar();

        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCard.id || c.id === secondCard.id
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          ));
          setFlippedCardIds([]);
          setIsLock(false);

          // Scoring: Ghép đúng một cặp: cộng 10 điểm
          const newMatched = matchedPairsCount + 1;
          const newScore = score + 10;
          setMatchedPairsCount(newMatched);
          setScore(newScore);

          // Check if all pairs are successfully found
          if (newMatched >= totalPairs) {
            setIsWon(true);
            soundManager.playFanfare();
            confetti({
              particleCount: 90,
              spread: 75,
              origin: { y: 0.6 }
            });
            // Update completion status in Super VIP Math Tournament
            onWin(newScore);
          }
        }, 600);
      } else {
        // MISMATCH!
        soundManager.playTryAgain();

        // Shake both mismatched cards
        setCards(prev => prev.map(c => 
          c.id === firstCard.id || c.id === secondCard.id
            ? { ...c, isShaking: true }
            : c
        ));

        // After approx 1 second (~1000ms), flip both cards back face down
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCard.id || c.id === secondCard.id
              ? { ...c, isFlipped: false, isShaking: false }
              : c
          ));
          setFlippedCardIds([]);
          setIsLock(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-1.5 sm:p-2.5 select-none overflow-hidden">
      <style>{`
        @keyframes card-shake-anim {
          0%, 100% { transform: rotateY(180deg) translateX(0); }
          20% { transform: rotateY(180deg) translateX(-8px) rotate(-3deg); }
          40% { transform: rotateY(180deg) translateX(8px) rotate(3deg); }
          60% { transform: rotateY(180deg) translateX(-6px) rotate(-2deg); }
          80% { transform: rotateY(180deg) translateX(6px) rotate(2deg); }
        }
        .animate-card-shake {
          animation: card-shake-anim 0.6s ease-in-out;
        }
      `}</style>

      {/* Top Bar Navigation & Info */}
      <div className="flex-none flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Về Siêu VIP
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
            Vòng 3 · Lật Thẻ Phép Tính Bằng Nhau
          </span>
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5 justify-center">
            🃏 THẺ BÀI THÔNG THÁI
          </h2>
        </div>

        {/* Difficulty Level Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setDifficulty('easy'); initGame('easy'); }}
            className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
              difficulty === 'easy' 
                ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Dễ (6 Thẻ)
          </button>
          <button
            onClick={() => { setDifficulty('medium'); initGame('medium'); }}
            className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
              difficulty === 'medium' 
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Vừa (8 Thẻ)
          </button>
          <button
            onClick={() => { setDifficulty('hard'); initGame('hard'); }}
            className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
              difficulty === 'hard' 
                ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Khó (12 Thẻ)
          </button>
        </div>
      </div>

      {/* Main 3D Card Stage */}
      <div className="flex-1 min-h-0 flex flex-col justify-between p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-emerald-300/80 shadow-2xl bg-gradient-to-b from-slate-950 via-emerald-950 to-indigo-950 overflow-hidden my-1 relative">
        {/* Subtle Magical Backdrop Glows */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Arena Header Stats */}
        <div className="flex-none flex items-center justify-between gap-2 mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-900/80 border border-emerald-400/60 px-3 py-1 rounded-xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-inner">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cặp đúng:</span>
              <span className="text-amber-300 text-sm sm:text-base font-black">{matchedPairsCount}</span>
              <span className="text-emerald-300">/ {totalPairs}</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-600/60 px-2.5 py-1 rounded-xl text-slate-200 font-bold text-xs hidden sm:flex items-center gap-1">
              <span>Lượt lật:</span>
              <span className="text-white font-black">{turns}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-xs sm:text-sm px-3.5 py-1 rounded-xl shadow-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-950" />
              <span>{score} Điểm</span>
            </div>

            <button
              onClick={() => initGame(difficulty)}
              className="p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Chia lại bài"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Trộn lại</span>
            </button>
          </div>
        </div>

        {/* Mission Instruction Banner */}
        <div className="flex-none bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-2.5 py-1 text-center mb-1.5 backdrop-blur-xs relative z-10">
          <p className="text-[11px] sm:text-xs text-emerald-200 font-bold flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span>Nhiệm vụ: Lật 2 thẻ có <strong>kết quả bằng nhau</strong> để ghép thành một cặp chính xác!</span>
          </p>
        </div>

        {/* 3D CARDS GRID */}
        <div className="flex-1 min-h-0 flex items-center justify-center relative z-10 w-full overflow-hidden">
          <div className={`grid gap-2 sm:gap-2.5 w-full items-center justify-center ${
            difficulty === 'easy'
              ? 'grid-cols-3 max-w-md mx-auto'
              : difficulty === 'medium'
              ? 'grid-cols-4 max-w-xl mx-auto'
              : 'grid-cols-4 sm:grid-cols-6 max-w-2xl mx-auto'
          }`}>
            {cards.map(card => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-[4/3] sm:aspect-square max-h-[85px] sm:max-h-[110px] cursor-pointer [perspective:1000px] transition-transform ${
                    card.isMatched ? 'cursor-default' : 'hover:scale-102 active:scale-95'
                  }`}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] rounded-xl sm:rounded-2xl shadow-md ${
                      isRevealed ? '[transform:rotateY(180deg)]' : ''
                    } ${card.isShaking ? 'animate-card-shake' : ''}`}
                  >
                    {/* CARD BACK (MẶT TRƯỚC KHI THẺ ÚP) */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 border-2 border-amber-300/80 shadow-md flex flex-col items-center justify-center text-white p-1 text-center group">
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-base sm:text-xl shadow-inner mb-0.5">
                        {card.id % 2 === 0 ? '⭐' : '❓'}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black tracking-wider text-amber-200 uppercase drop-shadow-xs">
                        Toán 1
                      </span>
                    </div>

                    {/* CARD FRONT (MẶT SAU HIỂN THỊ PHÉP TÍNH KHI LẬT MỞ) */}
                    <div 
                      className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl sm:rounded-2xl border-2 sm:border-3 flex flex-col items-center justify-center p-1 text-center transition-all ${
                        card.isMatched
                          ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 border-emerald-400 ring-3 ring-emerald-300 shadow-emerald-400/40 text-emerald-900'
                          : card.isShaking
                          ? 'bg-rose-50 border-rose-400 ring-3 ring-rose-300 text-rose-900'
                          : 'bg-white border-amber-400 ring-2 ring-amber-200 text-slate-800'
                      }`}
                    >
                      <div className="my-auto flex flex-col items-center justify-center">
                        <span className={`font-black tracking-wide leading-tight select-none font-mono ${
                          difficulty === 'hard' 
                            ? 'text-sm sm:text-lg text-slate-900' 
                            : 'text-base sm:text-xl text-slate-900'
                        }`}>
                          {card.expression}
                        </span>

                        {card.isMatched && (
                          <div className="mt-0.5 inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-black text-[8px] shadow-xs">
                            <CheckCircle2 className="w-2 h-2" />
                            <span>= {card.targetValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="flex-none pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
          <span>🎯 Mỗi cặp đúng: <strong>+10 điểm</strong></span>
          <span>⚡ Cần ghép đúng tất cả {totalPairs} cặp để vượt qua vòng 3</span>
        </div>

        {/* VICTORY OVERLAY MODAL */}
        {isWon && (
          <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 text-center animate-in fade-in duration-300">
            <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-3 animate-in zoom-in-95 duration-300 text-white relative">
              <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-4xl shadow-xl shadow-amber-400/40 animate-bounce">
                🃏🏆
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                <Award className="w-3 h-3" />
                VÒNG 3 HOÀN THÀNH
              </div>

              <h3 className="text-base sm:text-xl font-black text-amber-300 uppercase leading-snug">
                XUẤT SẮC! CON ĐÃ TÌM ĐÚNG TẤT CẢ CÁC CẶP PHÉP TÍNH!
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Con đã vận dụng trí nhớ và tài tính nhẩm tuyệt đỉnh để ghép đôi chính xác toàn bộ các thẻ bài có kết quả bằng nhau!
              </p>

              <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 flex items-center justify-around text-xs">
                <div className="text-center">
                  <div className="text-slate-400 font-bold">Số cặp đúng</div>
                  <div className="text-base font-black text-emerald-400">{matchedPairsCount}/{totalPairs}</div>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div className="text-center">
                  <div className="text-slate-400 font-bold">Tổng điểm</div>
                  <div className="text-base font-black text-amber-300">+{score} ⭐</div>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div className="text-center">
                  <div className="text-slate-400 font-bold">Số lượt lật</div>
                  <div className="text-base font-black text-sky-400">{turns}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => initGame(difficulty)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Chơi lại màn này
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/30 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5" /> Về Siêu VIP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
