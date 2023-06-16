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
        return new ExerciseLevel({
            id: row.id,
            exerciseId: row.exercise_id,
            level: row.level,
            repetition: row.reps,
            duration: row.duration,
            sets: row.sets,
            caloriesBurned: row.calories_burned,
            points: row.points
        })
    }
}
