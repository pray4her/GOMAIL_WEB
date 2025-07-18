"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSenders } from "../hooks/use-senders";
import { Sender } from "@/types/sender";


const formSchema = z.object({
  name: z.string().min(2, { message: "名称至少需要2个字符。" }),
  role: z.string().min(2, { message: "角色描述至少需要2个字符。" }),
  contact_info: z.string().email({ message: "请输入有效的联系邮箱。" }),
});

interface CreateSenderFormProps {
    onSuccess: (newSender: Sender) => void;
}

export function CreateSenderForm({ onSuccess }: CreateSenderFormProps) {
  const { createSender } = useSenders();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      contact_info: "",
    },
  });

  const { formState, reset } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newSender = await createSender(values);
      toast.success("发件人实体创建成功", {
        description: `名称为“${values.name}”的发件人实体已添加。`,
      });
      reset(); // Reset form on success
      onSuccess(newSender); // Pass the new sender to the parent
    } catch (error: unknown) {
       const errorMessage = error instanceof Error ? error.message : "未知错误，请检查网络或联系管理员。";
      toast.error("操作失败", {
        description: errorMessage,
      });
    }
  }

  return (
    <Card className="max-w-2xl">
        <CardHeader>
            <CardTitle>创建发件人实体</CardTitle>
            <CardDescription>
                步骤 1: 创建一个逻辑发件人，例如“市场部”或“客服团队”。
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>实体名称</FormLabel>
                    <FormControl>
                        <Input placeholder="例如：市场部" {...field} />
                    </FormControl>
                     <FormDescription>
                        这个名称将用于内部识别。
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>角色/用途</FormLabel>
                    <FormControl>
                        <Input placeholder="例如：新用户欢迎邮件" {...field} />
                    </FormControl>
                    <FormDescription>
                        简要描述这个发件实体的用途。
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="contact_info"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>联系邮箱</FormLabel>
                    <FormControl>
                        <Input placeholder="例如：marketing@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                        一个关联的联系方式，可以是真实邮箱或标识符。
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "正在创建..." : "创建实体"}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
} 