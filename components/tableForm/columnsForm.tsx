'use client'

import { useForm } from "antd/es/form/Form"
import { hydrateOnce } from "../../store/hydrate"
import { initTable, tableFormData, validateColumns } from "../../store/tableForm"
import { Button, Collapse, Form, message } from "antd"
import { runInAction } from "mobx"
import ColumnOperate from "./columnOperate"
import ColumnForm from "./columnForm"
import { observer } from "mobx-react"
import { createTable } from "../../api/table"

function ColumnsForm() {
  const submit = () => {
    const valid = validateColumns()
    if (valid) {
      createTable(
        tableFormData.base,
        tableFormData.columns.filter(col => col.name !== 'id').map((col, index) => {
          return {
            name: col.name,
            title: col.title,
            type: col.type,
            typeSize: col.typeSize,
            increase: col.increase,
            required: col.required,
            index: index,
            uniqueValue: col.uniqueValue,
            defaultValue: col.defaultValue,
            controller: {
              type: col.controller.type,
              data: col.controller.extraType
                ? {
                  type: col.controller.extraType,
                  value: col.controller.data[col.controller.extraType]
                }
                : void 0
            },
            comment: col.comment,
          }
        })
      )
    } else {
      message.error('表单错误')
    }
  }

  return <Form>
    <Collapse activeKey={tableFormData.openCollapseKeys}
      className="table-info-columns"
      onChange={keys => {
        runInAction(() => tableFormData.openCollapseKeys = keys as string[])
      }}
      items={tableFormData.columns.map((col, index) => ({
        key: col.key,
        label: tableFormData.columnErrors.get(index)?.size
          ? <span style={{ color: 'red' }}>{col.title}</span>
          : col.title,
        extra: <ColumnOperate index={index} disabledModify={col.name === 'id'} />,
        children: <ColumnForm index={index} disabled={col.name === 'id'} />
      }))} />
    <Button.Group style={{ margin: '20px 10px' }}>
      <Button onClick={() => runInAction(() => tableFormData.step = 0)}>返回</Button>
      <Button onClick={submit}
        type="primary">确定</Button>
    </Button.Group>
  </Form>
}

export default observer(ColumnsForm)