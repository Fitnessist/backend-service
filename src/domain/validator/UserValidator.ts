import Validator, { type ValidationSchema, type ValidationError } from "fastest-validator"
import { type RegisterUserPayload } from "@domain/user/entity/RegisterUser"
import { ValidationException } from "@common/exceptions/ValidationException"

const validator = new Validator()

const userSchema: ValidationSchema<any> = {
    username: { type: "string", optional: false },
    name: { type: "string", optional: false },
    email: { type: "email", optional: false, label: "Email Address" },
    password: { type: "string", optional: false, min: 8, label: "Password" },
    passwordConfirmation: { type: "equal", field: "password" }
}

export function validateRegisterUserRequest (payload: RegisterUserPayload): void {
    const validationResult = validator.validate(payload, userSchema)

    if (validationResult !== true) {
        const errors: ValidationError[] = validationResult as ValidationError[]
        // const errorMessages = errors.map((error) => error.message)
        throw new ValidationException(errors)
    }
}
