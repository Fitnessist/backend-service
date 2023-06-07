import { type FoodPredictUseCase } from "@application/usecase/predict/FoodPredictUseCase"
import { type NextFunction, type Request, type Response } from "express"
import { type Logger } from "@infrastructure/log/Logger"
import { sendError, sendSuccess } from "../ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"

export class FoodPredictController {
    private readonly foodPredictUC: FoodPredictUseCase
    private readonly logger: Logger

    constructor (foodPredictUC: FoodPredictUseCase, logger: Logger) {
        this.foodPredictUC = foodPredictUC
        this.logger = logger

        this.predictFoodImage = this.predictFoodImage.bind(this)
    }

    public predictFoodImage (
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        // base64String berisi file dalam format base64
        const file = req.file
        if (file === undefined) {
            sendError(
                res,
                HTTP_STATUS.BAD_REQUEST,
                "Bad Request",
                "VALIDATION_ERROR"
            )
            return
        }

        const user = req.currentUser
        if (user === undefined) {
            next(new UnauthorizedException())
            return
        }

        this.foodPredictUC
            .predictFoodImage(file, user.id)
            .then((result) => {
                sendSuccess(res, HTTP_STATUS.OK, result?.data, "OK")
            })
            .catch((error) => {
                next(error)
            })
    }
}
