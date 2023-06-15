import { type MyProgram } from "../entity/MyProgram"

export interface MyProgramRepository {
    create: (userProgram: MyProgram) => Promise<MyProgram>
    findByUserIdAndProgramId: (userId: string, programId?: string) => Promise<MyProgram | null>
    findByProgramId: (programId: string) => Promise<MyProgram | null>
    findByUserId: (userId: string) => Promise<MyProgram[] | null>
}
