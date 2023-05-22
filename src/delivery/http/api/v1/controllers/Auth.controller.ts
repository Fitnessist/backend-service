import { type NextFunction, type Request, type Response } from "express"
import { type RegisterUserUseCase } from "@application/user/usecase/RegistrationUseCase"
import { type Logger } from "@infrastructure/log/Logger"
import { RegisterUser } from "@domain/user/entity/RegisterUser"
import { sendError, sendSuccess } from "./ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { LoginUser } from "@domain/user/entity/LoginUser"
import { type AuthenticationUseCase } from "@application/user/usecase/AuthenticationUseCase"

export class AuthController {
    private readonly registerUserUseCase: RegisterUserUseCase
    private readonly authUserUseCase: AuthenticationUseCase
    private readonly logger: Logger

    constructor (logger: Logger, registerUseCase: RegisterUserUseCase, authUserUseCase: AuthenticationUseCase) {
        this.logger = logger
        this.registerUserUseCase = registerUseCase
        this.authUserUseCase = authUserUseCase

        // binding konteks function registerUser supaya terikat dengan kelas ini (this)
        this.registerUser = this.registerUser.bind(this)
        this.login = this.login.bind(this)
    }

    public registerUser (req: Request, res: Response): void {
        const registerUserData: RegisterUser = new RegisterUser({ ...req.body })

        this.registerUserUseCase.execute(registerUserData).then((response: string | boolean) => {
            sendSuccess(res, HTTP_STATUS.CREATED, { lastInsertedID: response }, "OK")
        }).catch((reason) => {
            sendError(res, HTTP_STATUS.BAD_REQUEST, "BAD REQUEST", reason.message)
        })
    }

    public login (req: Request, res: Response, next: NextFunction): void {
        const { email, password } = req.body

        // Create a login user object
        const loginUser: LoginUser = new LoginUser(email, password)

        // Call the authentication use case to perform login
        this.authUserUseCase
            .loginUser(loginUser)
            .then(({ accessToken, refreshToken }) => {
                // Send the access token and refresh token in the response
                sendSuccess(res, HTTP_STATUS.OK, { accessToken, refreshToken }, "OK")
            })
            .catch((error: any) => {
                next(error)
            })
    }
}
