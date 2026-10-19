import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Star, Trophy, Sparkles, Check, Undo2, Paintbrush } from 'lucide-react';

interface Props {
  onBack: () => void;
  onWin: (score: number) => void;
}

interface ShapeArea {
  id: string;
  name: string;
  shapeKind: 'square' | 'rectangle' | 'triangle' | 'circle';
  requiredColor: string; // HEX of target color
  requiredColorName: string;
}

interface PaintingStage {
  id: number;
  title: string;
  mission: string;
  shapes: ShapeArea[];
  svgViewBox: string;
}

const PALETTE_COLORS = [
  { name: 'Đỏ', hex: '#EF4444' },
  { name: 'Xanh dương', hex: '#3B82F6' },
  { name: 'Xanh lá', hex: '#22C55E' },
  { name: 'Vàng', hex: '#FACC15' },
  { name: 'Cam', hex: '#F97316' },
  { name: 'Tím', hex: '#A855F7' },
  { name: 'Hồng', hex: '#EC4899' }
];

const STAGES: PaintingStage[] = [
  // 1. Ngôi nhà ấm áp (House)
  {
    id: 1,
    title: 'Bức tranh 1: Ngôi Nhà Ấm Áp 🏠',
    mission: 'Tô MÁI NHÀ (tam giác) màu ĐỎ, TƯỜNG (hình vuông) màu XANH DƯƠNG, CỬA (hình chữ nhật) màu XANH LÁ, và CỬA SỔ (hình tròn) màu VÀNG!',
    svgViewBox: '0 0 300 240',
    shapes: [
      { id: 'h_roof', name: 'Mái nhà', shapeKind: 'triangle', requiredColor: '#EF4444', requiredColorName: 'Đỏ' },
      { id: 'h_wall', name: 'Tường nhà', shapeKind: 'square', requiredColor: '#3B82F6', requiredColorName: 'Xanh dương' },
      { id: 'h_door', name: 'Cửa ra vào', shapeKind: 'rectangle', requiredColor: '#22C55E', requiredColorName: 'Xanh lá' },
      { id: 'h_window', name: 'Cửa sổ', shapeKind: 'circle', requiredColor: '#FACC15', requiredColorName: 'Vàng' }
    ]
  },
  // 2. Chú Robot Thông Minh (Robot)
  {
    id: 2,
    title: 'Bức tranh 2: Chú Robot Thông Minh 🤖',
    mission: 'Tô ĐẦU ROBOT (hình vuông) màu VÀNG, THÂN (hình chữ nhật) màu XANH DƯƠNG, HAI MẮT (hình tròn) màu ĐỎ, và TAI (hình tam giác) màu CAM!',
    svgViewBox: '0 0 300 240',
    shapes: [
      { id: 'r_head', name: 'Đầu robot', shapeKind: 'square', requiredColor: '#FACC15', requiredColorName: 'Vàng' },
      { id: 'r_body', name: 'Thân robot', shapeKind: 'rectangle', requiredColor: '#3B82F6', requiredColorName: 'Xanh dương' },
      { id: 'r_eye_l', name: 'Mắt trái', shapeKind: 'circle', requiredColor: '#EF4444', requiredColorName: 'Đỏ' },
      { id: 'r_eye_r', name: 'Mắt phải', shapeKind: 'circle', requiredColor: '#EF4444', requiredColorName: 'Đỏ' },
      { id: 'r_ear_l', name: 'Tai trái', shapeKind: 'triangle', requiredColor: '#F97316', requiredColorName: 'Cam' },
      { id: 'r_ear_r', name: 'Tai phải', shapeKind: 'triangle', requiredColor: '#F97316', requiredColorName: 'Cam' }
    ]
  },
  // 3. Con Tàu Hỏa Vui Vẻ (Train)
  {
    id: 3,
    title: 'Bức tranh 3: Con Tàu Hỏa Vui Vẻ 🚂',
    mission: 'Tô ĐẦU TÀU (hình chữ nhật) màu XANH LÁ, ỐNG KHÓI (hình vuông) màu CAM, MŨI TÀU (hình tam giác) màu ĐỎ, và BÁNH XE (hình tròn) màu VÀNG!',
    svgViewBox: '0 0 320 240',
    shapes: [
      { id: 't_body', name: 'Đầu tàu', shapeKind: 'rectangle', requiredColor: '#22C55E', requiredColorName: 'Xanh lá' },
      { id: 't_chimney', name: 'Ống khói', shapeKind: 'square', requiredColor: '#F97316', requiredColorName: 'Cam' },
      { id: 't_front', name: 'Mũi tàu', shapeKind: 'triangle', requiredColor: '#EF4444', requiredColorName: 'Đỏ' },
      { id: 't_wheel_1', name: 'Bánh xe 1', shapeKind: 'circle', requiredColor: '#FACC15', requiredColorName: 'Vàng' },
      { id: 't_wheel_2', name: 'Bánh xe 2', shapeKind: 'circle', requiredColor: '#FACC15', requiredColorName: 'Vàng' },
      { id: 't_wheel_3', name: 'Bánh xe 3', shapeKind: 'circle', requiredColor: '#FACC15', requiredColorName: 'Vàng' }
    ]
  },
  // 4. Lâu Đài Cổ Tích (Castle)
  {
    id: 4,
    title: 'Bức tranh 4: Lâu Đài Cổ Tích 🏰',
    mission: 'Tô MÁI THÁP (tam giác) màu TÍM, TƯỜNG THÀNH (hình vuông) màu HỒNG, CỔNG THÀNH (hình chữ nhật) màu XANH DƯƠNG, và NGỌC TRÊN ĐỈNH (hình tròn) màu VÀNG!',
    svgViewBox: '0 0 300 240',
    shapes: [
      { id: 'c_roof_l', name: 'Mái tháp trái', shapeKind: 'triangle', requiredColor: '#A855F7', requiredColorName: 'Tím' },
      { id: 'c_roof_r', name: 'Mái tháp phải', shapeKind: 'triangle', requiredColor: '#A855F7', requiredColorName: 'Tím' },
      { id: 'c_wall', name: 'Tường thành', shapeKind: 'square', requiredColor: '#EC4899', requiredColorName: 'Hồng' },
      { id: 'c_gate', name: 'Cổng thành', shapeKind: 'rectangle', requiredColor: '#3B82F6', requiredColorName: 'Xanh dương' },
      { id: 'c_jewel', name: 'Ngọc đỉnh tháp', shapeKind: 'circle', requiredColor: '#FACC15', requiredColorName: 'Vàng' }
    ]
  },
  // 5. Chiếc Xe Ô Tô (Car)
  {
    id: 5,
    title: 'Bức tranh 5: Xe Ô Tô Du Lịch 🚗',
    mission: 'Tô THÂN XE (hình chữ nhật) màu ĐỎ, MUI XE (hình vuông) màu XANH DƯƠNG, ĐÈN XE (hình tam giác) màu VÀNG, và HAI BÁNH XE (hình tròn) màu XANH LÁ!',
    svgViewBox: '0 0 300 240',
    shapes: [
      { id: 'car_body', name: 'Thân xe', shapeKind: 'rectangle', requiredColor: '#EF4444', requiredColorName: 'Đỏ' },
      { id: 'car_roof', name: 'Mui xe', shapeKind: 'square', requiredColor: '#3B82F6', requiredColorName: 'Xanh dương' },
      { id: 'car_light', name: 'Đèn xe', shapeKind: 'triangle', requiredColor: '#FACC15', requiredColorName: 'Vàng' },
      { id: 'car_w1', name: 'Bánh trước', shapeKind: 'circle', requiredColor: '#22C55E', requiredColorName: 'Xanh lá' },
      { id: 'car_w2', name: 'Bánh sau', shapeKind: 'circle', requiredColor: '#22C55E', requiredColorName: 'Xanh lá' }
    ]
  }
];

// Chỉ giữ lại đúng 3 tranh tô màu trong một lượt chơi theo yêu cầu của Đại hội Toán học
const TOTAL_PLAY_STAGES = 3;
const ACTIVE_STAGES = STAGES.slice(0, TOTAL_PLAY_STAGES);

export const GeometryPainterGame: React.FC<Props> = ({ onBack, onWin }) => {
  const [stageIdx, setStageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[0].hex);
  const [coloredShapes, setColoredShapes] = useState<Record<string, string>>({});
  const [colorHistory, setColorHistory] = useState<Record<string, string>[]>([]);
  const [score, setScore] = useState(0);
  const [checkedStatus, setCheckedStatus] = useState<{ isSuccess: boolean; message: string } | null>(null);
  const [isWon, setIsWon] = useState(false);

  const currentStage = ACTIVE_STAGES[stageIdx % TOTAL_PLAY_STAGES];

  // Handle tap shape to color
  const handleColorShape = (shapeId: string) => {
    soundManager.unlockAudio();
    soundManager.playPop();
    setCheckedStatus(null);

    setColorHistory(prev => [...prev, coloredShapes]);
    setColoredShapes(prev => ({
      ...prev,
      [shapeId]: selectedColor
    }));
  };

  // Undo
  const handleUndo = () => {
    if (colorHistory.length === 0) return;
    soundManager.playPop();
    const prev = colorHistory[colorHistory.length - 1];
    setColoredShapes(prev);
    setColorHistory(hist => hist.slice(0, hist.length - 1));
    setCheckedStatus(null);
  };

  // Reset colors on current painting
  const handleClear = () => {
    soundManager.playPop();
    setColoredShapes({});
    setColorHistory([]);
    setCheckedStatus(null);
  };

  // Check painting
  const handleCheckPainting = () => {
    soundManager.unlockAudio();
    soundManager.playPop();

    let allFilled = true;
    let allCorrect = true;

    currentStage.shapes.forEach(shape => {
      const userColor = coloredShapes[shape.id];
      if (!userColor) {
        allFilled = false;
      } else if (userColor.toUpperCase() !== shape.requiredColor.toUpperCase()) {
        allCorrect = false;
      }
    });

    if (!allFilled) {
      soundManager.playTryAgain();
      setCheckedStatus({
        isSuccess: false,
        message: 'Bé còn hình chưa tô màu kìa, hãy tô đủ tất cả các hình nhé!'
      });
      return;
    }

    if (allCorrect) {
      soundManager.playSuccess();
      soundManager.playStar();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });

      const newScore = score + 30;
      setScore(newScore);

      setCheckedStatus({
        isSuccess: true,
        message: 'TUYỆT ĐẸP! Bức tranh rực rỡ sắc màu đã được tô chính xác 100%! 🎨✨'
      });

      setTimeout(() => {
        if (stageIdx + 1 >= TOTAL_PLAY_STAGES) {
          // Completed all 3 paintings!
          setIsWon(true);
          soundManager.playFanfare();
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onWin(newScore);
        } else {
          // Next painting
          setStageIdx(prev => prev + 1);
          setColoredShapes({});
          setColorHistory([]);
          setCheckedStatus(null);
        }
      }, 1800);
    } else {
      soundManager.playTryAgain();
      setCheckedStatus({
        isSuccess: false,
        message: 'Có hình màu chưa đúng với yêu cầu của đề bài, bé hãy xem lại gợi ý nhiệm vụ phía trên nhé!'
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-1.5 sm:p-2.5 select-none overflow-hidden">
      {/* Top Bar Navigation & Info */}
      <div className="flex-none flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border-2 border-pink-200 shadow-sm">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Về Siêu VIP
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 block">
            Vòng 4 · Nghệ thuật tô màu hình phẳng
          </span>
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5 justify-center">
            🎨 HỌA SĨ HÌNH HỌC
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-amber-900 font-black text-xs flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{score} điểm</span>
          </div>
          <div className="bg-pink-100 border border-pink-300 px-2.5 py-1 rounded-xl text-pink-900 font-black text-xs">
            Tranh {stageIdx + 1} / {TOTAL_PLAY_STAGES}
          </div>
        </div>
      </div>

      {/* Main Art Easel Canvas */}
      <div className="flex-1 min-h-0 flex flex-col justify-between p-2 sm:p-3 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-pink-300 shadow-xl bg-gradient-to-b from-amber-50 via-pink-50 to-rose-100 overflow-hidden my-1 relative">
        {/* Mission Banner */}
        <div className="flex-none bg-white/95 backdrop-blur-md rounded-xl p-2 border border-pink-200 shadow-xs text-center max-w-xl mx-auto w-full mb-1">
          <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider block">
            {currentStage.title}
          </span>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
            {currentStage.mission}
          </p>
        </div>

        {/* INTERACTIVE SVG COLORING BOARD */}
        <div className="flex-1 min-h-0 relative my-auto flex items-center justify-center p-2 bg-white rounded-2xl border-2 border-amber-200 shadow-md max-w-md mx-auto w-full aspect-[4/3] max-h-[220px] sm:max-h-[260px]">
          <svg
            viewBox={currentStage.svgViewBox}
            className="w-full h-full max-h-full select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* STAGE 1: NGÔI NHÀ (HOUSE) */}
            {currentStage.id === 1 && (
              <g id="house_drawing">
                {/* Roof: Triangle */}
                <polygon
                  points="150,20 40,110 260,110"
                  fill={coloredShapes['h_roof'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('h_roof')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Wall: Square */}
                <rect
                  x="70"
                  y="110"
                  width="160"
                  height="110"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['h_wall'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('h_wall')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Door: Rectangle */}
                <rect
                  x="125"
                  y="145"
                  width="50"
                  height="75"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['h_door'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('h_door')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Window: Circle */}
                <circle
                  cx="150"
                  cy="75"
                  r="18"
                  fill={coloredShapes['h_window'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('h_window')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
              </g>
            )}

            {/* STAGE 2: ROBOT */}
            {currentStage.id === 2 && (
              <g id="robot_drawing">
                {/* Ears: Triangles */}
                <polygon
                  points="70,55 95,30 95,80"
                  fill={coloredShapes['r_ear_l'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  onClick={() => handleColorShape('r_ear_l')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                <polygon
                  points="230,55 205,30 205,80"
                  fill={coloredShapes['r_ear_r'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  onClick={() => handleColorShape('r_ear_r')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Head: Square */}
                <rect
                  x="95"
                  y="20"
                  width="110"
                  height="80"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['r_head'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('r_head')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Eyes: Circles */}
                <circle
                  cx="125"
                  cy="55"
                  r="12"
                  fill={coloredShapes['r_eye_l'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  onClick={() => handleColorShape('r_eye_l')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                <circle
                  cx="175"
                  cy="55"
                  r="12"
                  fill={coloredShapes['r_eye_r'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  onClick={() => handleColorShape('r_eye_r')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Body: Rectangle */}
                <rect
                  x="80"
                  y="105"
                  width="140"
                  height="115"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['r_body'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('r_body')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
              </g>
            )}

            {/* STAGE 3: TÀU HỎA (TRAIN) */}
            {currentStage.id === 3 && (
              <g id="train_drawing">
                {/* Front nose: Triangle */}
                <polygon
                  points="260,110 310,170 260,170"
                  fill={coloredShapes['t_front'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('t_front')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Chimney: Square */}
                <rect
                  x="200"
                  y="45"
                  width="40"
                  height="45"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['t_chimney'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('t_chimney')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Train body: Rectangle */}
                <rect
                  x="40"
                  y="90"
                  width="220"
                  height="80"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['t_body'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('t_body')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Wheels: 3 Circles */}
                <circle
                  cx="85"
                  cy="190"
                  r="22"
                  fill={coloredShapes['t_wheel_1'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="3"
                  onClick={() => handleColorShape('t_wheel_1')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                <circle
                  cx="150"
                  cy="190"
                  r="22"
                  fill={coloredShapes['t_wheel_2'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="3"
                  onClick={() => handleColorShape('t_wheel_2')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                <circle
                  cx="215"
                  cy="190"
                  r="22"
                  fill={coloredShapes['t_wheel_3'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="3"
                  onClick={() => handleColorShape('t_wheel_3')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
              </g>
            )}

            {/* STAGE 4: LÂU ĐÀI (CASTLE) */}
            {currentStage.id === 4 && (
              <g id="castle_drawing">
                {/* Left tower roof: Triangle */}
                <polygon
                  points="75,25 40,75 110,75"
                  fill={coloredShapes['c_roof_l'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  onClick={() => handleColorShape('c_roof_l')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Right tower roof: Triangle */}
                <polygon
                  points="225,25 190,75 260,75"
                  fill={coloredShapes['c_roof_r'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  onClick={() => handleColorShape('c_roof_r')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Castle wall: Square */}
                <rect
                  x="60"
                  y="75"
                  width="180"
                  height="140"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['c_wall'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('c_wall')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Castle Gate: Rectangle */}
                <rect
                  x="120"
                  y="135"
                  width="60"
                  height="80"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['c_gate'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('c_gate')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Jewel: Circle */}
                <circle
                  cx="150"
                  cy="95"
                  r="14"
                  fill={coloredShapes['c_jewel'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  onClick={() => handleColorShape('c_jewel')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
              </g>
            )}

            {/* STAGE 5: XE Ô TÔ (CAR) */}
            {currentStage.id === 5 && (
              <g id="car_drawing">
                {/* Headlight: Triangle */}
                <polygon
                  points="260,135 290,120 290,150"
                  fill={coloredShapes['car_light'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  onClick={() => handleColorShape('car_light')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Roof: Square */}
                <rect
                  x="90"
                  y="40"
                  width="85"
                  height="75"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['car_roof'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('car_roof')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Body: Rectangle */}
                <rect
                  x="40"
                  y="115"
                  width="220"
                  height="65"
                  rx="0"
                  ry="0"
                  fill={coloredShapes['car_body'] || '#F1F5F9'}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  onClick={() => handleColorShape('car_body')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                {/* Wheels: 2 Circles */}
                <circle
                  cx="95"
                  cy="185"
                  r="22"
                  fill={coloredShapes['car_w1'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="3"
                  onClick={() => handleColorShape('car_w1')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
                <circle
                  cx="205"
                  cy="185"
                  r="22"
                  fill={coloredShapes['car_w2'] || '#FFFFFF'}
                  stroke="#94A3B8"
                  strokeWidth="3"
                  onClick={() => handleColorShape('car_w2')}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
              </g>
            )}
          </svg>
        </div>

        {/* FEEDBACK STATUS BANNER */}
        {checkedStatus && (
          <div className={`flex-none mt-1 p-2 rounded-xl border text-xs font-black text-center animate-in zoom-in-95 ${
            checkedStatus.isSuccess
              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
              : 'bg-rose-100 border-rose-300 text-rose-900'
          }`}>
            {checkedStatus.message}
          </div>
        )}

        {/* VICTORY OVERLAY SCREEN */}
        {isWon && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-center">
            <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border-4 border-pink-400 shadow-2xl space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-4xl shadow-xl animate-bounce">
                🎨👑
              </div>
              <span className="text-[10px] font-black uppercase text-pink-700 tracking-wider">
                Tuyệt tác nghệ thuật
              </span>
              <h3 className="text-xl font-black text-slate-900">
                HỌA SĨ HÌNH HỌC NHÍ!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bé đã xuất sắc nhận diện và tô màu hoàn hảo cả 3 bức tranh hình học, hoàn thành xuất sắc Vòng 4!
              </p>
              <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-200 font-black text-pink-900 text-xs sm:text-sm">
                + {score} Điểm thành tích Siêu VIP ⭐
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setStageIdx(0);
                    setColoredShapes({});
                    setColorHistory([]);
                    setCheckedStatus(null);
                    setIsWon(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Tô lại từ đầu
                </button>
                <button
                  onClick={onBack}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Khu Siêu VIP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COLOR PALETTE & ACTION BUTTONS */}
      <div className="flex-none bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border-2 border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Colors Palette */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 sm:pb-0">
          <span className="text-xs font-black text-slate-700 whitespace-nowrap mr-1 flex items-center gap-1">
            <Paintbrush className="w-3.5 h-3.5 text-pink-500" /> Chọn màu:
          </span>
          {PALETTE_COLORS.map(c => {
            const isSelected = selectedColor === c.hex;
            return (
              <button
                key={c.hex}
                onClick={() => {
                  soundManager.playPop();
                  setSelectedColor(c.hex);
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center text-white ${
                  isSelected ? 'border-slate-900 scale-110 shadow-sm ring-2 ring-pink-400' : 'border-white shadow-xs hover:scale-105'
                }`}
                title={c.name}
              >
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Action Controls: Undo, Clear, Check */}
        <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleUndo}
            disabled={colorHistory.length === 0}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Hoàn tác nét tô trước"
          >
            <Undo2 className="w-3.5 h-3.5" /> Hoàn tác
          </button>
          <button
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="Xóa tất cả để tô lại"
          >
            🧹 Tẩy màu
          </button>
          <button
            onClick={handleCheckPainting}
            className="flex-1 sm:flex-none px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-xs sm:text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> KIỂM TRA TRANH
          </button>
        </div>
      </div>
    </div>
  );
};
