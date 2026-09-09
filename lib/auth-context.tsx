'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  role: 'guest' | 'customer' | 'admin';
  sessionId: string;
  login: (email: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string, phone?: string, address?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'guest' | 'customer' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Generate or read persistent session ID
    let sid = localStorage.getItem('aquavibe_session_id');
    if (!sid) {
      sid = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem('aquavibe_session_id', sid);
    }
    setSessionId(sid);

    // Load saved user
    const savedUser = localStorage.getItem('aquavibe_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const login = async (email: string, name?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, name })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('aquavibe_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const register = async (name: string, email: string, phone?: string, address?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, email, phone, address })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('aquavibe_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aquavibe_user');
  };

  const switchRole = (newRole: 'guest' | 'customer' | 'admin') => {
    if (newRole === 'guest') {
      logout();
    } else if (newRole === 'customer') {
      const customerUser: User = {
        id: 'usr-customer-1',
        name: 'Nguyễn Văn Hùng (Khách quen)',
        email: 'hung.nguyen@example.com',
        phone: '0908123456',
        address: '124 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
        city: 'Hồ Chí Minh',
        role: 'customer',
        createdAt: '2026-02-15T00:00:00Z'
      };
      setUser(customerUser);
      localStorage.setItem('aquavibe_user', JSON.stringify(customerUser));
    } else if (newRole === 'admin') {
      const adminUser: User = {
        id: 'usr-admin-1',
        name: 'Admin Quản Trị Hệ Thống',
        email: 'admin@aquavibe.vn',
        phone: '0988888999',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z'
      };
      setUser(adminUser);
      localStorage.setItem('aquavibe_user', JSON.stringify(adminUser));
    }
  };

  const role: 'guest' | 'customer' | 'admin' = user ? user.role : 'guest';

  return (
    <AuthContext.Provider value={{ user, role, sessionId, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
