import { type Request, type Response, type NextFunction } from "express"
import { type TDECalculationUseCase } from "@application/user/usecase/TDECalculationUseCase"
import { TdeUserRequestDTO } from "@domain/user/dto/TdeUserRequestDTO"
import { sendSuccess } from "../ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"

export class UserPropertiController {
    private readonly tdeCalculationUseCase: TDECalculationUseCase

    constructor (tdeCalculationUseCase: TDECalculationUseCase) {
        this.tdeCalculationUseCase = tdeCalculationUseCase

        // binding this
        this.calculateTDE = this.calculateTDE.bind(this)
        this.getUserProperties = this.getUserProperties.bind(this)
        this.updateUserProperties = this.updateUserProperties.bind(this)
    }

    calculateTDE (req: Request, res: Response, next: NextFunction): void {
        const user = req.currentUser

        const dto: TdeUserRequestDTO = new TdeUserRequestDTO({ ...req.body, user_id: user?.id })
        this.tdeCalculationUseCase.calculateTDE(dto).then((data) => {
            sendSuccess(res, 200, data, "OK")
        }).catch((error: any) => {
            next(error)
        })
    }

    updateUserProperties (req: Request, res: Response, next: NextFunction): void {
        const user = req.currentUser
        if (user === undefined) {
            const err = new UnauthorizedException()
            next(err)
            return
        }

        const dto: TdeUserRequestDTO = new TdeUserRequestDTO({ ...req.body, user_id: user?.id })
        this.tdeCalculationUseCase.updateCalculateTDE(user.id, dto).then((data) => {
            sendSuccess(res, 200, data, "OK")
        }).catch((error: any) => {
            next(error)
        })
    }

    getUserProperties (req: Request, res: Response, next: NextFunction): void {
        const user = req.currentUser
        if (user === undefined) {
            const err = new UnauthorizedException()
            next(err)
            return
        }

        this.tdeCalculationUseCase.getUserProperties(user)
            .then((data) => {
                sendSuccess(res, HTTP_STATUS.OK, data, "OK")
            })
            .catch((error: any) => {
                next(error)
            })
    }
}
