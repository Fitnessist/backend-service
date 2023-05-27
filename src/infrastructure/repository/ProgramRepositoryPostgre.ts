import { type Pool, type QueryConfig } from "pg"
import Program from "@domain/workout/entity/Program"

export class ProgramRepositoryPostgre {
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
            text: "SELECT * FROM programs WHERE id=$1 LIMIT 1",
            values: [id]
        }

        const programResult = await this.pool.query(programQuery)
        if (programResult.rowCount <= 0) {
            return null
        }

        return new Program(programResult.rows[0].id, programResult.rows[0].title)
    }
}
