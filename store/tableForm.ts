import { action, makeAutoObservable, reaction, runInAction } from "mobx";
import { ControllerDataType, ControllerDataTypeMap, ControllerType, ExternalApi, ExternalTableKV, ExternalTableTree, Form, KV, KVTree, KVTreeValue, Label } from "../shared/controllerType";
import { SonodaTable } from "../server/model/table";
import { SonodaColumn } from "../server/model/column";
import { getTableInfo } from "../api/table";
import { DatabaseType } from "../shared/databaseType";
import { ResultCode } from "../utils/result";
import { generateKey } from "../utils/geneKey";
import { ValidateStatus } from "antd/es/form/FormItem";


export type Column = {
  key: string,
  enable: boolean
  name: string
  title: string
  type: DatabaseType,
  typeSize?: number,
  increase: boolean
  required: boolean
  uniqueValue: boolean
  defaultValue: {
    value?: any
    buildIn?: 'createUser' | 'createTime' | 'updateUser' | 'updateTime'
  }
  controller: {
    type: ControllerType
    extraType?: ControllerDataType
    // 全部初始化是为了写的时候不要老是提示可能为空，而且导致切换类型的时候还要初始化，实际上并不是全起作用
    data: {
      [ControllerDataType.Form]: Form['value'],
      [ControllerDataType.Label]: Label['value'],
      [ControllerDataType.KV]: KV['value'],
      [ControllerDataType.KVTree]: KVTree['value'],
      [ControllerDataType.ExternalTableKV]: ExternalTableKV['value'],
      [ControllerDataType.ExternalTableTree]: ExternalTableTree['value'],
      [ControllerDataType.ExternalApi]: ExternalApi['value'],
    }
  }
  comment: string
}

export const geneInitExtraData = (): Column['controller']['data'] => ({
  [ControllerDataType.Form]: {},
  [ControllerDataType.Label]: [],
  [ControllerDataType.KV]: [],
  [ControllerDataType.KVTree]: [],
  [ControllerDataType.ExternalTableKV]: {
    table: '',
    labelColumn: '',
    valueColumn: '',
  },
  [ControllerDataType.ExternalTableTree]: {
    table: '',
    labelColumn: '',
    valueColumn: '',
    parentColumn: '',
  },
  [ControllerDataType.ExternalApi]: {
    url: '',
    fetchOnChange: false
  },
})

export const newColumn = (): Column => ({
  key: `${generateKey()}`,
  enable: true,
  name: '',
  title: '',
  type: DatabaseType.VARCHAR,
  increase: false,
  required: true,
  uniqueValue: false,
  defaultValue: {},
  controller: { type: ControllerType.NONE, data: geneInitExtraData() },
  comment: ''
})

const buildInColumns: Column[] = [{
  key: `${generateKey()}`,
  enable: true,
  name: 'create_time',
  title: '创建时间',
  type: DatabaseType.TIMESTAMP,
  increase: false,
  required: true,
  uniqueValue: false,
  defaultValue: {
    buildIn: 'createTime'
  },
  controller: { type: ControllerType.NONE, data: geneInitExtraData() },
  comment: ''
}, {
  key: `${generateKey()}`,
  enable: true,
  name: 'create_user',
  title: '创建用户',
  type: DatabaseType.VARCHAR,
  typeSize: 50,
  increase: false,
  required: true,
  uniqueValue: false,
  defaultValue: {
    buildIn: 'createUser'
  },
  controller: { type: ControllerType.NONE, data: geneInitExtraData() },
  comment: ''
}, {
  key: `${generateKey()}`,
  enable: true,
  name: 'update_time',
  title: '修改时间',
  type: DatabaseType.TIMESTAMP,
  increase: false,
  required: true,
  uniqueValue: false,
  defaultValue: {
    buildIn: 'updateTime'
  },
  controller: { type: ControllerType.NONE, data: geneInitExtraData() },
  comment: ''
}, {
  key: `${generateKey()}`,
  enable: true,
  name: 'update_user',
  title: '修改用户',
  type: DatabaseType.VARCHAR,
  typeSize: 50,
  increase: false,
  required: true,
  uniqueValue: false,
  defaultValue: {
    buildIn: 'updateUser'
  },
  controller: { type: ControllerType.NONE, data: geneInitExtraData() },
  comment: ''
}]

export const tableFormData = makeAutoObservable<{
  step: number
  isModify: boolean
  base: {
    name: string
    title: string
    comment: string
  }
  columns: Column[]
  openCollapseKeys: string[]

  kvTreeEditItem?: KVTreeValue

  tableColumns: { label: string, value: string }[]
  baseErrors: Map<string, {
    validateStatus: ValidateStatus,
    help: string
  }>
  columnErrors: Map<number, Map<string, {
    validateStatus: ValidateStatus,
    help: string
  }>>
}>({
  step: 0,
  isModify: false,
  base: {
    name: '',
    title: '',
    comment: '',
  },
  columns: [],
  openCollapseKeys: [],
  kvTreeEditItem: void 0,
  // 选择ExternalTable的时候保存要选择的列信息
  tableColumns: [],
  baseErrors: new Map,
  columnErrors: new Map
})

export function initTable(tableInfo?: Awaited<ReturnType<typeof getTableInfo>>['data']) {
  runInAction(() => {
    tableFormData.base = {
      name: tableInfo?.name || '',
      title: tableInfo?.title || '',
      comment: tableInfo?.comment || '',
    }
    tableFormData.columns = [{
      key: `${generateKey()}`,
      enable: true,
      name: 'id',
      title: 'ID',
      type: DatabaseType.INTEGER,
      increase: false,
      required: false,
      uniqueValue: true,
      defaultValue: {},
      controller: { type: ControllerType.NONE, data: geneInitExtraData() },
      comment: '',
    }].concat(tableInfo?.columns.map(col => ({
      key: `${generateKey()}`,
      enable: true,
      name: col.name,
      title: col.title,
      type: col.type,
      typeSize: col.typeSize,
      increase: col.increase,
      required: col.required,
      uniqueValue: col.uniqueValue,
      defaultValue: col.defaultValue,
      controller: {
        type: col.controller.type,
        data: ((): Column['controller']['data'] => {
          const value = col.controller.data?.value
          switch (col.controller.data?.type) {
            case ControllerDataType.Form: {
              return Object.assign(geneInitExtraData(), { form: value as Form['value'] })
            }
            case ControllerDataType.Label: {
              return Object.assign(geneInitExtraData(), { label: value as Label['value'] })
            }
            case ControllerDataType.KV: {
              return Object.assign(geneInitExtraData(), { kv: value as KV['value'] })
            }
            case ControllerDataType.KVTree: {
              return Object.assign(geneInitExtraData(), { kvTree: value as KVTree['value'] })
            }
            case ControllerDataType.ExternalTableKV: {
              return Object.assign(geneInitExtraData(), { externalTableKV: value as ExternalTableKV['value'] })
            }
            case ControllerDataType.ExternalTableTree: {
              return Object.assign(geneInitExtraData(), { externalTableTree: value as ExternalTableTree['value'] })
            }
            case ControllerDataType.ExternalApi: {
              return Object.assign(geneInitExtraData(), { externalApi: value as ExternalApi['value'] })
            }
            default: {
              return geneInitExtraData()
            }
          }
        })()
      },
      comment: col.comment,
    } as Column)) || buildInColumns)
  })
}

export const getTableColumns = action(async (table: string) => {
  const res = await getTableInfo(table)
  if (res.retCode === ResultCode.SUCCESS) {
    tableFormData.tableColumns = res.data.columns.map(col => ({
      label: col.title,
      value: col.name
    }))
  }
})

export const validateBase = action(() => {
  tableFormData.baseErrors = new Map
  if(!tableFormData.base.name) {
    tableFormData.baseErrors.set('name', {
      help: '请输入表名',
      validateStatus: 'error'
    })
  } else if (!/^[a-z_][a-z0-9_]*$/g.test(tableFormData.base.name)) {
    tableFormData.baseErrors.set('name', {
      help: '不合规的表名',
      validateStatus: 'error'
    })
  }if(!tableFormData.base.title) {
    tableFormData.baseErrors.set('title', {
      help: '请输入显示名',
      validateStatus: 'error'
    })
  }
  return !tableFormData.baseErrors.size
})

export const validateColumns = action(() => {
  const errorIndex = new Set<string>
  tableFormData.columnErrors = new Map
  for (let i = 0; i < tableFormData.columns.length; i++) {
    if (!tableFormData.columnErrors.has(i)) {
      tableFormData.columnErrors.set(i, new Map)
    }
    const currErrorMap = tableFormData.columnErrors.get(i)!
    // check require
    const col = tableFormData.columns[i]
    if (!col.name) {
      currErrorMap.set('name', {
        help: '请输入字段名',
        validateStatus: 'error'
      })
      errorIndex.add(col.key)
    } else if (!/^[a-z_][a-z0-9_]*$/g.test(col.name)) {
      currErrorMap.set('name', {
        help: '不合规的列名',
        validateStatus: 'error'
      })
      errorIndex.add(col.key)
    }
    if (!col.title) {
      currErrorMap.set('title', {
        help: '请输入显示名',
        validateStatus: 'error'
      })
      errorIndex.add(col.key)
    }
    if (col.type === DatabaseType.VARCHAR && !col.typeSize) {
      currErrorMap.set('typeSize', {
        help: '请输入长度',
        validateStatus: 'error'
      })
      errorIndex.add(col.key)
    }
  }

  if (errorIndex.size) {
    tableFormData.openCollapseKeys = [...errorIndex]
  }
  return errorIndex.size === 0
})