import { Context } from "../../shared/koaContext"
import { getNowTimeStamp, getQueryer } from "../utils/postgresql";
import { getConfig } from "../utils/readConfig";
import { rtf } from "../utils/type";
import { BaseModel } from "./base";

export class SonodaUser extends BaseModel {
  name?: string
  nickname?: string
  password?: string

  constructor() {
    super()
  }
}

const rt = rtf<SonodaUser>()
const _table = `${getConfig().dbPrefix}_user`

export function insertUser(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (entity: SonodaUser): Promise<SonodaUser> => {
    const now = getNowTimeStamp()
    const result = await queryer(_table)
      .insert(rt({
        ...entity,
        createTime: now,
        updateTime: now,
      }))
      .returning<SonodaUser[]>('*')
    const user = result[0]
    return { ...user, password: void 0 }
  }
}

export function updateUser(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (entity: SonodaUser): Promise<SonodaUser> => {
    if (!entity.id) {
      throw new Error('SonodaUser.updateUser: fields required')
    }
    const result = await queryer(_table)
      .where(rt({ id: entity.id }))
      .update(rt({
        name: entity.name,
        nickname: entity.nickname,
        password: entity.password,
        dataActive: entity.dataActive,
        updateUser: entity.updateUser,
        updateTime: getNowTimeStamp(),
      }))
      .returning<SonodaUser[]>('*')
    const user = result[0]
    return { ...user, password: void 0 }
  }
}

export function getUsers(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (page = 1, pageSize = 10): Promise<SonodaUser[]> => {
    const result = await queryer(_table)
      .whereNot(rt({ dataActive: false }))
      .offset(pageSize * page)
      .limit(pageSize)
      .select<SonodaUser[]>()
    const users = result.map(user => ({ ...user, password: void 0 }))
    return users
  }
}

export function getUser(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (id: number): Promise<SonodaUser> => {
    const result = await queryer<SonodaUser>(_table)
      .where(rt({ id }))
      .whereNot(rt({ dataActive: false }))
      .select()
    const user = result[0]
    return { ...user, password: void 0 }
  }
}

export function getUserByName(ctx: Context) {
  const queryer = getQueryer(ctx)
  return async (name: string): Promise<SonodaUser> => {
    const result = await queryer<SonodaUser>(_table)
      .where(rt({ name }))
      .whereNot(rt({ dataActive: false }))
      .select()
    const user = result[0]
    return { ...user, password: void 0 }
  }
}