import { type Response } from "express"

export interface ApiResponse<T> {
    status: {
        code: number
        message: string
    }
    data?: T
    error?: {
        message: string
        code: string
        details?: any[]
    }
}

export const sendSuccess = (
    res: Response,
    statusCode: number = 200,
    data: any,
    message: string
): void => {
    const response: ApiResponse<any> = {
        status: {
            code: statusCode,
            message
        },
        data
    }

    res.status(statusCode).json(response)
}

export const sendError = (
    res: Response,
    statusCode: number,
    message: string,
    errorCode: string,
    details?: any[]
): void => {
    const response: ApiResponse<any> = {
        status: {
            code: statusCode,
            message
        },
        error: {
            message,
            code: errorCode,
            details
        }
    }

    res.status(statusCode).json(response)
}
