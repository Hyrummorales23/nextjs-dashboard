import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 60, // 30 minutes in seconds
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      console.log('🔐 Auth Check:', {
        pathname: nextUrl.pathname,
        isOnDashboard,
        isLoggedIn,
        hasUser: !!auth?.user,
        user: auth?.user
      });

      if (isOnDashboard) {
        if (isLoggedIn) {
          console.log('✅ Access granted to dashboard');
         return true;
        }
        console.log('❌ Redirecting to login - not authenticated');
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log('🔄 Redirecting logged in user to dashboard');
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      console.log('✅ Public route access granted');
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;