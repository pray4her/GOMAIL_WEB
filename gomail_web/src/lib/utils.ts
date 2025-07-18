import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化计划发送时间
 * @param scheduledAt - 计划发送时间字符串
 * @returns 格式化后的时间字符串或"立即发送"
 */
export function formatScheduledTime(scheduledAt: string | null | undefined): string {
  // 检查是否为空值、null、undefined或无效日期
  if (!scheduledAt || scheduledAt === "" || scheduledAt === "0001-01-01T00:00:00Z") {
    return "立即发送";
  }
  
  const date = new Date(scheduledAt);
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return "立即发送";
  }
  
  return date.toLocaleString();
}
