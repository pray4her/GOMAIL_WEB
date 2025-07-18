import useSWR from "swr";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export interface Task {
  id: number;
  task_name: string;
  status: "pending" | "dispatching" | "sending" | "completed" | "failed";
  created_at: string;
  scheduled_at: string;
  // 添加其他可能的字段
  recipient_group_id?: number;
  template_id?: number;
  subject?: string;
  body?: string;
}

export interface PaginatedTasks {
  records: Task[];
  pagination: {
    page: number;
    pageSize: number;
    total_records: number;
    total_pages: number;
  };
}

interface UseTasksProps {
  page?: number;
  pageSize?: number;
  fallbackData?: PaginatedTasks;
}

export function useTasks({ 
  page = 1, 
  pageSize = 10, 
  fallbackData 
}: UseTasksProps = {}) {
  const SWR_KEY = [`/tasks`, page, pageSize];

  const { data, error, isLoading, mutate } = useSWR<PaginatedTasks>(
    SWR_KEY,
    async () => {
      const response = await apiClient.get(`/tasks?page=${page}&pageSize=${pageSize}`);
      
      // 处理API响应结构
      if (response && typeof response === 'object') {
        // 如果响应中有tasks和pagination字段
        if ('tasks' in response && 'pagination' in response) {
          const responseData = response as any; // 临时使用any来处理类型问题
          return {
            records: responseData.tasks as Task[],
            pagination: {
              page: responseData.pagination.page,
              pageSize: responseData.pagination.pageSize || responseData.pagination.page_size,
              total_records: responseData.pagination.total || responseData.pagination.total_records,
              total_pages: responseData.pagination.total_pages,
            },
          };
        }
        // 如果响应直接是数组（无分页信息）
        if (Array.isArray(response)) {
          return {
            records: response,
            pagination: {
              page: 1,
              pageSize: response.length,
              total_records: response.length,
              total_pages: 1,
            },
          };
        }
      }
      
      // 默认返回空结果
      return {
        records: [],
        pagination: {
          page: 1,
          pageSize: 10,
          total_records: 0,
          total_pages: 0,
        },
      };
    },
    {
      fallbackData,
      keepPreviousData: true,
      onError: (error) => {
        console.error("Failed to fetch tasks:", error);
        toast.error("获取任务列表失败");
      },
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
} 