import type { ColumnType } from 'antd/lib/table'
import type {
  AntdTableOptions,
  Data,
  Params,
  Service,
  AntdTableResult,
} from 'ahooks/lib/useAntdTable/types'
import {  TablePaginationConfig } from 'antd'
import { useAntdTable } from 'ahooks'
import React from 'react'

export const isUndef = (v: unknown): boolean => v === undefined || v === null
const DEFAULT_PAGE_SIZE = 10

/**
 * 序号列配置hooks
 * @param orderNumberColumnProps 序号列配置
 * @returns 返回序号列配置
 */
export const useOrderNumberColumn = (orderNumberColumnProps?: ColumnType<any>) => {
  return {
    key: 'table_row_index',
    title: '序号',
    width: 65,
    render: (_t: unknown, _r: unknown, index: number) => index + 1,
    hidden: false,
    ...(orderNumberColumnProps ?? {}),
  }
}
/**
 * 分页hooks
 * @param pagination 分页配置
 * @returns 返回分页配置
 */
export const useTablePagination = (pagination?: false | TablePaginationConfig) => {
  const defaultPagination = {
    pageSize: (pagination as TablePaginationConfig)?.pageSize ?? DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) =>
      `共 ${total} 条记录  第 ${(pagination as TablePaginationConfig)?.current ?? 1} / ${Math.ceil(
        total / ((pagination as TablePaginationConfig)?.pageSize ?? DEFAULT_PAGE_SIZE)
      )} 页`,
  }

  let tablePagination = pagination === false ? false : pagination
  if (tablePagination !== false) {
    tablePagination = isUndef(tablePagination)
      ? defaultPagination
      : {
          ...defaultPagination,
          ...tablePagination,
        }
  }

  return tablePagination
}

export interface UseProTableOptions<T extends Data, P extends Params>
  extends AntdTableOptions<T, P> {
  // 排序是否请求数据
  isSortFetch?: boolean
}

export type UseProTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options?: UseProTableOptions<TData, TParams>
) => AntdTableResult<TData, TParams>
/**
 * ahooks的useAntdTable二次封装
 * @param service 请求函数
 * @param options 配置项
 * @returns 返回表格配置项
 */
export const useProTable: UseProTable = (service, options) => {
  const { isSortFetch, ...useAntdTableOptions } = options ?? {}
  const tableOptions = useAntdTable(service, {
    defaultPageSize: DEFAULT_PAGE_SIZE,
    ...useAntdTableOptions,
    defaultType: 'advance',
  })
  if ((tableOptions?.data as any)?.pageNo) {
    tableOptions.pagination.current = (tableOptions?.data as any)?.pageNo
  }

  if (!isSortFetch) {
    // 处理前端排序，禁止请求数据
    const onTableChange = tableOptions.tableProps.onChange
    const onChange = (
      pagination: unknown,
      filter: unknown,
      sorter: unknown,
      { action }: { action: string }
    ) => {
      if (action !== 'sort') {
        onTableChange(pagination, filter, sorter)
      }
    }
    tableOptions.tableProps.onChange = onChange as any
  }

  return tableOptions
}
