import express from "express"
import container from "@infrastructure/container"
import { authorizationMiddleware } from "@middleware/AuthorizationMiddleware"
import { type MyProgramUseCase } from "@application/usecase/my_progress/MyProgramUseCase"
import MyProgramController from "../../controllers/ProgramWorkout/MyProgramController"

const router = express.Router()
const myProgramUC = container.getInstance(
    "MyProgramUseCase"
) as MyProgramUseCase

const controller = new MyProgramController(myProgramUC)

router.post("/", authorizationMiddleware, controller.addMyProgram)

export default router
