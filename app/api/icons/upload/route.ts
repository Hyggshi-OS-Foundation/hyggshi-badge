import { NextRequest, NextResponse } from 'next/server';
import { saveIcon } from '@/lib/storage/icon-store';

export const runtime = 'nodejs'; // Needs fs module

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let iconContent: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const file = form.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const maxSize = 512 * 1024; // 512 KB
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'File too large (max 512 KB)' }, { status: 413 });
      }

      const allowed = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'image/x-icon'];
      const mimeType = file.type || 'application/octet-stream';
      if (!allowed.some(t => mimeType.startsWith(t.split('/')[0])) && !mimeType.includes('svg')) {
        return NextResponse.json({ error: 'Unsupported file type. Allowed: SVG, PNG, JPG, WebP' }, { status: 400 });
      }

      if (mimeType === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        iconContent = await file.text();
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        iconContent = `data:${mimeType};base64,${base64}`;
      }

    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      const { dataUri, url } = body;

      if (dataUri) {
        iconContent = dataUri;
      } else if (url) {
        // Validate it's a real HTTP URL (not internal)
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(url);
        } catch {
          return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          return NextResponse.json({ error: 'Only http/https URLs allowed' }, { status: 400 });
        }
        iconContent = url;
      }
    }

    if (!iconContent) {
      return NextResponse.json({ error: 'No icon content provided' }, { status: 400 });
    }

    const { id, mimeType } = saveIcon(iconContent);

    return NextResponse.json({
      id,
      mimeType,
      iconParam: id, // Use this as ?icon=ico_XXXXXXXX in badge URL
    });

  } catch (err) {
    console.error('Icon upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
