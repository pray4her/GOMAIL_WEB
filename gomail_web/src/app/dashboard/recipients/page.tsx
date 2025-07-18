import { Suspense } from "react";
import { cookies } from "next/headers";
import { RecipientTable } from "./components/recipient-table";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginatedRecipients } from "./hooks/use-recipients";

// 明确声明此页面需要动态渲染（因为使用了 cookies）
export const dynamic = 'force-dynamic';

async function getRecipients(): Promise<PaginatedRecipients> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gomail_token")?.value;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipients?page=1&pageSize=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch recipients on server:", res.statusText);
      throw new Error("Failed to fetch recipients.");
    }

    const body = await res.json();
    
    if (body.error) {
      console.error("API error on server fetch:", body.error);
      throw new Error(body.error);
    }

    // 根据API指南，收件人接口返回的结构应该是 { data: { recipients: [], pagination: {} } }
    // 但我们的hook期望的是 { records: [], pagination: {} }
    return {
      records: body.data.recipients || [],
      pagination: {
        page: body.data.pagination?.page || 1,
        pageSize: body.data.pagination?.pageSize || 10,
        total_records: body.data.pagination?.total || 0,
        total_pages: body.data.pagination?.total_pages || 0,
      },
    };

  } catch (error) {
    console.error("Failed to fetch initial recipients:", error);
    // 返回一个符合 PaginatedRecipients 结构的空状态
    return {
      records: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total_records: 0,
        total_pages: 0,
      },
    };
  }
}

function RecipientTableSkeleton() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border p-4">
          <div className="h-96 w-full animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }
  

export default async function RecipientsPage() {
  const initialData = await getRecipients();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">收件人管理</h1>
      <p className="text-gray-600 mb-6">在这里管理您的所有收件人。</p>
      <Suspense fallback={<RecipientTableSkeleton />}>
        <RecipientTable fallbackData={initialData} />
      </Suspense>
    </div>
  );
}