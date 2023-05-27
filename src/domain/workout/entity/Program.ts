import type Workout from "./Workout"

export default class Program {
    public id: string
    public title: string
    public workouts?: Workout[]

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
