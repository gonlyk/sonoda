import md5 from "md5"
import { SonodaUser, getUser, getUserByName, getUsers, insertUser, updateUser } from "../model/user"
import { Context } from "../../shared/koaContext"
import { BaseService } from "./baseService"

export class SonodaUserService extends BaseService {
    createUser(ctx: Context) {
        return async (name: string, nickname: string, password: string) => {
            const userEntity = new SonodaUser()
            userEntity.name = name
            userEntity.nickname = nickname
            userEntity.password = md5(password)
            const user = await insertUser(ctx)(userEntity)
            return user
        }
    }

    updateUser(ctx: Context) {
        return async (id: number, nickname: string, password: string, dataActive?: boolean) => {
            const userEntity = new SonodaUser()
            userEntity.nickname = nickname
            userEntity.password = md5(password)
            userEntity.dataActive = !!dataActive
            userEntity.id = id
            const user = await updateUser(ctx)(userEntity)
            return user
        }
    }

    getUsers(ctx: Context) {
        return async (page?: number, pageSize?: number) => {
            const users = await getUsers(ctx)(page, pageSize)
            return users
        }
    }

    getUser(ctx: Context) {
        return async (id: number) => {
            const user = await getUser(ctx)(id)
            return user
        }
    }

    getUserByName(ctx: Context) {
        return async (name: string) => {
            const user = await getUserByName(ctx)(name)
            return user
        }
    }
}
