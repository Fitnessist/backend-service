import { type Response } from "express"
import { sendSuccess, sendError } from "../ApiResponseHelper"

describe("ApiResponseHelper", () => {
    let res: Response

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response
    })

    describe("sendSuccess", () => {
        it("should send success response", () => {
            const data = { message: "Success" }
            const message = "Successful request"

            sendSuccess(res, 200, data, message)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: 200,
                    message: "Successful request"
                },
                data: { message: "Success" }
            })
        })
    })

    describe("sendError", () => {
        it("should send error response", () => {
            const message = "Error occurred"
            const statusCode = 400
            const errorCode = "ERROR"
            const details = ["Invalid input", "Missing parameter"]

            sendError(res, statusCode, message, errorCode, details)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: 400,
                    message: "Error occurred"
                },
                error: {
                    message: "Error occurred",
                    code: "ERROR",
                    details: ["Invalid input", "Missing parameter"]
                }
            })
        })
    })
})
