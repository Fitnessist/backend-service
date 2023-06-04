// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from "express"
import { type User } from "@domain/user/entity/User"

declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}
