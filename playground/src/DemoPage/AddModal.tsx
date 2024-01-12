import { useIdxDB } from '@/utils/db'
import { useAsyncEffect } from 'ahooks'
import { Form, Input, InputNumber, Modal, ModalProps, message } from 'antd'
import React from 'react'

export interface AddModalProps extends ModalProps {
  id?: string
}

const AddModal = ({ id, ...modalProps }: AddModalProps) => {
  const [form] = Form.useForm()
  const idxDB = useIdxDB()

  useAsyncEffect(async () => {
    if (id && modalProps.open) {
      const data = await idxDB?.store('t_user')?.getByKey(id)
      form.setFieldsValue(data)
    }
  }, [modalProps.open, id, form])

  const onFinish = async (e: any) => {
    const values = await form.validateFields()
    const method = id ? 'updateByKeyPath' : 'add'
    await idxDB?.store('t_user')?.[method]({
      id: id ?? Date.now(),
      ...values,
    })

    message.success('操作成功')
    modalProps.onCancel?.(e)
    modalProps.onOk?.(e)
  }

  const onAfterClose = () => {
    form.resetFields()
  }

  return (
    <Modal {...modalProps} onOk={onFinish} afterClose={onAfterClose}>
      <Form form={form}>
        <Form.Item name="name" label="姓名">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item name="age" label="年龄">
          <InputNumber
            placeholder="请输入年龄"
            min={1}
            max={150}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddModal
