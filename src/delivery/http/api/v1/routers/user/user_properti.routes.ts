import express from "express"
import container from "@infrastructure/container"
import type { TDECalculationUseCase } from "@application/user/usecase/TDECalculationUseCase"
import { UserPropertiController } from "../../controllers/user/UserPropertiController"
import { authorizationMiddleware } from "@middleware/AuthorizationMiddleware"

const router = express.Router()
const tdeCalculationUseCase = container.getInstance("TDECalculationUseCase") as TDECalculationUseCase
const tdeController = new UserPropertiController(tdeCalculationUseCase)

router.post("/properties", authorizationMiddleware, tdeController.calculateTDE)

export default router
