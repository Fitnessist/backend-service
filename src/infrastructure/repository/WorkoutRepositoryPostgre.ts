import { type Pool, type QueryConfig } from "pg"
import Workout from "@domain/workout/entity/Workout"

export default class WorkoutRepositoryPostgre {
    private readonly pool: Pool
    private readonly idGenerator: any

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    async findById (id: string): Promise<Workout> {
        const workoutQuery: QueryConfig = {
            text: "SELECT * FROM workouts WHERE id=$1 LIMIT 1",
            values: [id]
        }

        const workoutResult = await this.pool.query(workoutQuery)
        return new Workout(workoutResult.rows[0].id, workoutResult.rows[0].program_id, workoutResult.rows[0].day)
    }

    async create (programID: string, workout: Workout): Promise<Workout> {
        const workoutID: string = this.idGenerator()
        const workoutQuery: QueryConfig = {
            text: "INSERT INTO workouts (id, program_id, day) VALUES ($1, $2) RETURNING *",
            values: [workoutID, programID, workout.day]
        }

        const workoutResult = await this.pool.query(workoutQuery)
        return new Workout(workoutResult.rows[0].id, workoutResult.rows[0].program_id, workoutResult.rows[0].day)
    }
}
