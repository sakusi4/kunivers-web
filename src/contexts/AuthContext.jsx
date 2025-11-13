import { createContext, useContext, useState, useEffect } from 'react';
import { loginWithGoogle, logout as apiLogout } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 토큰과 유저 정보 복원
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const handleGoogleLogin = async (idToken) => {
    try {
      const response = await loginWithGoogle(idToken);

      // 토큰과 유저 정보 저장
      setToken(response.access_token);
      setUser(response.user);

      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      if (token) {
        await apiLogout(token);
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // API 실패해도 로컬 데이터는 지움
    } finally {
      // 로컬 상태 및 스토리지 정리
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login: handleGoogleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

