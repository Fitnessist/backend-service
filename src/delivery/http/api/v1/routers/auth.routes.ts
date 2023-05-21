import express from "express"
import { type AuthController } from "../controllers/Auth.controller"
import container from "@infrastructure/container"

const authRouter = express.Router()
const authController: AuthController = container.getInstance("AuthController")

authRouter.post("/register", authController.registerUser)

export default authRouter
