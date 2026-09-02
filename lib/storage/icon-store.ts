import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Use /tmp for serverless storage on Vercel / Linux, or fallback to local .cache
const CACHE_DIR = process.env.VERCEL ? '/tmp/hyggshi-icons' : path.join(process.cwd(), '.cache', 'icons');

// In-memory LRU map for ultra-fast response
const MEMORY_CACHE = new Map<string, { mimeType: string; data: Buffer | string }>();

function ensureDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  } catch {
    // ignore
  }
}

/**
 * Generate a short, deterministic 8-character ID from icon content
 */
export function generateIconId(content: string): string {
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
  return `ico_${hash}`;
}

/**
 * Save icon content and return its short ID
 */
export function saveIcon(content: string): { id: string; mimeType: string } {
  let mimeType = 'image/png';
  let rawData = content;

  if (content.startsWith('data:')) {
    const match = content.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      rawData = match[2];
    } else {
      const utf8Match = content.match(/^data:([^;]+);utf8,(.+)$/);
      if (utf8Match) {
        mimeType = utf8Match[1];
        rawData = decodeURIComponent(utf8Match[2]);
      }
    }
  } else if (content.trim().startsWith('<svg') || content.trim().startsWith('<?xml')) {
    mimeType = 'image/svg+xml';
  }

  const id = generateIconId(content);

  // Store in memory
  MEMORY_CACHE.set(id, { mimeType, data: rawData });

  // Store on disk
  try {
    ensureDir();
    const metaPath = path.join(CACHE_DIR, `${id}.json`);
    const filePath = path.join(CACHE_DIR, `${id}.dat`);
    fs.writeFileSync(metaPath, JSON.stringify({ mimeType }), 'utf-8');
    fs.writeFileSync(filePath, rawData, 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk cache:', err);
  }

  return { id, mimeType };
}

/**
 * Retrieve icon by short ID
 */
export function getIconById(id: string): { mimeType: string; buffer: Buffer | string; isBase64: boolean } | null {
  // Check memory
  if (MEMORY_CACHE.has(id)) {
    const item = MEMORY_CACHE.get(id)!;
    const isBase64 = typeof item.data === 'string' && !item.data.startsWith('<');
    return { mimeType: item.mimeType, buffer: item.data, isBase64 };
  }

  // Check disk
  try {
    ensureDir();
    const metaPath = path.join(CACHE_DIR, `${id}.json`);
    const filePath = path.join(CACHE_DIR, `${id}.dat`);

    if (fs.existsSync(metaPath) && fs.existsSync(filePath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const isBase64 = !rawData.startsWith('<');
      MEMORY_CACHE.set(id, { mimeType: meta.mimeType, data: rawData });
      return { mimeType: meta.mimeType, buffer: rawData, isBase64 };
    }
  } catch (err) {
    console.warn('Could not read from disk cache:', err);
  }

  return null;
}
