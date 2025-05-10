import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('zalama-auth');
  const { pathname } = request.nextUrl;

  // Rediriger vers la page de login si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!isLoggedIn && !publicRoutes.includes(pathname) && !pathname.startsWith('/_next') && !pathname.startsWith('/api') && !pathname.includes('.')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Rediriger vers le dashboard si l'utilisateur est déjà connecté et essaie d'accéder à la page de login
  if (isLoggedIn && publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configuration pour le middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     * - fonts/ (public fonts)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
