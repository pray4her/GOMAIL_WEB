"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsSummary } from "@/types/statistics";
import { formatNumber, formatPercentage, getKPIDisplayConfig } from "@/lib/statistics-utils";

interface DashboardStatsCardsProps {
  summary: StatisticsSummary;
}

export function DashboardStatsCards({ summary }: DashboardStatsCardsProps) {
  const kpiConfig = getKPIDisplayConfig();

  const getKPIValue = (key: string, isPercentage: boolean = false) => {
    const value = summary[key as keyof StatisticsSummary] as number;
    return isPercentage ? formatPercentage(value) : formatNumber(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiConfig.map((kpi) => (
        <Card key={kpi.key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getKPIValue(kpi.key, kpi.isPercentage)}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpi.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 