import { MyExerciseProgress } from "@domain/my_progress/entity/MyExerciseProgress"
import { type MyProgressRepository } from "@domain/my_progress/repository/MyProgressRepository"
import { User } from "@domain/user/entity/User"
import Exercise from "@domain/workout/entity/Exercise"
import ExerciseLevel from "@domain/workout/entity/ExerciseLevel"
import Workout from "@domain/workout/entity/Workout"
import { type QueryConfig, type Pool } from "pg"

export class MyProgressRepositoryImpl implements MyProgressRepository {
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
                    myProgress = MyExerciseProgress.builder()
                        .setId(row.prograss_id)
                        .setExerciseId(row.exercise_id)
                        .setExerciseLevelId(row.exercise_level_id)
                        .setProgramId(row.program_id)
                        .setWorkoutId(row.workout_id)
                        .build()
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
        throw new Error()
    }

    public async create (
        myProgress: MyExerciseProgress
    ): Promise<MyExerciseProgress> {
        const q: QueryConfig = {
            text: `
            INSERT INTO my_exercise_progress (id, user_id, program_id, workout_id, exercise_id, exercise_level_id)
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

        try {
            const queryResult = await this.pool.query(q)
            const createdProgress = queryResult.rows[0]

            return MyExerciseProgress.builder()
                .setId(createdProgress.id)
                .setUserId(createdProgress.user_id)
                .setProgramId(createdProgress.program_id)
                .setWorkoutId(createdProgress.workout_id)
                .setExerciseId(createdProgress.exercise_id)
                .setExerciseLevelId(createdProgress.exercise_level_id)
                .build()
        } catch (error) {
            console.error("Error executing query:", error)
            throw error
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

        try {
            const queryResult = await this.pool.query(q)
            const updatedProgress = queryResult.rows[0]

            return MyExerciseProgress.builder()
                .setId(updatedProgress.id)
                .setUserId(updatedProgress.user_id)
                .setProgramId(updatedProgress.program_id)
                .setWorkoutId(updatedProgress.workout_id)
                .setExerciseId(updatedProgress.exercise_id)
                .setExerciseLevelId(updatedProgress.exercise_level_id)
                .build()
        } catch (error) {
            console.error("Error executing query:", error)
            throw error
        }
    }
}
