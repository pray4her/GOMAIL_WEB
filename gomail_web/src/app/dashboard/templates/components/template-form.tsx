"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Template } from "../hooks/use-templates";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "模板名称为必填项"),
  subject: z.string().min(1, "邮件主题为必填项"),
  body: z.string().min(1, "邮件正文为必填项"),
});

export type TemplateFormValues = z.infer<typeof formSchema>;

interface TemplateFormProps {
  initialData?: Template | null;
  onSubmit: (values: TemplateFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function TemplateForm({
  initialData,
  onSubmit,
  isSubmitting,
}: TemplateFormProps) {
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      subject: initialData?.subject ?? "",
      body: initialData?.body ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>模板名称</FormLabel>
              <FormControl>
                <Input placeholder="例如：月度优惠通讯" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮件主题</FormLabel>
              <FormControl>
                <Input placeholder="例如：尊敬的 {{.FirstName}}，这是您的专属优惠！" {...field} />
              </FormControl>
              <FormDescription>
                {'您可以使用 Go 模板变量，如 `{{.FirstName}}`, `{{.Email}}`。'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮件正文 (HTML)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="<h1>欢迎!</h1><p>在这里编写您的HTML邮件内容...</p>"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "提交中..." : "提交"}
        </Button>
      </form>
    </Form>
  );
} 