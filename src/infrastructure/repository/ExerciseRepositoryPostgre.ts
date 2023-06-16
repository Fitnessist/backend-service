/* eslint-disable @typescript-eslint/naming-convention */
import { type Pool, type QueryConfig } from "pg"
import Exercise from "@domain/workout/entity/Exercise"
import { type IExerciseRepository } from "@domain/workout/repository/IExerciseRepository"
import ExerciseLevel from "@domain/workout/entity/ExerciseLevel"

class ExerciseRepositoryPostgre implements IExerciseRepository {
    private readonly pool: Pool
    private readonly idGenerator: any

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    async findByWorkoutId (workoutId: string): Promise<Exercise[] | null> {
        const exerQuery: QueryConfig = {
            text: `
            SELECT
              exercise.id,
              exercise.name,
              exercise.media,
              exercise.workout_id,
              exerciseLevel.id AS exercise_level_id,
              exerciseLevel.level,
              exerciseLevel.sets,
              exerciseLevel.reps,
              exerciseLevel.duration,
              exerciseLevel.calories_burned,
              exerciseLevel.points
            FROM exercises exercise
            LEFT JOIN exercise_levels exerciseLevel ON exercise.id = exerciseLevel.exercise_id
            WHERE exercise.workout_id = $1
          `,
            values: [workoutId]
        }

        const exerciseResult = await this.pool.query(exerQuery)
        if (exerciseResult.rowCount <= 0) {
            return null
        }

        const exerciseMap = new Map<string, Exercise>()

        exerciseResult.rows.forEach((row) => {
            let exercise = exerciseMap.get(row.id)
            if (exercise == null || exercise === undefined) {
                exercise = new Exercise(row.id, row.name, row.media, row.workout_id)
                exerciseMap.set(row.id, exercise)
            }

            const exerciseLevel = new ExerciseLevel({
                id: row.exercise_level_id,
                exerciseId: row.id,
                level: row.level,
                sets: row.sets,
                repetition: row.reps,
                duration: row.duration,
                caloriesBurned: row.calories_burned,
                points: row.points
            })

            exercise.exerciseLevels?.push(exerciseLevel)
        })

        const dataS: Exercise[] = Array.from(exerciseMap.values())

        return dataS
    }

    async findById (id: string): Promise<Exercise | null> {
        const exerQuery: QueryConfig = {
            text: ` 
            SELECT
              e.id AS id,
              e.name AS exercise_name,
              el.id AS exercise_level_id,
              el.level AS exercise_level,
              el.sets,
              el.reps,
              el.duration,
              el.calories_burned,
              el.points
            FROM exercises e 
            LEFT JOIN exercise_levels el ON e.id = el.exercise_id
            WHERE e.id = $1
          `,
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
                exerciseId: row.id,
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
