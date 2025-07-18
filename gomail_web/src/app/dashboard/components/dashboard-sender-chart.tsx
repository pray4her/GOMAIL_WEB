"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatisticsBySenderItem } from "@/types/statistics";
import { prepareSenderChartData } from "@/lib/statistics-utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface DashboardSenderChartProps {
  bySender: StatisticsBySenderItem[];
}

const chartConfig = {
  发送量: {
    label: "发送量",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function DashboardSenderChart({ bySender }: DashboardSenderChartProps) {
  const chartData = prepareSenderChartData(bySender, 8);

  if (!bySender || bySender.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>发件人对比</CardTitle>
          <CardDescription>各发件人的发送量对比</CardDescription>
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
        <CardTitle>发件人对比</CardTitle>
        <CardDescription>
          前 {Math.min(bySender.length, 8)} 个发件人的发送量对比
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="sender"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="发送量"
                  labelFormatter={(label) => `发件人: ${label}`}
                />
              }
            />
            <Bar
              dataKey="发送量"
              fill="var(--color-发送量)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 