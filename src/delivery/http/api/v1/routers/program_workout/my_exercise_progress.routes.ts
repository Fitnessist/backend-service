import express from "express"
import container from "@infrastructure/container"
import { MyExerciseProgressController } from "@delivery/http/api/v1/controllers/ProgramWorkout/MyExerciseProgressController"
import { type MyExerciseProgressUseCase } from "@application/usecase/my_progress/MyExerciseProgressUseCase"
import { authorizationMiddleware } from "@middleware/AuthorizationMiddleware"
import { type MyInventoryUseCase } from "@application/usecase/my_progress/MyInventoryUseCase"

const router = express.Router()
const exerciseUC = container.getInstance(
    "MyExerciseProgressUseCase"
) as MyExerciseProgressUseCase

const myInventoryUC = container.getInstance(
    "MyInventoryUseCase"
) as MyInventoryUseCase

const controller = new MyExerciseProgressController(exerciseUC, myInventoryUC)

router.get("/inventories", authorizationMiddleware, controller.getInventory)
router.get("/", authorizationMiddleware, controller.findByUser)
router.post("/", authorizationMiddleware, controller.create)

export default router
