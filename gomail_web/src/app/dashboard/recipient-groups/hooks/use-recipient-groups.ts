import useSWR from "swr";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export interface RecipientGroupRule {
  field: string;
  operator: "eq" | "neq" | "contains" | "gt" | "gte" | "lt" | "lte";
  value: string;
}

export interface RecipientGroup {
  id: number;
  name: string;
  description?: string;
  group_type: "dynamic" | "static";
  rules?: RecipientGroupRule[];
  member_ids?: number[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedRecipientGroups {
  records: RecipientGroup[];
  pagination: {
    page: number;
    pageSize: number;
    total_records: number;
    total_pages: number;
  };
}

interface UseRecipientGroupsProps {
  page?: number;
  pageSize?: number;
  fallbackData?: PaginatedRecipientGroups;
}

type CreateRecipientGroupPayload = Omit<RecipientGroup, "id" | "created_at" | "updated_at">;
type UpdateRecipientGroupPayload = Partial<CreateRecipientGroupPayload>;

export function useRecipientGroups({
  page = 1,
  pageSize = 10,
  fallbackData,
}: UseRecipientGroupsProps = {}) {

  const SWR_KEY = ['/recipient-groups', page, pageSize];

  const { data, error, isLoading, mutate } = useSWR<PaginatedRecipientGroups>(
    SWR_KEY,
    () => apiClient.get(`/recipient-groups?page=${page}&pageSize=${pageSize}`),
    {
      fallbackData,
      keepPreviousData: true,
      onError: (error) => {
        console.error("Failed to fetch recipient groups:", error);
        toast.error("获取分群列表失败");
      },
    }
  );

  async function createRecipientGroup(values: CreateRecipientGroupPayload) {
    try {
      const result = await apiClient.post<RecipientGroup>("/recipient-groups", values);
      toast.success("分群创建成功");
      await mutate();
      return result;
    } catch (error) {
      toast.error("分群创建失败");
      throw error;
    }
  }

  async function updateRecipientGroup(id: number, values: UpdateRecipientGroupPayload) {
    try {
      const result = await apiClient.put<RecipientGroup>(`/recipient-groups/${id}`, values);
      toast.success("分群更新成功");
      await mutate();
      return result;
    } catch (error) {
      toast.error("分群更新失败");
      throw error;
    }
  }

  async function deleteRecipientGroup(id: number) {
    try {
      await apiClient.delete(`/recipient-groups/${id}`);
      toast.success("分群删除成功");
      await mutate();
    } catch (error) {
      toast.error("分群删除失败");
      throw error;
    }
  }

  return {
    data,
    isLoading,
    error,
    createRecipientGroup,
    updateRecipientGroup,
    deleteRecipientGroup,
  };
} 