import { type Food } from "../entity/Food"

export interface FoodRepository {
    findByFoodName: (id: string) => Promise<Food | null>
    addUserFoodHistory: (imageUrl: string, userId: string) => Promise<any>
}
