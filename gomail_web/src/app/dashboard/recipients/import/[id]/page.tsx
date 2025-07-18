import { Suspense } from "react";
import { cookies } from "next/headers";
import { RecipientImportTask } from "@/types/recipient";
import { TaskDetailsContent } from "./components/task-details-content";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getTask(taskId: number): Promise<RecipientImportTask | null> {
  if (isNaN(taskId)) {
    return null;
  }
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gomail_token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipients/import-tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch task: ${res.statusText}`);
    }

    const body = await res.json();
    return body.data;

  } catch (error) {
    console.error("Failed to fetch initial task details:", error);
    return null;
  }
}

async function TaskDetailsView({ taskId }: { taskId: number }) {
  const initialData = await getTask(taskId);

  if (!initialData) {
    notFound();
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-2">导入任务详情</h1>
        <p className="text-gray-600">
          查看导入任务 #{initialData.id} 的详细信息和进度。
        </p>
      </div>
      <TaskDetailsContent taskId={taskId} initialData={initialData} />
    </>
  )
}


export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const taskId = parseInt(id, 10);

  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <TaskDetailsView taskId={taskId} />
      </Suspense>
    </div>
  );
} 