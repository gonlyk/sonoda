'use client'
import { Table, TableColumnType } from "antd";
import { observer } from "mobx-react";
import { useMemo } from "react";
import { tableListData } from "../../store/tableList";

function TableContent() {
  const columns = useMemo<TableColumnType<any>[]>(() => [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id'
    }
  ].concat((tableListData.currTable?.columns || []).map(col => {
    return {
      title: col.title,
      key: col.name,
      dataIndex: col.name
    }
  })), [tableListData.currTable?.columns])
  return <Table columns={columns} dataSource={tableListData.list.list} />
}

export default observer(TableContent)
