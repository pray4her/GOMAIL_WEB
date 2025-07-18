"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // 导入 js-cookie

// 定义 Context 中值的类型
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// 创建 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 定义 Provider 的 props 类型
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // 在组件首次加载时，检查 Cookie 是否有已存储的 token
  useEffect(() => {
    const storedToken = Cookies.get("gomail_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // 登录方法
  const login = (newToken: string) => {
    setToken(newToken);
    // 设置 cookie，可以根据需要配置过期时间等选项
    Cookies.set("gomail_token", newToken, { expires: 7, path: '/' });
  };

  // 登出方法
  const logout = () => {
    setToken(null);
    Cookies.remove("gomail_token", { path: '/' });
    router.push("/auth/login"); // 登出后重定向到登录页
  };

  const isAuthenticated = !!token;

  const value = {
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 创建一个自定义 Hook，方便子组件消费 Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth 必须在 AuthProvider 内部使用");
  }
  return context;
}; 