"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Recipient } from "../hooks/use-recipients";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const getColumns = (
  onEdit: (recipient: Recipient) => void,
  onDelete: (recipient: Recipient) => void
): ColumnDef<Recipient>[] => [
  {
    accessorKey: "email",
    header: "邮箱",
  },
  {
    accessorKey: "first_name",
    header: "名",
  },
  {
    accessorKey: "last_name",
    header: "姓",
  },
  {
    accessorKey: "metadata",
    header: "元数据",
    cell: ({ row }) => {
      const metadata = row.original.metadata;
      if (!metadata || Object.keys(metadata).length === 0) {
        return <span className="text-muted-foreground">无</span>;
      }

      const entries = Object.entries(metadata);
      const visibleCount = 2;
      const visibleEntries = entries.slice(0, visibleCount);
      const hiddenEntries = entries.slice(visibleCount);

      return (
        <div className="flex flex-wrap gap-1">
          {visibleEntries.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="font-normal">
              {key}: {String(value)}
            </Badge>
          ))}
          {hiddenEntries.length > 0 && (
            <Popover>
              <PopoverTrigger>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                >
                  +{hiddenEntries.length} 更多...
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="flex flex-col gap-1">
                  {hiddenEntries.map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="font-normal">
                      {key}: {String(value)}
                    </Badge>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.getValue("status") as Recipient["status"];
      
      const statusMap: Record<Recipient["status"], { text: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
        active: { text: "活跃", variant: "default" },
        unsubscribed: { text: "退订", variant: "secondary" },
        bounce: { text: "弹回", variant: "destructive" },
        pending: { text: "待定", variant: "outline" },
      };

      const { text, variant } = statusMap[status] || { text: status, variant: "secondary" };

      return <Badge variant={variant}>{text}</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "创建时间",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const recipient = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => onEdit(recipient)}>
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onDelete(recipient)}
              className="text-red-600"
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 