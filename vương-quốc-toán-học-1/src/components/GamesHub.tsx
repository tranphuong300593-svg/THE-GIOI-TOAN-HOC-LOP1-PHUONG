import React, { useState, useMemo } from 'react';
import { GameId } from '../types';
import { ALL_38_GAMES_METADATA, NEW_GAMES_METADATA } from '../data/gamesData';
import { MysteryNumberGame } from './games/MysteryNumberGame';
import { SuperheroMathGame } from './games/SuperheroMathGame';
import { SpeedMatchGame } from './games/SpeedMatchGame';
import { FindHouseGame } from './games/FindHouseGame';
import { MathRacewayGame } from './games/MathRacewayGame';
import { GeometryDetectiveGame } from './games/GeometryDetectiveGame';
import { LuckyBoxGame } from './games/LuckyBoxGame';
import { GrandQuestGame } from './games/GrandQuestGame';
import { DynamicMathGame } from './games/DynamicMathGame';
import {
  Sparkles,
  Trophy,
  Star,
  Play,
  Compass,
  ArrowRight,
  Search,
  Filter,
  Gamepad2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  onRecordGameScore: (gameId: GameId, score: number) => void;
  studentHighScores?: Record<string, number>;
}

export const GamesHub: React.FC<Props> = ({ onRecordGameScore, studentHighScores = {} }) => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'legacy'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGameFinish = (score: number, _correct: number, _total: number) => {
    if (activeGame) {
      onRecordGameScore(activeGame, score);
    }
  };

  // Filter games based on category, topic, and search
  const filteredGames = useMemo(() => {
    return ALL_38_GAMES_METADATA.filter((game) => {
      // Filter by type: all, new, legacy
      if (selectedFilter === 'new' && game.isLegacy) return false;
      if (selectedFilter === 'legacy' && !game.isLegacy) return false;

      // Filter by topic
      if (selectedTopic !== 'all' && game.topicId !== selectedTopic) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = game.title.toLowerCase().includes(query);
        const matchesSub = game.subtitle.toLowerCase().includes(query);
        const matchesBadge = game.badge.toLowerCase().includes(query);
        const matchesNum = `#${game.num}`.includes(query) || `${game.num}` === query;
        if (!matchesTitle && !matchesSub && !matchesBadge && !matchesNum) return false;
      }

      return true;
    });
  }, [selectedFilter, selectedTopic, searchQuery]);

  // Statistics
  const playedCount = useMemo(() => {
    return Object.keys(studentHighScores).filter(k => (studentHighScores[k] || 0) > 0).length;
  }, [studentHighScores]);

  const totalPoints = useMemo(() => {
    return Object.values(studentHighScores).reduce((acc, curr) => acc + (curr || 0), 0);
  }, [studentHighScores]);

  // Render active game view
  if (activeGame === 'mystery_number') {
    return <MysteryNumberGame onBack={() => setActiveGame(null)} onFinish={handleGameFinish} />;
  }
  if (activeGame === 'math_superhero') {
    return <SuperheroMathGame onBack={() => setActiveGame(null)} onFinish={handleGameFinish} />;
  }
  if (activeGame === 'speed_match') {
    return <SpeedMatchGame onBack={() => setActiveGame(null)} onFinish={handleGameFinish} />;
  }
  if (activeGame === 'find_house') {
    return <FindHouseGame onBack={() => setActiveGame(null)} onFinish={handleGameFinish} />;
  }
  if (activeGame === 'math_raceway') {
    return <MathRacewayGame onBack={() => setActiveGame(null)} onFinish={handleGameFinish} />;
  }
  if (activeGame === 'geometry_detective') {
    return <GeometryDetectiveGame onBack={() => setActiveGame(null)} onFinish={handleGameFinish} />;
  }
  if (activeGame === 'lucky_box') {
    return <LuckyBoxGame onBack={() => setActiveGame(null)} onFinish={handleGameFinish} />;
  }
  if (activeGame === 'grand_quest') {
    return <GrandQuestGame onBack={() => setActiveGame(null)} onFinish={handleGameFinish} />;
  }

  // Check if active game is one of the 30 new games
  const activeNewGame = NEW_GAMES_METADATA.find(g => g.id === activeGame);
  if (activeNewGame) {
    return (
      <DynamicMathGame
        game={activeNewGame}
        onBack={() => setActiveGame(null)}
        onFinish={handleGameFinish}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* ========================================================
          BANNER SÂN CHƠI 38 TRÒ CHƠI TOÁN HỌC KỲ DIỆU
         ======================================================== */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white shadow-xl relative overflow-hidden border-4 border-white/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
            <span>Khu Vui Chơi Giáo Dục Toán Học · Đầy đủ 38 Trò Chơi</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black mb-2 text-white tracking-tight drop-shadow-sm">
            SÂN CHƠI TOÁN HỌC 3D DIỆU KỲ
          </h2>

          <p className="text-amber-100 text-sm md:text-base leading-relaxed font-semibold">
            Bao gồm <b>8 trò chơi truyền thống</b> và <b>30 trò chơi 3D tương tác mới</b>. Mỗi câu trả lời đúng đều tạo ra hành động và thành quả thực tế: kéo cần câu cá, hái quả vào giỏ, phóng tên lửa, tưới hoa nở rộ và tích lũy thật nhiều ngôi sao sáng!
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-2xl flex items-center gap-2 text-xs font-extrabold">
              <Gamepad2 className="w-4 h-4 text-yellow-300" />
              <span>38 Trò chơi sẵn sàng</span>
            </div>
            <div className="px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-2xl flex items-center gap-2 text-xs font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Đã chinh phục: {playedCount} / 38 trò</span>
            </div>
            <div className="px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-2xl flex items-center gap-2 text-xs font-extrabold">
              <Trophy className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Tổng điểm: {totalPoints} điểm</span>
            </div>
          </div>
        </div>

        {/* Decorative Floating Emojis */}
        <div className="absolute -right-4 -bottom-4 text-8xl md:text-9xl opacity-25 pointer-events-none select-none">
          🎡
        </div>
        <div className="absolute right-36 top-4 text-5xl opacity-20 pointer-events-none select-none">
          🚀
        </div>
      </div>

      {/* ========================================================
          BỘ LỌC TÌM KIẾM & PHÂN LOẠI TRÒ CHƠI
         ======================================================== */}
      <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Nhóm lọc: Tất cả / 30 Trò Mới / 8 Trò Cũ */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => {
                soundManager.playPop();
                setSelectedFilter('all');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Tất cả 38 Trò chơi
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                setSelectedFilter('new');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === 'new'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 30 Trò chơi Mới (3D)
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                setSelectedFilter('legacy');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === 'legacy'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" /> 8 Trò chơi Cũ
            </button>
          </div>

          {/* Ô Tìm Kiếm Nhanh */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên trò hoặc số..."
              className="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50"
            />
          </div>
        </div>

        {/* Lọc theo Chủ đề môn Toán */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-extrabold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Chủ đề:
          </span>
          {[
            { id: 'all', label: 'Tất cả chủ đề' },
            { id: 'chu_de_1', label: 'CĐ 1: Số 0 - 10' },
            { id: 'chu_de_2', label: 'CĐ 2: Hình phẳng' },
            { id: 'chu_de_3', label: 'CĐ 3: Cộng trừ đến 10' },
            { id: 'chu_de_4', label: 'CĐ 4: Hình khối' },
            { id: 'chu_de_5', label: 'CĐ 5: Ôn học kì 1' },
            { id: 'chu_de_6', label: 'CĐ 6: Số đến 100' },
            { id: 'chu_de_7', label: 'CĐ 7: Đo độ dài' },
            { id: 'chu_de_8', label: 'CĐ 8: Cộng trừ đến 100' },
            { id: 'chu_de_9', label: 'CĐ 9: Thời gian & Lịch' },
            { id: 'chu_de_10', label: 'CĐ 10: Ôn cuối năm' }
          ].map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                soundManager.playPop();
                setSelectedTopic(topic.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedTopic === topic.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          DANH SÁCH THẺ TRÒ CHƠI (GRID CHUẨN ĐỦ 38 TRÒ)
         ======================================================== */}
      {filteredGames.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <span className="text-4xl mb-3 block">🔍</span>
          <h3 className="text-base font-black text-slate-700 mb-1">
            Không tìm thấy trò chơi phù hợp
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Bé thử đổi từ khóa tìm kiếm hoặc chọn "Tất cả chủ đề" xem sao nhé!
          </p>
          <button
            onClick={() => {
              setSelectedFilter('all');
              setSelectedTopic('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-md hover:bg-amber-600 transition-colors"
          >
            Hiển thị lại tất cả 38 trò chơi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGames.map((g) => {
            const highScore = studentHighScores[g.id] || 0;

            return (
              <div
                key={g.id}
                className="group bg-white rounded-3xl p-5 border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon, Number & Topic Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.bgGradient} flex items-center justify-center text-3xl shadow-md text-white group-hover:scale-110 transition-transform`}
                    >
                      {g.icon}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-1">
                        #{g.num}
                      </span>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block">
                          {g.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-600 mb-2">{g.subtitle}</p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                    {g.desc}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" /> Kỷ lục:
                    </span>
                    <span className="font-black text-amber-600">
                      {highScore > 0 ? `${highScore} điểm` : 'Chưa chơi'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playPop();
                      setActiveGame(g.id);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${g.bgGradient} text-white font-extrabold text-xs shadow-md shadow-amber-500/20 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Chơi trò chơi này
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
