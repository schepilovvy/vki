import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Публичные маршруты, которые не требуют аутентификации
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/init-users'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Разрешаем доступ к публичным маршрутам
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Разрешаем доступ к API маршрутам (защита будет на уровне API и клиента)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Для остальных маршрутов защита будет на клиентской стороне через ProtectedRoute
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

