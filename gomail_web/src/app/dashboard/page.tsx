import { Suspense } from "react";
import { cookies } from "next/headers";
import { Skeleton } from "@/components/ui/skeleton";
import { StatisticsData } from "@/types/statistics";
import { validateStatisticsData } from "@/lib/statistics-utils";
import { DashboardClientWrapper } from "./components/dashboard-client-wrapper";
// import { transformStatisticsData } from "@/lib/data-adapter";

// 明确声明此页面需要动态渲染（因为使用了 cookies）
export const dynamic = 'force-dynamic';

// 服务端获取统计数据
async function getStatisticsData(): Promise<StatisticsData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gomail_token")?.value;

    if (!token) {
      console.error("No authentication token found");
      return null;
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
    const response = await fetch(`${baseURL}/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: "no-store", // 确保获取最新数据
    });

    if (!response.ok) {
      console.error("Failed to fetch statistics:", response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    
    // 处理API响应格式
    if (result.error) {
      console.error("API Error:", result.error);
      return null;
    }

    const rawData = result.data || result;
    // const transformedData = transformStatisticsData(rawData);

    if (validateStatisticsData(rawData)) {
      return rawData;
    }
    
    console.error("Raw data is invalid");
    return null;
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const statistics = await getStatisticsData();

  if (!statistics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
          <p className="text-muted-foreground">
            查看您的邮件发送统计数据和趋势分析
          </p>
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            无法加载统计数据，请稍后重试或检查服务器连接
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground">
          查看您的邮件发送统计数据和趋势分析
        </p>
      </div>

      {/* 客户端包装组件处理所有交互 */}
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <DashboardClientWrapper initialData={statistics} />
      </Suspense>
    </div>
  );
} 