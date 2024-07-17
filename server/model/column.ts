import { BaseModel } from "./base"
import { ControllerDataType, ControllerType } from "../../shared/controllerType"
import { getConfig } from "../utils/readConfig"
import { rtf } from "../utils/type"
import { Context } from "../../shared/koaContext"
import { BaseType } from "../../shared/databaseType";
import { getNowTimeStamp, getQueryer } from "../utils/postgresql";

export class SonodaColumn extends BaseModel {
  name?: string
  title?: string
  type?: BaseType
  increase?: boolean
  required?: boolean
  index?: number
  default?: {
    value: any
  }
  controller?: {
    type: ControllerType
    data?: ControllerDataType[ControllerType]
  }
  comment?: string
  fromTable?: string
}

const rt = rtf<SonodaColumn>()
const _table = `${getConfig().dbPrefix}_column`

export function insertColumn(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (entity: SonodaColumn): Promise<SonodaColumn> => {
    const now = getNowTimeStamp()
    const result = await queryer(_table)
      .insert(rt({
        ...entity,
        createTime: now,
        updateTime: now,
      }))
      .returning<SonodaColumn[]>('*')
    const table = result[0]
    return table
  }
}

export function updateColumn(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (entity: SonodaColumn): Promise<SonodaColumn> => {
    if (!entity.id) {
      throw new Error('SonodaColumn.updateColumn: fields required')
    }
    const result = await queryer(_table)
      .where(rt({ id: entity.id }))
      .update(rt({
        name: entity.name,
        title: entity.title,
        type: entity.type,
        increase: entity.increase,
        required: entity.required,
        index: entity.index,
        controller: entity.controller,
        comment: entity.comment,
        fromTable: entity.fromTable,
        dataActive: entity.dataActive,
        updateUser: entity.updateUser,
        updateTime: getNowTimeStamp(),
      }))
      .returning<SonodaColumn[]>('*')
    const column = result[0]
    return column
  }
}

export function getTableColumns(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (table: string): Promise<SonodaColumn[]> => {
    return await queryer(_table)
      .where(rt({ fromTable: table }))
      .whereNot(rt({ dataActive: false }))
      .select<SonodaColumn[]>()
  }
}