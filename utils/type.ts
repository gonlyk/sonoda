import { Knex } from "knex"
import { isNullOrUndefined } from "./util"

export type RemoveFunctions<T> = {
  [K in keyof T]: T[K] extends (...arg: any) => any ? never : T[K]
}

/**
 * return this function with type
 * @returns 
 */
export function rtf<T extends Record<any, any>>() {
  return (o: Partial<T>) => {
    const keys = Object.keys(o)
    for (const k of keys) {
      if (isNullOrUndefined(o[k])) {
        delete o[k]
      }
    }
    return o
  }
}

export type KnexType =
  | string
  | number
  | boolean
  | null
  | Date
  | Array<string>
  | Array<number>
  | Array<Date>
  | Array<boolean>
  | Buffer
  | object
  | Knex.Raw;