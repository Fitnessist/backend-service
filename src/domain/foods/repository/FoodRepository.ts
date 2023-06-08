import { type Food } from "../entity/Food"

export interface FoodRepository {
    findByFoodName: (id: string) => Promise<Food | null>
    addUserFoodHistory: (payload: {
        userId: string
        imageUrl?: string
        foodId?: string
    }) => Promise<any>
}
