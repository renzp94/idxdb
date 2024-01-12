import type { ReactNode } from 'react'
import { Button, Col, FormItemProps, FormProps, Row, Space } from 'antd'
import { Form } from 'antd'
import React from 'react'
import './index.less'
import expandImage from './expand.png'
import { useExpand } from './useTableHeader.hooks'
import classNames from '@renzp/classes'

export interface ProTableHeaderColumn {
  formItemProps?: FormItemProps<any>
  // 列内容元素
  content: ReactNode
  // 包含列的数量
  span?: number
}

export interface ProTableHeaderProps {
  // 表单列
  columns: Array<ProTableHeaderColumn>
  // 一行几列
  colCount?: number
  // 是否展开
  formProps?: FormProps
  // 重置按钮之后是否自动查询
  isResetSearch?: boolean
  // 按钮权限
  buttons?: ['search' | 'reset']
  style?: React.CSSProperties
  className?: string
  // 重置表单
  onReset?: (values: any) => void
}

const ProTableHeader = (props: ProTableHeaderProps) => {
  const {
    columns,
    colCount = 4,
    isResetSearch = true,
    buttons = ['search', 'reset'],
    style,
    className,
    formProps,
  } = props
  const { columnsWitchExpand, btnGroupsSpan, isExpand, onExpandChange, enableExpand } = useExpand(
    columns,
    colCount
  )

  const onReset = (e: any) => {
    e.preventDefault()

    formProps?.form?.resetFields()
    if (isResetSearch) {
      formProps?.form?.submit()
    }
    props?.onReset?.(formProps?.form?.getFieldsValue(true))
  }

  return (
    <div className={classNames(['pro-table-header', className])} style={style}>
      <Form {...formProps}>
        <Row gutter={24}>
          {columnsWitchExpand.map((column, index) => {
            const { isLastRow, hidden, ...formItemProps } = column.formItem ?? {}
            return (
              <Col key={index} span={column.span} hidden={hidden}>
                <Form.Item {...formItemProps} style={isLastRow ? { marginBottom: '0' } : undefined}>
                  {column.content}
                </Form.Item>
              </Col>
            )
          })}
          <Col span={btnGroupsSpan} className="pro-table-header__btn-group">
            <Space>
              {buttons.includes('search') ? (
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              ) : null}
              {buttons.includes('reset') ? (
                <Button type="primary" ghost htmlType="reset" onClick={onReset}>
                  重置
                </Button>
              ) : null}
              {enableExpand && (
                <Button type="text" className="pro-table-header__expand" onClick={onExpandChange}>
                  {isExpand ? (
                    <div className="expand-item">
                      收起{' '}
                      <img src={expandImage} className="expand-icon expand-icon--close" alt="" />
                    </div>
                  ) : (
                    <div className="expand-item">
                      展开 <img src={expandImage} className="expand-icon" alt="" />
                    </div>
                  )}
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default ProTableHeader
