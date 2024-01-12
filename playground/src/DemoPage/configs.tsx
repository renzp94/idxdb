import { Input, InputNumber } from 'antd'
import React from 'react'

export const headerColumns = [
  {
    formItemProps: {
      name: 'name',
      label: '用户名',
    },
    content: <Input placeholder="请输入用户名" />,
  },
  {
    formItemProps: {
      name: 'age',
      label: '年龄',
    },
    content: <InputNumber placeholder="请输入年龄" min={1} max={150} />,
  },
]

export const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
]
