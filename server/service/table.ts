import { UserTablePermission } from "../../shared/constant";
import { Context } from "../../shared/koaContext"
import { DatabaseError, NoPermissionError, ResourceNotExistError } from "../exception";
import { SonodaColumn, getTableColumns, insertColumn, updateColumn } from "../model/column"
import { createTable, insertData } from "../model/customTable";
import { SonodaTable, geTables, getTable, getTableByName, getTableCount, insertTable, updateTable } from "../model/table"
import { getUser, getUserByName } from "../model/user";
import { SonodaUserTable, deletePermissionsByTable, geTablePermissions, getUserPermissions, insertPermission } from "../model/userTable";
import { getNowTimeStamp } from "../../utils/postgresql";
import { BaseService } from "./baseService";

export class SonodaTableService extends BaseService {
  createTable(ctx: Context) {
    return async (
      base: {
        name: string,
        title: string,
        comment: string,
      },
      columns: SonodaColumn[]
    ) => {
      const tableEntity = new SonodaTable
      tableEntity.name = base.name
      tableEntity.title = base.title
      tableEntity.comment = base.comment
      tableEntity.columns = []
      tableEntity.createUser = ctx.state.user
      tableEntity.updateUser = ctx.state.user
      let table = await insertTable(ctx)(tableEntity)
      const colIds: number[] = []
      const colEntitys: SonodaColumn[] = []
      if (!table?.id) {
        throw new DatabaseError('SonodaTableService.createTable fail, no table id')
      }
      for (const column of columns) {
        const columnEntity = new SonodaColumn
        columnEntity.name = column.name
        columnEntity.title = column.title
        columnEntity.type = column.type
        columnEntity.increase = column.increase
        columnEntity.required = column.required
        columnEntity.index = column.index
        columnEntity.uniqueValue = column.uniqueValue
        columnEntity.controller = column.controller
        columnEntity.fromTable = table.name
        columnEntity.createUser = ctx.state.user
        columnEntity.updateUser = ctx.state.user
        const col = await insertColumn(ctx)(columnEntity)
        if (!col?.id) {
          throw new DatabaseError('SonodaTableService.createTable fail, no column id')
        }
        colIds.push(col.id)
        colEntitys.push(col)
      }
      tableEntity.id = table.id
      tableEntity.columns = colIds
      table = await updateTable(ctx)(tableEntity)
      const user = await getUserByName(ctx)(tableEntity.createUser!)
      if (!user.id) {
        throw new DatabaseError('SonodaTableService.createTable fail, no user id, maybe user not active')
      }
      const userTable = new SonodaUserTable
      userTable.userId = user.id
      userTable.userName = user.name
      userTable.tableId = tableEntity.id
      userTable.tableName = tableEntity.name
      userTable.permission = UserTablePermission.READ | UserTablePermission.WRITE
      userTable.createUser = ctx.state.user
      userTable.updateUser = ctx.state.user
      await insertPermission(ctx)(userTable)
      await createTable(ctx)(base.name, columns as Required<SonodaColumn>[])
      return { ...table, columns: colEntitys }
    }
  }

  updateTable(ctx: Context) {
    return async (id: number, comment?: string, title?: string, columns?: SonodaColumn[]) => {
      const tableEntity = new SonodaTable
      tableEntity.title = title
      tableEntity.comment = comment
      tableEntity.id = id
      tableEntity.updateUser = ctx.state.user
      const table = await updateTable(ctx)(tableEntity)
      if (!table?.id) {
        throw new ResourceNotExistError('SonodaTableService.updateTable fail, table not exist')
      }
      const colIds: number[] = []
      const colEntitys: SonodaColumn[] = []

      // 比对新旧col
      if (columns) {
        for (const column of columns) {
          const columnEntity = new SonodaColumn
          columnEntity.name = column.name
          columnEntity.title = column.title
          columnEntity.type = column.type
          columnEntity.increase = column.increase
          columnEntity.required = column.required
          columnEntity.index = column.index
          columnEntity.uniqueValue = column.uniqueValue
          columnEntity.controller = column.controller
          columnEntity.fromTable = table.name
          if (column.id) {
            columnEntity.id = column.id
            columnEntity.updateUser = ctx.state.user
            await updateColumn(ctx)(columnEntity)
            colIds.push(column.id)
            colEntitys.push(column)
          } else {
            columnEntity.createUser = ctx.state.user
            columnEntity.updateUser = ctx.state.user
            const col = await insertColumn(ctx)(columnEntity)
            if (!col?.id) {
              throw new DatabaseError('SonodaTableService.updateTable fail, no column id')
            }
            colIds.push(col.id)
            colEntitys.push(col)
          }
        }
        for (const oldCol of table.columns || []) {
          if (!colIds.includes(oldCol)) {
            const columnEntity = new SonodaColumn
            columnEntity.id = oldCol
            columnEntity.dataActive = false
            await updateColumn(ctx)(columnEntity)
          }
        }
        tableEntity.columns = colIds
      }
      const newTable = await updateTable(ctx)(tableEntity)
      return { ...newTable }
    }
  }

  updateTablePerimssion(ctx: Context) {
    return async (tableId: number, users: [(number | string), UserTablePermission][]) => {
      await deletePermissionsByTable(ctx)(tableId)
      const table = await getTable(ctx)(tableId)
      if (!table) {
        throw new ResourceNotExistError('SonodaTableService.updateTablePerimssion, table not exist')
      }
      for (const [user, permission] of users) {
        const u = await (typeof user === 'number' ? getUser(ctx)(user) : getUserByName(ctx)(user))
        if (!u) {
          throw new ResourceNotExistError('SonodaTableService.updateTablePerimssion, user not exist')
        }
        const per = new SonodaUserTable
        per.tableId = table.id
        per.tableName = table.name
        per.userId = u.id
        per.userName = u.name
        per.permission = permission
        per.createUser = ctx.state.user
        per.updateUser = ctx.state.user
        await insertPermission(ctx)(per)
      }
    }
  }

  getTables(ctx: Context) {
    return async (page?: number, pageSize?: number): Promise<[SonodaTable[], number]> => {
      const permissions = await getUserPermissions(ctx)({ userName: ctx.state.user })
      const [tables, count] = await Promise.all([
        geTables(ctx)(permissions, page, pageSize),
        getTableCount(ctx)(permissions)
      ])
      return [tables, count]
    }
  }

  getUserTables(ctx: Context) {
    return async (): Promise<SonodaTable[]> => {
      const permissions = await getUserPermissions(ctx)({ userName: ctx.state.user })
      const tables = await geTables(ctx)(permissions)
      return tables
    }
  }

  getTable(ctx: Context) {
    return async (id: number) => {
      const permission = await geTablePermissions(ctx)({ tableId: id })
      if (!permission.some(p => p.userName === ctx.state.user)) {
        throw new NoPermissionError()
      }
      const table = await getTable(ctx)(id)
      if (!table?.name) {
        throw new ResourceNotExistError('table not exist')
      }
      const columns = await getTableColumns(ctx)(table.name)
      return { ...table, columns, user: permission.map(p => p.userName) }
    }
  }

  getTableByName(ctx: Context) {
    return async (name: string) => {
      const permission = await geTablePermissions(ctx)({ tableName: name })
      if (!permission.some(p => p.userName === ctx.state.user)) {
        throw new NoPermissionError('no permission')
      }
      const table = await getTableByName(ctx)(name)
      if (!table?.name) {
        throw new ResourceNotExistError('table not exist')
      }
      const columns = await getTableColumns(ctx)(table.name)
      return { ...table, columns, user: permission.map(p => p.userName) }
    }
  }
}
