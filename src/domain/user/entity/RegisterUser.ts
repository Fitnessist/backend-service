import { validateSchema } from "@domain/validator/UserValidator"

export interface RegisterUserPayload {
    username: string
    email: string
    name: string
    password: string
    passwordConfirmation: string
}

export class RegisterUser {
    public email: string
    public name: string
    public username: string
    public password: string
    public passwordConfirmation: string

    constructor (payload: RegisterUserPayload) {
        this._validatePayload(payload)

        this.email = payload.email
        this.name = payload.name
        this.username = payload.username
        this.password = payload.password
        this.passwordConfirmation = payload.passwordConfirmation
    }

    private _validatePayload (payload: RegisterUserPayload): void {
        const registerSchema: any = {
            username: { type: "string", optional: false },
            name: { type: "string", optional: false },
            email: { type: "email", optional: false, label: "Email Address" },
            password: {
                type: "string",
                optional: false,
                min: 8,
                label: "Password"
            },
            passwordConfirmation: { type: "equal", field: "password" }
        }

        validateSchema(payload, registerSchema)
    }
}
