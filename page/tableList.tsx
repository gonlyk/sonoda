'use client'
import { observer } from "mobx-react"
import TableTitle from '../components/table/title'
import TableComment from '../components/table/comment'
import TableContent from '../components/table/table'
import { getRecord, tableListData } from "../store/tableList"
import { hydrate } from "../store/hydrate"
import { useEffect } from "react"

function TableList({ tableInfo }: {
  tableInfo: typeof tableListData.currTable
}) {
  hydrate(() => {
    tableListData.currTable = tableInfo
  })

  useEffect(() => {
    if (tableInfo?.name) {
      getRecord(tableInfo.name)
    }
  }, [])

  return <>
    <TableTitle />
    <TableComment />
    <TableContent />
  </>
}

export default observer(TableList)
