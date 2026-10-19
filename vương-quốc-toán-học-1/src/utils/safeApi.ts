// Utility for safe API calling and resilient teacher photo storage
// Specifically designed for Vercel, static SPA hosting, and Node/Express environments

export interface SafeApiResponse<T = any> {
  ok: boolean;
  status: number;
  contentType: string;
  data: T | null;
  rawText?: string;
  errorType?: 'NETWORK_ERROR' | 'HTTP_404' | 'HTTP_405' | 'HTTP_AUTH' | 'HTTP_500' | 'INVALID_JSON' | 'UNKNOWN';
  errorMessage?: string;
}

/**
 * Safely executes a fetch request and inspects headers, status code, and content type
 * before attempting to parse JSON. Prevents crashes like:
 * "Unexpected token 'T', 'The page c'... is not valid JSON"
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeApiResponse<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const status = res.status;

    // Check if response is JSON
    if (contentType.includes('application/json')) {
      try {
        const json = await res.json();
        if (res.ok) {
          return {
            ok: true,
            status,
            contentType,
            data: json
          };
        } else {
          return {
            ok: false,
            status,
            contentType,
            data: json,
            errorType: status >= 500 ? 'HTTP_500' : status === 401 || status === 403 ? 'HTTP_AUTH' : 'UNKNOWN',
            errorMessage: json.error || json.message || `Máy chủ trả về mã lỗi HTTP ${status}`
          };
        }
      } catch (jsonErr: any) {
        return {
          ok: false,
          status,
          contentType,
          data: null,
          errorType: 'INVALID_JSON',
          errorMessage: `Không thể đọc dữ liệu JSON từ phản hồi: ${jsonErr.message}`
        };
      }
    }

    // Response is NOT JSON (e.g. text/html on 404 or Vercel static routing)
    const rawText = await res.text();

    if (status === 404) {
      return {
        ok: false,
        status: 404,
        contentType,
        data: null,
        rawText,
        errorType: 'HTTP_404',
        errorMessage: 'Lỗi 404: Đường dẫn API không tồn tại trên máy chủ hosting Vercel.'
      };
    }

    if (status === 405) {
      return {
        ok: false,
        status: 405,
        contentType,
        data: null,
        rawText,
        errorType: 'HTTP_405',
        errorMessage: 'Lỗi 405: Phương thức (POST/GET) không được máy chủ hỗ trợ.'
      };
    }

    if (status === 401 || status === 403) {
      return {
        ok: false,
        status,
        contentType,
        data: null,
        rawText,
        errorType: 'HTTP_AUTH',
        errorMessage: `Lỗi ${status}: Không có quyền truy cập vào máy chủ.`
      };
    }

    if (status >= 500) {
      return {
        ok: false,
        status,
        contentType,
        data: null,
        rawText,
        errorType: 'HTTP_500',
        errorMessage: `Lỗi 500: Máy chủ gặp sự cố xử lý nội bộ (Internal Server Error).`
      };
    }

    // Otherwise received HTML or other text when expecting JSON
    const preview = rawText.slice(0, 60).replace(/\s+/g, ' ');
    return {
      ok: false,
      status,
      contentType,
      data: null,
      rawText,
      errorType: 'INVALID_JSON',
      errorMessage: `Máy chủ trả về văn bản/HTML (${contentType || 'không rõ'}) thay vì JSON: "${preview}..."`
    };
  } catch (netErr: any) {
    return {
      ok: false,
      status: 0,
      contentType: '',
      data: null,
      errorType: 'NETWORK_ERROR',
      errorMessage: `Lỗi kết nối mạng: Không thể liên lạc với máy chủ (${netErr.message || 'Mất kết nối Internet'}).`
    };
  }
}

/**
 * Compresses an image data URL using an HTML5 Canvas to WebP/JPEG format
 * under ~100KB, ensuring it fits comfortably in localStorage without quota issues.
 */
export async function compressImageDataUrl(
  dataUrl: string,
  maxWidth = 1000,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  // If it's a relative path like /assets/co-phuong.webp, return as is
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressed = canvas.toDataURL('image/webp', quality);
        resolve(compressed);
      } catch {
        try {
          const fallback = canvas.toDataURL('image/jpeg', quality);
          resolve(fallback);
        } catch {
          resolve(dataUrl);
        }
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

const DB_NAME = 'the_gioi_toan_1_db';
const STORE_NAME = 'teacher_assets';

function openIndexedDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Stores large raw photo in IndexedDB for permanent browser cache
 */
export async function savePhotoToIndexedDb(key: string, dataUrl: string): Promise<boolean> {
  try {
    const db = await openIndexedDb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Retrieves raw photo from IndexedDB
 */
export async function getPhotoFromIndexedDb(key: string): Promise<string | null> {
  try {
    const db = await openIndexedDb();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
