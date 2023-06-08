import { type User } from "@domain/user/entity/User"
import type Workout from "./Workout"

export default class Program {
    public id: string
    public title: string
    public workouts?: Workout[]
    public user?: User

    constructor (
        id: string,
        title: string,
        workouts?: Workout[]
    ) {
        this.id = id
        this.title = title
        this.workouts = workouts
    }
}
