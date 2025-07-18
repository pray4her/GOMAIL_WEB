"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";

import { useAccounts } from "../../accounts/hooks/use-accounts";
import { useSenders } from "../hooks/use-senders";
import { Sender } from "@/types/sender";

const formSchema = z.object({
  accountId: z.string({ required_error: "请选择一个云账号。" }),
  email_address: z.string().email({ message: "请输入有效的发件邮箱。" }),
  daily_send_limit: z.coerce.number().int().positive({ message: "请输入一个正整数。" }),
});

interface AssociateAccountProps {
  sender: Sender;
}

export function AssociateAccount({ sender }: AssociateAccountProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { associateSenderWithAccount } = useSenders();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: "",
      email_address: "",
      daily_send_limit: 1000,
    },
  });

  const { formState, reset } = form;

  const accountOptions = React.useMemo(() => {
    if (!accounts) return [];
    return accounts.map(acc => ({ value: String(acc.id), label: `${acc.name} (${acc.domain})` }))
  }, [accounts]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { accountId, ...payload } = values;
      await associateSenderWithAccount(sender.id, Number(accountId), payload);
      toast.success("关联成功", {
        description: `发件人“${sender.name}”已与新的邮箱地址关联。`,
      });
      reset();
      setIsOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "未知错误，请检查网络或联系管理员。";
      toast.error("操作失败", {
        description: errorMessage,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>关联云账号</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>关联云账号到“{sender.name}”</DialogTitle>
          <DialogDescription>
            选择一个云账号并提供发件邮箱，以创建一个可用的发送地址。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>选择云账号</FormLabel>
                  <Combobox 
                    options={accountOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoadingAccounts}
                    placeholder="选择一个云账号..."
                    searchPlaceholder="搜索账号..."
                    emptyText={isLoadingAccounts ? "正在加载账号..." : "未找到云账号。"}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>发件邮箱地址</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：noreply@example.com" {...field} />
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
                  <FormLabel>此地址每日发送限额</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <Button type="submit" disabled={formState.isSubmitting}>
                    {formState.isSubmitting ? "正在关联..." : "确认关联"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 