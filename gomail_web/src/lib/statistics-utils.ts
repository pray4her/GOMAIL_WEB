import { StatisticsData, StatisticsTimeSeriesItem } from "@/types/statistics";

// 格式化数字为千分位显示
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

// 格式化百分比
export function formatPercentage(rate: number, decimals: number = 2): string {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return `0.${'0'.repeat(decimals)}%`;
  }
  return `${(rate * 100).toFixed(decimals)}%`;
}

// 计算变化百分比
export function calculateChangePercentage(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// 格式化变化百分比显示
export function formatChangePercentage(changeRate: number): {
  text: string;
  isPositive: boolean;
  isNegative: boolean;
} {
  const isPositive = changeRate > 0;
  const isNegative = changeRate < 0;
  const prefix = isPositive ? '+' : '';
  
  return {
    text: `${prefix}${changeRate.toFixed(1)}%`,
    isPositive,
    isNegative,
  };
}

// 获取指标的显示配置
export function getKPIDisplayConfig() {
  return [
    {
      key: 'total_sent',
      title: '总发送量',
      description: '所有邮件发送总数',
    },
    {
      key: 'total_unique_opened',
      title: '独立打开数',
      description: '不重复的邮件打开人数',
    },
    {
      key: 'overall_unique_open_rate',
      title: '独立打开率',
      description: '打开邮件的人数占比',
      isPercentage: true,
    },
    {
      key: 'total_unique_clicked',
      title: '独立点击数',
      description: '不重复的邮件点击人数',
    },
  ];
}

interface SenderStat {
  sender_email: string;
  sent_count: number;
  unique_open_rate: number;
}

// 为趋势图准备数据
export function prepareTrendChartData(timeSeries: StatisticsTimeSeriesItem[]) {
  return timeSeries.map(item => ({
    date: item.date,
    发送量: item.sent_count,
    打开率: Math.round(item.unique_open_rate * 100), // 转换为百分比整数
    点击率: Math.round(item.unique_click_rate * 100),
  }));
}

// 为发件人对比图准备数据
export function prepareSenderChartData(bySender: SenderStat[], maxSenders: number = 10) {
  if (!Array.isArray(bySender) || bySender.length === 0) {
    return [];
  }
  
  return bySender
    .slice(0, maxSenders)
    .map(sender => ({
      sender: sender.sender_email.split('@')[0], // 取邮箱用户名部分
      发送量: sender.sent_count,
      打开率: Math.round(sender.unique_open_rate * 100),
    }));
}

// 计算图表的配置
export function getTrendChartConfig() {
  return {
    发送量: {
      label: "发送量",
      color: "var(--chart-1)",
    },
    打开率: {
      label: "打开率 (%)",
      color: "var(--chart-2)",
    },
    点击率: {
      label: "点击率 (%)",
      color: "var(--chart-3)",
    },
  };
}

// 格式化日期显示
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}

// 验证统计数据的完整性
export function validateStatisticsData(data: unknown): data is StatisticsData {
  return !!(
    data &&
    typeof data === 'object' &&
    'summary' in data &&
    typeof (data as { summary: unknown }).summary === 'object' &&
    'period' in data &&
    'time_series' in data && Array.isArray((data as { time_series: unknown }).time_series) &&
    'by_sender' in data && Array.isArray((data as { by_sender: unknown }).by_sender)
  );
} 