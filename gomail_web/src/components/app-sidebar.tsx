"use client"

import * as React from "react"
import {
  Cloud,
  Users,
  UserCheck,
  UsersRound,
  Mail,
  Send,
  Home,
} from "lucide-react"

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// 导航数据配置
const navigationItems = [
  {
    title: "账号管理",
    items: [
      {
        title: "云账号管理",
        url: "/dashboard/accounts",
        icon: Cloud,
      },
      {
        title: "发件人管理", 
        url: "/dashboard/senders",
        icon: Users,
      },
    ],
  },
  {
    title: "内容管理",
    items: [
      {
        title: "收件人管理",
        url: "/dashboard/recipients", 
        icon: UserCheck,
      },
      {
        title: "收件人分群",
        url: "/dashboard/recipient-groups",
        icon: UsersRound,
      },
      {
        title: "邮件模板",
        url: "/dashboard/templates",
        icon: Mail,
      },
    ],
  },
  {
    title: "任务管理",
    items: [
      {
        title: "邮件任务",
        url: "/dashboard/tasks",
        icon: Send,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  // 路径匹配逻辑
  const isActive = (url: string) => {
    // 完全匹配，或者对于父路由，路径以其开头
    return pathname === url || (url !== "/dashboard" && pathname.startsWith(url))
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Mail className="h-6 w-6" />
          <h2 className="text-lg font-semibold">GOMail</h2>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                <span>总览</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
        {navigationItems.map((group, index) => (
          <React.Fragment key={group.title}>
            <SidebarGroup>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                      >
                        <Link href={item.url}>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index < navigationItems.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  )
} 