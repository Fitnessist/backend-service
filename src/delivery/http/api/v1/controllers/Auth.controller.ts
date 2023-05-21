import { type Request, type Response } from "express"
import { type RegisterUserUseCase } from "@application/user/usecase/RegistrationUseCase"
import { type Logger } from "@infrastructure/log/Logger"
import { RegisterUser } from "@domain/user/entity/RegisterUser"
import { sendError, sendSuccess } from "./ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"

export class AuthController {
    private readonly registerUserUseCase: RegisterUserUseCase
    private readonly logger: Logger

    constructor (logger: Logger, registerUseCase: RegisterUserUseCase) {
        this.registerUserUseCase = registerUseCase
        this.logger = logger

        // binding konteks function registerUser supaya terikat dengan kelas ini (this)
        this.registerUser = this.registerUser.bind(this)
    }

    public registerUser (req: Request, res: Response): void {
        console.log(req.body)
        const registerUserData: RegisterUser = new RegisterUser({ ...req.body })

        this.registerUserUseCase.execute(registerUserData).then((response: string | boolean) => {
            sendSuccess(res, HTTP_STATUS.CREATED, { lastInsertedID: response }, "OK")
        }).catch((reason) => {
            sendError(res, HTTP_STATUS.BAD_REQUEST, "BAD REQUEST", reason.message)
        })
    }
}
