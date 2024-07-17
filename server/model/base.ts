import Dayjs from "dayjs"
import { getNowTimeStamp } from "../utils/postgresql"
export class BaseModel {
    id?: number
    dataActive?: boolean
    createUser?: string
    createTime?: Date
    updateUser?: string
    updateTime?: Date

    constructor(
        createUser?: string,
        createTime?: Date,
        updateUser?: string,
        updateTime?: Date,
    ) {
        this.dataActive = true
        this.createUser = createUser
        this.createTime = createTime || getNowTimeStamp();
        this.updateUser = updateUser
        this.updateTime = updateTime || getNowTimeStamp();
    }
}