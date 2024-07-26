export enum ResultCode {
    SUCCESS = 0,
    PARAM_REQUIRE = 10000,
    PARAM_INVALID = 10001,
    SERVER_ERROR = -900
}

export default class Result<T> {
    retCode: ResultCode
    data: T
    errMsg?: string

    constructor(retCode: ResultCode, data: T, errMsg?: string) {
        this.retCode = retCode
        this.data = data
        this.errMsg = errMsg
    }

    static success<T>(data?: T) {
        return new Result(ResultCode.SUCCESS, data)
    }

    static list<T>(page: number, pageSize: number, count: number, list: any) {
        return new Result(ResultCode.SUCCESS, {
            page,
            pageSize,
            count,
            list
        })
    }

    static fail<T>(retCode: ResultCode, data: T, errMsg: string) {
        return new Result(retCode, data, errMsg)
    }
}