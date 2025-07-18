"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Template } from "../hooks/use-templates";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { TemplatePreviewForm, PreviewFormValues } from "./template-preview-form";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplatePreviewDialogProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PreviewResult {
  subject: string;
  body: string;
}

export function TemplatePreviewDialog({
  template,
  isOpen,
  onClose,
}: TemplatePreviewDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);

  const handleSubmit = async (values: PreviewFormValues) => {
    if (!template) return;
    setIsSubmitting(true);
    setPreviewResult(null); // 清除旧的预览
    try {
      // 构造符合 API 要求的数据
      const requestData = {
        ...values,
        metadata: values.metadata ? JSON.parse(values.metadata) : {},
      };
      
      const result = (await apiClient.post(
        `/templates/${template.id}/preview`,
        requestData
      )) as PreviewResult;
      setPreviewResult(result);
      toast.success("模板预览生成成功！");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "生成预览失败，请检查您的输入或稍后重试。";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setPreviewResult(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>预览模板: {template?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 overflow-y-auto -mr-6 pr-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">输入示例数据</h3>
            <TemplatePreviewForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">渲染结果</h3>
            <div className="space-y-4">
              {isSubmitting && (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-40 w-full" />
                </div>
              )}
              {previewResult && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">渲染后主题</h4>
                    <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                      {previewResult.subject}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">渲染后正文 (HTML)</h4>
                    <div
                      className="mt-1 p-3 border rounded-md min-h-[200px]"
                      dangerouslySetInnerHTML={{ __html: previewResult.body }}
                    />
                  </div>
                </div>
              )}
               {!previewResult && !isSubmitting && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  在这里查看渲染后的预览结果
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 