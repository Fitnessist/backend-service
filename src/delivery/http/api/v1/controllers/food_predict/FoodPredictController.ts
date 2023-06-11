import { type FoodPredictUseCase } from "@application/usecase/predict/FoodPredictUseCase"
import { type NextFunction, type Request, type Response } from "express"
import { type Logger } from "@infrastructure/log/Logger"
import { sendError, sendSuccess } from "../ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import { UserFoodHistoryRequestDTO } from "@domain/foods/dto/UserFoodHistoryRequestDTO"

export class FoodPredictController {
    private readonly foodPredictUC: FoodPredictUseCase
    private readonly logger: Logger

    constructor (foodPredictUC: FoodPredictUseCase, logger: Logger) {
        this.foodPredictUC = foodPredictUC
        this.logger = logger

        this.predictFoodImage = this.predictFoodImage.bind(this)
        this.addFoodForUser = this.addFoodForUser.bind(this)
        this.getFoodHistoryByUserId = this.getFoodHistoryByUserId.bind(this)
    }

    public predictFoodImage (
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        // base64String berisi file dalam format base64
        const fileStringBase64: string = req.body.food_image

        if (fileStringBase64 === undefined) {
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
            .predictFoodImage(fileStringBase64, user.id)
            .then((result) => {
                sendSuccess(res, HTTP_STATUS.OK, result?.data, "OK")
            })
            .catch((error) => {
                next(error)
            })
    }

    public addFoodForUser (
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const user = req.currentUser
        if (user === undefined) {
            next(new UnauthorizedException())
            return
        }
        const payload = new UserFoodHistoryRequestDTO({ ...req.body, user_id: user.id })

        this.foodPredictUC
            .addFoodForUser(payload)
            .then((result) => {
                sendSuccess(res, HTTP_STATUS.CREATED, result, "CREATED")
            })
            .catch((error) => {
                next(error)
            })
    }

    public getFoodHistoryByUserId (req: Request, res: Response, next: NextFunction): void {
        const user = req.currentUser
        if (user === undefined) {
            next(new UnauthorizedException())
            return
        }
        const dateString = req.query.date as string

        this.foodPredictUC
            .getUserFoodHistory(user.id, dateString)
            .then((result) => {
                sendSuccess(res, HTTP_STATUS.OK, result, "OK")
            }).catch((error: any) => {
                next(error)
            })
    }
}
