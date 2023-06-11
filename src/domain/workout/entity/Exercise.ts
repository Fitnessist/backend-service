import type ExerciseLevel from "./ExerciseLevel"

class Exercise {
    public id: string
    public name: string
    public media: string
    public workoutId?: string
    public exerciseLevels?: ExerciseLevel[]

    constructor (id: string, name: string, media: string, workoutId?: string, exerciseLevels?: ExerciseLevel[]) {
        this.id = id
        this.name = name
        this.media = media
        this.workoutId = workoutId
        this.exerciseLevels = exerciseLevels
    }
}

export default Exercise
