import { NextRequest, NextResponse } from 'next/server';
import { getIconById } from '@/lib/storage/icon-store';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !id.startsWith('ico_')) {
    return NextResponse.json({ error: 'Invalid icon ID' }, { status: 400 });
  }

  const icon = getIconById(id);

  if (!icon) {
    return NextResponse.json({ error: 'Icon not found' }, { status: 404 });
  }

  const { mimeType, buffer, isBase64 } = icon;

  let ab: ArrayBuffer;
  if (isBase64 && typeof buffer === 'string') {
    const buf = Buffer.from(buffer, 'base64');
    ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } else {
    const buf = Buffer.from(buffer as string, 'utf-8');
    ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }

  return new Response(ab, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
