"use client";
import * as React from "react";
import { useAccounts } from "../hooks/use-accounts";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm } from "./account-form";
import { Account } from "@/types/account";

export function AccountTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* 根据 columns.tsx 的定义来设置骨架屏的列数和宽度 */}
            <TableHead className="w-[150px]">
              <Skeleton className="h-5 w-full" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-full" />
            </TableHead>
            <TableHead className="w-[100px]">
              <Skeleton className="h-5 w-full" />
            </TableHead>
            <TableHead className="w-[180px]">
              <Skeleton className="h-5 w-full" />
            </TableHead>
            <TableHead className="w-[50px]">
              <Skeleton className="h-5 w-full" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function AccountTable({ fallbackData }: { fallbackData?: Account[] }) {
  const { accounts, isLoading, isError, mutate, createAccount, updateAccount } = useAccounts(fallbackData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<Account | null>(null);

  const handleCreateClick = () => {
    setEditingAccount(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (account: Account) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    mutate(); // Re-fetch the data
  };

  if (isLoading) return <AccountTableSkeleton />;
  if (isError) {
    return (
      <div className="flex items-center justify-center h-24 text-red-500">
        加载云账号失败，请稍后重试。
      </div>
    );
  }

  // Pass the edit handler to the columns
  const tableColumns = columns(handleEditClick);

  return (
    <div>
       <div className="flex items-center justify-end py-4">
        <Button onClick={handleCreateClick}>创建云账号</Button>
      </div>
      <DataTable columns={tableColumns} data={accounts || []} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAccount ? "编辑云账号" : "创建云账号"}</DialogTitle>
            <DialogDescription>
              {editingAccount ? "修改云账号的配置信息。" : "添加一个新的云账号到系统中。"}
            </DialogDescription>
          </DialogHeader>
          <AccountForm
            account={editingAccount ?? undefined}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 