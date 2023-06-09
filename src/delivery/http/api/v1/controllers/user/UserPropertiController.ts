import { type Request, type Response, type NextFunction } from "express"
import { type TDECalculationUseCase } from "@application/user/usecase/TDECalculationUseCase"
import { TdeUserRequestDTO } from "@domain/user/dto/TdeUserRequestDTO"
import { sendSuccess } from "../ApiResponseHelper"

export class UserPropertiController {
    private readonly tdeCalculationUseCase: TDECalculationUseCase

    constructor (tdeCalculationUseCase: TDECalculationUseCase) {
        this.tdeCalculationUseCase = tdeCalculationUseCase

        // binding this
        this.calculateTDE = this.calculateTDE.bind(this)
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
}
