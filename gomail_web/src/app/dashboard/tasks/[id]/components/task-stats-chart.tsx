"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskStatsChartProps {
  totalRecipients: number;
  uniqueOpenCount: number;
  uniqueClickCount: number;
}

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomizedLabelProps) => {
    if (!percent || !midAngle || !innerRadius || !outerRadius) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="#0f172a" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
};

export function TaskStatsChart({ totalRecipients, uniqueOpenCount, uniqueClickCount }: TaskStatsChartProps) {
    if (totalRecipients === 0) {
        return (
            <Card className="h-full flex items-center justify-center">
                <CardHeader>
                    <CardTitle>用户参与度漏斗</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">没有收件人数据可供分析。</p>
                </CardContent>
            </Card>
        );
    }
    
    const unopenedCount = totalRecipients - uniqueOpenCount;
    const openedNotClickedCount = uniqueOpenCount - uniqueClickCount;
  
    const data = [
      { name: '已点击', value: uniqueClickCount },
      { name: '已打开未点击', value: openedNotClickedCount },
      { name: '未打开', value: unopenedCount },
    ];
  
    const COLORS = ['#16a34a', '#f97316', '#6b7280'];
  
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>用户参与度漏斗</CardTitle>
        </CardHeader>
        <CardContent>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                    <Tooltip 
                        formatter={(value: number) => [`${value} 人`, '']}
                        itemStyle={{ fontWeight: 'bold' }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>
    );
  } 