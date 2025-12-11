import type { NextAuthConfig } from 'next-auth';

// This is a lightweight config for middleware (Edge Runtime)
// Does NOT import Prisma or bcrypt
export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnSeller = nextUrl.pathname.startsWith('/seller');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnSeller) {
        if (!isLoggedIn) return false;
        if (auth.user.role !== 'SELLER' && auth.user.role !== 'ADMIN') {
          return false;
        }
      }

      if (isOnAdmin) {
        if (!isLoggedIn) return false;
        if (auth.user.role !== 'ADMIN') return false;
      }

      return true;
    },
  },
  providers: [], // Providers will be added in the full config
} satisfies NextAuthConfig;