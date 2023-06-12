import type Workout from "../entity/Workout"
import ExerciseResponseDTO from "./ExerciseResponseDTO"

class WorkoutResponseDTO {
    public id: string
    public program_id: string
    public day: number
    public exercises?: ExerciseResponseDTO[]
    public total_exercises?: number

    constructor (payload: Workout) {
        this.id = payload.id
        this.program_id = payload.programId
        this.day = payload.day
        this.exercises = []
        if (payload.exercises !== undefined && payload.exercises !== null && payload.exercises.length > 0) {
            this.exercises = payload.exercises.map((data) => new ExerciseResponseDTO(data))
        }
        this.total_exercises = payload.totalExercises
    }
}

export default WorkoutResponseDTO
