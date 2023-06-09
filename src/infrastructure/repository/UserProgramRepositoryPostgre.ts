import { DatabaseError, type Pool, type QueryConfig } from "pg"
import { MyProgram } from "@domain/my_progress/entity/MyProgram"
import { type MyProgramRepository } from "@domain/my_progress/repository/MyProgramRepository"
import Program from "@domain/workout/entity/Program"
import { ConflictException } from "@common/exceptions/ConflictException"

export class UserProgramRepositoryPostgre implements MyProgramRepository {
    private readonly pool: Pool
    private readonly idGenerator: any

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    async findByUserIdAndWorkoutId (userId: string, workoutId: string): Promise<MyProgram | null> {
        try {
            const query: QueryConfig = {
                text: `
                    SELECT * 
                    FROM user_programs UP
                    WHERE UP.user_id = $1 
                    AND UP.program_id = $2
                    LIMIT 1
                `,
                values: [userId, workoutId]
            }
            const result = await this.pool.query(query)
            if (result.rowCount <= 0) {
                return null
            }
            const data = result.rows[0]
            const myProgram = new MyProgram(data.id, data.user_id, data.program_id, data.exercise_completed_counter)
            return myProgram
        } catch (error: any) {
            console.log(error)
            throw error
        }
    }

    async create (userProgram: MyProgram): Promise<MyProgram> {
        try {
            const query: QueryConfig = {
                text: `
            INSERT INTO user_programs (id, user_id, program_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `,
                values: [
                    this.idGenerator(),
                    userProgram.userId,
                    userProgram.programId
                ]
            }

            const result = await this.pool.query(query)
            const insertedUserProgram: MyProgram = userProgram
            insertedUserProgram.id = result.rows[0].id

            return insertedUserProgram
        } catch (error: any) {
            if (error instanceof DatabaseError && error.constraint != null) {
                throw new ConflictException("Data has already exist.")
            }
            throw error
        }
    }

    async findByProgramId (programId: string): Promise<MyProgram | null> {
        const query: QueryConfig = {
            text: `
            SELECT 
                UP.id as user_program_id
                UP.user_id,
                P.id as program_id,
                P.title
            FROM user_programs UP
            JOIN programs P ON UP.program_id = P.program_id
            WHERE UP.program_id = $1
            `,
            values: [programId]
        }

        const result = await this.pool.query(query)
        if (result.rowCount <= 0) {
            return null
        }

        const userProgramData = result.rows[0]
        const userProgram = new MyProgram(
            userProgramData.id,
            userProgramData.user_id,
            userProgramData.program_id
        )
        const program = new Program(
            userProgramData.program_id,
            userProgramData.title
        )
        userProgram.program = program

        return userProgram
    }

    async countTotalItems (): Promise<number> {
        const totalData = await this.pool.query(
            "SELECT COUNT(id) as total FROM user_programs"
        )
        return totalData.rows[0].total
    }
}
