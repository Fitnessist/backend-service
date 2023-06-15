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

    async findByUserIdAndProgramId (
        userId: string,
        programId?: string
    ): Promise<MyProgram | null> {
        const query: QueryConfig = {
            text: `
                    SELECT 
                        UP.id,
                        UP.user_id,
                        UP.program_id,
                        UP.created_at as user_programs_created_at,
                        UP.updated_at as user_programs_updated_at,
                        UP.total_workouts as total_workouts,
                        UP.total_exercises as total_exercises,
                        UP.exercise_completed_counter as exercise_completed_counter,
                        (
                            SELECT COUNT(*)
                            FROM user_completed_workouts UCW
                            WHERE UCW.user_id = $1 
                            AND UCW.my_program_id = $2
                        ) AS workout_completed_counter,
                        P.id AS program_id,
                        P.title
                    FROM user_programs UP
                    JOIN programs P 
                        ON P.id = UP.program_id
                    WHERE UP.user_id = $1 
                    AND UP.program_id = $2
                `,
            values: [userId, programId]
        }

        const result = await this.pool.query(query)
        if (result.rowCount <= 0) {
            return null
        }

        const data = result.rows[0]
        const myProgram = new MyProgram(
            data.id,
            data.user_id,
            data.program_id,
            data.exercise_completed_counter
        )
        myProgram.totalExercises = data.total_exercises
        myProgram.totalWorkouts = data.total_workouts
        myProgram.workoutCompletedCounter = Number(data.workout_completed_counter)

        const totalWorkoutsQuery: QueryConfig = {
            text: `
                    SELECT COUNT(*) as total_workouts
                    FROM workouts
                    WHERE program_id = $1
                `,
            values: [programId]
        }
        const totalWorkouts = await this.pool.query(totalWorkoutsQuery)
        if (totalWorkouts.rowCount <= 0) {
            return null
        }

        const program = new Program(data.program_id, data.title)
        program.totalWorkouts = totalWorkouts.rows[0].total_workouts
        if (
            myProgram.workoutCompletedCounter !== undefined &&
            program.totalWorkouts !== undefined
        ) {
            myProgram.progressPercent =
                myProgram.workoutCompletedCounter / program.totalWorkouts
        }

        myProgram.program = program
        return myProgram
    }

    async create (userProgram: MyProgram): Promise<MyProgram> {
        try {
            const totalExerciseQ = {
                text: `
                    SELECT COUNT(DISTINCT exercises.id) as total
                    FROM exercises JOIN workouts ON workouts.id = exercises.workout_id 
                    WHERE workouts.program_id = $1
                   `,
                values: [userProgram.programId]
            }

            const totalWorkoutQ = {
                text: `
                    SELECT COUNT(*) as total
                    FROM workouts
                    WHERE workouts.program_id = $1
                   `,
                values: [userProgram.programId]
            }

            const totalWorkoutPromise = this.pool.query(totalWorkoutQ)
            const totalExercisePromise = this.pool.query(totalExerciseQ)
            const [totalWorkout, totalExercise] = await Promise.all([
                totalWorkoutPromise,
                totalExercisePromise
            ])

            const query: QueryConfig = {
                text: `
                INSERT INTO user_programs (id, user_id, program_id, total_exercises, total_workouts)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `,
                values: [
                    this.idGenerator(),
                    userProgram.userId,
                    userProgram.programId,
                    totalExercise.rows[0].total,
                    totalWorkout.rows[0].total
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

    async findByUserId (userId: string): Promise<MyProgram[] | null> {
        const query: QueryConfig = {
            text: `
            SELECT 
                *
            FROM user_programs UP
            WHERE UP.user_id = $1
            `,
            values: [userId]
        }

        const result = await this.pool.query(query)
        if (result.rowCount <= 0) {
            return null
        }

        const userProgramData = result.rows.map((data) => {
            const userProgram = new MyProgram(
                data.id,
                data.user_id,
                data.program_id,
                data.exercise_completed_counter,
                data.workout_completed_counter
            )
            userProgram.exerciseCompletedCounter = data.exercise_completed_counter
            userProgram.workoutCompletedCounter = data.workout_completed_counter
            userProgram.totalExercises = data.total_exercises
            userProgram.totalWorkouts = data.total_workouts
            userProgram.progressPercent = data.progress_percent

            return userProgram
        })

        return userProgramData
    }

    async findByProgramId (programId: string): Promise<MyProgram | null> {
        const query: QueryConfig = {
            text: `
            SELECT 
                UP.id as user_program_id,
                UP.user_id,
                UP.total_workouts,
                UP.total_exercises,
                UP.progress_percent,
                P.id as program_id,
                P.title
            FROM user_programs UP
            JOIN programs P ON UP.program_id = P.id
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
