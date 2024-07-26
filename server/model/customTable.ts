import { DatabaseType } from "../../shared/databaseType";
import { Context } from "../../shared/koaContext";
import { knex } from "../db";
import { InvalidParameterError } from "../exception";
import { dev } from "../../utils/env";
import { getQueryer } from "../../utils/postgresql";
import { SonodaColumn } from "./column";

export function createTable(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (name: string, columns: Required<SonodaColumn>[]) => {
    await queryer.schema.createTable(name, (table) => {
      table.increments('id').primary();
      for (const column of columns.sort((c1, c2) => c1.index - c2.index)) {
        let type;
        switch (column.type) {
          case DatabaseType.VARCHAR: {
            type = `varchar(${column.typeSize || 255})${column.increase ? '[]' : ''}`
            break;
          }
          case DatabaseType.JSON: {
            type = `json`
            break;
          }
          case DatabaseType.JSONB: {
            type = `jsonb`
            break;
          }
          case DatabaseType.BOOL: {
            type = `bool${column.increase ? '[]' : ''}`
            break;
          }
          case DatabaseType.INTEGER: {
            type = `integer${column.increase ? '[]' : ''}`
            break;
          }
          case DatabaseType.TIMESTAMP: {
            type = `timestamp`
            break;
          }
          default: {
            throw new InvalidParameterError('unsupport database type')
          }
        }
        const newCol = table.specificType(column.name, type)
        if (column.uniqueValue) {
          newCol.unique()
        }
        if (column.required) {
          newCol.notNullable()
        }
        
        if (column.comment) {
          newCol.comment(column.comment)
        }
      }
    }).debug(dev)
  }
}

export function insertData(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (customTableName: string, record: any) => {
    const keys = [], values = [];
    for (const key of Object.keys(record)) {
      keys.push(key)
      values.push(`:${key}`)
    }
    return await queryer
      .raw(`insert into ${customTableName} (${keys.join()}) values (${values.join()}) returning *`, record)
  }
}

export function updateData(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (customTableName: string, record: any) => {
    const setter = [];
    for (const key of Object.keys(record)) {
      setter.push(`${key}=:${key}`)
    }
    return await queryer
      .raw(`update ${customTableName} set ${setter.join()} returning *`, record)
  }
}

export function selectDatas(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (customTableName: string, page?: number, pageSize = 10) => {
    const result = await queryer
      .raw(`select * from ${customTableName} ${page ? `offset :offset limit :limit` : ''}`, {
        offset: pageSize * ((page || 1) - 1),
        limit: pageSize
      })

    return result.rows
  }
}

export function selectDataCount(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (customTableName: string) => {
    const result = await queryer
      .raw(`select COUNT(1) from ${customTableName}`)

      return result.rowCount
  }
}