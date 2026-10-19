import React from 'react';

export type FlatShapeType = 'square' | 'rectangle' | 'triangle' | 'circle';

export interface FlatShapeProps {
  shape: FlatShapeType | string;
  color?: string;
  size?: number;
  className?: string;
}

export const FLAT_SHAPE_COLORS: Record<FlatShapeType, string> = {
  square: '#3B82F6',     // Xanh dương đồng nhất
  rectangle: '#22C55E',  // Xanh lá đồng nhất
  triangle: '#FACC15',   // Vàng đồng nhất
  circle: '#EF4444'      // Đỏ đồng nhất
};

/**
 * QUY CHUẨN TOÁN HỌC LỚP 1:
 * 1. Không đường viền: stroke="none", strokeWidth="0".
 * 2. Màu tô đặc duy nhất (Solid HEX/RGB), không gradient, không shadow, không 3D.
 * 3. Hình vuông: 4 cạnh bằng nhau, 4 góc 90°, rx="0" ry="0", không bo góc.
 * 4. Hình chữ nhật: 4 góc 90°, cạnh thẳng, rx="0" ry="0", không bo góc.
 * 5. Hình tam giác: 3 cạnh thẳng, 3 đỉnh sắc nét, không bo góc.
 * 6. Hình tròn: tròn đều, không méo.
 * 7. Nằm trọn trong khung (viewBox có khoảng đệm an toàn), preserveAspectRatio="xMidYMid meet".
 */
export const FlatShapeRenderer: React.FC<FlatShapeProps> = ({
  shape,
  color,
  size = 120,
  className = ''
}) => {
  const normShape = (shape || '').toLowerCase().trim();

  // Hình Vuông
  if (normShape === 'square' || normShape === 'hình vuông') {
    const fillColor = color || FLAT_SHAPE_COLORS.square;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        preserveAspectRatio="xMidYMid meet"
        className={`inline-block ${className}`}
        style={{ border: 'none', boxShadow: 'none' }}
      >
        <rect
          x="10"
          y="10"
          width="100"
          height="100"
          rx="0"
          ry="0"
          fill={fillColor}
          stroke="none"
          strokeWidth="0"
        />
      </svg>
    );
  }

  // Hình Chữ Nhật
  if (normShape === 'rectangle' || normShape === 'hình chữ nhật') {
    const fillColor = color || FLAT_SHAPE_COLORS.rectangle;
    const w = size;
    const h = Math.round(size * 0.75);
    return (
      <svg
        width={w}
        height={h}
        viewBox="0 0 160 120"
        preserveAspectRatio="xMidYMid meet"
        className={`inline-block ${className}`}
        style={{ border: 'none', boxShadow: 'none' }}
      >
        <rect
          x="10"
          y="20"
          width="140"
          height="80"
          rx="0"
          ry="0"
          fill={fillColor}
          stroke="none"
          strokeWidth="0"
        />
      </svg>
    );
  }

  // Hình Tam Giác
  if (normShape === 'triangle' || normShape === 'hình tam giác') {
    const fillColor = color || FLAT_SHAPE_COLORS.triangle;
    const w = size;
    const h = Math.round(size * 0.88);
    return (
      <svg
        width={w}
        height={h}
        viewBox="0 0 150 130"
        preserveAspectRatio="xMidYMid meet"
        className={`inline-block ${className}`}
        style={{ border: 'none', boxShadow: 'none' }}
      >
        <polygon
          points="75,10 140,120 10,120"
          fill={fillColor}
          stroke="none"
          strokeWidth="0"
        />
      </svg>
    );
  }

  // Hình Tròn
  if (normShape === 'circle' || normShape === 'hình tròn') {
    const fillColor = color || FLAT_SHAPE_COLORS.circle;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        preserveAspectRatio="xMidYMid meet"
        className={`inline-block ${className}`}
        style={{ border: 'none', boxShadow: 'none' }}
      >
        <circle
          cx="70"
          cy="70"
          r="58"
          fill={fillColor}
          stroke="none"
          strokeWidth="0"
        />
      </svg>
    );
  }

  return null;
};
