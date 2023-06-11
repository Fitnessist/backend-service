import { type User } from "@domain/user/entity/User"

export class MyInventory {
    public id: string
    public userId: string
    public totalPoints: number
    public totalCaloriesBurned: number
    public user?: User
    public createdAt?: Date
    public updatedAt?: Date

    constructor (payload: {
        id: string
        userId: string
        totalPoints: number
        totalCaloriesBurned: number
        user?: User
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.id = payload.id
        this.userId = payload.userId
        this.totalPoints = payload.totalPoints
        this.totalCaloriesBurned = payload.totalCaloriesBurned
        this.createdAt = payload.createdAt
        this.updatedAt = payload.updatedAt
    }
}
