import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../lib/db';
import User from '../../../../lib/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Connect to database
          await connectDB();

          // Find user by email
          const user = await User.findOne({ email: credentials?.email });
          
          if (!user) {
            // Check for demo user
            if (credentials?.email === 'demo@example.com' && credentials?.password === 'demo123') {
              return {
                id: '688e00ea9f3c26b75e6b53e8',
                name: 'Demo User',
                email: 'demo@example.com',
                image: null
              };
            }
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials?.password || '', user.password);
          
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 