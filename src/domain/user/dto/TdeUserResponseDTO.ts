import type UserProperti from "../entity/UserProperti"

export interface TdeUserResponseDTO {
    id: string
    gender: string
    age: number
    weight: number
    height: number
    activity?: string
    fat?: number
    user_id: string
    weight_target?: number
    calories_each_day?: number
    calories_each_day_target?: number
}

export class TdeUserResponseDTO {
    public id: string
    public gender: string
    public age: number
    public weight: number
    public height: number
    public activity?: string
    public fat?: number
    public user_id: string
    public weight_target?: number
    public calories_each_day?: number
    public calories_each_day_target?: number

    constructor (dto: UserProperti) {
        this.id = dto.id
        this.gender = dto.gender
        this.age = dto.age
        this.weight = dto.weight
        this.height = dto.height
        this.activity = dto.activity
        this.fat = dto.fat
        this.user_id = dto.userId
        this.weight_target = dto.weightTarget
        this.calories_each_day = dto.caloriesEachDay
        this.calories_each_day_target = dto.caloriesEachDayTarget
    }
}
