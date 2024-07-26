import { makeAutoObservable, runInAction } from 'mobx';
import { type SonodaTable } from '../server/model/table';
import { getTableData, getTableInfo, getUserTables } from '../api/table';
import Result, { ResultCode } from '../utils/result';
import { MenuItemType } from 'antd/es/menu/interface';
import { type SonodaColumn } from '../server/model/column';

export const tableListData = makeAutoObservable<{
  tables: Required<SonodaTable>[]
  menu: MenuItemType[]
  tablesOption: { label: string, value: string}[]
  currTable?: Awaited<ReturnType<typeof getTableInfo>>['data']
  list: ReturnType<typeof Result.list>['data']
}>({
  tables: [],
  get menu() {
    return this.tables.map((table: SonodaTable) => ({
      key: `/table/${table.name!}`,
      label: table.title!,
    }) as MenuItemType)
  },
  get tablesOption() {
    return this.tables.map((table: SonodaTable) => ({
      label: table.title,
      value: table.name
    }))
  },
  currTable: void 0,
  list: {
    page: 1,
    pageSize: 10,
    count: 0,
    list: [],
  }
})

export async function getTable(name: string) {
  if (!name) return
  const res = await getTableInfo(name)

  if (res.retCode === ResultCode.SUCCESS) {
    runInAction(() => {
      tableListData.currTable = res.data
    })
  }
}

export async function getRecord(name: string) {
  if (!name) return
  const res = await getTableData(name)

  if (res.retCode === ResultCode.SUCCESS) {
    runInAction(() => {
      tableListData.list = res.data
    })
  }
}