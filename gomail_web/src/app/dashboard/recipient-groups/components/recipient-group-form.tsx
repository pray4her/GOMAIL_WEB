"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  RecipientGroup,
} from "../hooks/use-recipient-groups";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { XIcon, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const ruleSchema = z.object({
  field: z.string().min(1, "字段为必填项"),
  operator: z.enum(["eq", "neq", "contains", "gt", "gte", "lt", "lte"]),
  value: z.string().min(1, "值为必填项"),
});

const formSchema = z
  .object({
    name: z.string().min(1, "分群名称为必填项"),
    description: z.string().optional(),
    group_type: z.enum(["dynamic", "static"]),
    rules: z.array(ruleSchema).optional(),
    member_ids_text: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.group_type === "dynamic") {
        return data.rules && data.rules.length > 0;
      }
      return true;
    },
    {
      message: "动态分群至少需要一条规则",
      path: ["rules"],
    }
  )
  .refine(
    (data) => {
      if (data.group_type === "static") {
        return !!data.member_ids_text;
      }
      return true;
    },
    {
      message: "静态分群需要填写成员ID",
      path: ["member_ids_text"],
    }
  );

export type RecipientGroupFormValues = z.infer<typeof formSchema>;

interface Payload {
    name: string;
    description?: string;
    group_type: "dynamic" | "static";
    rules?: { field: string; operator: "eq" | "neq" | "contains" | "gt" | "gte" | "lt" | "lte"; value: string }[];
    member_ids?: number[];
}

interface RecipientGroupFormProps {
  initialData?: RecipientGroup | null;
  onSubmit: (values: Payload) => Promise<void>;
  isSubmitting: boolean;
}

export function RecipientGroupForm({
  initialData,
  onSubmit,
  isSubmitting,
}: RecipientGroupFormProps) {
  const form = useForm<RecipientGroupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      group_type: initialData?.group_type ?? "dynamic",
      rules: initialData?.rules ?? [{ field: "", operator: "eq", value: "" }],
      member_ids_text: initialData?.member_ids?.join(", ") ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const groupType = form.watch("group_type");

  const handleFormSubmit = (values: RecipientGroupFormValues) => {
    const payload: Payload = {
        name: values.name,
        description: values.description,
        group_type: values.group_type,
    }

    if (values.group_type === 'dynamic') {
        payload.rules = values.rules?.map(rule => ({
            ...rule,
            field: rule.field.startsWith('metadata.') ? rule.field : `metadata.${rule.field}`
        }));
    } else {
        payload.member_ids = values.member_ids_text
            ?.split(',')
            .map(id => parseInt(id.trim(), 10))
            .filter(id => !isNaN(id));
    }
    
    return onSubmit(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>分群名称</FormLabel>
              <FormControl>
                <Input placeholder="例如：美国活跃用户" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea placeholder="描述这个分群的特点..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>分群类型</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="dynamic" />
                    </FormControl>
                    <FormLabel className="font-normal">动态</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="static" />
                    </FormControl>
                    <FormLabel className="font-normal">静态</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {groupType === "dynamic" && (
          <div className="space-y-4 rounded-md border p-4">
            <h4 className="font-medium">动态规则</h4>
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-start gap-2">
                <FormField
                  control={form.control}
                  name={`rules.${index}.field`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="元数据字段 (如: country, sent_count)" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`rules.${index}.operator`}
                  render={({ field }) => (
                    <FormItem>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="操作符" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="eq">等于</SelectItem>
                          <SelectItem value="neq">不等于</SelectItem>
                          <SelectItem value="contains">包含</SelectItem>
                          <SelectItem value="gt">大于</SelectItem>
                          <SelectItem value="gte">大于等于</SelectItem>
                          <SelectItem value="lt">小于</SelectItem>
                          <SelectItem value="lte">小于等于</SelectItem>
                        </SelectContent>
                      </Select>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`rules.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="值 (e.g. USA)" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
             <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ field: "", operator: "eq", value: "" })}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> 添加规则
            </Button>
            <FormField
                control={form.control}
                name="rules"
                render={() => (
                    <FormItem>
                         <FormMessage />
                    </FormItem>
                )}
            />
          </div>
        )}

        {groupType === "static" && (
          <div className="space-y-2 rounded-md border p-4">
             <h4 className="font-medium">静态成员</h4>
            <FormField
              control={form.control}
              name="member_ids_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>收件人ID列表</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="输入收件人ID，用逗号分隔 (e.g. 1, 2, 3)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    请提供一个或多个收件人的数字ID，并用逗号分隔。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "提交中..." : "提交"}
        </Button>
      </form>
    </Form>
  );
} 