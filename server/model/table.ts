import { Context } from "../../shared/koaContext"
import { SonodaUserTable, getUserPermissions, _table as permissionTable } from "./userTable";
import { getNowTimeStamp, getQueryer } from "../../utils/postgresql";
import { getConfig } from "../../utils/readConfig";
import { rtf } from "../../utils/type";
import { BaseModel } from "./base";

export class SonodaTable extends BaseModel {
  name?: string
  title?: string
  columns?: number[]
  comment?: string
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
  return async (permissions: SonodaUserTable[], page?: number, pageSize = 10): Promise<SonodaTable[]> => {

    const selector = queryer(_table)
      .select<SonodaTable[]>()
      .whereNot(rt({ dataActive: false }))
      .whereIn('id', permissions.map(per => per.tableId!))
      .orderBy('createTime', 'desc')

    if (page) {
      selector
        .offset(pageSize * (page - 1))
        .limit(pageSize)
    }
    return await selector
  }
}

export function getTableCount(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (permissions: SonodaUserTable[]): Promise<number> => {
    const result = await queryer(_table)
      .whereNot(rt({ dataActive: false }))
      .whereIn('id', permissions.map(per => per.tableId!))
      .count()

    return result[0].count as number
  }
}

export function getTable(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (id: number): Promise<SonodaTable | undefined> => {
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
  return async (name: string): Promise<SonodaTable | undefined> => {
    const result = await queryer(_table)
      .where(rt({ name }))
      .whereNot(rt({ dataActive: false }))
      .select()
    const table = result[0] as SonodaTable
    return table
  }
}
