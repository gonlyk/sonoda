'use client'
import { observer } from "mobx-react";
import { tableListData } from "../../store/tableList";

function TableComment() {
  return <h3>{tableListData.currTable?.comment}</h3>
}

export default observer(TableComment)
