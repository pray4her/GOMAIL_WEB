"use client"; // 将整个布局文件标记为客户端组件

import React from "react";
import { useAuth } from "@/providers/auth-provider"; // 导入 useAuth
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Header 组件现在需要使用 useAuth，因此也必须是客户端组件
const Header = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <div className="flex flex-1 items-center justify-between">
        <div>{/* 其他头部内容，例如面包屑导航 */}</div>
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <span>用户信息</span>
            <button
              onClick={logout}
              className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
            >
              登出
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "200px",
          "--sidebar-width-mobile": "200px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
} 