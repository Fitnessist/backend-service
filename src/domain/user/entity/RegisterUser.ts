import { validateRegisterUserRequest } from "@domain/validator/UserValidator"

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
        validateRegisterUserRequest(payload)
    }
}
