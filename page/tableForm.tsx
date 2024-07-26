'use client'
import { Button, Divider, Steps } from "antd"
import { initTable, tableFormData } from "../store/tableForm"
import { observer } from "mobx-react"
import { hydrateOnce } from "../store/hydrate"
import TableBaseForm from "../components/tableForm/tableBaseForm"
import ColumnsForm from "../components/tableForm/columnsForm"

function TableForm({ mode, tableInfo }: { mode: 'create' | 'update', tableInfo?: any }) {
  hydrateOnce(TableForm, () => {
    initTable(tableInfo)
    tableFormData.openCollapseKeys = tableFormData.columns.filter(col => col.name !== 'id').map(col => col.key)
    tableFormData.isModify = mode === 'update'
  })

  const stepCmp = () => {
    switch (tableFormData.step) {
      case 0: {
        return <TableBaseForm  />
      }
      case 1: {
        return <ColumnsForm />
      }
    }
  }

  return <div className="table-info-form">
    <div className="table-info-content">
      {stepCmp()}
    </div>
    <Divider type="vertical" className="table-info-divider" />
    <div className="table-info-steps">
      <div className="table-info-steps-content">
      <Steps direction="vertical"
        current={tableFormData.step}
        items={[
          { title: '基本信息' },
          { title: '列信息' }
        ]} />
      </div>
    </div>
  </div>
}

export default observer(TableForm)