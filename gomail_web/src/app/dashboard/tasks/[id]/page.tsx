import { cookies } from "next/headers";
import { notFound } from 'next/navigation';
import TaskDetailsContent from './components/task-details-content';

interface TaskDetails {
    id: number;
    task_name: string;
    status: "pending" | "dispatching" | "sending" | "completed" | "failed";
    total_recipients: number;
    open_count: number;
    click_count: number;
    unique_open_count: number;
    unique_click_count: number;
    open_rate: number;
    click_rate: number;
    unique_open_rate: number;
    unique_click_rate: number;
    created_at: string;
}

async function getTaskDetails(id: string): Promise<TaskDetails | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("gomail_token")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to fetch task details on server:", res.statusText);
            return null;
        }

        const body = await res.json();
        
        if (body.error) {
            console.error("API error on server fetch:", body.error);
            return null;
        }

        return body.data;
    } catch (error) {
        console.error("Failed to fetch task details:", error);
        return null;
    }
}

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const details = await getTaskDetails(id);

  if (!details) {
    notFound();
  }
  
  return <TaskDetailsContent details={details} />;
} 