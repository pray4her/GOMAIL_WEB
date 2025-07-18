import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 从 cookie 中获取 token
  const token = request.cookies.get("gomail_token")?.value;

  const { pathname } = request.nextUrl;

  // 如果用户未认证
  if (!token) {
    // 并且试图访问受保护的 /dashboard 路径
    if (pathname.startsWith("/dashboard")) {
      // 重定向到登录页
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  } else {
    // 如果用户已认证
    // 并且试图访问登录页
    if (pathname === "/auth/login") {
      // 重定向到仪表盘
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // 其他情况，继续请求
  return NextResponse.next();
}

// 定义中间件需要匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配除了以下路径之外的所有请求路径:
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 