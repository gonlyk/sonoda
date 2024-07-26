import { getFetcer } from ".";
import { SonodaColumn } from "../server/model/column";
import { type SonodaTable } from "../server/model/table";
import type Result from "../utils/result";

export function getUserTables(): Promise<Result<SonodaTable[]>> {
  return getFetcer().get({ url: '/user/tables' })
}

export function getTableInfo(name: string): Promise<Result<
  Omit<SonodaTable, 'columns'> &
  { columns: Required<SonodaColumn>[], user: string[] }
>> {
  return getFetcer().get({ url: `/table/name/${name}` })
}

export function getTableData(tableName: string): Promise<Result<{
  page: number,
  pageSize: number,
  count: number,
  list: any[],
}>> {
  return getFetcer().get({ url: `/custom/select`, params: { tableName } })
}

export function createTable(
  base: {
    name: string,
    title: string,
    comment: string,
  },
  columns: SonodaColumn[]
) {
  return getFetcer().post({ 
    url: '/table/create',
    data: {
      base, 
      columns
    }
   })
}