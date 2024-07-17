import { SonodaColumn, getTableColumns, insertColumn } from "./server/model/column";
import { SonodaTable } from "./server/model/table";
import { ControllerType } from "./shared/controllerType";
import { Integer } from "./shared/databaseType";

const col = new SonodaColumn
col.name = 'col'
col.title = '列'
col.type = new Integer
col.required = true
col.increase = false
col.index = 2
col.controller = {
    type: ControllerType.INPUT
}
col.fromTable = 'table_1'

const mockCtx = {} as any

insertColumn(mockCtx)(col)
    .then(console.log).catch(console.error)
    .then(() => getTableColumns(mockCtx)(col.fromTable!))
    .then(res => {
        const time = res[0].createTime as any
        console.log(time instanceof Date)
    })

const table = new SonodaTable
table.name = 'table'
table.title = 'title'