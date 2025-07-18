"use client";

import useSWR from 'swr';
import apiClient from '@/lib/api-client';
import { PaginatedRecipientImportTasks, RecipientImportTask } from '@/types/recipient';

// 1. Hook to get a list of import tasks
export function useRecipientImportTasks({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number; } = {}) {
  const url = `/recipients/import-tasks?page=${page}&pageSize=${pageSize}`;
  const { data, error, isLoading, mutate } = useSWR<PaginatedRecipientImportTasks>(url, apiClient.get);

  return {
    tasks: data?.records ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

// 2. Hook to get a single import task's details
export function useRecipientImportTask(taskId: number | null, refreshInterval: number = 0) {
    const url = taskId ? `/recipients/import-tasks/${taskId}` : null;
    const { data, error, isLoading, mutate } = useSWR<RecipientImportTask>(
      url, 
      apiClient.get,
      { refreshInterval }
    );
  
    return {
      task: data,
      isLoading,
      error,
      mutate,
    };
}

// 3. Function to upload a recipients file
export async function uploadRecipientsFile(formData: FormData): Promise<RecipientImportTask> {
    try {
      const response = await apiClient.post<RecipientImportTask>('/recipients/batch-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      // More specific error handling can be added here
      console.error("Failed to upload recipients file:", error);
      throw new Error(error.response?.data?.error || 'An unexpected error occurred during file upload.');
    }
} 