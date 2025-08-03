'use client';

import { SessionProvider } from 'next-auth/react';
import AuthProvider from '../contexts/AuthContext';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
} 