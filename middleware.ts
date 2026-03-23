import createMiddleware from 'next-intl/middleware';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['ar', 'en', 'fr'],
  defaultLocale: 'ar',
  localePrefix: 'always',
});

export default async function middleware(req: NextRequest) {
  const response = intlMiddleware(req);
  const supabase = createMiddlewareSupabaseClient({ req, res: response });
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const protectedPaths = ['/consultant', '/defense', '/judge', '/analyst', '/financial-analyzer', '/consultation', '/dashboard', '/admin', '/templates'];
  const pathWithoutLocale = pathname.replace(/^\/(ar|en|fr)/, '');

  if (protectedPaths.some(p => pathWithoutLocale.startsWith(p)) && !session) {
    const locale = pathname.split('/')[1] || 'ar';
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};