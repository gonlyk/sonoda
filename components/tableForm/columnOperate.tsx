import { DeleteOutlined, DownCircleOutlined, PlusSquareOutlined, UpCircleOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { observer } from "mobx-react";
import { newColumn, tableFormData } from "../../store/tableForm";
import { runInAction } from "mobx";

function ColumnOperate({ index, disabledModify }: {
  index: number,
  disabledModify: boolean
}) {
  const columns = tableFormData.columns
  return <Space>
    <PlusSquareOutlined onClick={e => {
      e.stopPropagation()
      runInAction(() => {
        const newCol = newColumn()
        columns.splice(index + 1, 0, newCol)
        console.log(tableFormData.openCollapseKeys)
        tableFormData.openCollapseKeys.push(newCol.key)
        console.log(tableFormData.openCollapseKeys)
      })
    }} />
    {
      index > 0
        ? <UpCircleOutlined onClick={e => {
          e.stopPropagation()
          runInAction(() => ([columns[index], columns[index - 1]] = [columns[index - 1], columns[index]]))
        }} />
        : null
    }
    {
      index < columns.length - 1
        ? <DownCircleOutlined onClick={e => {
          e.stopPropagation()
          runInAction(() => ([columns[index], columns[index + 1]] = [columns[index + 1], columns[index]]))
        }} />
        : null
    }
    {
      !disabledModify
        ? <DeleteOutlined onClick={e => {
          e.stopPropagation()
          runInAction(() => {
            const [del] = columns.splice(index, 1)
            tableFormData.openCollapseKeys = tableFormData.openCollapseKeys.filter(key => key !== del.key)
          })
        }} />
        : null
    }
  </Space>
}

export default observer(ColumnOperate)
