"use client";

import useSWR from "swr";
import apiClient from "@/lib/api-client";
import { Account } from "@/types/account";

const fetcher = (url: string): Promise<Account[]> => apiClient.get(url);

// --- API 操作 ---
async function createAccount(data: Omit<Account, "id" | "created_at" | "updated_at" | "status">) {
  return apiClient.post("/accounts", data);
}

async function updateAccount(id: number, data: Partial<Omit<Account, "id" | "created_at" | "updated_at">>) {
  return apiClient.put(`/accounts/${id}`, data);
}

export function useAccounts(fallbackData?: Account[]) {
  const { data, error, isLoading, mutate } = useSWR(
    "/accounts", 
    fetcher,
    { fallbackData }
    );

  return {
    accounts: data,
    isLoading,
    isError: error,
    mutate,
    createAccount: createAccount,
    updateAccount: updateAccount,
  };
} 