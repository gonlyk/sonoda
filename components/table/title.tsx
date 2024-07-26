'use client'
import { observer } from "mobx-react";
import { tableListData } from "../../store/tableList";

function TableTitle() {
  return <h2>{tableListData.currTable?.title}（{tableListData.currTable?.name}）</h2>
}

export default observer(TableTitle)
