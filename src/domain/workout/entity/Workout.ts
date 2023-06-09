import type Exercise from "./Exercise"

class Workout {
    public id: string
    public programId: string
    public day: number
    public exercises?: Exercise[]
    public totalExercises?: number

    constructor (
        id: string,
        programId: string,
        day: number,
        exercise?: Exercise[]
    ) {
        this.id = id
        this.programId = programId
        this.day = day
        this.exercises = exercise
    }
}

export default Workout
