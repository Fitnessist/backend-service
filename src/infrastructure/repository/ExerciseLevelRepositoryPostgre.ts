/* eslint-disable @typescript-eslint/naming-convention */
import { type Pool, type QueryConfig } from "pg"
import ExerciseLevel from "@domain/workout/entity/ExerciseLevel"
import { type IExerciseLevelRepository } from "@domain/workout/repository/ExerciseLevelRepository"

export class ExerciseLevelRepositoryPostgre implements IExerciseLevelRepository {
    private readonly pool: Pool
    private readonly idGenerator: any

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    async findById (id: string): Promise<ExerciseLevel | null> {
        const exerQuery: QueryConfig = {
            text: `
            SELECT
              *
            FROM exercise_levels exerciseLevels
            WHERE exerciseLevels.id = $1
          `,
            values: [id]
        }

        const exerciseResult = await this.pool.query(exerQuery)
        if (exerciseResult.rowCount <= 0) {
            return null
        }
        const row = exerciseResult.rows[0]
        return new ExerciseLevel(row.id, row.exercise_id, row.level, row.reps, row.duration, row.sets, row.calories_burned, row.points)
    }
}
