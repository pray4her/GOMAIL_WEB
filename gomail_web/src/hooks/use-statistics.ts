"use client";

import useSWR from "swr";
import apiClient from "@/lib/api-client";
import { StatisticsData, UseStatisticsParams } from "@/types/statistics";

// API 数据获取函数
const fetcher = async (url: string): Promise<StatisticsData> => {
  return apiClient.get(url);
};

// 构建查询字符串
function buildStatisticsUrl(params?: UseStatisticsParams): string {
  const baseUrl = "/statistics";
  
  if (!params) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  
  if (params.start_date) {
    searchParams.append("start_date", params.start_date);
  }
  
  if (params.end_date) {
    searchParams.append("end_date", params.end_date);
  }
  
  if (params.account_id) {
    searchParams.append("account_id", params.account_id.toString());
  }
  
  if (params.account_sender_id) {
    searchParams.append("account_sender_id", params.account_sender_id.toString());
  }
  
  if (params.group_by) {
    searchParams.append("group_by", params.group_by);
  }

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

// 主要的 Hook
export function useStatistics(
  params?: UseStatisticsParams,
  fallbackData?: StatisticsData
) {
  const url = buildStatisticsUrl(params);
  
  const { data, error, isLoading, mutate } = useSWR<StatisticsData>(
    url,
    fetcher,
    {
      fallbackData,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 5 * 60 * 1000, // 5分钟自动刷新
    }
  );

  return {
    statistics: data,
    isLoading,
    isError: error,
    mutate,
    refresh: () => mutate(),
  };
}

// 获取默认统计数据（最近30天）
export function useDefaultStatistics(fallbackData?: StatisticsData) {
  return useStatistics(undefined, fallbackData);
} 