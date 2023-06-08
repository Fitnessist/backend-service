import type Workout from "../entity/Workout"
import ExerciseResponseDTO from "./ExerciseResponseDTO"

class WorkoutResponseDTO {
    public id: string
    public program_id: string
    public day: number
    public exercises?: ExerciseResponseDTO[]

    constructor (payload: Workout) {
        this.id = payload.id
        this.program_id = payload.programId
        this.day = payload.day
        this.exercises =
            payload.exercises !== undefined
                ? payload.exercises.map((data) => new ExerciseResponseDTO(data))
                : []
    }
}

export default WorkoutResponseDTO
