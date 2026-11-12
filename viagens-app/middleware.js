import { NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { podeAcessarApi } from '@/lib/permissions';

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/register',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths and Next.js internals
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/api/') && !podeAcessarApi(user.perfil, request.method, pathname)) {
    return NextResponse.json({ error: 'Seu perfil não tem permissão para esta ação.' }, { status: 403 });
  }

  if (pathname === '/usuarios' && user.perfil !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const res = NextResponse.next();
  res.headers.set('x-user-id', String(user.id));
  res.headers.set('x-user-nome', user.nome || '');
  res.headers.set('x-user-perfil', user.perfil || '');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};