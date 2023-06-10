import { type Food } from "../entity/Food"
import { type UserFoodHistory } from "../entity/UserFoodHistory"

export interface FoodRepository {
    findByFoodName: (id: string) => Promise<Food | null>
    addUserFoodHistory: (payload: UserFoodHistory) => Promise<any>
    getFoodHistoryByUserId: (userId: string, dateString?: string) => Promise<UserFoodHistory[] | null>
}
