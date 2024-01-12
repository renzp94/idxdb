import type { ProTableHeaderProps } from './ProTableHeader'
import type { ProTableContentProps } from './ProTableContent'
import React from 'react'
import ProTableHeader from './ProTableHeader'
import ProTableContent from './ProTableContent'
import './index.less'

export interface ProTableProps extends ProTableContentProps {
  header?: ProTableHeaderProps
}

const ProTable = ({ header, ...contentProps }: ProTableProps) => {
  return (
    <div className="pro-table">
      {header ? <ProTableHeader {...header} /> : null}
      <ProTableContent {...contentProps} />
    </div>
  )
}

export default ProTable

export * from './hook'
