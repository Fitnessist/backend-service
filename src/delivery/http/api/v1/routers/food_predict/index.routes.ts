import express from "express"
import container from "@infrastructure/container"
import { authorizationMiddleware } from "@middleware/AuthorizationMiddleware"
import multer from "multer"
import { type FoodPredictUseCase } from "@application/usecase/predict/FoodPredictUseCase"
import { FoodPredictController } from "../../controllers/food_predict/FoodPredictController"
import { type Logger } from "@infrastructure/log/Logger"
import os from "os"

const router = express.Router()
const foodPredictRouter = container.getInstance(
    "FoodPredictUseCase"
) as FoodPredictUseCase
const log = container.getInstance("Logger") as Logger

const controller = new FoodPredictController(foodPredictRouter, log)

const upload = multer({
    storage: multer.diskStorage({
        destination: os.tmpdir()
    }),
    limits: {
        fieldSize: 1.5 * 1024 * 1024
    }
})
router.post("/", authorizationMiddleware, upload.single("food_image"), controller.predictFoodImage)

export default router
