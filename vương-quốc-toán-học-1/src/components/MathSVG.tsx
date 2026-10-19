import React from 'react';
import { MathIllustration } from '../types';

interface MathSVGProps {
  illustration?: MathIllustration;
  className?: string;
  showOuterLabel?: string;
}

export const MathSVG: React.FC<MathSVGProps> = ({ illustration, className = '', showOuterLabel }) => {
  if (!illustration) return null;

  const { type, count = 1, secondaryCount = 0, itemType, shape, data } = illustration;

  // Render individual cute item icon with no text inside, 100% clear counting
  const renderItem = (index: number, kind: string = 'apple') => {
    switch (kind) {
      case 'tomato':
        return (
          <g key={index}>
            <ellipse cx="25" cy="27" rx="19" ry="17" fill="#EF4444" />
            <ellipse cx="19" cy="21" rx="5" ry="3.5" fill="#F87171" opacity="0.6" />
            <path d="M25 10 C24 6, 26 2, 28 3" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <polygon points="25,11 20,8 24,14 18,13 23,16 25,13 28,16 27,12 32,13 27,8" fill="#22C55E" />
          </g>
        );

      case 'orange':
        return (
          <g key={index}>
            <circle cx="25" cy="27" r="19" fill="#F97316" />
            <circle cx="25" cy="27" r="17" fill="#FB923C" />
            <circle cx="19" cy="20" rx="4" ry="3" fill="#FDBA74" opacity="0.7" />
            <path d="M25 8 C25 4, 27 2, 29 4" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
            <ellipse cx="29" cy="7" rx="5" ry="2.5" fill="#16A34A" transform="rotate(-20 29 7)" />
          </g>
        );

      case 'carrot':
        return (
          <g key={index}>
            <path d="M25 8 Q33 22 28 44 Q25 46 22 44 Q17 22 25 8 Z" fill="#F97316" />
            <path d="M22 18 Q26 20 27 18" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M20 26 Q25 28 28 26" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M22 34 Q25 35 27 34" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M25 8 C22 2, 17 4, 18 8" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M25 8 C25 1, 28 1, 26 8" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M25 8 C28 3, 33 5, 30 8" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'chick':
        return (
          <g key={index}>
            <circle cx="25" cy="29" r="15" fill="#FBBF24" />
            <circle cx="25" cy="16" r="11" fill="#FDE047" />
            <circle cx="29" cy="14" r="2.5" fill="#1E293B" />
            <circle cx="30" cy="13" r="0.8" fill="#FFFFFF" />
            <polygon points="34,16 41,18 34,20" fill="#F97316" />
            <path d="M14 27 C12 33, 20 35, 22 29 Z" fill="#F59E0B" />
            <path d="M21 44 L21 48 M29 44 L29 48" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'fish':
        return (
          <g key={index}>
            <ellipse cx="26" cy="25" rx="16" ry="11" fill="#38BDF8" />
            <polygon points="12,25 2,16 2,34" fill="#0284C7" />
            <circle cx="34" cy="23" r="2.5" fill="#0F172A" />
            <circle cx="35" cy="22" r="0.8" fill="#FFFFFF" />
            <path d="M24 20 Q28 25 24 30" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" fill="none" />
            <ellipse cx="26" cy="14" rx="6" ry="3" fill="#0EA5E9" />
          </g>
        );

      case 'frog':
        return (
          <g key={index}>
            <ellipse cx="25" cy="29" rx="16" ry="13" fill="#22C55E" />
            <circle cx="16" cy="16" r="6" fill="#22C55E" />
            <circle cx="34" cy="16" r="6" fill="#22C55E" />
            <circle cx="16" cy="15" r="3" fill="#0F172A" />
            <circle cx="34" cy="15" r="3" fill="#0F172A" />
            <circle cx="17" cy="14" r="1" fill="#FFFFFF" />
            <circle cx="35" cy="14" r="1" fill="#FFFFFF" />
            <path d="M19 29 Q25 35 31 29" stroke="#15803D" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="14" cy="27" r="2" fill="#F472B6" opacity="0.6" />
            <circle cx="36" cy="27" r="2" fill="#F472B6" opacity="0.6" />
          </g>
        );

      case 'leaf':
      case 'lotus_leaf':
        return (
          <g key={index}>
            <circle cx="25" cy="26" r="18" fill="#10B981" />
            <circle cx="25" cy="26" r="16" fill="#34D399" />
            <circle cx="25" cy="25" r="2.5" fill="#059669" />
            <line x1="25" y1="25" x2="14" y2="17" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="25" x2="36" y2="17" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="25" x2="12" y2="30" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="25" x2="38" y2="30" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="25" x2="25" y2="40" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="20" cy="21" r="2" fill="#FFFFFF" opacity="0.8" />
          </g>
        );

      case 'butterfly':
        return (
          <g key={index}>
            <path d="M25 24 C18 10, 6 12, 10 24 C12 28, 20 27, 25 25 Z" fill="#F43F5E" />
            <circle cx="15" cy="20" r="3" fill="#FDE047" opacity="0.8" />
            <path d="M25 24 C32 10, 44 12, 40 24 C38 28, 30 27, 25 25 Z" fill="#F43F5E" />
            <circle cx="35" cy="20" r="3" fill="#FDE047" opacity="0.8" />
            <path d="M25 25 C19 28, 12 36, 17 40 C22 43, 24 33, 25 27 Z" fill="#FB923C" />
            <path d="M25 25 C31 28, 38 36, 33 40 C28 43, 26 33, 25 27 Z" fill="#FB923C" />
            <ellipse cx="25" cy="26" rx="2.5" ry="9" fill="#1E293B" />
            <circle cx="25" cy="15" r="2.5" fill="#1E293B" />
            <path d="M24 14 Q20 8 17 9 M26 14 Q30 8 33 9" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'child':
      case 'student':
        return (
          <g key={index}>
            <path d="M16 45 L18 31 C20 28, 30 28, 32 31 L34 45 Z" fill="#3B82F6" />
            <polygon points="25,32 21,29 29,29" fill="#FFFFFF" />
            <circle cx="25" cy="20" r="10" fill="#FED7AA" />
            <path d="M15 18 C15 10, 35 10, 35 18 C33 13, 28 12, 25 12 C20 12, 17 14, 15 18 Z" fill="#475569" />
            <circle cx="21.5" cy="19" r="1.5" fill="#1E293B" />
            <circle cx="28.5" cy="19" r="1.5" fill="#1E293B" />
            <path d="M22 23 Q25 26 28 23" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="18.5" cy="22" r="1.5" fill="#F472B6" opacity="0.6" />
            <circle cx="31.5" cy="22" r="1.5" fill="#F472B6" opacity="0.6" />
          </g>
        );

      case 'chair':
        return (
          <g key={index}>
            <rect x="15" y="8" width="20" height="15" rx="3" fill="#F59E0B" />
            <line x1="20" y1="11" x2="20" y2="20" stroke="#B45309" strokeWidth="1.5" />
            <line x1="25" y1="11" x2="25" y2="20" stroke="#B45309" strokeWidth="1.5" />
            <line x1="30" y1="11" x2="30" y2="20" stroke="#B45309" strokeWidth="1.5" />
            <rect x="12" y="23" width="26" height="6" rx="2" fill="#D97706" />
            <line x1="15" y1="29" x2="13" y2="44" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
            <line x1="35" y1="29" x2="37" y2="44" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
            <line x1="19" y1="29" x2="18" y2="41" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="31" y1="29" x2="32" y2="41" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'marble':
        return (
          <g key={index}>
            <circle cx="25" cy="26" r="16" fill="#0284C7" />
            <circle cx="25" cy="26" r="14" fill="#38BDF8" />
            <path d="M16 32 C20 20, 28 34, 34 20" stroke="#F0F9FF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
            <path d="M18 22 C23 28, 30 18, 32 30" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
            <ellipse cx="20" cy="18" rx="4.5" ry="3" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 20 18)" />
          </g>
        );

      case 'rabbit':
      case 'bunny':
        return (
          <g key={index}>
            <ellipse cx="19" cy="14" rx="4" ry="11" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <ellipse cx="19" cy="14" rx="2" ry="8" fill="#F472B6" opacity="0.7" />
            <ellipse cx="31" cy="14" rx="4" ry="11" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <ellipse cx="31" cy="14" rx="2" ry="8" fill="#F472B6" opacity="0.7" />
            <circle cx="25" cy="29" r="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <circle cx="20" cy="28" r="2.2" fill="#1E293B" />
            <circle cx="20.7" cy="27.3" r="0.8" fill="#FFFFFF" />
            <circle cx="30" cy="28" r="2.2" fill="#1E293B" />
            <circle cx="30.7" cy="27.3" r="0.8" fill="#FFFFFF" />
            <polygon points="25,32 23.5,30 26.5,30" fill="#F43F5E" />
            <path d="M23 33 Q25 35 27 33" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="17" cy="31" r="2.5" fill="#F472B6" opacity="0.5" />
            <circle cx="33" cy="31" r="2.5" fill="#F472B6" opacity="0.5" />
          </g>
        );

      case 'flower':
        return (
          <g key={index}>
            <circle cx="25" cy="17" r="8" fill="#FB7185" />
            <circle cx="33" cy="22" r="8" fill="#FB7185" />
            <circle cx="31" cy="32" r="8" fill="#FB7185" />
            <circle cx="19" cy="32" r="8" fill="#FB7185" />
            <circle cx="17" cy="22" r="8" fill="#FB7185" />
            <circle cx="25" cy="25" r="7" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
          </g>
        );

      case 'star':
        return (
          <g key={index}>
            <polygon
              points="25,5 31,18 45,18 34,27 38,40 25,32 12,40 16,27 5,18 19,18"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'apple':
      default:
        return (
          <g key={index}>
            <circle cx="25" cy="27" r="18" fill="#E11D48" />
            <circle cx="20" cy="21" r="5" fill="#FB7185" opacity="0.6" />
            <path d="M25 10 C25 5, 29 3, 31 5" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M26 8 C30 4, 36 7, 34 11 C30 11, 27 10, 26 8 Z" fill="#22C55E" />
          </g>
        );
    }
  };

  // =========================================================================
  // PHẦN SO SÁNH HAI HOẶC BA NHÓM ĐỐI TƯỢNG (NHIỀU HƠN, ÍT HƠN, BẰNG NHAU)
  // BẮT BUỘC: Hiển thị đầy đủ cả 2 nhóm đặt cạnh nhau, số lượng chuẩn xác,
  // nhãn tên nhóm rõ ràng, mỗi đối tượng là một biểu tượng riêng biệt, dễ đếm.
  // =========================================================================
  if (
    type === 'balance_tray' || 
    type === 'compare_groups' || 
    (secondaryCount !== undefined && secondaryCount > 0)
  ) {
    const leftCount = count || 1;
    const rightCount = secondaryCount || 1;
    const tertiaryCount = data?.tertiaryCount;
    const hasThreeGroups = typeof tertiaryCount === 'number' && tertiaryCount > 0;

    const leftKind = itemType || 'apple';
    const rightKind = data?.rightKind || (type === 'balance_tray' ? 'carrot' : leftKind);
    const thirdKind = data?.thirdKind || leftKind;

    const leftLabel = data?.leftLabel || 'Nhóm 1';
    const rightLabel = data?.rightLabel || 'Nhóm 2';
    const thirdLabel = data?.thirdLabel || 'Nhóm 3';

    return (
      <div className={`p-3 sm:p-4 bg-gradient-to-b from-amber-50/70 to-sky-50/50 rounded-2xl border-2 border-amber-200/80 shadow-xs flex flex-col items-center gap-3 w-full ${className}`}>
        <div className={`grid ${hasThreeGroups ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:gap-4 w-full`}>
          {/* Nhóm 1 */}
          <div className="bg-white/95 p-2 sm:p-3 rounded-2xl border-2 border-amber-200 flex flex-col items-center shadow-xs transition-all hover:border-amber-300">
            <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full mb-2 text-center shadow-2xs">
              {leftLabel} ({leftCount})
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 min-h-[64px] p-2 bg-amber-50/40 rounded-xl w-full">
              {Array.from({ length: leftCount }).map((_, i) => (
                <svg key={i} viewBox="0 0 50 50" className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 drop-shadow-2xs transition-transform hover:scale-110">
                  {renderItem(i, leftKind)}
                </svg>
              ))}
            </div>
          </div>

          {/* Nhóm 2 */}
          <div className="bg-white/95 p-2 sm:p-3 rounded-2xl border-2 border-sky-200 flex flex-col items-center shadow-xs transition-all hover:border-sky-300">
            <span className="inline-block bg-sky-100 text-sky-900 border border-sky-300 text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full mb-2 text-center shadow-2xs">
              {rightLabel} ({rightCount})
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 min-h-[64px] p-2 bg-sky-50/40 rounded-xl w-full">
              {Array.from({ length: rightCount }).map((_, i) => (
                <svg key={i} viewBox="0 0 50 50" className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 drop-shadow-2xs transition-transform hover:scale-110">
                  {renderItem(i, rightKind)}
                </svg>
              ))}
            </div>
          </div>

          {/* Nhóm 3 (nếu có bài so sánh 3 tổ) */}
          {hasThreeGroups && (
            <div className="bg-white/95 p-2 sm:p-3 rounded-2xl border-2 border-emerald-200 flex flex-col items-center shadow-xs transition-all hover:border-emerald-300">
              <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full mb-2 text-center shadow-2xs">
                {thirdLabel} ({tertiaryCount})
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 min-h-[64px] p-1.5 bg-emerald-50/30 rounded-xl w-full">
                {Array.from({ length: tertiaryCount }).map((_, i) => (
                  <svg key={i} width="38" height="38" viewBox="0 0 50 50" className="shrink-0 drop-shadow-2xs transition-transform hover:scale-110">
                    {renderItem(i, thirdKind)}
                  </svg>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Đếm đơn nhóm: fruits, animals, sea creatures
  if (type === 'fruits' || type === 'animals' || type === 'sea_creatures') {
    const kind = itemType || (type === 'fruits' ? 'apple' : type === 'sea_creatures' ? 'fish' : 'chick');
    return (
      <div className={`p-4 bg-white/95 rounded-2xl border border-sky-100 shadow-sm flex flex-wrap items-center justify-center gap-3.5 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <svg key={i} width="52" height="52" viewBox="0 0 50 50" className="drop-shadow-sm transition-transform hover:scale-105 shrink-0">
            {renderItem(i, kind)}
          </svg>
        ))}
      </div>
    );
  }

  // =========================================================================
  // CHỦ ĐỀ 2: HÌNH PHẲNG (HÌNH VUÔNG, TRÒN, TAM GIÁC, CHỮ NHẬT)
  // CHÍNH XÁC VỀ MẶT TOÁN HỌC & TUYỆT ĐỐI KHÔNG VIẾT CHỮ BÊN TRONG HÌNH!
  // =========================================================================
  // =========================================================================
  // CHỦ ĐỀ 2: HÌNH PHẲNG (HÌNH VUÔNG, TRÒN, TAM GIÁC, CHỮ NHẬT)
  // QUY CHUẨN: KHÔNG ĐƯỜNG VIỀN - MÀU SẮC ĐỒNG NHẤT - KHÔNG BO GÓC - KHÔNG ĐỔ BÓNG
  // =========================================================================
  if (type === 'flat_shapes') {
    const currentShape = shape || 'square';
    // Bảng màu đồng nhất chuẩn theo quy định:
    // Hình vuông: xanh dương (#3B82F6) | Chữ nhật: xanh lá (#22C55E) | Tam giác: vàng (#FACC15) | Tròn: đỏ (#EF4444)
    const color = data?.color || (
      currentShape === 'square' ? '#3B82F6' :
      currentShape === 'rectangle' ? '#22C55E' :
      currentShape === 'triangle' ? '#FACC15' :
      currentShape === 'circle' ? '#EF4444' : '#3B82F6'
    );

    // Dãy so sánh nhiều hình phẳng cùng lúc
    if (data?.shapesList && Array.isArray(data.shapesList)) {
      return (
        <div className={`p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-center gap-6 ${className}`}>
          {data.shapesList.map((item: any, idx: number) => {
            const itemColor = item.color || (
              item.shape === 'square' ? '#3B82F6' :
              item.shape === 'rectangle' ? '#22C55E' :
              item.shape === 'triangle' ? '#FACC15' :
              item.shape === 'circle' ? '#EF4444' : '#3B82F6'
            );
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <svg width="80" height="80" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  {item.shape === 'square' && (
                    <rect x="15" y="15" width="70" height="70" rx="0" ry="0" fill={itemColor} stroke="none" strokeWidth="0" />
                  )}
                  {item.shape === 'circle' && (
                    <circle cx="50" cy="50" r="35" fill={itemColor} stroke="none" strokeWidth="0" />
                  )}
                  {item.shape === 'triangle' && (
                    <polygon points="50,15 85,85 15,85" fill={itemColor} stroke="none" strokeWidth="0" />
                  )}
                  {item.shape === 'rectangle' && (
                    <rect x="10" y="25" width="80" height="50" rx="0" ry="0" fill={itemColor} stroke="none" strokeWidth="0" />
                  )}
                </svg>
                {item.label && (
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className={`p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center ${className}`}>
        {currentShape === 'square' && (
          /* Hình vuông: 4 cạnh bằng nhau, 4 góc 90°, rx="0" ry="0", stroke="none", màu tô đồng nhất */
          <svg width="140" height="140" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto">
            <rect x="10" y="10" width="100" height="100" rx="0" ry="0" fill={color} stroke="none" strokeWidth="0" />
          </svg>
        )}

        {currentShape === 'rectangle' && (
          /* Hình chữ nhật: 4 góc vuông 90°, cạnh thẳng, rx="0" ry="0", stroke="none", màu tô đồng nhất */
          <svg width="160" height="120" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet" className="mx-auto">
            <rect x="10" y="20" width="140" height="80" rx="0" ry="0" fill={color} stroke="none" strokeWidth="0" />
          </svg>
        )}

        {currentShape === 'triangle' && (
          /* Hình tam giác: 3 cạnh thẳng, 3 đỉnh sắc nét, không bo góc, stroke="none", màu tô đồng nhất */
          <svg width="150" height="130" viewBox="0 0 150 130" preserveAspectRatio="xMidYMid meet" className="mx-auto">
            <polygon points="75,10 140,120 10,120" fill={color} stroke="none" strokeWidth="0" />
          </svg>
        )}

        {currentShape === 'circle' && (
          /* Hình tròn: tròn đều, không méo, stroke="none", màu tô đồng nhất */
          <svg width="140" height="140" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" className="mx-auto">
            <circle cx="70" cy="70" r="58" fill={color} stroke="none" strokeWidth="0" />
          </svg>
        )}

        {showOuterLabel && (
          <span className="text-xs font-bold text-slate-700 mt-2 bg-slate-100 px-3 py-1 rounded-full">
            {showOuterLabel}
          </span>
        )}
      </div>
    );
  }

  // =========================================================================
  // CHỦ ĐỀ 2 (TIẾP TỤC): THỰC HÀNH LẮP GHÉP HÌNH (BÀI 8)
  // GHÉP CÁC HÌNH PHẲNG THÀNH NGÔI NHÀ, CON THUYỀN, HÌNH VUÔNG TỪ 2 TAM GIÁC
  // =========================================================================
  if (type === 'shapes_composition') {
    const mode = data?.mode || 'two_triangles_square';

    return (
      <div className={`p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center ${className}`}>
        <svg width="220" height="160" viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet">
          {mode === 'two_triangles_square' && (
            /* 2 tam giác vuông ghép thành hình vuông 100x100 với đường phân chia nét đứt */
            <g transform="translate(60, 30)">
              {/* Tam giác 1 (trên-trái) */}
              <polygon points="0,0 100,0 0,100" fill="#3B82F6" stroke="none" strokeWidth="0" />
              {/* Tam giác 2 (dưới-phải) */}
              <polygon points="100,0 100,100 0,100" fill="#60A5FA" stroke="none" strokeWidth="0" />
              {/* Đường phân chia nội dung Toán học */}
              <line x1="100" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            </g>
          )}

          {mode === 'house' && (
            /* Ngôi nhà ghép từ Mái tam giác + Tường vuông + Cửa chữ nhật */
            <g transform="translate(45, 15)">
              {/* Mái nhà: Tam giác không viền */}
              <polygon points="65,5 5,55 125,55" fill="#EF4444" stroke="none" strokeWidth="0" />
              {/* Tường nhà: Vuông không bo góc, không viền */}
              <rect x="20" y="55" width="90" height="85" rx="0" ry="0" fill="#FACC15" stroke="none" strokeWidth="0" />
              {/* Cửa: Chữ nhật không bo góc, không viền */}
              <rect x="52" y="90" width="26" height="50" rx="0" ry="0" fill="#3B82F6" stroke="none" strokeWidth="0" />
              {/* Cửa sổ: Tròn không viền */}
              <circle cx="65" cy="72" r="10" fill="#FFFFFF" stroke="none" strokeWidth="0" />
            </g>
          )}

          {mode === 'boat' && (
            /* Con thuyền: 2 Cánh buồm tam giác + Thân thuyền hình thang */
            <g transform="translate(30, 20)">
              {/* Buồm trái: Tam giác không viền */}
              <polygon points="80,10 30,85 80,85" fill="#38BDF8" stroke="none" strokeWidth="0" />
              {/* Buồm phải: Tam giác không viền */}
              <polygon points="85,25 85,85 130,85" fill="#F43F5E" stroke="none" strokeWidth="0" />
              {/* Cột buồm */}
              <line x1="82" y1="8" x2="82" y2="90" stroke="#78350F" strokeWidth="3" />
              {/* Thân thuyền */}
              <polygon points="15,95 150,95 130,125 35,125" fill="#F59E0B" stroke="none" strokeWidth="0" />
              {/* Sóng nước */}
              <path d="M5 130 Q40 120 75 130 T145 130 T170 130" stroke="#0284C7" strokeWidth="2.5" fill="none" />
            </g>
          )}
        </svg>

        {showOuterLabel && (
          <span className="text-xs font-bold text-slate-700 mt-2 bg-slate-100 px-3 py-1 rounded-full">
            {showOuterLabel}
          </span>
        )}
      </div>
    );
  }

  // =========================================================================
  // CHỦ ĐỀ 4: HÌNH KHỐI (KHỐI LẬP PHƯƠNG, KHỐI HỘP CHỮ NHẬT)
  // PHỐI CẢNH 3D CHUẨN XÁC, PHÂN BIỆT RÕ VỚI HÌNH PHẲNG, TUYỆT ĐỐI KHÔNG VIẾT CHỮ LÊN MẶT
  // =========================================================================
  if (type === 'solids_3d') {
    const isCube = shape === 'cube';
    return (
      <div className={`p-4 bg-white/95 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center ${className}`}>
        <svg width="200" height="150" viewBox="0 0 200 150">
          {isCube ? (
            /* True Isometric Cube (Khối lập phương): 6 equal square faces, NO text inside */
            <g transform="translate(100, 75)">
              {/* Top face */}
              <polygon points="0,-45 45,-20 0,5 -45,-20" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="2.5" />
              {/* Left face */}
              <polygon points="-45,-20 0,5 0,55 -45,30" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
              {/* Right face */}
              <polygon points="0,5 45,-20 45,30 0,55" fill="#1E40AF" stroke="#1D4ED8" strokeWidth="2.5" />
            </g>
          ) : (
            /* Isometric Cuboid (Khối hộp chữ nhật): Rectangular faces, NO text inside */
            <g transform="translate(90, 75)">
              {/* Top face */}
              <polygon points="0,-45 75,-20 15,10 -60,-15" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
              {/* Left face */}
              <polygon points="-60,-15 15,10 15,50 -60,25" fill="#EAB308" stroke="#CA8A04" strokeWidth="2.5" />
              {/* Right face */}
              <polygon points="15,10 75,-20 75,20 15,50" fill="#A16207" stroke="#CA8A04" strokeWidth="2.5" />
            </g>
          )}
        </svg>

        {showOuterLabel && (
          <span className="text-xs font-bold text-slate-700 mt-2 bg-slate-100 px-3 py-1 rounded-full">
            {showOuterLabel}
          </span>
        )}
      </div>
    );
  }

  // =========================================================================
  // CHỦ ĐỀ 4 (TIẾP TỤC): VỊ TRÍ, ĐỊNH HƯỚNG TRONG KHÔNG GIAN (BÀI 15)
  // TRÊN - DƯỚI, TRƯỚC - SAU, TRÁI - PHẢI, Ở GIỮA VỚI GÓC NHÌN RÕ RÀNG
  // =========================================================================
  if (type === 'spatial_positions') {
    const mode = data?.mode || 'above_below';

    return (
      <div className={`p-4 bg-white/95 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center ${className}`}>
        <svg width="260" height="150" viewBox="0 0 260 150">
          {mode === 'traffic_light' && (
            /* Đèn giao thông: Đỏ (trên cùng), Vàng (ở giữa), Xanh (dưới cùng) */
            <g transform="translate(100, 10)">
              {/* Housing */}
              <rect x="0" y="0" width="60" height="130" rx="20" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
              {/* Red light (Top) */}
              <circle cx="30" cy="28" r="16" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
              <circle cx="26" cy="24" r="4" fill="#FCA5A5" opacity="0.8" />
              {/* Yellow light (Middle) */}
              <circle cx="30" cy="65" r="16" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              <circle cx="26" cy="61" r="4" fill="#FEF08A" opacity="0.8" />
              {/* Green light (Bottom) */}
              <circle cx="30" cy="102" r="16" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
              <circle cx="26" cy="98" r="4" fill="#86EFAC" opacity="0.8" />
            </g>
          )}

          {mode === 'above_below' && (
            /* Bàn gỗ: Trên bàn có quả táo đỏ, Dưới gầm bàn có quả bóng tròn */
            <g transform="translate(30, 15)">
              {/* Table Top */}
              <rect x="20" y="55" width="160" height="14" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              {/* Table Legs */}
              <rect x="30" y="69" width="10" height="55" fill="#92400E" />
              <rect x="160" y="69" width="10" height="55" fill="#92400E" />
              {/* Floor line */}
              <line x1="0" y1="125" x2="200" y2="125" stroke="#CBD5E1" strokeWidth="2" />

              {/* TRÊN BÀN: Cuốn sách hoặc quả táo */}
              <g transform="translate(90, 20)">
                <circle cx="15" cy="22" r="12" fill="#E11D48" />
                <path d="M15 10 C15 6, 18 4, 20 6" stroke="#78350F" strokeWidth="2" fill="none" />
                <ellipse cx="20" cy="7" rx="3" ry="1.5" fill="#16A34A" />
              </g>

              {/* DƯỚI GẦM BÀN: Quả bóng tròn */}
              <g transform="translate(85, 95)">
                <circle cx="15" cy="15" r="14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                <path d="M5 15 Q15 5 25 15 Q15 25 5 15" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {mode === 'left_right' && (
            /* Cây ở giữa, Bên trái là chú chim, Bên phải là chú sóc */
            <g transform="translate(20, 15)">
              {/* Center Tree */}
              <rect x="105" y="60" width="16" height="65" fill="#78350F" rx="2" />
              <circle cx="113" cy="45" r="34" fill="#16A34A" stroke="#14532D" strokeWidth="2" />
              <circle cx="95" cy="40" r="22" fill="#22C55E" />
              <circle cx="130" cy="40" r="22" fill="#22C55E" />

              {/* BÊN TRÁI: Chú thỏ trắng */}
              <g transform="translate(30, 75)">
                <ellipse cx="18" cy="28" rx="14" ry="16" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
                <circle cx="18" cy="12" r="10" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Ears */}
                <ellipse cx="14" cy="-2" rx="3.5" ry="10" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
                <ellipse cx="22" cy="-2" rx="3.5" ry="10" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
                <circle cx="15" cy="11" r="1.5" fill="#1E293B" />
                <circle cx="21" cy="11" r="1.5" fill="#1E293B" />
              </g>

              {/* BÊN PHẢI: Chú cún vàng */}
              <g transform="translate(170, 75)">
                <ellipse cx="18" cy="28" rx="15" ry="16" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
                <circle cx="18" cy="12" r="10" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
                {/* Ears */}
                <ellipse cx="8" cy="10" rx="3.5" ry="7" fill="#B45309" />
                <ellipse cx="28" cy="10" rx="3.5" ry="7" fill="#B45309" />
                <circle cx="15" cy="11" r="1.5" fill="#1E293B" />
                <circle cx="21" cy="11" r="1.5" fill="#1E293B" />
              </g>
            </g>
          )}
        </svg>

        {showOuterLabel && (
          <span className="text-xs font-bold text-slate-700 mt-2 bg-slate-100 px-3 py-1 rounded-full">
            {showOuterLabel}
          </span>
        )}
      </div>
    );
  }

  // =========================================================================
  // CHỦ ĐỀ 9: THỜI GIAN, GIỜ VÀ LỊCH
  // 1. ĐỒNG HỒ KIM CHUẨN XÁC: KIM GIỜ NGẮN, KIM PHÚT DÀI, CÁC SỐ 1 ĐẾN 12 ĐÚNG TỌA ĐỘ
  // =========================================================================
  if (type === 'clock_face') {
    const rawHour = Number(data?.hour) || 8;
    const hour = ((rawHour - 1 + 12) % 12) + 1; // Normalize to 1..12
    const hourAngle = (hour % 12) * 30; // 30 deg per hour
    const minuteAngle = 0; // Exactly on 12 for Grade 1 "giờ đúng"

    return (
      <div className={`p-4 bg-white/95 rounded-2xl border border-sky-100 shadow-sm flex flex-col items-center ${className}`}>
        <svg width="170" height="170" viewBox="0 0 150 150">
          {/* Clock Outer Rim with Soft 3D Bevel */}
          <circle cx="75" cy="75" r="70" fill="#E0F2FE" stroke="#0284C7" strokeWidth="6" />
          <circle cx="75" cy="75" r="63" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />

          {/* Minute tick markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 - 90) * (Math.PI / 180);
            const x1 = 75 + 57 * Math.cos(rad);
            const y1 = 75 + 57 * Math.sin(rad);
            const x2 = 75 + 52 * Math.cos(rad);
            const y2 = 75 + 52 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />;
          })}

          {/* Numbers 1-12 with precise trigonometric angles: theta = (num * 30 - 90) deg */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const x = 75 + 43 * Math.cos(angle);
            const y = 75 + 43 * Math.sin(angle) + 4.5;
            return (
              <text key={num} x={x} y={y} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0369A1">
                {num}
              </text>
            );
          })}

          {/* Minute Hand (Pointing straight to 12 - longer and narrower) */}
          <line
            x1="75"
            y1="75"
            x2="75"
            y2="30"
            stroke="#0284C7"
            strokeWidth="3.2"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle}, 75, 75)`}
          />

          {/* Hour Hand (Pointing to the target hour - shorter and bolder) */}
          <line
            x1="75"
            y1="75"
            x2="75"
            y2="46"
            stroke="#DC2626"
            strokeWidth="4.8"
            strokeLinecap="round"
            transform={`rotate(${hourAngle}, 75, 75)`}
          />

          {/* Center Rivet */}
          <circle cx="75" cy="75" r="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        </svg>

        {showOuterLabel && (
          <span className="text-xs font-black text-sky-900 mt-2 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
            {showOuterLabel}
          </span>
        )}
      </div>
    );
  }

  // =========================================================================
  // CHỦ ĐỀ 9 (TIẾP TỤC): TỜ LỊCH & LỊCH TUẦN THỰC TẾ BẰNG THUẬT TOÁN (BÀI 35, 36)
  // ĐÚNG NGÀY TRONG THÁNG (28, 29, 30, 31), ĐÚNG THỨ TRONG TUẦN (THỨ HAI ĐẾN CHỦ NHẬT)
  // =========================================================================
  if (type === 'calendar_page') {
    const dayName = data?.dayName || 'Thứ Năm';
    const dayNumber = data?.dayNumber || 15;
    const month = data?.month || 5;
    const year = data?.year || 2026;
    const isSunday = dayName.toLowerCase().includes('chủ nhật');

    // Single Tear-off Wall Calendar Sheet (Tờ lịch bóc tường truyền thống)
    return (
      <div className={`p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col items-center justify-center ${className}`}>
        <div className="w-48 bg-white rounded-2xl shadow-md border-2 border-slate-300 overflow-hidden text-center transition-transform hover:scale-102">
          {/* Top Binding with Hanging Holes */}
          <div className="bg-red-600 px-3 py-2 text-white flex items-center justify-between border-b-2 border-red-700">
            <div className="w-2.5 h-2.5 rounded-full bg-white/40 border border-red-800" />
            <span className="text-xs font-black tracking-widest uppercase">
              THÁNG {month} · {year}
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-white/40 border border-red-800" />
          </div>

          {/* Day of Week */}
          <div className={`py-1.5 px-2 text-xs font-black uppercase tracking-wider ${
            isSunday ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
          }`}>
            {dayName}
          </div>

          {/* Big Bold Day Number */}
          <div className="py-4">
            <span className={`text-5xl font-black tracking-tight ${
              isSunday ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {dayNumber}
            </span>
          </div>

          {/* Bottom Footnote */}
          <div className="py-1 px-2 bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-500">
            Lịch học Toán lớp 1
          </div>
        </div>

        {showOuterLabel && (
          <span className="text-xs font-bold text-slate-700 mt-2 bg-slate-100 px-3 py-1 rounded-full">
            {showOuterLabel}
          </span>
        )}
      </div>
    );
  }

  // Mathematically Verified Ruler with cm markings and multi-item support (GDPT 2018 Toán 1)
  if (type === 'ruler_cm') {
    const rawLen = data?.lengthCm !== undefined ? data.lengthCm : (data?.pencilLength !== undefined ? data.pencilLength : 7);
    const measuredLengthCm = Number(rawLen) || 7;
    const startCm = Number(data?.startCm ?? 0);
    const endCm = startCm + measuredLengthCm;

    // Detect item type
    const rawItem = String(data?.item || '').toLowerCase().trim();
    let itemKind: 'pencil' | 'eraser' | 'clip' | 'ribbon' | 'segment' | 'crayon' = 'pencil';
    if (rawItem.includes('eraser') || rawItem.includes('tẩy')) {
      itemKind = 'eraser';
    } else if (rawItem.includes('clip') || rawItem.includes('ghim')) {
      itemKind = 'clip';
    } else if (rawItem.includes('ribbon') || rawItem.includes('ruy băng')) {
      itemKind = 'ribbon';
    } else if (rawItem.includes('segment') || rawItem.includes('đoạn thẳng')) {
      itemKind = 'segment';
    } else if (rawItem.includes('crayon') || rawItem.includes('sáp')) {
      itemKind = 'crayon';
    } else {
      itemKind = 'pencil';
    }

    const rulerZeroX = 55;
    const cmUnit = 48; // 1 cm = 48 SVG units
    const maxCm = Math.max(10, endCm + 1);
    const rulerStartX = 20;
    const rulerEndX = rulerZeroX + maxCm * cmUnit + 30;
    const rulerWidth = rulerEndX - rulerStartX;
    const rulerY = 78;
    const rulerHeight = 62;

    const itemStartX = rulerZeroX + startCm * cmUnit;
    const itemEndX = rulerZeroX + endCm * cmUnit;
    const itemTotalWidth = itemEndX - itemStartX;
    const itemY = 22;
    const itemHeight = 30;

    return (
      <div className={`p-4 sm:p-5 bg-gradient-to-b from-sky-50/90 to-amber-50/70 rounded-3xl border-2 border-sky-200 shadow-md flex flex-col items-center gap-2 max-w-full overflow-x-auto ${className}`}>
        <svg width="100%" height="165" viewBox={`0 0 ${Math.max(560, rulerEndX + 20)} 165`} className="max-w-[580px] select-none">
          <defs>
            <linearGradient id="rulerBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="60%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="pencilTopFacet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="pencilMidFacet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <linearGradient id="pencilBotFacet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="eraserPinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <linearGradient id="eraserBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
          </defs>

          {/* Dotted projection guidelines from item endpoints to ruler ticks */}
          <line
            x1={itemStartX}
            y1={14}
            x2={itemStartX}
            y2={rulerY + 22}
            stroke="#0284C7"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <line
            x1={itemEndX}
            y1={14}
            x2={itemEndX}
            y2={rulerY + 22}
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Start indicator tag at top */}
          <g transform={`translate(${itemStartX}, 12)`}>
            <circle cx="0" cy="0" r="4" fill="#0284C7" />
            <text x="0" y="-4" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0369A1">
              Vạch {startCm}
            </text>
          </g>

          {/* End indicator dot at top (NO text to prevent leaking the answer) */}
          <g transform={`translate(${itemEndX}, 12)`}>
            <circle cx="0" cy="0" r="4" fill="#059669" />
          </g>

          {/* ========================================================
              ĐỒ VẬT ĐO ĐỘ DÀI: CHÍNH XÁC THEO TỪNG LOẠI ĐƯỢC HỎI
             ======================================================== */}
          {/* 1. CỤC TẨY (ERASER) */}
          {itemKind === 'eraser' && (
            <g id="eraser">
              {/* Thân cục tẩy góc cạnh chuẩn xác từ itemStartX đến itemEndX */}
              <rect
                x={itemStartX}
                y={itemY}
                width={itemTotalWidth}
                height={itemHeight}
                rx="3"
                ry="3"
                fill="url(#eraserPinkGrad)"
                stroke="#BE123C"
                strokeWidth="1.5"
              />
              {/* Đai giấy bảo vệ ở giữa (Sleeve) */}
              <rect
                x={itemStartX + itemTotalWidth * 0.25}
                y={itemY - 1}
                width={itemTotalWidth * 0.5}
                height={itemHeight + 2}
                rx="2"
                ry="2"
                fill="#EFF6FF"
                stroke="#3B82F6"
                strokeWidth="1.5"
              />
              <line
                x1={itemStartX + itemTotalWidth * 0.3}
                y1={itemY + itemHeight / 2}
                x2={itemStartX + itemTotalWidth * 0.7}
                y2={itemY + itemHeight / 2}
                stroke="#60A5FA"
                strokeWidth="2"
              />
              {/* Biểu tượng cục tẩy nhỏ */}
              <text
                x={itemStartX + itemTotalWidth * 0.5}
                y={itemY + itemHeight / 2 + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="900"
                fill="#1D4ED8"
              >
                ERASER
              </text>
            </g>
          )}

          {/* 2. BÚT CHÌ (PENCIL) */}
          {itemKind === 'pencil' && (() => {
            const tipConeWidth = Math.min(36, itemTotalWidth * 0.3);
            const graphiteTipWidth = Math.min(14, tipConeWidth * 0.4);
            const bodyWidth = itemTotalWidth - tipConeWidth;

            return (
              <g id="pencil">
                {/* Flat Left End Plate (flush at x = itemStartX) */}
                <line
                  x1={itemStartX}
                  y1={itemY}
                  x2={itemStartX}
                  y2={itemY + itemHeight}
                  stroke="#7C2D12"
                  strokeWidth="2.5"
                />
                {/* Eraser / metal end band flush at left */}
                <rect
                  x={itemStartX}
                  y={itemY}
                  width={Math.min(16, bodyWidth * 0.15)}
                  height={itemHeight}
                  fill="#F43F5E"
                  stroke="#BE123C"
                  strokeWidth="1"
                />
                <rect
                  x={itemStartX + Math.min(12, bodyWidth * 0.12)}
                  y={itemY}
                  width={6}
                  height={itemHeight}
                  fill="#CBD5E1"
                  stroke="#94A3B8"
                  strokeWidth="0.5"
                />

                {/* Pencil wooden body facets */}
                <rect
                  x={itemStartX + Math.min(18, bodyWidth * 0.18)}
                  y={itemY}
                  width={bodyWidth - Math.min(18, bodyWidth * 0.18)}
                  height={9}
                  fill="url(#pencilTopFacet)"
                />
                <rect
                  x={itemStartX + Math.min(18, bodyWidth * 0.18)}
                  y={itemY + 9}
                  width={bodyWidth - Math.min(18, bodyWidth * 0.18)}
                  height={12}
                  fill="url(#pencilMidFacet)"
                />
                <rect
                  x={itemStartX + Math.min(18, bodyWidth * 0.18)}
                  y={itemY + 21}
                  width={bodyWidth - Math.min(18, bodyWidth * 0.18)}
                  height={9}
                  fill="url(#pencilBotFacet)"
                />

                {/* Sharpened wooden cone tapering to exact itemEndX */}
                <polygon
                  points={`
                    ${itemStartX + bodyWidth},${itemY}
                    ${itemEndX},${itemY + itemHeight / 2}
                    ${itemStartX + bodyWidth},${itemY + itemHeight}
                  `}
                  fill="#FEF3C7"
                  stroke="#D97706"
                  strokeWidth="0.5"
                />

                {/* Graphite tip tapering to absolute sharp tip at (itemEndX, itemY + itemHeight/2) */}
                <polygon
                  points={`
                    ${itemEndX - graphiteTipWidth},${itemY + itemHeight / 2 - 4}
                    ${itemEndX},${itemY + itemHeight / 2}
                    ${itemEndX - graphiteTipWidth},${itemY + itemHeight / 2 + 4}
                  `}
                  fill="#0F172A"
                />
              </g>
            );
          })()}

          {/* 3. KẸP GHIM (PAPERCLIP) */}
          {itemKind === 'clip' && (
            <g id="paperclip">
              {/* Outer and inner metallic wire loops spanning itemStartX to itemEndX */}
              <rect
                x={itemStartX}
                y={itemY + 4}
                width={itemTotalWidth}
                height={itemHeight - 8}
                rx={(itemHeight - 8) / 2}
                ry={(itemHeight - 8) / 2}
                fill="none"
                stroke="#64748B"
                strokeWidth="4"
              />
              <rect
                x={itemStartX + 8}
                y={itemY + 8}
                width={itemTotalWidth - 16}
                height={itemHeight - 16}
                rx={(itemHeight - 16) / 2}
                ry={(itemHeight - 16) / 2}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="3"
              />
            </g>
          )}

          {/* 4. DẢI RUY BĂNG (RIBBON) */}
          {itemKind === 'ribbon' && (
            <g id="ribbon">
              {/* Satin ribbon with straight cut edges flush at itemStartX and itemEndX */}
              <rect
                x={itemStartX}
                y={itemY + 3}
                width={itemTotalWidth}
                height={itemHeight - 6}
                rx="0"
                ry="0"
                fill="url(#ribbonGrad)"
                stroke="#BE185D"
                strokeWidth="1.5"
              />
              {/* White stitching lines */}
              <line
                x1={itemStartX}
                y1={itemY + 7}
                x2={itemEndX}
                y2={itemY + 7}
                stroke="#FDF2F8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <line
                x1={itemStartX}
                y1={itemY + itemHeight - 7}
                x2={itemEndX}
                y2={itemY + itemHeight - 7}
                stroke="#FDF2F8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </g>
          )}

          {/* 5. BÚT SÁP MÀU (CRAYON) */}
          {itemKind === 'crayon' && (() => {
            const coneW = Math.min(24, itemTotalWidth * 0.25);
            const bodyW = itemTotalWidth - coneW;
            return (
              <g id="crayon">
                {/* Flat base at itemStartX */}
                <rect
                  x={itemStartX}
                  y={itemY + 2}
                  width={bodyW}
                  height={itemHeight - 4}
                  rx="2"
                  ry="2"
                  fill="#2563EB"
                />
                {/* Paper label */}
                <rect
                  x={itemStartX + bodyW * 0.2}
                  y={itemY + 2}
                  width={bodyW * 0.6}
                  height={itemHeight - 4}
                  fill="#93C5FD"
                  stroke="#1D4ED8"
                  strokeWidth="1"
                />
                {/* Conical tip to itemEndX */}
                <polygon
                  points={`
                    ${itemStartX + bodyW},${itemY + 2}
                    ${itemEndX},${itemY + itemHeight / 2}
                    ${itemStartX + bodyW},${itemY + itemHeight - 2}
                  `}
                  fill="#1D4ED8"
                />
              </g>
            );
          })()}

          {/* 6. ĐOẠN THẲNG (SEGMENT) */}
          {itemKind === 'segment' && (
            <g id="segment">
              {/* Straight segment line */}
              <line
                x1={itemStartX}
                y1={itemY + itemHeight / 2}
                x2={itemEndX}
                y2={itemY + itemHeight / 2}
                stroke="#1E40AF"
                strokeWidth="4"
              />
              {/* End cap A */}
              <circle cx={itemStartX} cy={itemY + itemHeight / 2} r="5" fill="#1E40AF" />
              <text x={itemStartX} y={itemY + itemHeight / 2 - 8} textAnchor="middle" fontSize="12" fontWeight="900" fill="#1E40AF">A</text>
              {/* End cap B */}
              <circle cx={itemEndX} cy={itemY + itemHeight / 2} r="5" fill="#1E40AF" />
              <text x={itemEndX} y={itemY + itemHeight / 2 - 8} textAnchor="middle" fontSize="12" fontWeight="900" fill="#1E40AF">B</text>
            </g>
          )}

          {/* ========================================================
              THƯỚC ĐO: Vạch 0 tại x = 55, mỗi 1 cm = 48 đơn vị SVG
             ======================================================== */}
          <g id="ruler">
            {/* Ruler body */}
            <rect
              x={rulerStartX}
              y={rulerY}
              width={rulerWidth}
              height={rulerHeight}
              fill="url(#rulerBodyGrad)"
              stroke="#CA8A04"
              strokeWidth="2"
              rx="6"
            />

            {/* Centimeter ticks and numbers */}
            {Array.from({ length: maxCm + 1 }).map((_, cm) => {
              const tickX = rulerZeroX + cm * cmUnit;
              const isStartOrEnd = cm === startCm || cm === endCm;

              return (
                <g key={cm}>
                  {/* Major cm tick line */}
                  <line
                    x1={tickX}
                    y1={rulerY}
                    x2={tickX}
                    y2={rulerY + 22}
                    stroke={isStartOrEnd ? '#B45309' : '#78350F'}
                    strokeWidth={isStartOrEnd ? '3' : '2'}
                  />
                  {/* Number label */}
                  <text
                    x={tickX}
                    y={rulerY + 44}
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="800"
                    fill="#78350F"
                  >
                    {cm}
                  </text>

                  {/* Half-cm tick line */}
                  {cm < maxCm && (
                    <line
                      x1={tickX + cmUnit / 2}
                      y1={rulerY}
                      x2={tickX + cmUnit / 2}
                      y2={rulerY + 12}
                      stroke="#92400E"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}

            {/* Unit symbol 'cm' */}
            <text
              x={rulerEndX - 20}
              y={rulerY + 38}
              textAnchor="middle"
              fontSize="14"
              fontWeight="900"
              fill="#9A3412"
            >
              cm
            </text>
          </g>
        </svg>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/90 px-4 py-1.5 rounded-full border border-sky-200">
          <span className="flex items-center gap-1 text-sky-700">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Đầu vật đặt đúng vạch {startCm} cm
          </span>
          <span>·</span>
          <span className="text-slate-600">
            Quan sát vạch thước mà đầu kia của vật chạm tới để đọc số đo
          </span>
        </div>
      </div>
    );
  }

  // Train cars for missing numbers (Toán 1 Tập 1 p.6, p.14, p.25)
  if (type === 'train_cars') {
    const sequence = data?.sequence || [1, 2, '?', 4, 5];
    return (
      <div className={`p-4 bg-sky-50/80 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-center overflow-x-auto ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-14 h-12 bg-rose-500 rounded-l-xl rounded-tr-lg border-2 border-rose-700 flex flex-col items-center justify-center text-white text-xs font-bold shadow-sm relative shrink-0">
            <span>🚂</span>
            <div className="w-3 h-3 rounded-full bg-slate-800 absolute -bottom-1 left-2 border border-white" />
            <div className="w-3 h-3 rounded-full bg-slate-800 absolute -bottom-1 right-2 border border-white" />
          </div>

          {sequence.map((item: any, idx: number) => {
            const isMissing = item === '?';
            return (
              <div
                key={idx}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-base shadow-sm relative transition-transform shrink-0 ${
                  isMissing
                    ? 'bg-amber-100 border-dashed border-amber-400 text-amber-600 animate-pulse'
                    : 'bg-white border-sky-400 text-sky-800'
                }`}
              >
                <span>{item}</span>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 absolute -bottom-1 left-1.5 border border-white" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 absolute -bottom-1 right-1.5 border border-white" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default fallback container
  return (
    <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center ${className}`}>
      <span className="text-xs text-slate-500 font-medium">Hình minh họa Toán học</span>
    </div>
  );
};
