import { type NextFunction, type Request, type Response } from "express"
import { sendSuccess } from "../ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { type MyProgramUseCase } from "@application/usecase/my_progress/MyProgramUseCase"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"

export default class MyProgramController {
    private readonly myProgramUseCase: MyProgramUseCase

    constructor (uc: MyProgramUseCase) {
        this.myProgramUseCase = uc

        // binding this context for each function
        this.addMyProgram = this.addMyProgram.bind(this)
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
}
