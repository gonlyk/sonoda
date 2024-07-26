import Dayjs from "dayjs"
import { getNowTimeStamp } from "../../utils/postgresql"
export class BaseModel {
    id?: number
    dataActive?: boolean
    createUser?: string
    createTime?: Date
    updateUser?: string
    updateTime?: Date

    constructor() {
        this.dataActive = true
    }
}