import type UserResponseDTO from "@domain/user/entity/UserResponseDTO"
import type Program from "../entity/Program"
import WorkoutResponseDTO from "./WorkoutResponseDTO"

export default class ProgramResponseDTO {
    public id: string
    public title: string
    public workouts?: WorkoutResponseDTO[]
    public user?: UserResponseDTO

    constructor (payload: Program) {
        this.id = payload.id
        this.title = payload.title
        this.workouts = payload.workouts !== undefined ? payload.workouts.map((workout) => (new WorkoutResponseDTO(workout))) : undefined
    }
}
