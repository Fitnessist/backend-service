import { type MyProgram } from "../entity/MyProgram"
import UserResponseDTO from "@domain/user/entity/UserResponseDTO"
import ProgramResponseDTO from "@domain/workout/dto/ProgramResponseDTO"

export class MyProgramResponseDTO {
    public id: string
    public user_id: string
    public program_id: string
    public user?: UserResponseDTO
    public program?: ProgramResponseDTO
    public updated?: Date

    constructor (payload: MyProgram) {
        this.id = payload.id
        this.user_id = payload.userId
        this.program_id = payload.programId
        this.program = payload.program !== undefined ? new ProgramResponseDTO(payload.program) : undefined
        this.user = payload.user !== undefined ? new UserResponseDTO(payload.user) : undefined
    }
}
