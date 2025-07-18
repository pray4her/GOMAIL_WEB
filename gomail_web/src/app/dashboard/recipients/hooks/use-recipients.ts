import useSWR from 'swr';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

export interface Recipient {
  id: number;
  email: string;
  first_name: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounce' | 'pending';
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PaginatedRecipients {
  records: Recipient[];
  pagination: {
    page: number;
    pageSize: number;
    total_records: number;
    total_pages: number;
  };
}

// 定义一个更通用的筛选类型
export interface RecipientFilters {
    name?: string;
    email?: string;
    [key: string]: string | undefined; // 允许未来扩展，例如 metadata.country
}

interface UseRecipientsProps {
  page?: number;
  pageSize?: number;
  filters?: RecipientFilters;
  fallbackData?: PaginatedRecipients;
}

type CreateRecipientPayload = Omit<Recipient, 'id' | 'created_at' | 'updated_at' | 'status'>;
type UpdateRecipientPayload = Partial<CreateRecipientPayload>;


export function useRecipients({
  page = 1,
  pageSize = 10,
  filters,
  fallbackData,
}: UseRecipientsProps = {}) {
  const SWR_KEY = ['/recipients', page, pageSize, filters ? JSON.stringify(filters) : ''];

  const { data, error, isLoading, mutate } = useSWR<PaginatedRecipients>(
    SWR_KEY,
    () => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (filters) {
            for (const key in filters) {
                if (Object.prototype.hasOwnProperty.call(filters, key) && filters[key]) {
                    params.append(key, filters[key]);
                }
            }
        }
        return apiClient.get(`/recipients?${params.toString()}`)
    },
    {
      fallbackData,
      keepPreviousData: true, // 在加载新数据时保留旧数据，防止闪烁
    }
  );

  async function createRecipient(values: CreateRecipientPayload) {
    try {
      const result = await apiClient.post<Recipient>('/recipients', values);
      toast.success('收件人创建成功');
      await mutate();
      return result;
    } catch (error) {
      toast.error('创建失败');
      throw error;
    }
  }

  async function updateRecipient(id: number, values: UpdateRecipientPayload) {
    try {
      const result = await apiClient.put<Recipient>(`/recipients/${id}`, values);
      toast.success('收件人更新成功');
      await mutate();
      return result;
    } catch (error) {
      toast.error('更新失败');
      throw error;
    }
  }

  async function deleteRecipient(id: number) {
    try {
      await apiClient.delete(`/recipients/${id}`);
      toast.success('收件人删除成功');
      // Optimistic update
      if (data) {
        mutate({
          ...data,
          records: data.records.filter(r => r.id !== id)
        }, false);
      } else {
        mutate();
      }
    } catch (error) {
      toast.error('删除失败');
      throw error;
    }
  }

  return {
    data,
    recipients: data?.records ?? [],
    pagination: data?.pagination,
    error,
    isLoading,
    createRecipient,
    updateRecipient,
    deleteRecipient,
  };
} 