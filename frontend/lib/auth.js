import GoogleProvider from 'next-auth/providers/google';

/**
 * 許可するメールドメイン（環境変数 ALLOWED_EMAIL_DOMAIN）
 * 例: "company.com" または "company.com,other.com"
 * 
 * TODO: メールアドレスの収集・利用目的について、プライバシーポリシー等でユーザーに明示してください。
 */
function getAllowedDomains() {
  const raw = process.env.ALLOWED_EMAIL_DOMAIN || '';
  return raw
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1日
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== 'google' || !profile?.email) return false;
      const domains = getAllowedDomains();
      if (domains.length === 0) return true; // 未設定の場合は全ドメイン許可
      const email = profile.email.toLowerCase();
      const allowed = domains.some((d) => email.endsWith('@' + d));
      return !!profile.email_verified && allowed;
    },
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
