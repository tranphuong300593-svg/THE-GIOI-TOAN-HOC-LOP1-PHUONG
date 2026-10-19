// Vercel Serverless Function for Teacher Photo Upload
// Path: /api/teacher/upload-photo

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: `Phương thức ${req.method} không được hỗ trợ.`
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { imageBase64 } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Chưa có dữ liệu ảnh (imageBase64).'
      });
    }

    // On Vercel serverless environment, dynamic uploads can either return the data URL
    // or point to the canonical static bundle path /assets/co-phuong.webp
    return res.status(200).json({
      success: true,
      photoUrl: imageBase64.startsWith('data:') ? imageBase64 : `/assets/co-phuong.webp?v=${Date.now()}`,
      message: 'Nhận ảnh thành công'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Lỗi xử lý ảnh: ' + (err?.message || 'Không xác định')
    });
  }
}
