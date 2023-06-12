import { ConflictException } from "@common/exceptions/ConflictException"
import { MyExerciseProgress } from "@domain/my_progress/entity/MyExerciseProgress"
import { MyInventory } from "@domain/my_progress/entity/MyInventory"
import { type MyProgressRepository } from "@domain/my_progress/repository/MyProgressRepository"
import { User } from "@domain/user/entity/User"
import Exercise from "@domain/workout/entity/Exercise"
import ExerciseLevel from "@domain/workout/entity/ExerciseLevel"
import Workout from "@domain/workout/entity/Workout"
import { type QueryConfig, type Pool, DatabaseError } from "pg"

export class UserExerciseProgressRepositoryImpl implements MyProgressRepository {
    private readonly idGenerator: any
    private readonly pool: Pool

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    public async findByUserId (
        userId: string
    ): Promise<MyExerciseProgress[] | null> {
        const q: QueryConfig = {
            text: `
            SELECT 
              P.id AS progress_id,
              P.user_id,
              P.program_id,
              P.workout_id,
              P.exercise_id,
              P.exercise_level_id,
              U.id AS user_id,
              U.name AS user_name,
              W.id AS workout_id,
              W.day,
              E.id AS exercise_id,
              E.name AS exercise_name,
              EL.id AS exercise_level_id,
              EL.level,
              EL.reps,
              EL.duration,
              EL.sets,
              EL.calories_burned,
              EL.points
            FROM my_exercise_progress P
            JOIN users U ON U.id = P.user_id
            JOIN workouts W ON W.id = P.workout_id
            JOIN exercises E ON E.id = P.exercise_id
            JOIN exercise_levels EL ON EL.id = P.exercise_level_id
            WHERE P.user_id = $1
          `,
            values: [userId]
        }

        try {
            const queryResult = await this.pool.query(q)
            const rows = queryResult.rows

            // Mapping hasil query ke objek MyExerciseProgress
            const myProgressListMap = new Map<string, MyExerciseProgress>()

            rows.forEach((row) => {
                let myProgress = myProgressListMap.get(row.progress_id)

                if (myProgress == null || myProgress === undefined) {
                    myProgress = new MyExerciseProgress({
                        id: row.id,
                        programId: row.program_id,
                        workoutId: row.workout_id,
                        exerciseId: row.exercise_id,
                        exerciseLevelId: row.exercise_level_id,
                        userId: row.user_id
                    })
                    myProgressListMap.set(row.id, myProgress)
                }

                // Mapping data terkait dari tabel-tabel lain
                const user = new User(
                    row.user_id,
                    row.username,
                    row.password,
                    row.email,
                    row.user_name
                )
                const workout = new Workout(
                    row.workout_id,
                    row.program_id,
                    row.day
                )
                const exercise = new Exercise(
                    row.exercise_id,
                    row.exercise_name,
                    row.media
                )

                const exerciseLevel = new ExerciseLevel(
                    row.exercise_level_id,
                    row.exercise_id,
                    row.level,
                    row.reps,
                    row.duration,
                    row.sets,
                    row.calories_burned
                )

                // Set data terkait pada MyExerciseProgress
                myProgress.user = user
                myProgress.workout = workout
                myProgress.exercise = exercise
                myProgress.exerciseLevel = exerciseLevel
            })
            const data: MyExerciseProgress[] = Array.from(
                myProgressListMap.values()
            )
            return data
        } catch (error) {
            console.error("Error executing query:", error)
            throw error
        }
    }

    public async findWithCondition (payload: {
        programId?: string
        workoutId?: string
        exerciseId?: string
        exerciseLevelId?: string
    }): Promise<MyExerciseProgress | null> {
        throw new Error("NOT IMPLEMETEND FUNCTION" + __filename)
    }

    public async create (
        myProgress: MyExerciseProgress
    ): Promise<MyExerciseProgress> {
        const client = await this.pool.connect()
        try {
            const query1: QueryConfig = {
                text: `
                INSERT INTO my_exercise_progress (
                    id, 
                    user_id, 
                    program_id, 
                    workout_id, 
                    exercise_id, 
                    exercise_level_id
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `,
                values: [
                    this.idGenerator(),
                    myProgress.userId,
                    myProgress.programId,
                    myProgress.workoutId,
                    myProgress.exerciseId,
                    myProgress.exerciseLevelId
                ]
            }
            await client.query("BEGIN")
            const queryResult = await client.query(query1)

            const queryInsertInventory: QueryConfig = {
                text: `
                    INSERT INTO user_inventories
                        (id, user_id, total_points, total_calories_burned)
                    VALUES (
                        $1, $2, 
                        (
                            SELECT points
                            FROM exercise_levels
                            WHERE id = $3
                        ),
                        (
                            SELECT calories_burned
                            FROM exercise_levels
                            WHERE id = $4
                        )
                    )
                `,
                values: [
                    this.idGenerator(),
                    myProgress.userId,
                    myProgress.exerciseLevelId,
                    myProgress.exerciseLevelId
                ]
            }
            await client.query(queryInsertInventory)
            await client.query("COMMIT")
            const createdProgress = queryResult.rows[0]

            const myExerciseProgres = new MyExerciseProgress({
                id: createdProgress.id,
                programId: createdProgress.program_id,
                workoutId: createdProgress.workout_id,
                exerciseId: createdProgress.exercise_id,
                exerciseLevelId: createdProgress.exercise_level_id,
                userId: createdProgress.user_id
            })

            return myExerciseProgres
        } catch (error: any) {
            await client.query("ROLLBACK")
            if (error instanceof DatabaseError && error.constraint != null) {
                throw new ConflictException("Data has already exist.")
            }
            throw error
        } finally {
            client.release()
        }
    }

    public async update (
        myProgress: MyExerciseProgress
    ): Promise<MyExerciseProgress> {
        const q: QueryConfig = {
            text: `
            UPDATE my_exercise_progress
            SET user_id = $2, program_id = $3, workout_id = $4, exercise_id = $5, exercise_level_id = $6
            WHERE id = $1
            RETURNING *
          `,
            values: [
                myProgress.id,
                myProgress.userId,
                myProgress.programId,
                myProgress.workoutId,
                myProgress.exerciseId,
                myProgress.exerciseLevelId
            ]
        }

        const queryResult = await this.pool.query(q)
        const updatedProgress = queryResult.rows[0]

        const myExerciseProgres = new MyExerciseProgress({
            id: updatedProgress.id,
            programId: updatedProgress.program_id,
            workoutId: updatedProgress.workout_id,
            exerciseId: updatedProgress.exercise_id,
            exerciseLevelId: updatedProgress.exercise_level_id,
            userId: updatedProgress.user_id
        })

        return myExerciseProgres
    }

    public async GetUserInventory (userId: string): Promise<MyInventory | null> {
        const q: QueryConfig = {
            text: `
                    SELECT 
                        U.id AS user_id, 
                        U.username, 
                        U.name, 
                        U.email, 
                        U.password,
                        I.id as inventory_id,
                        I.total_points,
                        I.total_calories_burned
                    FROM user_inventories I
                    JOIN users U ON I.user_id = U.id
                    WHERE U.id = $1 LIMIT 1
                `,
            values: [userId]
        }
        const result = await this.pool.query(q)

        if (result.rowCount <= 0) {
            return null
        }

        const row = result.rows[0]

        const user = new User(
            row.user_id,
            row.username,
            row.password,
            row.email,
            row.name
        )
        const myInventory = new MyInventory({
            id: row.inventory_id,
            userId: row.user_id,
            totalPoints: row.total_points,
            totalCaloriesBurned: row.total_calories_burned
        })
        myInventory.user = user

        return myInventory
    }
}
