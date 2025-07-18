"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardTimeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const timeRangeOptions = [
  { value: "7", label: "最近 7 天" },
  { value: "30", label: "最近 30 天" },
  { value: "90", label: "最近 90 天" },
];

export function DashboardTimeSelector({ 
  selectedRange, 
  onRangeChange 
}: DashboardTimeSelectorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">时间范围</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedRange} onValueChange={onRangeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择时间范围" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
} 