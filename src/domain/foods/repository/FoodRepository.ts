import { type Food } from "../entity/Food"

export interface FoodRepository {
    findByFoodName: (id: string) => Promise<Food | null>
    addUserFoodHistory: (userId: string, imageUrl?: string) => Promise<any>
}
