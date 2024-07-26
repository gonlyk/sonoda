import { getTableInfo } from "../../../../api/table";
import CommonLayoutWrapper from "../../../../components/layout/commonLayoutWrapper";
import TableForm from "../../../../page/tableForm";
import { ResultCode } from "../../../../utils/result";

export default async function CreateTable({ params }: { params: { name: string } }) {
  const res = await getTableInfo(params.name)

  if (res.retCode !== ResultCode.SUCCESS) {
    throw new Error('get table fail')
  }

  return <CommonLayoutWrapper>
    <TableForm mode="update" tableInfo={res.data} />
  </CommonLayoutWrapper>
}


