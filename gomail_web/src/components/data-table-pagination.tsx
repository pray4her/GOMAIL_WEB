"use client"

import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  manualPagination?: boolean
  pageCount?: number
}

export function DataTablePagination<TData>({
  table,
  manualPagination = false,
  pageCount,
}: DataTablePaginationProps<TData>) {
  // 计算当前页码和总页数
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = manualPagination && pageCount ? pageCount : table.getPageCount()
  
  // 计算记录信息
  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length
  const totalRowsCount = manualPagination 
    ? undefined // 手动分页时我们无法获取总记录数
    : table.getFilteredRowModel().rows.length

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedRowsCount > 0 && (
          <>
            已选择 {selectedRowsCount} 条记录
            {totalRowsCount && ` / 共 ${totalRowsCount} 条`}
          </>
        )}
        {selectedRowsCount === 0 && totalRowsCount && (
          `共 ${totalRowsCount} 条记录`
        )}
        {manualPagination && !totalRowsCount && selectedRowsCount === 0 && (
          `第 ${currentPage} 页，共 ${totalPages} 页`
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">每页显示</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          第 {currentPage} 页，共 {totalPages} 页
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">跳转到首页</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">上一页</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">下一页</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">跳转到尾页</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
} 