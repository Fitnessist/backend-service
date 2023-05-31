import { type Pool, type QueryConfig } from "pg"
import Program from "@domain/workout/entity/Program"
import { type IProgramRepository } from "@domain/workout/repository/IProgramRepository"
import type Workout from "@domain/workout/entity/Workout"

export class ProgramRepositoryPostgre implements IProgramRepository {
    private readonly pool: Pool
    private readonly idGenerator: any

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    async create (program: Program): Promise<Program> {
        const programID = this.idGenerator()
        const programQuery: QueryConfig = {
            text: "INSERT INTO workouts (id, title) VALUES ($1, $2) RETURNING *",
            values: [programID, program.title]
        }

        const result = await this.pool.query(programQuery)
        const insertedProgram: Program = program
        insertedProgram.id = result.rows[0].id

        return insertedProgram
    }

    async findById (id: string): Promise<Program | null> {
        const programQuery: QueryConfig = {
            text: `
            SELECT 
                P.id,
                P.title,
                P.created_at,
                P.updated_at,
                W.id AS workout_id,
                W.program_id,
                W.day
            FROM programs P 
            LEFT JOIN workouts W ON W.program_id = P.id
            WHERE P.id=$1
            `,
            values: [id]
        }

        const programResult = await this.pool.query(programQuery)
        if (programResult.rowCount <= 0) {
            return null
        }

        const workouts: Workout[] = []

        programResult.rows.forEach((row) => {
            if (row.workout_id != null) {
                workouts.push({
                    id: row.workout_id,
                    day: row.day,
                    programId: row.program_id
                })
            }
        })

        const program = new Program(
            programResult.rows[0].id,
            programResult.rows[0].title
        )

        program.workouts = workouts

        return program
    }

    async getAll (limit: number, offset: number): Promise<Program[]> {
        const programQuery: QueryConfig = {
            text: "SELECT * FROM programs LIMIT $1 OFFSET $2",
            values: [limit, offset]
        }

        const programResult = await this.pool.query(programQuery)
        const programs: Program[] = programResult.rows.map(
            (row) => new Program(row.id, row.title)
        )

        return programs
    }

    async countTotalItems (): Promise<number> {
        const totalData = await this.pool.query(
            "SELECT COUNT(id) as total FROM programs"
        )
        return totalData.rows[0].total
    }
}
