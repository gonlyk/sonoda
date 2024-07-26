import { ReactNode } from "react"
import CommonLayout from "./commonLayout"
import { tableListData } from "../../store/tableList"
import { getUserTables } from "../../api/table"
import { ResultCode } from "../../utils/result"

export default async function CommonLayoutWrapper({ children }: { children: ReactNode }) {
  const res = await getUserTables()

  if (res.retCode !== ResultCode.SUCCESS) {
    throw new Error('get menu fail')
  }
  console.log('CommonLayoutWrapper', tableListData.tables)
  return <CommonLayout tables={res.data as any}>{children}</CommonLayout>
}