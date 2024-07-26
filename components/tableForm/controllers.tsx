import { AutoComplete, Cascader, Checkbox, ColorPicker, DatePicker, Input, InputNumber, Radio, Select, Switch, TimePicker, message } from "antd";
import { BaseControllerDataType, ControllerDataType, ControllerType, ExternalApi, ExternalTableKV, ExternalTableTree, KV, KVTree, Label } from "../../shared/controllerType";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { createFetcher, getFetcer } from "../../api";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { getTableData } from "../../api/table";
import { ResultCode } from "../../utils/result";
import Dayjs from "dayjs";
import { observer } from "mobx-react";
import { Column } from "../../store/tableForm";
import { autorun } from "mobx";

function Controllers({ value, onChange, type, controller }: {
  value?: any
  onChange?: (val: any) => void
  type: ControllerType
  controller: Column['controller']
}) {
  const [externalData, setExternalData] = useState<KV['value'] | KVTree['value']>()

  useEffect(() => {
    autorun(() => {
      setExternalData(void 0)
      if (controller.extraType === ControllerDataType.ExternalApi) {
        const value = controller.data[ControllerDataType.ExternalApi]
        if (value) {
          const fetcher = createFetcher(value.url, value.url)
          fetcher.get({ url: '/' })
            .then(res => {
              if (res) {
                setExternalData(res)
              }
            })
            .catch(() => {
              message.error('不正确的api')
            })
        }
      } else if (controller.extraType === ControllerDataType.ExternalTableKV) {
        const { table, labelColumn, valueColumn } = controller.data[ControllerDataType.ExternalTableKV]
        if (table && labelColumn && valueColumn) {
          getTableData(table)
            .then(res => {
              if (res.retCode === ResultCode.SUCCESS) {
                const data = res.data.list.map(item => ({ label: item[labelColumn], value: item[valueColumn] }))
                setExternalData(data)
              }
            })
        }
      } else if (controller.extraType === ControllerDataType.ExternalTableTree) {
        const { table, labelColumn, valueColumn, parentColumn } = controller.data[ControllerDataType.ExternalTableTree]
        if (table && labelColumn && valueColumn && parentColumn) {
          getTableData(table)
            .then(res => {
              if (res.retCode === ResultCode.SUCCESS) {
                // const data = res.data.list.map(item => ({ label: item[labelColumn], value: item[valueColumn] }))
                // setExternalData(data)
              }
            })
        }
      }
    })
  }, [])

  const getController = () => {
    switch (type) {
      case ControllerType.FORM: { }
      case ControllerType.NONE: {
        return null
      }
      case ControllerType.RADIO: {
        if (controller.extraType === ControllerDataType.KV) {
          return <Radio.Group value={value} onChange={e => onChange?.(e.target.value)}>
            {
              controller.data[ControllerDataType.KV].map(({ label, value }) => (
                <Radio value={value} key={value}>{label}</Radio>
              ))
            }
          </Radio.Group>
        }
        break;
      }
      case ControllerType.CHECKBOX: {
        if (controller.extraType === ControllerDataType.KV) {
          return <Checkbox.Group value={value} onChange={onChange}>
            {
              controller.data[ControllerDataType.KV].map(({ label, value }) => (
                <Checkbox value={value} key={value}>{label}</Checkbox>
              ))
            }
          </Checkbox.Group>
        }
        break;
      }
      case ControllerType.INPUT: {
        const options = controller.extraType === ControllerDataType.Label
          ? controller.data[ControllerDataType.Label].map(value => ({ value }))
          : []

        return <AutoComplete value={value}
          onChange={onChange}
          options={options} />
      }
      case ControllerType.INPUTNUMBER: {
        return <InputNumber value={value} onChange={onChange} />
      }
      case ControllerType.TEXTAREA: {
        const options = controller.extraType === ControllerDataType.Label
          ? controller.data[ControllerDataType.Label].map(value => ({ value }))
          : []

        return <AutoComplete value={value}
          onChange={onChange}
          options={options}>
          <TextArea />
        </AutoComplete>
      }
      case ControllerType.SELECT: {
        if (controller.extraType === ControllerDataType.KV) {
          return <Select value={value} onChange={onChange}>
            {/* 这里不能用options方式，不触发label和value的get 修改kv之后不会更新 */}
            {
              controller.data[ControllerDataType.KV].map(({ label, value }) => (
                <Select.Option value={value} key={value}>{label}</Select.Option>
              ))
            }
          </Select>
        }
        if (controller.extraType === ControllerDataType.ExternalTableKV
          || controller.extraType === ControllerDataType.ExternalApi) {
          return <Select value={value} onChange={onChange}>
            {
              ((externalData as KV['value']) || []).map(({ label, value }) => (
                <Select.Option value={value} key={value}>{label}</Select.Option>
              ))
            }
          </Select>
        }
        break;
      }
      case ControllerType.CASCADER: {
        if (controller.extraType === ControllerDataType.KVTree) {
          return <Cascader value={value} onChange={onChange}
            options={controller.data[ControllerDataType.KVTree]}></Cascader>
        }
        if (controller.extraType === ControllerDataType.ExternalTableTree
          || controller.extraType === ControllerDataType.ExternalApi) {
          return <Cascader value={value} onChange={onChange}
            options={(externalData as KVTree['value']) || []}></Cascader>
        }
        break;
      }
      case ControllerType.COLOR: {
        return <ColorPicker value={value} onChange={onChange} />
      }
      case ControllerType.TIME: {
        return <TimePicker value={Dayjs(value)}
          onChange={time => onChange?.(time.format('HH:mm:ss'))} />
      }
      case ControllerType.DATE: {
        return <DatePicker showTime
          value={Dayjs(value)}
          onChange={time => onChange?.(time.format('YYYY-MM-DD HH:mm:ss'))} />
      }
      case ControllerType.SWITCH: {
        return <Switch value={value} onChange={onChange} />
      }
      case ControllerType.STRING_ARRAY: {
        return
      }
      case ControllerType.CALCULATE: {
        return
      }
      default: {
        const ner: never = type
        ner
        return '请选择控件'
      }
    }
  }

  return <ErrorBoundary message="数据读取错误">
    {getController()}
  </ErrorBoundary>
}

export default observer(Controllers)
