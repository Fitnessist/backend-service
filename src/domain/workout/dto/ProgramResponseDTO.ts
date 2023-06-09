import type UserResponseDTO from "@domain/user/entity/UserResponseDTO"
import type Program from "../entity/Program"
import WorkoutResponseDTO from "./WorkoutResponseDTO"

export default class ProgramResponseDTO {
    public id: string
    public title: string
    public workouts?: WorkoutResponseDTO[]
    public total_workouts?: number
    public user?: UserResponseDTO

    constructor (payload: Program) {
        this.id = payload.id
        this.title = payload.title
        this.workouts = payload.workouts !== undefined ? payload.workouts.map((workout) => (new WorkoutResponseDTO(workout))) : undefined
        this.total_workouts = payload.totalWorkouts
        this.user = payload.user
    }
}
