// Vercel Serverless Function for Teacher Profile
// Path: /api/teacher/profile

let memoryProfile: any = {
  heroPhoto: '/assets/co-phuong.webp',
  footerPhoto: '/assets/co-phuong.webp',
  zoom: 1,
  posX: 0,
  posY: 0,
  teacherName: 'Trần Thị Phượng',
  schoolName: 'Trường Tiểu học Trần Đại Nghĩa, phường Hòa Xuân, thành phố Đà Nẵng',
  hasRealPhoto: true,
  updatedAt: new Date().toISOString()
};

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      profile: memoryProfile
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { heroPhoto, footerPhoto, zoom, posX, posY } = body;
      
      memoryProfile = {
        ...memoryProfile,
        heroPhoto: heroPhoto || memoryProfile.heroPhoto,
        footerPhoto: footerPhoto || memoryProfile.footerPhoto,
        zoom: zoom !== undefined ? zoom : memoryProfile.zoom,
        posX: posX !== undefined ? posX : memoryProfile.posX,
        posY: posY !== undefined ? posY : memoryProfile.posY,
        hasRealPhoto: true,
        updatedAt: new Date().toISOString()
      };

      return res.status(200).json({
        success: true,
        profile: memoryProfile,
        message: 'Cập nhật hồ sơ cô giáo thành công'
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: 'Dữ liệu gửi lên không hợp lệ: ' + (err?.message || 'Lỗi không xác định')
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: `Phương thức ${req.method} không được hỗ trợ.`
  });
}
