import { cookies } from "next/headers";
import { notFound } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { TaskStatsChart } from './task-stats-chart';

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

export default function TaskDetailsContent({ details }: { details: TaskDetails }) {
    const statusTextMap: { [key: string]: string } = {
        pending: "待处理",
        dispatching: "分发中",
        sending: "发送中",
        completed: "已完成",
        failed: "失败",
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">任务分析：{details.task_name}</h2>
                <p className="text-muted-foreground">查看任务的核心绩效指标和用户参与度分析。</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">任务状态</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                             <Badge>{statusTextMap[details.status] ?? details.status}</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">总收件人数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{details.total_recipients}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">创建时间</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">
                            {format(new Date(details.created_at), "yyyy-MM-dd HH:mm")}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <div className="md:col-span-3">
                    <TaskStatsChart 
                        totalRecipients={details.total_recipients}
                        uniqueOpenCount={details.unique_open_count}
                        uniqueClickCount={details.unique_click_count}
                    />
                </div>
                <div className="grid gap-4 md:col-span-4 md:grid-cols-2">
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">独立打开数 / 打开率</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{details.unique_open_count}</div>
                            <p className="text-xs text-muted-foreground">
                                {`(${(details.unique_open_rate).toFixed(2)}%)`}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">总打开次数</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{details.open_count}</div>
                             <p className="text-xs text-muted-foreground">
                                {`(${(details.open_rate).toFixed(2)}%)`}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">独立点击数 / 点击率</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{details.unique_click_count}</div>
                            <p className="text-xs text-muted-foreground">
                                {`(${(details.unique_click_rate).toFixed(2)}%)`}
                            </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">总点击次数</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{details.click_count}</div>
                            <p className="text-xs text-muted-foreground">
                                {`(${(details.click_rate).toFixed(2)}%)`}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 