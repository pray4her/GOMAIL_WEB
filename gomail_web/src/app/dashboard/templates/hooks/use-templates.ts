import useSWR from "swr";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { z } from "zod";

export interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedTemplates {
  records: Template[];
  pagination: {
    page: number;
    pageSize: number;
    total_records: number;
    total_pages: number;
  };
}

interface UseTemplatesProps {
  page?: number;
  pageSize?: number;
  fallbackData?: PaginatedTemplates;
}

const createTemplateSchema = z.object({
  name: z.string().min(1, "模板名称为必填项"),
  subject: z.string().min(1, "邮件主题为必填项"),
  body: z.string().min(1, "邮件正文为必填项"),
});

export type CreateTemplatePayload = z.infer<typeof createTemplateSchema>;
export type UpdateTemplatePayload = Partial<CreateTemplatePayload>;

export function useTemplates({
  page = 1,
  pageSize = 10,
  fallbackData,
}: UseTemplatesProps = {}) {
  const SWR_KEY = [`/templates`, page, pageSize];

  const { data, error, isLoading, mutate } = useSWR<PaginatedTemplates>(
    SWR_KEY,
    async () => {
      const response = await apiClient.get<unknown>(`/templates?page=${page}&pageSize=${pageSize}`);
      
      // 类型安全地处理API响应结构
      if (response && typeof response === 'object') {
        // 后端返回的key是templates，这里做个兼容
        if ('templates' in response && 'pagination' in response) {
          const paginatedResponse = response as { templates: Template[]; pagination: PaginatedTemplates['pagination'] };
          return {
            records: paginatedResponse.templates,
            pagination: paginatedResponse.pagination,
          };
        }
        
        // 检查是否为标准的PaginatedTemplates结构
        if ('records' in response && 'pagination' in response) {
            return response as PaginatedTemplates;
        }

        // 检查是否为简单的模板数组
        if (Array.isArray(response)) {
          return {
            records: response as Template[],
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
        console.error("Failed to fetch templates:", error);
        toast.error("获取模板列表失败");
      },
    }
  );

  const createTemplate = async (values: CreateTemplatePayload) => {
    try {
      createTemplateSchema.parse(values); // 运行时验证
      const result = await apiClient.post<Template>("/templates", values);
      toast.success("模板创建成功");
      // 重新获取数据以更新分页信息
      await mutate();
      return result;
    } catch (error) {
      toast.error("模板创建失败");
      throw error;
    }
  };

  const updateTemplate = async (
    id: number,
    values: UpdateTemplatePayload
  ) => {
    try {
      const result = await apiClient.put<Template>(`/templates/${id}`, values);
      toast.success("模板更新成功");
      // 重新获取数据以保持分页状态
      await mutate();
      return result;
    } catch (error) {
      toast.error("模板更新失败");
      throw error;
    }
  };

  const deleteTemplate = async (id: number) => {
    try {
      await apiClient.delete(`/templates/${id}`);
      toast.success("模板删除成功");
      // 重新获取数据以更新分页信息
      await mutate();
    } catch (error) {
      toast.error("模板删除失败");
      throw error;
    }
  };

  return {
    data,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    mutate,
  };
} 