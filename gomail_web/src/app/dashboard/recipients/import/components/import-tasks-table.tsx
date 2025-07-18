"use client"

import { useState } from 'react';
import { DataTable } from "@/components/data-table";
import { useRecipientImportTasks } from "../../hooks/use-recipient-import";
import { getColumns } from "./columns";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PaginationState } from '@tanstack/react-table';

export function ImportTasksTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { tasks, pagination: tasksPagination, isLoading } = useRecipientImportTasks({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
    });
    
    const columns = getColumns();

    const pageCount = tasksPagination?.total_pages ?? 0;

    if (isLoading && !tasks.length) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>历史导入任务</CardTitle>
                <CardDescription>
                    查看您过去上传和处理的所有收件人文件。
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tasks}
                    pageCount={pageCount}
                    manualPagination={true}
                    onPaginationChange={setPagination}
                    initialState={{ pagination }}
                />
            </CardContent>
        </Card>
    );
} 