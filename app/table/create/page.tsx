import CommonLayoutWrapper from "../../../components/layout/commonLayoutWrapper";
import TableForm from "../../../page/tableForm";
import '../../../asserts/table-form.scss'

export default function CreateTable() {

  return <div className="sonoda-create-table">
    <CommonLayoutWrapper>
      <TableForm mode="create" />
    </CommonLayoutWrapper>
  </div>
}


