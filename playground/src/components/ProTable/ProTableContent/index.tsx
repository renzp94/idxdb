import type { TableProps } from 'antd'
import { Table } from 'antd'
import React from 'react'
import './index.less'
import classNames from '@renzp/classes'
import { useTablePagination } from '../hook'

export interface ProTableContentProps extends TableProps<any> {
  contentRef?: React.RefObject<HTMLDivElement>
  tableRef?: any
  tools?: React.ReactNode
  contentStyle?: React.CSSProperties
  contentClassName?: string
}

const ProTableContent = ({
  tools,
  tableRef,
  contentRef,
  contentStyle,
  contentClassName,
  ...tableProps
}: ProTableContentProps) => {
  const { bordered = true } = tableProps
  const pagination = useTablePagination(tableProps.pagination)

  return (
    <div
      className={classNames(['pro-table-content', contentClassName])}
      ref={contentRef}
      style={contentStyle}
    >
      {tools ? <div className="pro-table-content__tools">{tools}</div> : null}
      <Table ref={tableRef} {...tableProps} pagination={pagination} bordered={bordered} />
    </div>
  )
}

export default ProTableContent
