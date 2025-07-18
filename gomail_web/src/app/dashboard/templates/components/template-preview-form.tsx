"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址"),
  metadata: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "元数据必须是有效的 JSON 格式" }
    ),
});

export type PreviewFormValues = z.infer<typeof formSchema>;

interface TemplatePreviewFormProps {
  onSubmit: (values: PreviewFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function TemplatePreviewForm({
  onSubmit,
  isSubmitting,
}: TemplatePreviewFormProps) {
  const form = useForm<PreviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      metadata: JSON.stringify({ custom_field: "some value" }, null, 2),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓 (First Name)</FormLabel>
                <FormControl>
                  <Input placeholder="例如：John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名 (Last Name)</FormLabel>
                <FormControl>
                  <Input placeholder="例如：Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱地址</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="例如：test@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metadata"
          render={({ field }) => (
            <FormItem>
              <FormLabel>元数据 (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{ "country": "USA", "level": "VIP" }'
                  className="min-h-[100px] font-mono"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                输入一个 JSON 对象来模拟收件人的元数据。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "生成预览..." : "生成预览"}
        </Button>
      </form>
    </Form>
  );
} 