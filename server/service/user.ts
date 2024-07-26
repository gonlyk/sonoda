import md5 from "md5"
import { SonodaUser, getUser, getUserByName, getUserCount, getUsers, insertUser, updateUser } from "../model/user"
import { Context } from "../../shared/koaContext"
import { BaseService } from "./baseService"
import { ResourceNotExistError } from "../exception"

export class SonodaUserService extends BaseService {
    createUser(ctx: Context) {
        return async (name: string, nickname: string, password: string) => {
            const userEntity = new SonodaUser()
            userEntity.name = name
            userEntity.nickname = nickname
            userEntity.password = md5(password)
            userEntity.createUser = ctx.state.user
            userEntity.updateUser = ctx.state.user
            const user = await insertUser(ctx)(userEntity)
            return user
        }
    }

    updateUser(ctx: Context) {
        return async (id: number, nickname?: string, password?: string, dataActive?: boolean) => {
            const userEntity = new SonodaUser()
            userEntity.id = id
            userEntity.nickname = nickname
            userEntity.password = password ? md5(password) : void 0
            userEntity.dataActive = dataActive
            userEntity.updateUser = ctx.state.user
            const user = await updateUser(ctx)(userEntity)
            if (!user?.id) {
              throw new ResourceNotExistError('SonodaUserService.updateUser fail, user not exist')
            }
            return user
        }
    }

    getUsers(ctx: Context) {
        return async (page?: number, pageSize?: number): Promise<[SonodaUser[], number]> => {
            const [users, count] = await Promise.all([getUsers(ctx)(page, pageSize), getUserCount(ctx)()])
            return [users, count]
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
