import express from "express"
import container from "@infrastructure/container"
import { authorizationMiddleware } from "@middleware/AuthorizationMiddleware"
import { type FoodPredictUseCase } from "@application/usecase/predict/FoodPredictUseCase"
import { FoodPredictController } from "../../controllers/food_predict/FoodPredictController"
import { type Logger } from "@infrastructure/log/Logger"

const router = express.Router()
const foodPredictUseCase = container.getInstance(
    "FoodPredictUseCase"
) as FoodPredictUseCase
const log = container.getInstance("Logger") as Logger

const controller = new FoodPredictController(foodPredictUseCase, log)

router.post("/predict", authorizationMiddleware, controller.predictFoodImage)
router.post("/my-histories", authorizationMiddleware, controller.addFoodForUser)
router.get("/my-histories", authorizationMiddleware, controller.getFoodHistoryByUserId)

export default router
