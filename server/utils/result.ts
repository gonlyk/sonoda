export enum ResultCode {
    SUCCESS = 0,
    PARAM_REQUIRE = 10000,
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

    static success<T>(data: T) {
        return new Result(ResultCode.SUCCESS, data)
    }

    static fail<T>(retCode: ResultCode, data: T, errMsg: string) {
        return new Result(retCode, data, errMsg)
    }
}