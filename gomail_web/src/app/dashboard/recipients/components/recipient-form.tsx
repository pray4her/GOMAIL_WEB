"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Recipient } from "../hooks/use-recipients";
import { PlusIcon, XIcon } from "lucide-react";

// 定义元数据键值对的schema
const metadataItemSchema = z.object({
  key: z.string().min(1, { message: "键不能为空" }),
  value: z.string().min(1, { message: "值不能为空" }),
});

export const recipientFormSchema = z.object({
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  first_name: z.string().min(1, { message: "名不能为空" }),
  last_name: z.string().optional(),
  metadata_items: z.array(metadataItemSchema).optional(),
});


export type RecipientFormValues = z.infer<typeof recipientFormSchema>;

interface RecipientFormProps {
  initialData?: Recipient | null;
  onSubmit: (values: RecipientFormValues) => void;
  isSubmitting: boolean;
}

// 辅助函数：将JSON对象转换为键值对数组
function metadataToItems(metadata?: Record<string, unknown>): { key: string; value: string }[] {
  if (!metadata) return [];
  return Object.entries(metadata).map(([key, value]) => ({
    key,
    value: String(value),
  }));
}

export function RecipientForm({ initialData, onSubmit, isSubmitting }: RecipientFormProps) {
  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: {
      email: initialData?.email ?? "",
      first_name: initialData?.first_name ?? "",
      last_name: initialData?.last_name ?? "",
      metadata_items: metadataToItems(initialData?.metadata),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "metadata_items",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
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
              <FormLabel>姓 (可选)</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 元数据键值对输入 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>元数据 (可选)</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ key: "", value: "" })}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              添加字段
            </Button>
          </div>

          {fields.length > 0 && (
            <div className="space-y-3 rounded-md border p-4">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`metadata_items.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="字段名 (如: country)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`metadata_items.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="字段值 (如: USA)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {fields.length === 0 && (
            <div className="text-sm text-muted-foreground">
              点击"添加字段"来添加元数据
            </div>
          )}

          <FormField
            control={form.control}
            name="metadata_items"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "提交中..." : "提交"}
        </Button>
      </form>
    </Form>
  );
} 