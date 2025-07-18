"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import {
  useRecipientGroups,
  RecipientGroup,
  PaginatedRecipientGroups,
} from "../hooks/use-recipient-groups";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RecipientGroupForm,
  RecipientGroupFormValues,
} from "./recipient-group-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationState } from "@tanstack/react-table";

interface RecipientGroupTableProps {
  fallbackData?: PaginatedRecipientGroups;
}

export function RecipientGroupTable({ fallbackData }: RecipientGroupTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data,
    isLoading,
    createRecipientGroup,
    updateRecipientGroup,
    deleteRecipientGroup,
  } = useRecipientGroups({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    fallbackData,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<RecipientGroup | null>(
    null
  );

  const handleCreate = () => {
    setSelectedGroup(null);
    setIsFormOpen(true);
  };

  const handleEdit = (group: RecipientGroup) => {
    setSelectedGroup(group);
    setIsFormOpen(true);
  };

  const handleDelete = (group: RecipientGroup) => {
    setSelectedGroup(group);
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedGroup) return;
    setIsSubmitting(true);
    await deleteRecipientGroup(selectedGroup.id);
    setIsSubmitting(false);
    setIsConfirmOpen(false);
    setSelectedGroup(null);
  };

  const onSubmit = async (values: RecipientGroupFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedGroup) {
        await updateRecipientGroup(selectedGroup.id, values);
      } else {
        await createRecipientGroup(values);
      }
      setIsFormOpen(false);
      setSelectedGroup(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = getColumns(handleEdit, handleDelete);

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border p-4">
          <div className="h-96 w-full animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  const groups = data?.records ?? [];
  const pageCount = data?.pagination?.total_pages ?? 0;

  return (
    <div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup ? "编辑分群" : "创建分群"}
            </DialogTitle>
            <DialogDescription>
              {selectedGroup
                ? "修改分群信息"
                : "创建一个新的收件人分群"}
            </DialogDescription>
          </DialogHeader>
          <RecipientGroupForm
            initialData={selectedGroup}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>您确定吗?</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。这将永久删除该分群。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "删除中..." : "确定"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-end py-4">
        <Button onClick={handleCreate}>创建分群</Button>
      </div>
      <DataTable
        columns={columns}
        data={groups}
        pageCount={pageCount}
        manualPagination
        onPaginationChange={setPagination}
        initialState={{
          pagination,
        }}
      />
    </div>
  );
} 