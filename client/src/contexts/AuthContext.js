'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        provider: session.user.provider || 'credentials'
      });
    } else {
      setUser(null);
    }

    setIsLoading(false);
  }, [session, status]);

  const login = async (provider = 'credentials', credentials = null) => {
    try {
      if (provider === 'credentials' && credentials) {
        const result = await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });
        
        if (result?.error) {
          throw new Error(result.error);
        }
        
        return result;
      } else {
        await signIn(provider);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const requireAuth = (callback) => {
    if (!user) {
      router.push('/');
      return false;
    }
    return callback ? callback() : true;
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    requireAuth,
    status
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 