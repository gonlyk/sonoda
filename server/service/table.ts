import { UserTablePermission } from "../../shared/constant";
import { Context } from "../../shared/koaContext"
import { DatabaseError, NoPermissionError, ResourceNotExistError } from "../exception";
import { SonodaColumn, getTableColumns, insertColumn, updateColumn } from "../model/column"
import { SonodaTable, geTables, getTable, getTableByName, insertTable, updateTable } from "../model/table"
import { getUserByName } from "../model/user";
import { SonodaUserTable, deletePermissionsByTable, geTablePermissions, insertPermission } from "../model/userTable";
import { BaseService } from "./baseService";

export class SonodaTableService extends BaseService {
  createTable(ctx: Context) {
    return async (name: string, title: string, columns: SonodaColumn[]) => {
      const tableEntity = new SonodaTable
      tableEntity.name = name
      tableEntity.title = title
      tableEntity.createUser = ctx.state.user
      const table = await insertTable(ctx)(tableEntity)
      const colIds: number[] = []
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
        columnEntity.controller = column.controller
        columnEntity.fromTable = table.name
        const col = await insertColumn(ctx)(columnEntity)
        if (!col?.id) {
          throw new DatabaseError('SonodaTableService.createTable fail, no column id')
        }
        colIds.push(col.id)
      }
      tableEntity.id = table.id
      tableEntity.columns = colIds
      await updateTable(ctx)(tableEntity)
      const user = await getUserByName(ctx)(tableEntity.createUser!)
      const userTable = new SonodaUserTable
      userTable.userId = user.id
      userTable.userName = user.name
      userTable.tableId = tableEntity.id
      userTable.tableName = tableEntity.name
      userTable.premission = UserTablePermission.READ & UserTablePermission.WRITE
      await insertPermission(ctx)(userTable)
      // TODO: create table
      return table
    }
  }

  updateTable(ctx: Context) {
    return async (id: number, name?: string, title?: string, columns: SonodaColumn[] = []) => {
      const tableEntity = new SonodaTable
      tableEntity.name = name
      tableEntity.title = title
      tableEntity.id = id
      tableEntity.updateUser = ctx.state.user
      const table = await updateTable(ctx)(tableEntity)
      const colIds: number[] = []

      // 比对新旧col
      for (const column of columns) {
        const columnEntity = new SonodaColumn
        columnEntity.name = column.name
        columnEntity.title = column.title
        columnEntity.type = column.type
        columnEntity.increase = column.increase
        columnEntity.required = column.required
        columnEntity.controller = column.controller
        columnEntity.fromTable = table.name
        if (column.id) {
          columnEntity.id = column.id
          await updateColumn(ctx)(columnEntity)
          colIds.push(column.id)
        } else {
          const col = await insertColumn(ctx)(columnEntity)
          if (!col?.id) {
            throw new DatabaseError('SonodaTableService.updateTable fail, no column id')
          }
          colIds.push(col.id)
        }
      }
      for (const oldCol of table.columns || []) {
        const columnEntity = new SonodaColumn
        columnEntity.id = oldCol
        columnEntity.dataActive = false
        await updateColumn(ctx)(columnEntity)
      }
      tableEntity.columns = colIds
      updateTable(ctx)(tableEntity)
      return table
    }
  }

  updateTablePerimssion(ctx: Context) {
    return async (tableName: string, premission: SonodaUserTable) => {
      await deletePermissionsByTable(ctx)(tableName)
      await insertPermission(ctx)(premission)
    }
  }

  geTables(ctx: Context) {
    return async (page?: number, pageSize?: number) => {
      const tables = await geTables(ctx)(page, pageSize)
      return tables
    }
  }

  getTable(ctx: Context) {
    return async (id: number) => {
      const premission = await geTablePermissions(ctx)({ tableId: id })
      if (!premission.some(p => p.userName === ctx.state.user)) {
        throw new NoPermissionError('no permission')
      }
      const table = await getTable(ctx)(id)
      if (!table.name) {
        throw new ResourceNotExistError('table not exist')
      }
      const columns = await getTableColumns(ctx)(table.name)
      return { ...table, columns, user: premission.map(p => p.userName) }
    }
  }

  getTableByName(ctx: Context) {
    return async (name: string) => {
      const premission = await geTablePermissions(ctx)({ tableName: name })
      if (!premission.some(p => p.userName === ctx.state.user)) {
        throw new NoPermissionError('no permission')
      }
      const table = await getTableByName(ctx)(name)
      if (!table.name) {
        throw new ResourceNotExistError('table not exist')
      }
      const columns = await getTableColumns(ctx)(table.name)
      return { ...table, columns, user: premission.map(p => p.userName) }
    }
  }
}
