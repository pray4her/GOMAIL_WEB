"use client";

import { useState, useEffect, useRef } from "react";
import { DataTable } from "@/components/data-table";
import {
  useRecipients,
  Recipient,
  PaginatedRecipients,
  RecipientFilters,
} from "../hooks/use-recipients";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecipientForm, RecipientFormValues } from "./recipient-form";
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
import { Input } from "@/components/ui/input";
import { PaginationState } from "@tanstack/react-table";
import { XIcon, Upload } from "lucide-react";
import Link from "next/link";

// A simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface RecipientTableProps {
  fallbackData?: PaginatedRecipients;
}

interface MetadataFilter {
    id: number;
    key: string;
    value: string;
}

export function RecipientTable({ fallbackData }: RecipientTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [metadataFilters, setMetadataFilters] = useState<MetadataFilter[]>([]);
  const [nextId, setNextId] = useState(0);

  const debouncedName = useDebounce(nameFilter, 500);
  const debouncedEmail = useDebounce(emailFilter, 500);
  const debouncedMetadata = useDebounce(metadataFilters, 500);

  const [finalFilters, setFinalFilters] = useState<RecipientFilters>({});

  const {
    data,
    isLoading,
    createRecipient,
    updateRecipient,
    deleteRecipient,
  } = useRecipients({ 
    page: pagination.pageIndex + 1, 
    pageSize: pagination.pageSize,
    filters: finalFilters,
    fallbackData 
  });

  const isInitialMount = useRef(true);
  const debouncedFiltersString = JSON.stringify(finalFilters);

  // 当筛选条件变化时，重置到第一页
  useEffect(() => {
    const combinedFilters: RecipientFilters = {
        name: debouncedName || undefined,
        email: debouncedEmail || undefined,
    };
    debouncedMetadata.forEach(f => {
        if (f.key && f.value) {
            combinedFilters[`metadata.${f.key}`] = f.value;
        }
    });
    setFinalFilters(combinedFilters);
  }, [debouncedName, debouncedEmail, debouncedMetadata]);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, [debouncedFiltersString]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  const handleCreate = () => {
    setSelectedRecipient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setIsFormOpen(true);
  };

  const handleDelete = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedRecipient) return;
    setIsSubmitting(true);
    await deleteRecipient(selectedRecipient.id);
    setIsSubmitting(false);
    setIsConfirmOpen(false);
    setSelectedRecipient(null);
  };

  const onSubmit = async (values: RecipientFormValues) => {
    setIsSubmitting(true);

    // 将键值对数组转换为JSON对象
    let metadata: Record<string, unknown> | undefined = undefined;
    if (values.metadata_items && values.metadata_items.length > 0) {
      metadata = {};
      values.metadata_items.forEach(item => {
        if (item.key && item.value) {
          metadata![item.key] = item.value;
        }
      });
      // 如果没有有效的键值对，则设为undefined
      if (Object.keys(metadata).length === 0) {
        metadata = undefined;
      }
    }

    const payload = {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        metadata,
    };

    try {
      if (selectedRecipient) {
        await updateRecipient(selectedRecipient.id, payload);
      } else {
        await createRecipient(payload);
      }
      setIsFormOpen(false);
      setSelectedRecipient(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const columns = getColumns(handleEdit, handleDelete);

  const handleAddMetadataFilter = () => {
    setMetadataFilters(prev => [...prev, { id: nextId, key: '', value: '' }]);
    setNextId(prev => prev + 1);
  };

  const handleMetadataFilterChange = (id: number, field: 'key' | 'value', value: string) => {
    setMetadataFilters(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleRemoveMetadataFilter = (id: number) => {
    setMetadataFilters(prev => prev.filter(f => f.id !== id));
  };

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
        </div>
        <div className="rounded-md border p-4">
          <div className="h-96 w-full animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }
  
  const recipients = data?.records ?? [];
  const pageCount = data?.pagination?.total_pages ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row">
        <div className="flex-1 space-y-2 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
                <Input
                    placeholder="按姓名筛选..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Input
                    placeholder="按邮箱筛选..."
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="space-y-2">
                {metadataFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-2">
                         <Input
                            placeholder="元数据键"
                            value={filter.key}
                            onChange={(e) => handleMetadataFilterChange(filter.id, 'key', e.target.value)}
                            className="max-w-xs"
                        />
                        <Input
                            placeholder="元数据值"
                            value={filter.value}
                            onChange={(e) => handleMetadataFilterChange(filter.id, 'value', e.target.value)}
                            className="max-w-xs"
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMetadataFilter(filter.id)}>
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <div>
                <Button variant="outline" size="sm" onClick={handleAddMetadataFilter}>
                    添加元数据筛选
                </Button>
            </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreate}>新建收件人</Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/recipients/import">
              <Upload className="mr-2 h-4 w-4" />
              导入收件人
            </Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={recipients}
        pageCount={pageCount}
        manualPagination
        onPaginationChange={setPagination}
        initialState={{
            pagination
        }}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRecipient ? "编辑" : "新建"}收件人</DialogTitle>
            <DialogDescription>
              请填写收件人信息，可以添加自定义元数据字段。
            </DialogDescription>
          </DialogHeader>
          <RecipientForm
            onSubmit={onSubmit}
            initialData={selectedRecipient}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。这将永久删除该收件人。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} disabled={isSubmitting}>
              {isSubmitting ? "删除中..." : "确定"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 