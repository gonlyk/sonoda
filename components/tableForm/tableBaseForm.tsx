import { Button, Form, Input, message } from "antd";
import { observer } from "mobx-react";
import { tableFormData, validateBase } from "../../store/tableForm";
import { runInAction } from "mobx";

const { Item } = Form

function TableBaseForm() {
  const isModify = tableFormData.isModify
  const nextStep = () => {
    const valid = validateBase()
    if (valid) {
      runInAction(() => {
        tableFormData.step = 1
      })
    }
  }
  return <Form>
    <Item label="表名" required
      {...tableFormData.baseErrors.get('name') || {}}>
      <Input disabled={isModify} value={tableFormData.base.name}
        onChange={e => runInAction(() => tableFormData.base.name = e.target.value)} />
    </Item>
    <Item label="显示名" required
      {...tableFormData.baseErrors.get('title') || {}}>
      <Input disabled={isModify}
        value={tableFormData.base.title}
        onChange={e => runInAction(() => tableFormData.base.title = e.target.value)} />
    </Item>
    <Item label="注释">
      <Input value={tableFormData.base.comment}
        onChange={e => runInAction(() => tableFormData.base.comment = e.target.value)} />
    </Item>
    <Button style={{ margin: '20px 10px' }}
      type="primary"
      onClick={nextStep}>下一步</Button>
  </Form>
}

export default observer(TableBaseForm)
