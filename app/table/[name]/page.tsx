import { getTableInfo } from '../../../api/table'
import CommonLayoutWrapper from '../../../components/layout/commonLayoutWrapper'
import TableList from '../../../page/tableList'
import { ResultCode } from '../../../utils/result'

export default async function Table({ params }: { params: { name: string } }) {
  const res = await getTableInfo(params.name)

  if (res.retCode !== ResultCode.SUCCESS) {
    throw new Error('get table fail')
  }

  return <CommonLayoutWrapper>
    <TableList tableInfo={res.data} />
  </CommonLayoutWrapper>
}


