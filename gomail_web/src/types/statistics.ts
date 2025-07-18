export interface StatisticsPeriod {
  start_date: string;
  end_date: string;
  days: number;
}

export interface StatisticsSummary {
  total_sent: number;
  total_opened: number;
  total_unique_opened: number;
  total_clicked: number;
  total_unique_clicked: number;
  total_bounced?: number;
  total_failed?: number;
  overall_open_rate: number;
  overall_unique_open_rate: number;
  overall_click_rate: number;
  overall_unique_click_rate: number;
  open_rate?: number;
  unique_open_rate?: number;
  click_rate?: number;
  unique_click_rate?: number;
  bounce_rate?: number;
  failure_rate?: number;
}

export interface StatisticsTimeSeriesItem {
  date: string;
  sent_count: number;
  open_count: number;
  unique_open_count: number;
  click_count: number;
  unique_click_count: number;
  bounce_count?: number;
  fail_count?: number;
  open_rate: number;
  unique_open_rate: number;
  click_rate: number;
  unique_click_rate: number;
  bounce_rate?: number;
  failure_rate?: number;
}

export interface StatisticsBySenderItem {
  sender_email: string;
  sent_count: number;
  open_count: number;
  unique_open_count: number;
  click_count: number;
  unique_click_count: number;
  bounce_count?: number;
  fail_count?: number;
  open_rate: number;
  unique_open_rate: number;
  click_rate: number;
  unique_click_rate: number;
  bounce_rate?: number;
  failure_rate?: number;
}

export interface StatisticsData {
  period: StatisticsPeriod;
  summary: StatisticsSummary;
  time_series: StatisticsTimeSeriesItem[];
  by_sender: StatisticsBySenderItem[];
}

export interface UseStatisticsParams {
  start_date?: string;
  end_date?: string;
  account_id?: number;
  account_sender_id?: number;
  group_by?: 'day' | 'week' | 'month' | 'sender';
} 