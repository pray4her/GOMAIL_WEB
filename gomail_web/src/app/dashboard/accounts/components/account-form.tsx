"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import React from "react";

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
import { Account } from "@/types/account";
import { useAccounts } from "../hooks/use-accounts";

// The form schema now correctly uses Omit on the Account type.
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  domain: z.string().min(3, "Domain must be at least 3 characters."),
  access_key_id: z.string().min(10, "Access Key ID seems too short."),
  access_key_secret: z.string().min(20, "Access Key Secret seems too short."),
  daily_send_limit: z.coerce.number().int().positive(),
});

type FormData = z.infer<typeof formSchema>;

interface AccountFormProps {
  account?: Account;
  onSuccess: () => void;
}

export function AccountForm({ account, onSuccess }: AccountFormProps) {
  const { createAccount, updateAccount } = useAccounts();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account?.name || "",
      domain: account?.domain || "",
      access_key_id: account?.access_key_id || "",
      access_key_secret: "", // Secret is not pre-filled for security
      daily_send_limit: account?.daily_send_limit || 5000,
    },
  });

  const { formState, reset } = form;

  async function onSubmit(data: FormData) {
    try {
      if (account) {
        await updateAccount(account.id, data);
        toast.success("Account updated successfully.");
      } else {
        await createAccount(data);
        toast.success("Account created successfully.");
      }
      reset();
      onSuccess(); // Triggers re-fetching data in the parent component
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("Operation failed", { description: errorMessage });
    }
  }

  // Reset form when dialog is closed or account data changes
  React.useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        domain: account.domain,
        access_key_id: account.access_key_id,
        daily_send_limit: account.daily_send_limit,
        access_key_secret: "",
      });
    } else {
      reset({
        name: "",
        domain: "",
        access_key_id: "",
        access_key_secret: "",
        daily_send_limit: 5000,
      });
    }
  }, [account, reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名称</FormLabel>
              <FormControl>
                <Input placeholder="例如：Aliyun Account 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>域名</FormLabel>
              <FormControl>
                <Input placeholder="例如：mail.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="access_key_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Key ID</FormLabel>
              <FormControl>
                <Input placeholder="LTAI5t..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="access_key_secret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Key Secret</FormLabel>
              <FormControl>
                <Input type="password" placeholder="如需修改请输入新的 Secret" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="daily_send_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>每日发送限额</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>
             {formState.isSubmitting ? "正在提交..." : "保存更改"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 