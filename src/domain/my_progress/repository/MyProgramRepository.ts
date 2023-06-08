import { type MyProgram } from "../entity/MyProgram"

export interface MyProgramRepository {
    create: (userProgram: MyProgram) => Promise<MyProgram>
    findById: (id: string) => Promise<MyProgram | null>
    findByProgramId: (programId: string) => Promise<MyProgram | null>
}
