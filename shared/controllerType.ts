export enum ControllerType {
  RADIO = 1,
  CHECKBOX,
  INPUT,
  INPUTNUMBER,
  TEXTARE,
  CASCADER,
  COLOR
}

type KV = {
  lable: string
  value: string
}[]

type KVTree = {
  lable: string
  value: string
  children: KVTree[]
}

type ExternalTable = {
  table: string,
  labelColumn: string,
  valueColumn: string
}

type ExternalTableTree = {
  table: string,
  labelColumn: string,
  valueColumn: string,
  parentColumn: string,
}

export type ControllerDataType = {
  [ControllerType.RADIO]: KV | ExternalTable
  [ControllerType.CHECKBOX]: KV | ExternalTable
  [ControllerType.INPUT]: KV
  [ControllerType.INPUTNUMBER]: never
  [ControllerType.TEXTARE]: KV
  [ControllerType.CASCADER]: KVTree | ExternalTableTree
  [ControllerType.COLOR]: never
}