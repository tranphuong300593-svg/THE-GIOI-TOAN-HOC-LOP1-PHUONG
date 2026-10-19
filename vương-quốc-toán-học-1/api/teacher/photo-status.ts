// Vercel Serverless Function for Photo Status
// Path: /api/teacher/photo-status

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.status(200).json({
    success: true,
    hasRealPhoto: true,
    canonicalPath: '/assets/co-phuong.webp',
    serverType: 'vercel-serverless',
    timestamp: new Date().toISOString()
  });
}
