import { CreateTaskForm } from "./components/create-task-form";

export default function CreateTaskPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">创建新邮件任务</h2>
        <p className="text-muted-foreground">
          请填写以下信息来创建一个新的邮件发送任务。
        </p>
      </div>
      <CreateTaskForm />
    </div>
  );
} 