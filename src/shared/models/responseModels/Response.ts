export interface IResponse {
    isSuccess: boolean
    result: any | null
    message: string | null
    error: string | null
}

export class Response<T> implements IResponse {
    isSuccess: boolean
    result: T | null
    message: string | null
    error: string | null
}

export class SuccessResponse<T> extends Response<T> {
    constructor(result?: T, message?: string) {
        super()
        this.isSuccess = true
        this.message = message ? message : null
        this.result = result ? result : null
        this.error = null
    }

    static Response<T>(result?: T, message?: string): SuccessResponse<T> {
        return new SuccessResponse(result, message)
    }
}

export class ErrorResponse implements IResponse {
    isSuccess: boolean
    result: any
    message: string | null
    error: string | null

    constructor(error: string, message?: string) {
        this.isSuccess = false
        this.message = message ? message : null
        this.result = null
        this.error = error
    }

    static Response(error: string, message?: string): ErrorResponse {
        return new ErrorResponse(error, message)
    }
}