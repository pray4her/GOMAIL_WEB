"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useAccountSenders } from "../hooks/use-senders";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { PaginationState } from "@tanstack/react-table";

interface SenderTableProps {
  accountId: number;
}

export function SenderTable({ accountId }: SenderTableProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;

  const { response, isLoading, isError } = useAccountSenders(accountId, page, pageSize);
  
  const pagination: PaginationState = React.useMemo(() => ({
    pageIndex: page - 1,
    pageSize,
  }), [page, pageSize]);

  const handlePaginationChange = (updater: React.SetStateAction<PaginationState>) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    const params = new URLSearchParams(searchParams);
    params.set('page', (newPagination.pageIndex + 1).toString());
    params.set('pageSize', newPagination.pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  const pageCount = response ? Math.ceil(response.total_count / pageSize) : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  
  if (isError) return <div>加载失败...</div>;
  if (!response || !response.account_senders) return <div>没有数据</div>;
  
  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={response.account_senders}
        pageCount={pageCount}
        manualPagination={true}
        initialState={{ pagination }}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
} 