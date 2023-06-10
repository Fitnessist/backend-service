import { type UserFoodHistory } from "../entity/UserFoodHistory"

export class UserFoodHistoryResponseDTO {
    public id: string
    public food_name?: string
    public user_id: string
    public image_url?: string
    public food_id?: string
    public total_grams?: number
    public calories_per_100gr?: number
    public total_calories?: number

    constructor (payload: UserFoodHistory) {
        this.id = payload.id
        this.user_id = payload.userId
        this.image_url = payload.imageUrl
        this.food_id = payload.foodId
        this.food_name = payload.foodName
        this.total_calories = payload.totalCalories
        this.total_grams = payload.totalGrams
        this.calories_per_100gr = payload.caloriesPer100gr
    }
}
