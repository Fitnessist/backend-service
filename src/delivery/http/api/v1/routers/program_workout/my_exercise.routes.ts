import express from "express"
import container from "@infrastructure/container"
import { MyExerciseProgressController } from "@delivery/http/api/v1/controllers/ProgramWorkout/MyExerciseProgressController"
import { type MyExerciseProgressUseCase } from "@application/usecase/my_progress/MyExerciseProgressUseCase"
import { authorizationMiddleware } from "@middleware/AuthorizationMiddleware"

const router = express.Router()
const exerciseUC = container.getInstance(
    "MyExerciseProgressUseCase"
) as MyExerciseProgressUseCase
const controller = new MyExerciseProgressController(exerciseUC)

router.get("/:userId", authorizationMiddleware, controller.findByUser)
router.post("/", authorizationMiddleware, controller.create)

export default router
