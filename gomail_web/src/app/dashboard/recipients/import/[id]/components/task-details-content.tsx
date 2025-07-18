"use client";

import { useRecipientImportTask } from "../../../hooks/use-recipient-import";
import { RecipientImportTask } from "@/types/recipient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface TaskDetailsContentProps {
  taskId: number;
  initialData?: RecipientImportTask;
}

export function TaskDetailsContent({ taskId, initialData }: TaskDetailsContentProps) {
  const { task, isLoading } = useRecipientImportTask(
    taskId,
    // Poll every 3 seconds if the task is still processing
    initialData?.status === 'pending' || initialData?.status === 'processing' ? 3000 : 0
  );

  const displayData = task || initialData;

  if (isLoading && !displayData) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!displayData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>错误</CardTitle>
        </CardHeader>
        <CardContent>
          <p>找不到指定的导入任务。</p>
        </CardContent>
      </Card>
    );
  }

  const {
    task_name,
    status,
    file_name,
    total_records,
    processed_records,
    success_records,
    failed_records,
    created_at,
    error_message
  } = displayData;
  
  const progress = total_records > 0 ? (processed_records / total_records) * 100 : 0;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl">{task_name}</CardTitle>
                <CardDescription>导入任务详情和当前状态</CardDescription>
            </div>
            <Badge variant={status === 'completed' ? 'default' : status === 'failed' ? 'destructive' : 'secondary'} className="text-lg">
                {status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        { (status === 'pending' || status === 'processing') &&
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">处理进度</span>
                    <span className="text-sm text-muted-foreground">{processed_records} / {total_records}</span>
                </div>
                <Progress value={progress} />
            </div>
        }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
                <p className="font-semibold">文件名</p>
                <p className="text-muted-foreground">{file_name}</p>
            </div>
            <div className="space-y-1">
                <p className="font-semibold">创建时间</p>
                <p className="text-muted-foreground">{new Date(created_at).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
                <p className="font-semibold">总记录数</p>
                <p className="text-muted-foreground">{total_records}</p>
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-green-600">成功导入</p>
                <p className="text-muted-foreground">{success_records}</p>
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-red-600">导入失败</p>
                <p className="text-muted-foreground">{failed_records}</p>
            </div>
        </div>

        {error_message && (
            <div className="space-y-2">
                <p className="font-semibold text-destructive">错误信息</p>
                <pre className="p-4 bg-muted rounded-md text-sm text-destructive-foreground whitespace-pre-wrap">
                    {error_message}
                </pre>
            </div>
        )}
      </CardContent>
    </Card>
  );
} 