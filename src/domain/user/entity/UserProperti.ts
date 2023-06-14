import { type User } from "./User"

export default class UserProperti {
    public id: string
    public gender: string
    public age: number
    public weight: number
    public height: number
    public activity?: string
    public fat?: number
    public userId: string
    public caloriesEachDay: number
    public weightTarget: number
    public caloriesEachDayTarget?: number
    public user?: User

    constructor (payload: {
        id: string
        gender: string
        age: number
        weight: number
        height: number
        userId: string
        caloriesEachDay: number
        weightTarget: number
        caloriesEachDayTarget?: number
        activity?: string
        fat?: number
        user?: User
    }
    ) {
        this.id = payload.id
        this.gender = payload.gender
        this.age = payload.age
        this.weight = payload.weight
        this.height = payload.height
        this.activity = payload.activity
        this.fat = payload.fat
        this.userId = payload.userId
        this.caloriesEachDay = payload.caloriesEachDay
        this.weight = payload.weight
        this.weightTarget = payload.weightTarget
        this.caloriesEachDayTarget = payload.caloriesEachDayTarget
        this.user = payload.user
    }
}
