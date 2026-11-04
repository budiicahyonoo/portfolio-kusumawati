import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ error: 'Filename or body is missing' }, { status: 400 });
  }

  try {
    // TAMBAHKAN addRandomSuffix: true DI SINI 👇
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: true, // Ini kuncinya! Biar Vercel otomatis kasih akhiran unik
    });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}