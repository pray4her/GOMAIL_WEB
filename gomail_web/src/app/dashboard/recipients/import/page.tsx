"use client"

import { ImportUploadForm } from "./components/import-upload-form";
import { ImportTasksTable } from "./components/import-tasks-table";
import { useRecipientImportTasks } from "../hooks/use-recipient-import";
import { Separator } from "@/components/ui/separator";

export default function ImportRecipientsPage() {
  const { mutate } = useRecipientImportTasks();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">导入收件人</h1>
        <p className="text-gray-600">
          通过上传文件批量添加收件人，并在这里跟踪您的导入任务。
        </p>
      </div>
      <ImportUploadForm onUploadSuccess={mutate} />
      <Separator />
      <ImportTasksTable />
    </div>
  );
} 