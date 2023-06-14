import { type NextFunction, type Request, type Response } from "express"
import { sendError, sendSuccess } from "../ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { type MyProgramUseCase } from "@application/usecase/my_progress/MyProgramUseCase"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import { ValidationException } from "@common/exceptions/ValidationException"

export default class MyProgramController {
    private readonly myProgramUseCase: MyProgramUseCase

    constructor (uc: MyProgramUseCase) {
        this.myProgramUseCase = uc

        // binding this context for each function
        this.addMyProgram = this.addMyProgram.bind(this)
        this.getMyProgramWithIdByUserId = this.getMyProgramWithIdByUserId.bind(this)
    }

    addMyProgram (req: Request, res: Response, next: NextFunction): void {
        const currentUser = req.currentUser
        if (currentUser === undefined) {
            throw new UnauthorizedException()
        }
        // Panggil use case untuk mencari program berdasarkan ID
        this.myProgramUseCase
            .addMyProgram({
                userId: currentUser.id,
                user: currentUser,
                program_id: req.body.program_id
            })
            .then((program) => {
                sendSuccess(res, HTTP_STATUS.CREATED, program, "CREATED")
            })
            .catch((error: any) => {
                next(error)
            })
    }

    getMyProgramWithIdByUserId (req: Request, res: Response, next: NextFunction): void {
        const currentUser = req.currentUser
        const programId = req.query.program_id

        if (currentUser === undefined) {
            sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized", "AUTHENTICATED_ERROR")
            return
        }

        if (programId === undefined && typeof programId !== "string") {
            const err = new ValidationException([
                {
                    type: "string",
                    field: "program_id",
                    message: "program_id should be string"
                }
            ])
            next(err)
            return
        }

        this.myProgramUseCase.getMyProgramWithIdByUserId(currentUser.id, programId !== undefined ? programId as string : undefined)
            .then((data) => {
                sendSuccess(res, HTTP_STATUS.OK, data, "OK")
            })
            .catch((error: any) => {
                next(error)
            })
    }
}
