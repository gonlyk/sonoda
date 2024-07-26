import { observer } from "mobx-react";
import { ControllerDataType, ControllerType, ExternalApi, ExternalTableKV, ExternalTableTree, Form, KV, KVTree, KVTreeValue, Label } from "../../shared/controllerType";
import { Button, Input, InputNumber, Space, Tabs, Tree, Form as AntdForm, Select } from "antd";
import { tableFormData } from "../../store/tableForm";
import { computed, runInAction } from "mobx";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { DataNode } from "antd/es/tree";
import { DatabaseType } from "../../shared/databaseType";
import { tableListData } from "../../store/tableList";
import { useCallback, useState } from "react";
import { SonodaColumn } from "../../server/model/column";
import { asyncDebounce } from "../../utils/util";
import { getTableInfo } from "../../api/table";
import { ResultCode } from "../../utils/result";

function ExtraDataForm({ type, index }: {
  type: ControllerType,
  index: number
}) {
  const [tableColumnOptions, setTableColumnOptions] = useState<{ label: string, value: string }[]>([])
  const currController = tableFormData.columns[index].controller

  const getColumn = useCallback(asyncDebounce(async (name: string) => {
    const res = await getTableInfo(name)
    if (res.retCode === ResultCode.SUCCESS) {
      setTableColumnOptions(res.data.columns.map(col => ({
        label: col.title,
        value: col.name,
      })))
    }
  }), [])

  const formTab = {
    key: `${ControllerDataType.Form}`,
    label: '表单型',
    children: <a>编辑新表单 &gt;&gt;&gt;</a>,
  }

  const kvTab = {
    key: `${ControllerDataType.KV}`,
    label: 'KV型',
    children: <div className="extra-kv-table">
      {
        currController.data[ControllerDataType.KV].map(({ label, value }, index) => {
          const kvData = currController.data[ControllerDataType.KV][index]
          return <div className="extra-kv-row" key={index}>
            <div className="extra-kv-cell">
              <Input value={label}
                placeholder="请输入标签"
                onChange={e => runInAction(() => kvData.label = e.target.value)} />
            </div>
            <div className="extra-kv-cell">
              <Input value={value}
                placeholder="请输入值"
                onChange={e => runInAction(() => kvData.value = e.target.value)} />
            </div>
          </div>
        })
      }
      <div className="extra-kv-row">
        <div className="extra-kv-cell">
          <a onClick={() => runInAction(() => {
            currController.data[ControllerDataType.KV].push({ label: '', value: '' })
          })}>+ 新增</a>
        </div>
        <div className="extra-kv-cell"></div>
      </div>
    </div>,
  }

  const treeData = computed(() => {
    const treeData = currController.data[ControllerDataType.KVTree] || []
    const parser = (treeChildren: KVTreeValue[]): DataNode[] => {
      return treeChildren.map((item) => {
        const { label, value, children } = item
        return {
          key: value,
          title: <div className="extra-tree-item">
            <div className="extra-tree-item-label">
              {
                tableFormData.kvTreeEditItem === item
                  ? <Space.Compact block>
                    <Input value={label} onChange={(e) => runInAction(() => item.label = e.target.value)} />
                    {
                      tableFormData.columns[index].type === DatabaseType.INTEGER
                        ? <InputNumber value={value} onChange={(val) => runInAction(() => val && (item.value = val))} />
                        : <Input value={value} onChange={(e) => runInAction(() => item.value = e.target.value)} />
                    }
                  </Space.Compact>
                  : label
              }
            </div>
            <EditOutlined onClick={() => {
              runInAction(() => tableFormData.kvTreeEditItem = item)
            }} />
            <PlusSquareOutlined />
            <PlusCircleOutlined />
            <DeleteOutlined />
          </div>,
          children: children ? parser(children) : void 0
        }
      })
    }
    return parser(treeData)
  })

  const treeTab = {
    key: `${ControllerDataType.KVTree}`,
    label: 'Tree型',
    children: treeData.get().length
      ? <Tree treeData={treeData.get()}
        draggable />
      : <Button onClick={() => {
        runInAction(() => {
          currController.data[ControllerDataType.KVTree].push({
            label: '1',
            value: 1,
            children: []
          })
          tableFormData.kvTreeEditItem = currController.data[
            ControllerDataType.KVTree
          ][
            currController.data[ControllerDataType.KVTree].length - 1
          ]
        })
      }}>添加根元素</Button>
  }

  const labelTab = {
    key: `${ControllerDataType.Label}`,
    label: 'Label型',
    children: <div className="extra-label-table">
      {
        currController.data[ControllerDataType.Label].map((label, index) => {
          const kvData = currController.data[ControllerDataType.Label]
          return <div className="extra-label-row">
            <div className="extra-label-cell">
              <Input value={label}
                placeholder="请输入内容"
                onChange={e => runInAction(() => kvData[index] = e.target.value)} />
            </div>
          </div>
        })
      }
      <div className="extra-label-row">
        <div className="extra-label-cell">
          <a onClick={() => runInAction(() => {
            currController.data[ControllerDataType.Label].push('')
          })}>+ 新增</a>
        </div>
        <div className="extra-label-cell"></div>
      </div>
    </div>
  }

  const externalTableKVTab = {
    key: `${ControllerDataType.ExternalTableKV}`,
    label: '其他表格KV',
    children: <>
      <AntdForm.Item label="表">
        <Select options={tableListData.tablesOption}
          value={currController.data[ControllerDataType.ExternalTableKV].table}
          onChange={(table) => runInAction(() => {
            currController.data[ControllerDataType.ExternalTableKV].table = table
            currController.data[ControllerDataType.ExternalTableKV].labelColumn = ''
            currController.data[ControllerDataType.ExternalTableKV].valueColumn = ''
            tableFormData.columns[index].defaultValue.value = void 0
            getColumn(table)
          })} />
      </AntdForm.Item>
      <AntdForm.Item label="label列">
        <Select options={tableColumnOptions}
          value={currController.data[ControllerDataType.ExternalTableKV].labelColumn}
          onChange={(col) => runInAction(() => {
            currController.data[ControllerDataType.ExternalTableKV].labelColumn = col
          })} />
      </AntdForm.Item>
      <AntdForm.Item label="值列">
        <Select options={tableColumnOptions}
          value={currController.data[ControllerDataType.ExternalTableKV].valueColumn}
          onChange={(col) => runInAction(() => {
            currController.data[ControllerDataType.ExternalTableKV].valueColumn = col
          })} />
      </AntdForm.Item>
    </>
  }

  const getExtraTab = () => {
    switch (type) {
      case ControllerType.FORM: {
        return [formTab]
      }
      case ControllerType.RADIO:
      case ControllerType.CHECKBOX: {
        return [kvTab]
      }
      case ControllerType.INPUT:
      case ControllerType.TEXTAREA: {
        return [labelTab]
      }
      case ControllerType.SELECT: {
        return [kvTab, externalTableKVTab]
      }
      case ControllerType.CASCADER: {
        return [treeTab]
      }
      case ControllerType.NONE:
      case ControllerType.INPUTNUMBER:
      case ControllerType.COLOR:
      case ControllerType.TIME:
      case ControllerType.DATE:
      case ControllerType.SWITCH:
      case ControllerType.STRING_ARRAY:
      case ControllerType.CALCULATE:
      default: {
        return []
      }
    }
  }

  const extra = getExtraTab()
  if (!extra.length) {
    return null
  }

  return <Tabs items={extra} onChange={(activeKey) => {
    runInAction(() => currController.extraType = Number(activeKey))
  }} />
}

export default observer(ExtraDataForm)
