"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RecipientImportTask } from "@/types/recipient"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpDown, Eye } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const getColumns = (): ColumnDef<RecipientImportTask>[] => {
  return [
    {
      accessorKey: "task_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            任务名称
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.original.task_name}</div>,
    },
    {
        accessorKey: "file_name",
        header: "文件名",
        cell: ({ row }) => <div className="truncate max-w-xs">{row.original.file_name}</div>,
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.original.status
        const variant: "default" | "secondary" | "destructive" =
          status === "completed"
            ? "default"
            : status === "failed"
            ? "destructive"
            : "secondary"
        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
        accessorKey: "total_records",
        header: "总记录数",
    },
    {
        accessorKey: "success_records",
        header: "成功",
    },
    {
        accessorKey: "failed_records",
        header: "失败",
    },
    {
      accessorKey: "created_at",
      header: "创建于",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" asChild>
                  <Link href={`/dashboard/recipients/import/${task.id}`}>
                    <span className="sr-only">查看详情</span>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>查看任务详情</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
  ]
} 