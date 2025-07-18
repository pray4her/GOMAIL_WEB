import { Suspense } from "react";
import { cookies } from "next/headers";
import { AccountTable, AccountTableSkeleton } from "./components/account-table";
import { Account } from "@/types/account";

async function getAccounts(): Promise<Account[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("gomail_token")?.value;

  // 在服务器组件中，如果没有 token，请求会自然失败，
  // SWR 在客户端会捕获这个错误。
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // 确保在每次请求时都能获取最新数据
    cache: "no-store",
  });

  if (!res.ok) {
    // 如果请求失败，SWR 在客户端会进入 error 状态
    // 这里可以根据需要记录服务器端错误
    console.error("Failed to fetch accounts on server:", res.statusText);
    throw new Error("Failed to fetch accounts.");
  }

  const body = await res.json();
  
  if(body.error){
      console.error("API error on server fetch:", body.error);
      throw new Error(body.error);
  }

  return body.data || [];
}

async function AccountsData() {
    const accounts = await getAccounts();
    return <AccountTable fallbackData={accounts} />;
}


export default function AccountsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">云账号管理</h1>
      <p className="text-muted-foreground mb-6">
        管理所有用于发送邮件的云服务提供商账号。
      </p>
      <Suspense fallback={<AccountTableSkeleton />}>
        <AccountsData />
      </Suspense>
    </div>
  );
}
