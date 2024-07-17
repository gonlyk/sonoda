import { Context } from "../../shared/koaContext"
import { getNowTimeStamp, getQueryer } from "../utils/postgresql";
import { getConfig } from "../utils/readConfig";
import { rtf } from "../utils/type";
import { BaseModel } from "./base";

export class SonodaTable extends BaseModel {
  name?: string
  title?: string
  columns?: number[]
  comment?: string

  constructor() {
    super()
    this.columns = []
  }
}

const rt = rtf<SonodaTable>()
const _table = `${getConfig().dbPrefix}_table`

export function insertTable(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (entity: SonodaTable): Promise<SonodaTable> => {
    const now = getNowTimeStamp()
    const result = await queryer(_table)
      .insert(rt({
        ...entity,
        createTime: now,
        updateTime: now,
      }))
      .returning<SonodaTable[]>('*')
    const table = result[0]
    return table
  }
}

export function updateTable(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (entity: SonodaTable): Promise<SonodaTable> => {
    if (!entity.id) {
      throw new Error('SonodaTable.updateTable: fields required')
    }
    const result = await queryer(_table)
      .where(rt({ id: entity.id }))
      .update(rt({
        name: entity.name,
        title: entity.title,
        columns: entity.columns,
        comment: entity.comment,
        dataActive: entity.dataActive,
        updateUser: entity.updateUser,
        updateTime: getNowTimeStamp(),
      }))
      .returning<SonodaTable[]>('*')
    const table = result[0]
    return table
  }
}

export function geTables(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (page = 1, pageSize = 10): Promise<SonodaTable[]> => {
    return await queryer(_table)
      .whereNot(rt({ dataActive: false }))
      .offset(pageSize * page)
      .limit(pageSize)
      .select<SonodaTable[]>()
  }
}

export function getTable(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (id: number): Promise<SonodaTable> => {
    const result = await queryer(_table)
      .where(rt({ id }))
      .whereNot(rt({ dataActive: false }))
      .select()
    const table = result[0] as SonodaTable
    return table
  }
}

export function getTableByName(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (name: string): Promise<SonodaTable> => {
    const result = await queryer(_table)
      .where(rt({ name }))
      .whereNot(rt({ dataActive: false }))
      .select()
    const table = result[0] as SonodaTable
    return table
  }
}
