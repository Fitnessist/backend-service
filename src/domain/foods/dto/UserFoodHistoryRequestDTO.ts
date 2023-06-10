import Validator, { type ValidationError } from "fastest-validator"
import { ValidationException } from "@common/exceptions/ValidationException"

export class UserFoodHistoryRequestDTO {
    public food_name?: string
    public user_id: string
    public image_url?: string
    public food_id?: string
    public total_grams?: number
    public calories_per_100gr?: number
    public total_calories?: number

    constructor (payload: UserFoodHistoryRequestDTO) {
        this._validatePayload(payload)

        this.user_id = payload.user_id
        this.image_url = payload.image_url
        this.food_id = payload.food_id
        this.food_name = payload.food_name
        this.total_calories = payload.total_calories
        this.total_grams = payload.total_grams
        this.calories_per_100gr = payload.calories_per_100gr
    }

    private _validatePayload (dto: any): void {
        const schema: any = {
            user_id: { type: "string", optional: false },
            image_url: { type: "string", optional: true },
            food_name: { type: "string", optional: false },
            food_id: { type: "string", optional: true },
            total_grams: { type: "number", optional: true },
            calories_per_100gr: { type: "number", optional: true },
            total_calories: { type: "number", optional: true }
        }
        const validator = new Validator()
        const validationResult = validator.validate(dto, schema)

        if (validationResult !== true) {
            const errors: ValidationError[] = validationResult as ValidationError[]

            throw new ValidationException(errors)
        }
    }
}
