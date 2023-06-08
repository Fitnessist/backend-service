import type ExerciseLevel from "../entity/ExerciseLevel"

class ExerciseLevelResponseDTO {
    public id: string
    public exercise_id: string
    public level: string
    public repetition: number
    public duration: number
    public sets?: number
    public calories_burned?: number
    public points?: number

    constructor (payload: ExerciseLevel) {
        this.id = payload.id
        this.exercise_id = payload.exerciseId
        this.level = payload.level
        this.repetition = payload.repetition
        this.duration = payload.duration
        this.sets = payload.sets
        this.calories_burned = payload.caloriesBurned
        this.points = payload.points
    }
}

export default ExerciseLevelResponseDTO
