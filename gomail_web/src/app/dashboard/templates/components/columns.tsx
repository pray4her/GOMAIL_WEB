"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Template } from "../hooks/use-templates";

export const columns: (
  onEdit: (template: Template) => void,
  onDelete: (template: Template) => void,
  onPreview: (template: Template) => void
) => ColumnDef<Template>[] = (onEdit, onDelete, onPreview) => [
  {
    accessorKey: "name",
    header: "模板名称",
  },
  {
    accessorKey: "subject",
    header: "邮件主题",
  },
  {
    accessorKey: "created_at",
    header: "创建时间",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const template = row.original;
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
            <DropdownMenuItem onClick={() => onPreview(template)}>
              预览
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(template)}>
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(template)}
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