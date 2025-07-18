"use client";

import { useState } from "react";
import { StatisticsData } from "@/types/statistics";
import { useDefaultStatistics } from "@/hooks/use-statistics";
import { DashboardStatsCards } from "./dashboard-stats-cards";
import { DashboardTrendChart } from "./dashboard-trend-chart";
import { DashboardSenderChart } from "./dashboard-sender-chart";
import { DashboardTimeSelector } from "./dashboard-time-selector";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardClientWrapperProps {
  initialData: StatisticsData | null;
}

export function DashboardClientWrapper({ initialData }: DashboardClientWrapperProps) {
  const [selectedRange, setSelectedRange] = useState("30");
  
  // 使用SWR进行客户端数据管理，初始数据作为fallback
  const { statistics, isLoading, isError } = useDefaultStatistics(initialData || undefined);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    // TODO: 在这里可以添加根据时间范围重新获取数据的逻辑
    console.log("Time range changed:", range);
  };

  if (isError || (!isLoading && !statistics && !initialData)) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          加载数据时出错，请刷新页面重试
        </p>
      </div>
    );
  }

  const currentData = statistics || initialData;

  if (!currentData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          暂无统计数据
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI 指标卡片 */}
      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <DashboardStatsCards summary={currentData.summary} />
      )}

      {/* 趋势图表 */}
      {isLoading ? (
        <Skeleton className="h-[350px] w-full" />
      ) : (
        <DashboardTrendChart timeSeries={currentData.time_series} />
      )}

      {/* 底部分析区域 */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* 发件人对比图 */}
        <div className="md:col-span-3">
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <DashboardSenderChart bySender={currentData.by_sender} />
          )}
        </div>

        {/* 时间选择器 */}
        <div className="md:col-span-1">
          <DashboardTimeSelector 
            selectedRange={selectedRange} 
            onRangeChange={handleRangeChange} 
          />
        </div>
      </div>
    </div>
  );
} 