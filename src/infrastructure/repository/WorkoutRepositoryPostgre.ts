import { type Pool, type QueryConfig } from "pg"
import Workout from "@domain/workout/entity/Workout"
import { type IWorkoutRepository } from "@domain/workout/repository/IWorkoutRepository"
import type Exercise from "@domain/workout/entity/Exercise"

export default class WorkoutRepositoryPostgre implements IWorkoutRepository {
    private readonly pool: Pool
    private readonly idGenerator: any

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    async getAll (
        programId: string = "",
        limit: number,
        offset: number
    ): Promise<Workout[]> {
        let query: QueryConfig = {
            text: ""
        }

        if (programId !== "") {
            console.log("programId", programId)
            query = {
                text: "SELECT * FROM workouts WHERE program_id = $1 LIMIT $2 OFFSET $3",
                values: [programId, limit, offset]
            }
        } else {
            query = {
                text: "SELECT * FROM workouts LIMIT $1 OFFSET $2",
                values: [limit, offset]
            }
        }

        const result = await this.pool.query(query)
        const workouts: Workout[] = result.rows.map((row) => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, program_id, day } = row
            return new Workout(id, program_id, day)
        })

        return workouts
    }

    async countTotalItems (): Promise<number> {
        const query: QueryConfig = {
            text: "SELECT COUNT(*) AS total FROM workouts"
        }
        const result = await this.pool.query(query)
        return result.rows[0].total
    }

    async findById (id: string): Promise<Workout | null> {
        const workoutQuery: QueryConfig = {
            text: `
            SELECT 
                W.id,
                W.program_id,
                W.day,
                E.id AS exercise_id,
                E.name AS exercise_name,
                E.media AS exercise_media,
                E.workout_id
            FROM workouts W 
            LEFT JOIN exercises E ON E.workout_id = W.id
            WHERE W.id=$1
            `,
            values: [id]
        }

        const workoutResult = await this.pool.query(workoutQuery)
        if (workoutResult.rowCount <= 0) {
            return null
        }

        const exercises: Exercise[] = []

        workoutResult.rows.forEach((rowData) => {
            if (rowData.exercise_id != null) {
                exercises.push({
                    id: rowData.exercise_id,
                    name: rowData.exercise_name,
                    workoutId: rowData.workout_id,
                    media: rowData.exercise_media,
                    exerciseLevels: []
                })
            }
        })

        const workout: Workout = {
            id: workoutResult.rows[0].id,
            programId: workoutResult.rows[0].program_id,
            day: workoutResult.rows[0].day,
            exercises
        }

        return workout
    }

    async create (programID: string, workout: Workout): Promise<Workout> {
        const workoutID: string = this.idGenerator()
        const workoutQuery: QueryConfig = {
            text: "INSERT INTO workouts (id, program_id, day) VALUES ($1, $2) RETURNING *",
            values: [workoutID, programID, workout.day]
        }

        const workoutResult = await this.pool.query(workoutQuery)
        return new Workout(
            workoutResult.rows[0].id,
            workoutResult.rows[0].program_id,
            workoutResult.rows[0].day
        )
    }
}
