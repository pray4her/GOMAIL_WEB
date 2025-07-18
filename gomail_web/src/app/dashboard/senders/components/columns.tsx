"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AccountSender } from "@/types/sender";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<AccountSender>[] = [
  {
    accessorKey: "sender.name",
    header: "发件人名称",
  },
  {
    accessorKey: "email_address",
    header: "发件邮箱",
  },
  {
    accessorKey: "sender.role",
    header: "角色",
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = status === "active" ? "default" : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "daily_send_limit",
    header: "日发送限额",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sender = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(sender.id.toString())}
            >
              复制 ID
            </DropdownMenuItem>
            {/* Add more actions here, e.g., Edit, Delete */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 