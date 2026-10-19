import React, { useState, useEffect } from 'react';
import { soundManager, AudioState } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, X, ChevronUp, Bot, Check } from 'lucide-react';

interface Props {
  studentName?: string;
}

export const FloatingAudioControl: React.FC<Props> = ({ studentName = 'Bé yêu' }) => {
  const [audioState, setAudioState] = useState<AudioState>(() => soundManager.getAudioState());
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPromptedUnlock, setHasPromptedUnlock] = useState(false);

  useEffect(() => {
    const unsubscribe = soundManager.subscribe((state) => {
      setAudioState(state);
      if (state.isUnlocked) {
        setHasPromptedUnlock(true);
      }
    });
    return unsubscribe;
  }, []);

  const handleUnlockClick = () => {
    soundManager.unlockAudio().then(() => {
      soundManager.playRobotGreeting();
    });
    setHasPromptedUnlock(true);
  };

  const handleToggleMute = () => {
    const nextState = !audioState.soundEnabled;
    soundManager.soundEnabled = nextState;
    if (nextState) {
      soundManager.playPop();
    }
  };

  const handleSetVolume = (vol: number) => {
    soundManager.volume = vol;
    soundManager.playPop();
  };

  const handleTestGreeting = () => {
    soundManager.speakVietnamese(
      `Chào ${studentName}! Cô Phượng chúc em học Toán thật giỏi và vui nhé!`
    );
  };

  const handleTestRobot = () => {
    soundManager.playRobotGreeting();
  };

  return (
    <aside 
      aria-label="Điều khiển âm thanh"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto select-none font-sans"
    >
      {/* Expanded Control Panel */}
      {isExpanded && (
        <div className="mb-2 w-72 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border-2 border-amber-300 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔊</span>
              <span className="text-xs font-black uppercase text-amber-950 tracking-wider">
                Cài đặt âm thanh
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Đóng bảng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-3">
            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Trạng thái loa:</span>
              <button
                type="button"
                onClick={handleToggleMute}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  audioState.soundEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {audioState.soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Đang bật</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Đang tắt</span>
                  </>
                )}
              </button>
            </div>

            {/* Volume Presets */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">Âm lượng:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Nhẹ (40%)', val: 0.4 },
                  { label: 'Vừa (75%)', val: 0.75 },
                  { label: 'To (100%)', val: 1.0 }
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => handleSetVolume(item.val)}
                    className={`py-1.5 rounded-xl text-[11px] font-extrabold transition-all border ${
                      Math.abs(audioState.volume - item.val) < 0.1
                        ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                Thử âm thanh:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={handleTestGreeting}
                  className="py-2 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>👩‍🏫</span>
                  <span>Nghe cô chào</span>
                </button>
                <button
                  onClick={handleTestRobot}
                  className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rô-bốt bíp</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-400 pt-1">
            Tối ưu 100% cho iPhone Safari & Chrome Android
          </div>
        </div>
      )}

      {/* Main Pill Button */}
      {!audioState.isUnlocked ? (
        <button
          onClick={handleUnlockClick}
          className="flex items-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white animate-bounce cursor-pointer"
          title="Chạm để mở khóa âm thanh trên điện thoại"
        >
          <Sparkles className="w-4 h-4 fill-yellow-200 text-yellow-200" />
          <span>Chạm bật âm thanh 🔊</span>
        </button>
      ) : (
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-sky-200">
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-full transition-all ${
              audioState.soundEnabled
                ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
            }`}
            title={audioState.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {audioState.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="px-2.5 py-1 text-[11px] font-black text-slate-700 hover:text-sky-600 flex items-center gap-1 transition-colors"
            title="Cài đặt âm lượng"
          >
            <span>{Math.round(audioState.volume * 100)}%</span>
            <ChevronUp className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </aside>
  );
};
