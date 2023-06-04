import UserResponseDTO from "@domain/user/entity/UserResponseDTO"
import { type MyInventory } from "../entity/MyInventory"

export class MyInventoryResponseDTO {
    public id: string
    public user_id: string
    public total_points: number
    public total_calories_burned: number
    public user?: UserResponseDTO

    constructor (payload: MyInventory) {
        this.id = payload.id
        this.user_id = payload.userId
        this.total_points = payload.totalPoints
        this.total_calories_burned = payload.totalCaloriesBurned
        if (payload.user !== undefined) {
            this.user = new UserResponseDTO(payload.user)
        }
    }
}
