import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '30mb' }));
const rootDir = process.env.NODE_ENV === 'production' && __dirname.endsWith('dist')
  ? path.resolve(__dirname, '..')
  : __dirname;

const publicDir = path.join(rootDir, 'public');
const assetsDir = path.join(publicDir, 'assets');
const distDir = path.join(rootDir, 'dist');
const dataDir = path.join(rootDir, 'data');
const profileFilePath = path.join(dataDir, 'teacher_profile.json');

// Ensure public/assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// In-memory & disk-backed teacher profile settings
const DEFAULT_PROFILE = {
  heroPhoto: '/assets/co-phuong.webp',
  footerPhoto: '/assets/co-phuong.webp',
  zoom: 1,
  posX: 0,
  posY: 0,
  teacherName: 'Trần Thị Phượng',
  schoolName: 'Trường Tiểu học Trần Đại Nghĩa, phường Hòa Xuân, thành phố Đà Nẵng',
  hasRealPhoto: false,
  updatedAt: new Date().toISOString()
};

function checkHasRealPhoto(): boolean {
  const file = path.join(assetsDir, 'co-phuong.webp');
  if (!fs.existsSync(file)) return false;
  try {
    const stat = fs.statSync(file);
    return stat.size > 2000;
  } catch {
    return false;
  }
}

function loadTeacherProfile() {
  try {
    if (fs.existsSync(profileFilePath)) {
      const data = JSON.parse(fs.readFileSync(profileFilePath, 'utf-8'));
      const profile = { ...DEFAULT_PROFILE, ...data };
      profile.hasRealPhoto = checkHasRealPhoto();
      return profile;
    }
  } catch (err) {
    console.warn('Could not read teacher_profile.json, using default profile', err);
  }
  const initial = { ...DEFAULT_PROFILE };
  initial.hasRealPhoto = checkHasRealPhoto();
  return initial;
}

function saveTeacherProfile(profile: any) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(profileFilePath, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save teacher_profile.json', err);
  }
}

let teacherProfile = loadTeacherProfile();

// Serve public assets with high priority
app.use('/assets', express.static(assetsDir));
app.use(express.static(publicDir));

// Teacher Profile Endpoints
app.get('/api/teacher/profile', (_req: Request, res: Response) => {
  teacherProfile.hasRealPhoto = checkHasRealPhoto();
  res.json({ success: true, profile: teacherProfile });
});

app.post('/api/teacher/profile', (req: Request, res: Response) => {
  const { heroPhoto, footerPhoto, zoom, posX, posY } = req.body;
  if (heroPhoto !== undefined) teacherProfile.heroPhoto = heroPhoto;
  if (footerPhoto !== undefined) teacherProfile.footerPhoto = footerPhoto;
  if (zoom !== undefined) teacherProfile.zoom = zoom;
  if (posX !== undefined) teacherProfile.posX = posX;
  if (posY !== undefined) teacherProfile.posY = posY;
  teacherProfile.hasRealPhoto = checkHasRealPhoto();
  teacherProfile.updatedAt = new Date().toISOString();
  saveTeacherProfile(teacherProfile);
  res.json({ success: true, profile: teacherProfile });
});

// Endpoint to inspect physical photo file status
app.get('/api/teacher/photo-status', (_req: Request, res: Response) => {
  const canonicalFile = path.join(assetsDir, 'co-phuong.webp');
  const exists = fs.existsSync(canonicalFile);
  let size = 0;
  if (exists) {
    try {
      size = fs.statSync(canonicalFile).size;
    } catch {}
  }
  const hasRealPhoto = exists && size > 2000;
  res.json({
    success: true,
    fileName: 'co-phuong.webp',
    diskPath: 'public/assets/co-phuong.webp',
    canonicalUrl: '/assets/co-phuong.webp',
    exists,
    sizeBytes: size,
    hasRealPhoto,
    serverProfile: teacherProfile
  });
});

// Endpoint to upload and persist teacher photo file to server
app.post('/api/teacher/upload-photo', (req: Request, res: Response) => {
  try {
    const { imageBase64, position = 'hero' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Chưa có dữ liệu ảnh.' });
    }

    const matches = imageBase64.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    const base64Data = matches ? matches[2] : imageBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    const prefix = position === 'footer' ? 'co-phuong-footer' : 'co-phuong-hero';

    // Save as permanent real asset on disk: public/assets/[prefix].jpg and [prefix].webp
    const jpgPath = path.join(assetsDir, `${prefix}.jpg`);
    const webpPath = path.join(assetsDir, `${prefix}.webp`);
    fs.writeFileSync(jpgPath, buffer);
    fs.writeFileSync(webpPath, buffer);

    // Also update legacy/fallback file
    fs.writeFileSync(path.join(assetsDir, 'co-phuong.webp'), buffer);

    // If dist/assets exists (production build), mirror it there immediately
    const distAssetsDir = path.join(distDir, 'assets');
    if (fs.existsSync(distAssetsDir)) {
      fs.writeFileSync(path.join(distAssetsDir, `${prefix}.jpg`), buffer);
      fs.writeFileSync(path.join(distAssetsDir, `${prefix}.webp`), buffer);
      fs.writeFileSync(path.join(distAssetsDir, 'co-phuong.webp'), buffer);
    }

    // Set permanent URL
    const photoUrl = `/assets/${prefix}.jpg?v=${Date.now()}`;
    if (position === 'footer') {
      teacherProfile.footerPhoto = photoUrl;
    } else {
      teacherProfile.heroPhoto = photoUrl;
    }
    teacherProfile.hasRealPhoto = true;
    teacherProfile.updatedAt = new Date().toISOString();
    saveTeacherProfile(teacherProfile);

    res.json({ success: true, photoUrl, position, profile: teacherProfile });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Lỗi lưu ảnh máy chủ' });
  }
});

// Health and AI configuration check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Endpoint to analyze uploaded textbook or document using Gemini
app.post('/api/ai/analyze-document', async (req: Request, res: Response) => {
  try {
    const { fileName, textContent, imageBase64, mimeType } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'Khóa GEMINI_API_KEY chưa được cấu hình. Hệ thống sử dụng bộ phân tích nội bộ chuẩn SGK.'
      });
    }

    const ai = new GoogleGenAI({});
    const systemPrompt = `Bạn là chuyên gia sư phạm Toán tiểu học theo Chương trình GDPT 2018 Việt Nam (Sách Kết nối tri thức với cuộc sống).
Nhiệm vụ: Phân tích tài liệu sách giáo khoa Toán lớp 1 và trích xuất cấu trúc bài học, mục tiêu, kiến thức và bài tập theo định dạng JSON chuẩn.

Hãy trả về DUY NHẤT một JSON hợp lệ (không kèm markdown ngoài khối json) theo cấu trúc:
{
  "bookTitle": "Tên sách hoặc tài liệu",
  "semester": 1,
  "topicName": "Tên chủ đề",
  "lessonNumber": 1,
  "lessonTitle": "Tên bài học",
  "pageRange": "Trang 8-10",
  "learningObjectives": ["Nhận biết số lượng...", "Đọc, viết số..."],
  "coreKnowledge": "Kiến thức trọng tâm tóm tắt ngắn gọn",
  "examples": [
    {"description": "Ví dụ 1", "illustrationType": "fruits", "calculation": "3 + 2 = 5"}
  ],
  "exercises": [
    {
      "id": "ex_1",
      "type": "multiple_choice",
      "level": "Cơ bản",
      "question": "Quan sát và chọn số tương ứng:",
      "svgType": "apples",
      "svgCount": 4,
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4",
      "explanation": "Đếm có đúng 4 quả táo đỏ."
    }
  ],
  "needsReview": false,
  "reviewNotes": ""
}`;

    const contents: any[] = [];
    if (textContent) {
      contents.push({ text: `Tài liệu: ${fileName}\n\nNội dung văn bản:\n${textContent}` });
    }
    if (imageBase64 && mimeType) {
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:[^;]+;base64,/, '')
        }
      });
      contents.push({ text: `Hãy đọc trang sách/hình ảnh này của tài liệu "${fileName}" và trích xuất theo định dạng JSON.` });
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu văn bản hoặc hình ảnh để phân tích.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json'
      }
    });

    const outputText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      // Clean up markdown block if wrapped
      const cleanJson = outputText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      parsedData = JSON.parse(cleanJson);
    }

    return res.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error('Error analyzing document with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi phân tích bằng AI. Vui lòng thử lại hoặc sử dụng dữ liệu trích xuất chuẩn.'
    });
  }
});

// Endpoint to generate new customized grade 1 exercises
app.post('/api/ai/generate-exercises', async (req: Request, res: Response) => {
  try {
    const { topic, lessonTitle, difficulty = 'Luyện tập', count = 5 } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'Chế độ tạo câu hỏi tiêu chuẩn GDPT 2018.'
      });
    }

    const ai = new GoogleGenAI({});
    const prompt = `Tạo ${count} câu hỏi bài tập Toán lớp 1 chuẩn GDPT 2018.
Chủ đề: ${topic || 'Các số từ 0 đến 10'}
Bài học: ${lessonTitle || 'Phép cộng trong phạm vi 10'}
Mức độ: ${difficulty} (Cơ bản / Luyện tập / Thử thách)

Quy tắc bắt buộc:
1. Phù hợp 100% với học sinh 6-7 tuổi Việt Nam.
2. Không cho số âm, không vượt quá phạm vi bài học (nếu HK1 tối đa 10, nếu HK2 tối đa 100 không nhớ).
3. Câu hỏi về hình phải nêu rõ loại hình (square, circle, triangle, rectangle, cube, cuboid).
4. Công thức toán viết rõ ràng dạng văn bản: ví dụ "4 + 3 = ?", "5 > 3".

Trả về DUY NHẤT mảng JSON:
[
  {
    "id": "gen_1",
    "type": "multiple_choice | fill_blank | compare | count_items | geometry",
    "level": "${difficulty}",
    "question": "Câu hỏi...",
    "svgType": "apples | chicks | fish | shapes | number_line | blocks",
    "svgCount": 5,
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "Giải thích ngắn gọn, dễ hiểu cho bé"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const outputText = response.text || '[]';
    let exercises = [];
    try {
      exercises = JSON.parse(outputText);
    } catch {
      const cleanJson = outputText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      exercises = JSON.parse(cleanJson);
    }

    return res.json({
      success: true,
      exercises
    });
  } catch (error: any) {
    console.error('Error generating exercises with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
