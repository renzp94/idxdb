import { ProTable } from '@/components'
import { useProTable } from '@/components/ProTable'
import { useIdxDB } from '@/utils/db'
import useModal from '@/utils/useModal'
import type { Data, Params, Service } from 'ahooks/lib/useAntdTable/types'
import { App, Button, Divider, Form, Space } from 'antd'
import React from 'react'
import AddModal from './AddModal'
import { columns, headerColumns } from './configs'

const DemoPage = () => {
  const idxDB = useIdxDB()
  const { modal, message } = App.useApp()
  const [form] = Form.useForm()
  const { showModal, modalProps, modalData, setModalData, setTitle } =
    useModal<string>()

  const getList: Service<Data, Params> = async ({ current }, formData) => {
    if (!idxDB) {
      return {
        pageNo: current,
        total: 0,
        list: [],
      }
    }
    const data = await idxDB?.store('t_user')?.getQuery({ values: formData })

    return {
      pageNo: current,
      total: data?.length ?? 0,
      list: data ?? [],
    }
  }
  const { tableProps, search, refresh } = useProTable(getList, {
    refreshDeps: [idxDB],
    form,
  })

  const onShowAddModal = () => {
    setTitle('新增')
    showModal()
  }

  const onBatchAdd = async () => {
    await idxDB?.store('t_user')?.addList([
      {
        id: Date.now(),
        name: '批量添加1',
        age: 18,
      },
      {
        id: Date.now() + 1,
        name: '批量添加2',
        age: 18,
      },
    ])
    message.success('操作成功')
    refresh()
  }

  const onBatchUpdate = async () => {
    const data = tableProps.dataSource.map((item) => ({
      ...item,
      age: Math.ceil(Math.random() * 100),
    }))
    await idxDB?.store('t_user')?.updateListByKeyPath(data)
    message.success('操作成功')
    refresh()
  }

  const tools = (
    <Space>
      <Button type="primary" onClick={onShowAddModal}>
        新增
      </Button>
      <Button type="primary" onClick={onBatchAdd}>
        批量新增
      </Button>
      <Button type="primary" onClick={onBatchUpdate}>
        批量更新
      </Button>
    </Space>
  )

  const onRemove = (id: string) => {
    modal.confirm({
      title: '删除警告',
      content: '此操作将删除此数据，确定继续?',
      onOk: async () => {
        await idxDB?.store('t_user')?.deleteByKey(id)
        refresh()
      },
    })
  }

  const onEdit = (id: string) => {
    setModalData(id)
    setTitle('编辑')
    showModal()
  }

  const actionColumn = {
    title: '操作',
    dataIndex: 'action',
    width: 180,
    render: (_: unknown, record: any) => {
      return (
        <Space split={<Divider type="vertical" />} size={0}>
          <Button type="link" onClick={() => onRemove(record.id)}>
            删除
          </Button>
          <Button type="link" onClick={() => onEdit(record.id)}>
            编辑
          </Button>
        </Space>
      )
    },
  }

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <ProTable
        header={{
          columns: headerColumns,
          formProps: { onFinish: search.submit, form },
        }}
        rowKey="id"
        tools={tools}
        style={{ width: '80vw' }}
        columns={[...columns, actionColumn]}
        {...tableProps}
      />
      <AddModal id={modalData} {...modalProps} onOk={refresh} />
    </div>
  )
}

export default DemoPage
