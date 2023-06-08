import { type User } from "@domain/user/entity/User"
import type Program from "@domain/workout/entity/Program"

export class MyProgram {
    public id: string
    public userId: string
    public programId: string
    public user?: User
    public program?: Program
    public created_at?: Date
    public updated?: Date

    constructor (id: string, userId: string, programId: string) {
        this.id = id
        this.userId = userId
        this.programId = programId
    }
}
