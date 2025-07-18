"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RecipientGroup } from "../hooks/use-recipient-groups";

export const getColumns = (
  onEdit: (group: RecipientGroup) => void,
  onDelete: (group: RecipientGroup) => void
): ColumnDef<RecipientGroup>[] => [
  {
    accessorKey: "name",
    header: "分群名称",
  },
  {
    accessorKey: "description",
    header: "描述",
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.description}</div>
  },
  {
    accessorKey: "group_type",
    header: "类型",
    cell: ({ row }) => {
      const type = row.original.group_type;
      return (
        <Badge variant={type === "dynamic" ? "default" : "secondary"}>
          {type === "dynamic" ? "动态" : "静态"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "创建时间",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const group = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">打开菜单</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(group)}>编辑</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(group)}>删除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 