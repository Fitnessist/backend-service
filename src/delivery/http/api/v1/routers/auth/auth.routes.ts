import express from "express"
import { type AuthController } from "../../controllers/Auth.controller"
import container from "@infrastructure/container"
import { authorizationMiddleware } from "@middleware/AuthorizationMiddleware"

const authRouter = express.Router()

const authController: AuthController = container.getInstance(
    "AuthController"
) as AuthController

authRouter.post("/register", authController.registerUser)
authRouter.post("/login", authController.login)
authRouter.get("/", authorizationMiddleware, authController.findById)

export default authRouter
