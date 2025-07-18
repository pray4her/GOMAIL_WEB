"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";

// API aata interfaces based on API guide
interface RecipientGroup {
  id: number;
  name: string;
}

interface Template {
  id: number;
  name: string;
}

const listFetcher = async (url: string) => {
  const data: { [key: string]: any } = await apiClient.get<any>(url);
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
    if (arrayKey) {
      return data[arrayKey];
    }
  }
  return data ?? [];
};

const formSchema = z
  .object({
    task_name: z.string().min(1, { message: "任务名称不能为空" }),
    recipient_group_id: z.number({
      required_error: "请选择一个收件人分群",
      invalid_type_error: "请选择一个收件人分群",
    }),
    template_id: z.number({
      required_error: "请选择一个邮件模板",
      invalid_type_error: "请选择一个邮件模板",
    }),
    send_type: z.enum(["instant", "scheduled"], {
      required_error: "请选择发送类型",
    }),
    scheduled_at: z.date().optional(),
    send_limit: z.coerce
      .number({ invalid_type_error: "发送数量必须是数字" })
      .int()
      .min(0, "发送数量不能为负数")
      .optional()
      .or(z.literal("")),
    send_offset: z.coerce
      .number({ invalid_type_error: "跳过数量必须是数字" })
      .int()
      .min(0, "跳过数量不能为负数")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.send_type === "scheduled") {
        return data.scheduled_at !== undefined;
      }
      return true;
    },
    {
      message: "定时发送必须选择一个发送时间",
      path: ["scheduled_at"],
    }
  );

type CreateTaskFormValues = z.infer<typeof formSchema>;

export function CreateTaskForm() {
  const router = useRouter();

  const {
    data: recipientGroups,
    isLoading: isLoadingGroups,
    error: errorGroups,
  } = useSWR<RecipientGroup[]>("/recipient-groups", listFetcher);
  
  const {
    data: templates,
    isLoading: isLoadingTemplates,
    error: errorTemplates,
  } = useSWR<Template[]>("/templates", listFetcher);

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task_name: "",
      send_type: "instant",
      send_limit: "",
      send_offset: "",
    },
  });

  const onSubmit = async (values: CreateTaskFormValues) => {
    try {
      // Create a deep copy to avoid modifying the original form values
      const rawPayload: Omit<CreateTaskFormValues, "send_type"> & { scheduled_at?: string } = JSON.parse(JSON.stringify(values));

      // Clean up the payload by removing empty strings and convert date
      const payload = Object.entries(rawPayload).reduce((acc, [key, value]) => {
        if (key === "send_type") return acc;

        if (key === "scheduled_at" && values.send_type === "scheduled" && values.scheduled_at) {
          (acc as any)[key] = formatInTimeZone(values.scheduled_at, 'Asia/Shanghai', "yyyy-MM-dd'T'HH:mm:ssXXX");
        } else if (value !== "" && value !== null && value !== undefined) {
          (acc as any)[key] = value;
        }
        return acc;
      }, {} as any);

      if (values.send_type === "instant") {
        delete payload.scheduled_at;
      }

      await apiClient.post("/tasks", payload);
      toast.success("邮件任务创建成功！");
      router.push("/dashboard/tasks");
      router.refresh(); 
    } catch (error: any) {
      toast.error("创建失败", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  if (errorGroups || errorTemplates) {
    toast.error("加载数据失败", {
        description: "无法获取收件人分群或模板列表，请刷新页面重试。",
    });
    return <div className="text-red-500">加载依赖数据失败，请检查网络连接或联系管理员。</div>
  }
  
  const sendType = form.watch("send_type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="task_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>任务名称</FormLabel>
              <FormControl>
                <Input placeholder="例如：2024年第四季度营销邮件" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="send_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>发送方式</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="instant" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      立即发送
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="scheduled" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      定时发送
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {sendType === 'scheduled' && (
          <FormField
            control={form.control}
            name="scheduled_at"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>预定发送时间</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd HH:mm")
                        ) : (
                          <span>选择日期和时间</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        const newDate = field.value || new Date();
                        if(date) {
                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                            field.onChange(newDate);
                        }
                      }}
                      initialFocus
                    />
                     <div className="p-2 border-t border-border">
                        <label htmlFor="time-input" className="text-sm">时间 (HH:mm)</label>
                        <Input
                            id="time-input"
                            type="time"
                            defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                                const newDate = field.value || new Date();
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                            }}
                        />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="send_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>本次发送数量</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="可选。留空则发送分群中的所有收件人"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="send_offset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>跳过数量 (从第几个开始)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="可选。默认从 0 开始"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {isLoadingGroups ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
            <FormField
            control={form.control}
            name="recipient_group_id"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>收件人分群</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value
                            ? recipientGroups?.find(
                                (group) => group.id === field.value
                            )?.name
                            : "选择一个收件人分群"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="搜索分群..." />
                        <CommandList>
                        <CommandEmpty>未找到任何分群。</CommandEmpty>
                        <CommandGroup>
                            {recipientGroups?.map((group) => (
                            <CommandItem
                                value={group.name}
                                key={group.id}
                                onSelect={() => {
                                form.setValue("recipient_group_id", group.id);
                                }}
                            >
                                <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    group.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                                />
                                {group.name}
                            </CommandItem>
                            ))}
                        </CommandGroup>
                        </CommandList>
                    </Command>
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        )}

        {isLoadingTemplates ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
            <FormField
            control={form.control}
            name="template_id"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>邮件模板</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value
                            ? templates?.find(
                                (template) => template.id === field.value
                            )?.name
                            : "选择一个邮件模板"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="搜索模板..." />
                        <CommandList>
                        <CommandEmpty>未找到任何模板。</CommandEmpty>
                        <CommandGroup>
                            {templates?.map((template) => (
                            <CommandItem
                                value={template.name}
                                key={template.id}
                                onSelect={() => {
                                form.setValue("template_id", template.id);
                                }}
                            >
                                <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    template.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                                />
                                {template.name}
                            </CommandItem>
                            ))}
                        </CommandGroup>
                        </CommandList>
                    </Command>
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "创建中..." : "创建任务"}
        </Button>
      </form>
    </Form>
  );
} 