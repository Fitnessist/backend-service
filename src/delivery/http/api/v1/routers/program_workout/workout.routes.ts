import express from "express"
import container from "@infrastructure/container"
import WorkoutController from "../../controllers/ProgramWorkout/WorkoutControlller"
import type WorkoutUseCase from "@application/workout/usecase/WorkoutUseCase"

const workoutRouter = express.Router()

const workoutController = new WorkoutController(container.getInstance("WorkoutUseCase") as WorkoutUseCase)

workoutRouter.get("/:workoutId", workoutController.getWorkoutById)
workoutRouter.get("/", workoutController.getAllWorkouts) // cotoh optional query: ?programId=12&page=2&perPage=5

export default workoutRouter
