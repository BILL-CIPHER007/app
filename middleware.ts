
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/login', '/register'];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Verificar se o usuário tem token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Para verificação detalhada do token, deixamos para as páginas
  // fazerem via API call, pois o Edge Runtime não suporta jwt/bcrypt
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
