import { ValidationException } from "@common/exceptions/ValidationException"
import Validator, { type ValidationError } from "fastest-validator"

export interface TdeUpdateRequestDTOInterface {
    id: string
    gender?: string
    age?: number
    weight?: number
    height?: number
    activity?: string
    fat?: number
    user_id: string
    weight_target?: number
    calories_each_day?: number
    calories_each_day_target?: number
}

export class TdeUpdateRequestDTO {
    public id?: string
    public gender?: string
    public age?: number
    public weight?: number
    public height?: number
    public activity?: string
    public fat?: number
    public user_id: string
    public weight_target?: number
    public program_id?: string
    public calories_each_day?: number
    public calories_each_day_target?: number

    constructor (dto: TdeUpdateRequestDTO) {
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
        this.calories_each_day = dto.calories_each_day
        this.calories_each_day_target = dto.calories_each_day_target
    }

    private _validatePayload (dto: TdeUpdateRequestDTO): void {
        const schema: any = {
            id: { type: "string", optional: true },
            gender: { type: "string", optional: true },
            age: { type: "number", optional: true },
            weight: { type: "number", optional: true },
            height: { type: "number", optional: true },
            activity: { type: "string", optional: true },
            fat: { type: "number", optional: true },
            user_id: { type: "string", optional: false },
            weight_target: { type: "number", optional: true }
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
