import express from "express"
import authRouter from "@delivery/http/api/v1/routers/auth/auth.routes"
import programRouter from "./program_workout/program.routes"
import workoutRouter from "@delivery/http/api/v1/routers/program_workout/workout.routes"
import myProgress from "@delivery/http/api/v1/routers/program_workout/my_exercise.routes"
import predictRouter from "@delivery/http/api/v1/routers/food_predict/index.routes"

const router = express.Router()

router.use("/auth", authRouter)
router.use("/my-progress", myProgress)
router.use("/programs", programRouter)
router.use("/workouts", workoutRouter)
router.use("/predict", predictRouter)

export default router
