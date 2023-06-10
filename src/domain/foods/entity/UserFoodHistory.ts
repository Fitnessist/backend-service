export class UserFoodHistory {
    public id: string
    public foodName?: string
    public userId: string
    public imageUrl?: string
    public foodId?: string
    public totalGrams?: number
    public caloriesPer100gr?: number
    public totalCalories?: number
    public createdAt?: Date
    public updatedAt?: Date

    constructor (payload: {
        id: string
        userId: string
        imageUrl?: string
        foodId?: string
        foodName?: string
        totalGrams?: number
        caloriesPer100gr?: number
        totalCalories?: number
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.id = payload.id
        this.userId = payload.userId
        this.imageUrl = payload.imageUrl
        this.foodId = payload.foodId
        this.foodName = payload.foodName
        this.totalCalories = payload.totalCalories
        this.totalGrams = payload.totalGrams
        this.caloriesPer100gr = payload.caloriesPer100gr
        this.createdAt = payload.createdAt
        this.updatedAt = payload.updatedAt
    }
}
