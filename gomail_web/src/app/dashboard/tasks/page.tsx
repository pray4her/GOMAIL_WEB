"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "./hooks/use-tasks";

function TaskPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="rounded-md border">
        <div className="h-12 w-full bg-muted animate-pulse rounded-t-md" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading, error } = useTasks({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
    });

    if (isLoading && !data) return <TaskPageSkeleton />;
    
    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">邮件任务管理</h2>
                        <p className="text-muted-foreground">
                            这里是您所有的邮件发送任务。
                        </p>
                    </div>
                    <Link href="/dashboard/tasks/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            创建任务
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-center h-32 text-red-500 border rounded-md">
                    加载任务失败，请稍后重试。错误信息: {error?.message}
                </div>
            </div>
        );
    }

    const tasks = data?.records || [];
    const pageCount = data?.pagination?.total_pages || 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">邮件任务管理</h2>
                    <p className="text-muted-foreground">
                        这里是您所有的邮件发送任务。
                    </p>
                </div>
                <Link href="/dashboard/tasks/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        创建任务
                    </Button>
                </Link>
            </div>
            <DataTable 
                columns={columns} 
                data={tasks} 
                pageCount={pageCount}
                manualPagination={true}
                onPaginationChange={setPagination}
                initialState={{
                    pagination: pagination
                }}
            />
        </div>
    );
} 