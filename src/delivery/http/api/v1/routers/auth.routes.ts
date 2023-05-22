import express from "express"
import { AuthController } from "../controllers/Auth.controller"
import container from "@infrastructure/container"
import { type AuthenticationUseCase } from "@application/user/usecase/AuthenticationUseCase"

const authRouter = express.Router()
const authUserUseCase = container.getInstance("AuthenticationUseCase") as AuthenticationUseCase

const authController: AuthController = new AuthController(
    container.getInstance("Logger"),
    container.getInstance("RegisterUserUseCase"),
    authUserUseCase
)

authRouter.post("/register", authController.registerUser)
authRouter.post("/login", authController.login)

export default authRouter
