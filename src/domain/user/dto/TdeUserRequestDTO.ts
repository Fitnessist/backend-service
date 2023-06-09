import { ValidationException } from "@common/exceptions/ValidationException"
import Validator, { type ValidationError } from "fastest-validator"

export interface TdeUserRequestDTO {
    id: string
    gender: string
    age: number
    weight: number
    height: number
    activity?: string
    fat?: number
    user_id: string
    program_id: string
}

export class TdeUserRequestDTO {
    public id: string
    public gender: string
    public age: number
    public weight: number
    public height: number
    public activity?: string
    public fat?: number
    public user_id: string
    public weight_target: number
    public program_id: string

    constructor (dto: TdeUserRequestDTO) {
        this._validatePayload(dto)

        this.id = dto.id
        this.gender = dto.gender
        this.age = dto.age
        this.weight = dto.weight
        this.height = dto.height
        this.activity = dto.activity
        this.fat = dto.fat
        this.user_id = dto.user_id
        this.weight_target = dto.weight_target
        this.program_id = dto.program_id
    }

    private _validatePayload (dto: TdeUserRequestDTO): void {
        const schema: any = {
            gender: { type: "string", optional: false },
            age: { type: "number", optional: false },
            weight: { type: "number", optional: false },
            height: { type: "number", optional: false },
            activity: { type: "string", optional: true },
            fat: { type: "number", optional: true },
            user_id: { type: "string", optional: false },
            weight_target: { type: "number", optional: true },
            program_id: { type: "string", optional: false }
        }
        const validator = new Validator()
        const validationResult = validator.validate(dto, schema)

        if (validationResult !== true) {
            const errors: ValidationError[] = validationResult as ValidationError[]
            // const errorMessages = errors.map((error) => error.message)
            throw new ValidationException(errors)
        }
    }
}
