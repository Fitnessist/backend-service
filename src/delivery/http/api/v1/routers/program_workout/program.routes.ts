import express from "express"
import container from "@infrastructure/container"
import ProgramController from "@delivery/http/api/v1/controllers/ProgramWorkout/ProgramController"
import type ProgramUseCase from "@application/workout/usecase/ProgramUseCase"

const programRouter = express.Router()
const programUseCase = container.getInstance("ProgramUseCase") as ProgramUseCase
const programController = new ProgramController(programUseCase)

programRouter.get("/programs/:programId", programController.getProgramById)
programRouter.get("/programs", programController.getAllPrograms)

export default programRouter
