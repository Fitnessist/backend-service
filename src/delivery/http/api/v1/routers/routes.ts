import express from "express"
import authRouter from "@delivery/http/api/v1/routers/auth/auth.routes"
import programRouter from "./program_workout/program.routes"
import workoutRouter from "@delivery/http/api/v1/routers/program_workout/workout.routes"

const router = express.Router()

router.use("/auth", authRouter)
router.use("/", programRouter)
router.use("/", workoutRouter)

export default router
