"use client";

import useSWR from "swr";
import apiClient from "@/lib/api-client";
import { Sender, AccountSendersResponse } from "@/types/sender";

// --- API 操作 ---
async function createSender(data: Omit<Sender, "id" | "created_at" | "updated_at">): Promise<Sender> {
  return apiClient.post("/senders", data);
}

async function associateSenderWithAccount(senderId: number, accountId: number, data: { email_address: string; daily_send_limit: number; }) {
    return apiClient.post(`/senders/${senderId}/accounts/${accountId}`, data);
}

const fetchSenders = (url: string): Promise<AccountSendersResponse> => apiClient.get(url);

export function useAccountSenders(accountId: number | null, page: number = 1, pageSize: number = 10) {
    const canFetch = accountId !== null;
    const { data, error, isLoading, mutate } = useSWR(
        canFetch ? `/accounts/${accountId}/senders?page=${page}&page_size=${pageSize}` : null,
        fetchSenders
    );

    return {
        response: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useSenders() {
  // This hook might be used for fetching all sender entities in the future.
  // For now, we keep the existing structure but add the new functionalities.
  return {
    createSender,
    associateSenderWithAccount,
  };
} 