import express from "express"
import authRouter from "@delivery/http/api/v1/routers/auth/auth.routes"
import programRouter from "./program_workout/program.routes"
import workoutRouter from "@delivery/http/api/v1/routers/program_workout/workout.routes"
import myProgress from "@delivery/http/api/v1/routers/program_workout/my_exercise_progress.routes"
import myProgram from "@delivery/http/api/v1/routers/program_workout/my_program.routes"
import foodRouter from "@delivery/http/api/v1/routers/food_predict/index.routes"
import userPropRouter from "@delivery/http/api/v1/routers/user/user_properti.routes"

const router = express.Router()

router.use("/foods", foodRouter)
router.use("/auth", authRouter)
router.use("/my-progress", myProgress)
router.use("/my-program", myProgram)
router.use("/programs", programRouter)
router.use("/workouts", workoutRouter)
router.use("/users", userPropRouter)

export default router
