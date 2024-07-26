import { UserTablePermission } from "../../shared/constant"
import { Context } from "../../shared/koaContext"
import { getNowTimeStamp, getQueryer } from "../../utils/postgresql"
import { getConfig } from "../../utils/readConfig"
import { rtf } from "../../utils/type"
import { BaseModel } from "./base"


export class SonodaUserTable extends BaseModel {
  userId?: number
  userName?: string
  tableId?: number
  tableName?: string
  permission?: UserTablePermission
}

const rt = rtf<SonodaUserTable>()
export const _table = `${getConfig().dbPrefix}_user_table`

export function insertPermission(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (entity: SonodaUserTable) => {
    const now = getNowTimeStamp()
    const result = await queryer(_table)
      .insert(rt({
        ...entity,
        createTime: now,
        updateTime: now
      }))
      .returning<SonodaUserTable[]>('*')
    return result[0]
  }
}

export function deletePermissionsByUser(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (name: string) => {
    if (!name) {
      throw new Error('SonodaUserTable.deletePermissionByUser: userName required')
    }
    const result = await queryer(_table)
      .where({ userName: name })
      .delete<SonodaUserTable[]>("*")
    return result[0]
  }
}

export function deletePermissionsByTable(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (tableId: number) => {
    if (!_table) {
      throw new Error('SonodaUserTable.deletePermissionByTable: tableId required')
    }
    const result = await queryer(_table)
      .where(rt({ tableId }))
      .delete<SonodaUserTable[]>("*")
    return result[0]
  }
}

export function getUserPermissions(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async ({ userId, userName }: { userId?: number, userName?: string }) => {
    return await queryer(_table)
      .where(rt({
        userId,
        userName
      }))
      .whereNot(rt({ dataActive: false }))
      .select<SonodaUserTable[]>()
  }
}

export function geTablePermissions(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async ({ tableId, tableName }: { tableId?: number, tableName?: string }) => {
    return await queryer(_table)
      .where(rt({
        tableId,
        tableName
      }))
      .whereNot(rt({ dataActive: false }))
      .select<SonodaUserTable[]>()
  }
}