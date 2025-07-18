"use client";

import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useTemplates, Template, CreateTemplatePayload } from "./hooks/use-templates";
import { DataTable } from "@/components/data-table";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { TemplateForm, TemplateFormValues } from "./components/template-form";
import { toast } from "sonner";
import { TemplatePreviewDialog } from "./components/template-preview-dialog";

export default function TemplatesPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTemplates({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedTemplate(null);
    setIsFormOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
  };

  const handleDelete = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTemplate) {
      toast.promise(deleteTemplate(selectedTemplate.id), {
        loading: "删除中...",
        success: () => {
          setIsDeleteDialogOpen(false);
          setSelectedTemplate(null);
          return `模板 "${selectedTemplate.name}" 已删除。`;
        },
        error: (err) => `删除失败: ${err.message}`,
      });
    }
  };
  
  const handleSubmit = async (values: TemplateFormValues) => {
    setIsSubmitting(true);
    const promise = selectedTemplate
      ? updateTemplate(selectedTemplate.id, values)
      : createTemplate(values as CreateTemplatePayload);

    toast.promise(promise, {
      loading: selectedTemplate ? "更新中..." : "创建中...",
      success: () => {
        setIsSubmitting(false);
        setIsFormOpen(false);
        setSelectedTemplate(null);
        return `模板已成功${selectedTemplate ? "更新" : "创建"}。`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return `操作失败: ${err.message}`;
      },
    });
  };

  const tableColumns = columns(handleEdit, handleDelete, handlePreview);

  if (isLoading && !data) return <TemplatePageSkeleton />;
  
  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">邮件模板管理</h1>
          <Button onClick={handleCreate}>创建新模板</Button>
        </div>
        <div className="flex items-center justify-center h-32 text-red-500 border rounded-md">
          加载模板失败，请稍后重试。错误信息: {error?.message}
        </div>
      </div>
    );
  }

  const templates = data?.records || [];
  const pageCount = data?.pagination?.total_pages || 0;

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => !isSubmitting && setIsFormOpen(isOpen)}>
        <DialogContent className="flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? `编辑模板: ${selectedTemplate.name}` : "创建新模板"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto -mr-6 pr-6">
            <TemplateForm
              initialData={selectedTemplate}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。这将永久删除模板
              <span className="font-semibold">&quot;{selectedTemplate?.name}&quot;</span>。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       <TemplatePreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={selectedTemplate}
      />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">邮件模板管理</h1>
          <Button onClick={handleCreate}>创建新模板</Button>
        </div>
        <DataTable 
          columns={tableColumns} 
          data={templates} 
          pageCount={pageCount}
          manualPagination={true}
          onPaginationChange={setPagination}
          initialState={{
            pagination: pagination
          }}
        />
      </div>
    </>
  );
}

function TemplatePageSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">邮件模板管理</h1>
        <Button disabled>创建新模板</Button>
      </div>
      <div className="space-y-4">
        <div className="rounded-md border">
            <div className="h-12 w-full bg-muted animate-pulse rounded-t-md" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
      </div>
    </div>
  );
} 