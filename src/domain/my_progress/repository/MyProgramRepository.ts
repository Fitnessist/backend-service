import { type MyProgram } from "../entity/MyProgram"

export interface MyProgramRepository {
    create: (userProgram: MyProgram) => Promise<MyProgram>
    findByUserIdAndWorkoutId: (userId: string, workoutId: string) => Promise<MyProgram | null>
    findByProgramId: (programId: string) => Promise<MyProgram | null>
}
