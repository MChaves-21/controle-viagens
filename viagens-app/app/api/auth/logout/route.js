import { NextResponse } from 'next/server';
import { COOKIE_NAME, cookieOptions } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { ...cookieOptions(-1) });
  return res;
}
