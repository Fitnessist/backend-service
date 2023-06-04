import { type User } from "@domain/user/entity/User"

export class MyInventory {
    public id: string
    public userId: string
    public totalPoints: number
    public totalCaloriesBurned: number
    public user?: User

    constructor (
        id: string,
        userId: string,
        totalPoints: number,
        totalCaloriesBurned: number
    ) {
        this.id = id
        this.userId = userId
        this.totalPoints = totalPoints
        this.totalCaloriesBurned = totalCaloriesBurned
    }
}
