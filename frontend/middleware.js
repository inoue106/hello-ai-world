import { getToken } from 'next-auth/jwt';

/** 認証不要なパス（ここだけ通過、他は全て認証必須） */
function isPublic(pathname) {
  if (pathname.startsWith('/api/auth')) return true;
  if (pathname === '/api/health') return true;
  if (pathname === '/auth/signin') return true;
  return false;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (isPublic(pathname)) return;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return Response.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてにマッチ:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico, 画像など
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
