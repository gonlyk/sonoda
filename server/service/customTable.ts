import { Context } from "../../shared/koaContext"
import { getNowTimeStamp } from "../../utils/postgresql"
import { ResourceNotExistError } from "../exception"
import { getTableColumns } from "../model/column"
import { insertData, selectDataCount, selectDatas } from "../model/customTable"
import { getTableByName } from "../model/table"

export class SonodaCustomTableService {
  selectCustomTable(ctx: Context) {
    return async (name: string, page?: number, pageSize?: number) => {
      // check not buildin table
      const table = await getTableByName(ctx)(name)
      if (!table) {
        throw new ResourceNotExistError('SonodaCustomTableService.insertCustomTable, table not exist')
      }
      const [records, count] = await Promise.all([
        selectDatas(ctx)(name, page, pageSize),
        selectDataCount(ctx)(name)
      ])
      return [records, count]
    }
  }

  insertCustomTable(ctx: Context) {
    return async (name: string, record: Record<string, any>) => {
      // check not buildin table
      const table = await getTableByName(ctx)(name)
      if (!table) {
        throw new ResourceNotExistError('SonodaCustomTableService.insertCustomTable, table not exist')
      }
      const columns = await getTableColumns(ctx)(name)
      for (const column of columns) {
        if (column.defaultValue?.buildIn) {
          switch (column.defaultValue?.buildIn) {
            case 'createTime':
            case 'updateTime': {
              record[column.name!] = getNowTimeStamp()
              break;
            }
            case 'createUser':
            case 'updateUser': {
              record[column.name!] = ctx.state.user
              break;
            }
          }
        }
      }
      return await insertData(ctx)(name, record)
    }
  }

  updateCustomTable(ctx: Context) {
    return async (name: string, record: Record<string, any>) => {
      // check not buildin table
      const table = await getTableByName(ctx)(name)
      if (!table) {
        throw new ResourceNotExistError('SonodaCustomTableService.updateCustomTable, table not exist')
      }
      const columns = await getTableColumns(ctx)(name)
      for (const column of columns) {
        if (column.defaultValue?.buildIn) {
          switch (column.defaultValue?.buildIn) {
            case 'createTime':{
              delete record[column.name!]
              break;
            }
            case 'updateTime': {
              record[column.name!] = getNowTimeStamp()
              break;
            }
            case 'createUser':{
              delete record[column.name!]
              break;
            }
            case 'updateUser': {
              record[column.name!] = ctx.state.user
              break;
            }
          }
        }
      }
      return await insertData(ctx)(name, record)
    }
  }
}