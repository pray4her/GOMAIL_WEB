"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { uploadRecipientsFile } from "../../hooks/use-recipient-import";
import { Loader2, Download } from "lucide-react";

const formSchema = z.object({
  task_name: z.string().min(3, { message: "任务名称至少需要3个字符。" }),
  file: z.instanceof(File).refine(file => file.size > 0, "请选择一个文件。")
});

interface ImportUploadFormProps {
  onUploadSuccess: () => void;
}

export function ImportUploadForm({ onUploadSuccess }: ImportUploadFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false);
  const [isDownloadingJson, setIsDownloadingJson] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task_name: "",
      file: new File([], ""),
    },
  });

  const handleDownloadSample = async (format: "csv" | "json") => {
    const setLoading = format === "csv" ? setIsDownloadingCsv : setIsDownloadingJson;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/recipients/batch-upload/sample/${format}`
      );

      if (!response.ok) {
        throw new Error(`下载文件失败，状态码: ${response.status}`);
      }

      const contentDisposition = response.headers.get("content-disposition");
      let filename = `sample_recipients.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "下载失败",
        description: "无法下载示例文件，请检查网络连接或联系管理员。",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("task_name", values.task_name);
    formData.append("file", values.file);

    try {
      await uploadRecipientsFile(formData);
      toast({
        title: "上传成功",
        description: "文件已开始后台处理。您可以在下方查看导入任务的状态。",
      });
      form.reset();
      onUploadSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "上传失败",
        description: error.message || "无法上传文件，请稍后重试。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>创建新的导入任务</CardTitle>
        <CardDescription>
          上传一个 .csv, .xlsx, 或者 .json 文件来批量添加收件人。
        </CardDescription>
        <div className="text-sm text-muted-foreground pt-2">
          不确定格式？
          <Button
            variant="link"
            type="button"
            disabled={isSubmitting || isDownloadingCsv}
            onClick={() => handleDownloadSample("csv")}
            className="px-1"
          >
            {isDownloadingCsv ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            下载CSV模板
          </Button>
          /
          <Button
            variant="link"
            type="button"
            disabled={isSubmitting || isDownloadingJson}
            onClick={() => handleDownloadSample("json")}
            className="px-1"
          >
            {isDownloadingJson ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            下载JSON模板
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="task_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>任务名称</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：2024年第一季度营销活动" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>收件人文件</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .json"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "上传中..." : "开始导入"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 