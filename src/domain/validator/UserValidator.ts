import Validator, { type ValidationError } from "fastest-validator"
import { type RegisterUserPayload } from "@domain/user/entity/RegisterUser"
import { ValidationException } from "@common/exceptions/ValidationException"

const validator = new Validator()

export function validateSchema (payload: RegisterUserPayload, schema: any): void {
    const validationResult = validator.validate(payload, schema)

    if (validationResult !== true) {
        const errors: ValidationError[] = validationResult as ValidationError[]
        // const errorMessages = errors.map((error) => error.message)
        throw new ValidationException(errors)
    }
}
