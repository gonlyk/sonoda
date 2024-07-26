import { DatabaseType } from "./databaseType"

export enum ControllerType {
  FORM = 1,
  NONE,
  RADIO,
  CHECKBOX,
  INPUT,
  INPUTNUMBER,
  TEXTAREA,
  SELECT,
  CASCADER,
  COLOR,
  TIME,
  DATE,
  SWITCH,

  STRING_ARRAY,
  CALCULATE
}

export enum ControllerDataType {
  Form = 1,
  KV,
  Label,
  KVTree,
  ExternalTableKV,
  ExternalTableTree,
  ExternalApi,
}

export abstract class BaseControllerDataType {
  abstract type: ControllerDataType
  abstract value: any
}

export class Form extends BaseControllerDataType {
  type = ControllerDataType.Form
  value: Record<string, any> = {}
}

export class Label extends BaseControllerDataType {
  type = ControllerDataType.KV
  value: string[] = []
}

export class KV extends BaseControllerDataType {
  type = ControllerDataType.KV
  value: {
    label: string
    value: string | number
  }[] = []
}

export type KVTreeValue = {
  label: string
  value: string | number
  children?: KVTreeValue[]
}
export class KVTree extends BaseControllerDataType {
  type = ControllerDataType.KVTree
  value: KVTreeValue[] = []
}

export class ExternalTableKV extends BaseControllerDataType {
  type = ControllerDataType.ExternalTableKV
  value: {
    table: string,
    labelColumn: string,
    valueColumn: string
  } = {
      table: '',
      labelColumn: '',
      valueColumn: ''
    }
}

export class ExternalTableTree extends BaseControllerDataType {
  type = ControllerDataType.ExternalTableTree
  value: {
    table: string,
    labelColumn: string,
    valueColumn: string,
    parentColumn: string,
  } = {
      table: '',
      labelColumn: '',
      valueColumn: '',
      parentColumn: '',
    }
}

export class ExternalApi extends BaseControllerDataType {
  type = ControllerDataType.ExternalApi
  value: {
    url: string
    fetchOnChange: boolean
  } = {
      url: '',
      fetchOnChange: false
    }
}

export type ControllerDataTypeMap = {
  [ControllerType.FORM]: Form
  [ControllerType.NONE]: never
  [ControllerType.RADIO]: KV
  [ControllerType.CHECKBOX]: KV
  [ControllerType.INPUT]: Label
  [ControllerType.INPUTNUMBER]: never
  [ControllerType.TEXTAREA]: Label
  [ControllerType.SELECT]: KV | ExternalTableKV | ExternalApi
  [ControllerType.CASCADER]: KVTree | ExternalTableTree | ExternalApi
  [ControllerType.COLOR]: never
  [ControllerType.TIME]: never
  [ControllerType.DATE]: never
  [ControllerType.SWITCH]: never
  [ControllerType.STRING_ARRAY]: never
  [ControllerType.CALCULATE]: never
}

export const ControllerDataTypeDefault: Record<ControllerType, ControllerDataType | undefined> = {
  [ControllerType.FORM]: ControllerDataType.Form,
  [ControllerType.RADIO]: ControllerDataType.KV,
  [ControllerType.CHECKBOX]: ControllerDataType.KV,
  [ControllerType.INPUT]: ControllerDataType.Label,
  [ControllerType.TEXTAREA]: ControllerDataType.Label,
  [ControllerType.SELECT]: ControllerDataType.KV,
  [ControllerType.CASCADER]: ControllerDataType.KVTree,
  [ControllerType.NONE]: void 0,
  [ControllerType.INPUTNUMBER]: void 0,
  [ControllerType.COLOR]: void 0,
  [ControllerType.TIME]: void 0,
  [ControllerType.DATE]: void 0,
  [ControllerType.SWITCH]: void 0,
  [ControllerType.STRING_ARRAY]: void 0,
  [ControllerType.CALCULATE]: void 0,
}

export const ControllerDataNameMap: Record<ControllerType, string> = {
  [ControllerType.FORM]: '子表单',
  [ControllerType.NONE]: '无',
  [ControllerType.RADIO]: '单选框',
  [ControllerType.CHECKBOX]: '多选框',
  [ControllerType.INPUT]: '输入框',
  [ControllerType.INPUTNUMBER]: '数字输入框',
  [ControllerType.TEXTAREA]: '文本框',
  [ControllerType.SELECT]: '下拉选择',
  [ControllerType.CASCADER]: '级联选择',
  [ControllerType.COLOR]: '颜色',
  [ControllerType.TIME]: '时间',
  [ControllerType.DATE]: '日期',
  [ControllerType.SWITCH]: '开关',
  [ControllerType.STRING_ARRAY]: '多行输入',
  [ControllerType.CALCULATE]: '计算',
}


export const typeToController: Record<DatabaseType, ControllerType[]> = {
  [DatabaseType.VARCHAR]: [
    ControllerType.NONE,
    ControllerType.INPUT,
    ControllerType.RADIO,
    ControllerType.TEXTAREA,
    ControllerType.SELECT,
    ControllerType.CASCADER,
    ControllerType.COLOR,
  ],
  [DatabaseType.INTEGER]: [
    ControllerType.NONE,
    ControllerType.INPUTNUMBER,
    ControllerType.RADIO,
    ControllerType.SELECT,
    ControllerType.CASCADER,
  ],
  [DatabaseType.JSONB]: [ControllerType.NONE, ControllerType.FORM],
  [DatabaseType.JSON]: [ControllerType.NONE, ControllerType.FORM],
  [DatabaseType.BOOL]: [
    ControllerType.NONE,
    ControllerType.RADIO,
    ControllerType.SELECT,
    ControllerType.SWITCH,
  ],
  [DatabaseType.TIMESTAMP]: [ControllerType.NONE, ControllerType.DATE, ControllerType.TIME],
}