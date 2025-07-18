"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatisticsTimeSeriesItem } from "@/types/statistics";
import { prepareTrendChartData, getTrendChartConfig, formatChartDate } from "@/lib/statistics-utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface DashboardTrendChartProps {
  timeSeries: StatisticsTimeSeriesItem[];
}

export function DashboardTrendChart({ timeSeries }: DashboardTrendChartProps) {
  const chartData = prepareTrendChartData(timeSeries);
  const chartConfig = getTrendChartConfig() satisfies ChartConfig;

  if (!timeSeries || timeSeries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>发送量趋势</CardTitle>
          <CardDescription>最近时间段的邮件发送和打开趋势</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">暂无数据</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>发送量趋势</CardTitle>
        <CardDescription>
          最近 {timeSeries.length} 天的邮件发送和打开趋势
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatChartDate}
            />
            <YAxis yAxisId="count" orientation="left" />
            <YAxis yAxisId="rate" orientation="right" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="views"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              yAxisId="count"
              type="monotone"
              dataKey="发送量"
              stroke="var(--color-发送量)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="打开率"
              stroke="var(--color-打开率)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 