import type Exercise from "../entity/Exercise"
import ExerciseLevelResponseDTO from "./ExerciseLevelResponseDTO"

class ExerciseResponseDTO {
    public id: string
    public name: string
    public media: string
    public workout_id?: string
    public exercise_levels?: ExerciseLevelResponseDTO[]

    constructor (payload: Exercise) {
        this.id = payload.id
        this.name = payload.name
        this.media = payload.media
        this.workout_id = payload.workoutId
        this.exercise_levels = payload?.exerciseLevels?.map((data) => (new ExerciseLevelResponseDTO(data)))
    }
}

export default ExerciseResponseDTO
