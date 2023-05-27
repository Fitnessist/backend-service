import type ExerciseLevel from "./ExerciseLevel"

class Exercise {
    public id: string
    public name: string
    public media: string
    public exerciseLevels: ExerciseLevel[]

    constructor (id: string, name: string, media: string, exerciseLevels: ExerciseLevel[]) {
        this.id = id
        this.name = name
        this.media = media
        this.exerciseLevels = exerciseLevels
    }
}

export default Exercise
