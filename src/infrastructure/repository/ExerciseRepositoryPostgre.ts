import { type Pool, type QueryConfig } from "pg"
import type Exercise from "@domain/workout/entity/Exercise"
import { type IExerciseRepository } from "@domain/workout/repository/IExerciseRepository"

class ExerciseRepositoryPostgre implements IExerciseRepository {
    private readonly pool: Pool
    private readonly idGenerator: any

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    async findById (id: string): Promise<Exercise | null> {
        const exerQuery: QueryConfig = {
            text: "SELECT * FROM exercises AS E LEFT JOIN exercise_levels AS EL ON E.id = EL.exercise_id WHERE E.id = $1",
            values: [id]
        }

        const exerciseResult = await this.pool.query(exerQuery)
        if (exerciseResult.rowCount <= 0) {
            return null
        }
        const exercise: Exercise = {
            id: exerciseResult.rows[0].id,
            name: exerciseResult.rows[0].name,
            media: exerciseResult.rows[0].media,
            exerciseLevels: exerciseResult.rows.map((row) => ({
                id: row.exercise_level_id,
                exerciseId: row.exercise_id,
                level: row.level,
                repetition: row.reps,
                duration: row.duration,
                caloriesBurned: row.calories_burned,
                points: row.points
            }))
        }

        return exercise
    }

    async create (exercise: Exercise): Promise<Exercise> {
        const { name, media } = exercise

        const exerciseID: string = this.idGenerator()
        const exerciseQuery: QueryConfig = {
            text: "INSERT INTO workouts (id, name, media) VALUES ($1, $2, $3) RETURNING *",
            values: [exerciseID, name, media]
        }

        const result = await this.pool.query(exerciseQuery)
        const inserted = exercise
        inserted.id = result.rows[0].id
        return inserted
    }
}

export default ExerciseRepositoryPostgre
