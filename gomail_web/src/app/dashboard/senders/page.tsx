"use client";
import * as React from "react";
import { CreateSenderForm } from "./components/create-sender-form";
import { AssociateAccount } from "./components/associate-account";
import { Separator } from "@/components/ui/separator";
import { useAccounts } from "../accounts/hooks/use-accounts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import { SenderTable } from "./components/sender-table";
import { Sender } from "@/types/sender";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SenderListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedAccountId = searchParams.get("accountId");

  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const [lastCreatedSender, setLastCreatedSender] = React.useState<Sender | null>(null);

  const handleAccountChange = (accountId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("accountId", accountId);
    params.delete("page"); // Reset page on new account selection
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  const handleSuccess = (newSender: Sender) => {
    setLastCreatedSender(newSender);
  }

  return (
    <div className="space-y-8">
      {/* --- Top Section for Creation --- */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">发件人管理</h2>
        <p className="text-muted-foreground">
          创建一个逻辑发件人实体，然后将其与一个或多个云账号关联以创建实际的发送地址。
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CreateSenderForm onSuccess={handleSuccess} />
        {lastCreatedSender ? (
            <Card>
                <CardHeader>
                    <CardTitle>步骤 2: 关联到云账号</CardTitle>
                    <CardDescription>
                        为发件人 <span className="font-bold text-sky-600">“{lastCreatedSender.name}”</span> 关联一个云账号。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AssociateAccount sender={lastCreatedSender} />
                </CardContent>
            </Card>
        ) : (
            <Card className="h-full flex flex-col items-center justify-center bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-muted-foreground">等待创建发件人</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">请先在左侧表单中创建一个发件人实体。</p>
                </CardContent>
            </Card>
        )}
      </div>

      <Separator />

      {/* --- Bottom Section for Listing --- */}
      <div>
        <h3 className="text-lg font-medium">发件人地址列表</h3>
        <p className="text-sm text-muted-foreground">
          选择一个云账号以查看其关联的所有发件人地址。
        </p>
      </div>
      <div className="w-full max-w-sm">
        <Select onValueChange={handleAccountChange} value={selectedAccountId ?? ""}>
          <SelectTrigger>
            <SelectValue placeholder="请选择一个云账号..." />
          </SelectTrigger>
          <SelectContent>
            {isLoadingAccounts ? (
              <SelectItem value="loading" disabled>加载中...</SelectItem>
            ) : (
              accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.name} ({account.domain})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedAccountId && <SenderTable accountId={Number(selectedAccountId)} />}
    </div>
  );
}

export default function SendersPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <SenderListPage />
    </Suspense>
  );
} 