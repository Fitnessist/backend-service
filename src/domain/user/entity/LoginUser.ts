import { validateSchema } from "@domain/validator/UserValidator"

export class LoginUser {
    public readonly email: string
    public readonly password: string

    constructor (email: string, password: string) {
        this._validatePayload({ email, password })
        this.email = email
        this.password = password
    }

    getEmail (): string {
        return this.email
    }

    getPassword (): string {
        return this.password
    }

    private _validatePayload (payload: any): void {
        const loginSchema: any = {
            email: { type: "email", optional: false, label: "Email Address" },
            password: { type: "string", optional: false, label: "Password" }
        }
        validateSchema(payload, loginSchema)
    }
}
