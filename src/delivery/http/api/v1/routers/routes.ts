import express from "express"
import authRouter from "@delivery/http/api/v1/routers/auth/auth.routes"

const router = express.Router()

router.use("/auth", authRouter)

export default router
