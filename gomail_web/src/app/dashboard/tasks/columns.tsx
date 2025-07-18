"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Task } from "./hooks/use-tasks";
import { formatScheduledTime } from "@/lib/utils";

const statusVariantMap: { [key in Task["status"]]: "default" | "secondary" | "destructive" | "outline" } = {
    pending: "secondary",
    dispatching: "default",
    sending: "default",
    completed: "default", // Should be success, but we use default for now
    failed: "destructive",
};

// 新建一个组件来处理操作，以便在其中安全地使用 hook
function TaskActions({ task }: { task: Task }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">打开菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>操作</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(`/dashboard/tasks/${task.id}`)}>
          查看详情
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "task_name",
    header: "任务名称",
    cell: ({ row }) => <div className="font-medium">{row.getValue("task_name")}</div>,
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.getValue("status") as Task["status"];
      const variant = statusVariantMap[status] ?? "secondary";

      let statusText: string = status;
        // Simple mapping for demonstration
      const statusTextMap: Record<Task["status"], string> = {
        pending: "待处理",
        dispatching: "分发中",
        sending: "发送中",
        completed: "已完成",
        failed: "失败",
      };
      statusText = statusTextMap[status] ?? status;


      return <Badge variant={variant}>{statusText}</Badge>;
    },
  },
  {
    accessorKey: "scheduled_at",
    header: "计划发送时间",
    cell: ({ row }) => {
      const scheduledAt = row.getValue("scheduled_at") as string;
      const formattedTime = formatScheduledTime(scheduledAt);
      
      return (
        <span className={formattedTime === "立即发送" ? "text-muted-foreground" : ""}>
          {formattedTime}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "创建时间",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      return <span>{new Date(createdAt).toLocaleString()}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;
      return <TaskActions task={task} />;
    },
  },
]; 