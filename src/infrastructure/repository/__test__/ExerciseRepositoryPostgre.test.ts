import { type Pool, type QueryResult } from "pg"
import ExerciseRepositoryPostgre from "../ExerciseRepositoryPostgre"
import Exercise from "@domain/workout/entity/Exercise"
import ExerciseLevel from "@domain/workout/entity/ExerciseLevel"

describe("ExerciseRepositoryPostgre", () => {
    let exerciseRepository: ExerciseRepositoryPostgre
    let mockPool: Partial<Pool>
    const ID = {
        idGenerator: jest.fn()
    }

    beforeEach(() => {
        mockPool = {
            query: jest.fn(),
            connect: jest.fn()
        }

        exerciseRepository = new ExerciseRepositoryPostgre(
            mockPool as Pool,
            ID.idGenerator as any
        )
    })

    describe("findById", () => {
        it("should return the exercise when found", async () => {
            // Mock the query result
            const exerciseId = "exercise-123"
            const exerciseName = "Push Up"
            const exerciseMedia = "push-up.jpg"
            const mockQueryResult: QueryResult = {
                rows: [
                    {
                        id: exerciseId,
                        name: exerciseName,
                        media: exerciseMedia,
                        exercise_level_id: "level-1",
                        exercise_id: exerciseId,
                        level: "Beginner",
                        reps: 10,
                        duration: 60,
                        calories_burned: 100,
                        points: 50
                    }
                ],
                command: "",
                rowCount: 1,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            // Invoke the method being tested
            const exercise = await exerciseRepository.findById(exerciseId)

            // Assert the result
            expect(exercise).toBeDefined()
            expect(exercise?.id).toBe(exerciseId)
            expect(exercise?.name).toBe(exerciseName)
            expect(exercise?.media).toBe(exerciseMedia)
            expect(exercise?.exerciseLevels).toHaveLength(1)
            expect(exercise?.exerciseLevels?.at(0)).toEqual({
                id: "level-1",
                exerciseId,
                level: "Beginner",
                repetition: 10,
                duration: 60,
                caloriesBurned: 100,
                points: 50
            })
        })

        it("should return null when exercise not found", async () => {
            // Mock the query result
            const exerciseId = "unknown-exercise"
            const mockQueryResult: QueryResult = {
                rows: [],
                command: "",
                rowCount: 0,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            // Invoke the method being tested
            const exercise = await exerciseRepository.findById(exerciseId)

            // Assert the result
            expect(exercise).toBeNull()
        })
    })

    describe("findByWorkoutId", () => {
        it("should return exercises with exercise levels", async () => {
            // Arrange
            const workoutId = "workout-123"

            // Mock this.pool.query untuk mengembalikan hasil yang diharapkan
            mockPool.query = jest.fn().mockResolvedValue({
                rowCount: 3,
                rows: [
                    {
                        id: "exercise-1",
                        name: "Exercise 1",
                        media: "media-1",
                        workout_id: workoutId,
                        exercise_level_id: "level-1",
                        level: "Level 1",
                        sets: 3,
                        reps: 10,
                        duration: 60,
                        calories_burned: 100,
                        points: 50
                    },
                    {
                        id: "exercise-1",
                        name: "Exercise 1",
                        media: "media-1",
                        workout_id: workoutId,
                        exercise_level_id: "level-2",
                        level: "Level 2",
                        sets: 4,
                        reps: 12,
                        duration: 45,
                        calories_burned: 120,
                        points: 60
                    },
                    {
                        id: "exercise-2",
                        name: "Exercise 2",
                        media: "media-2",
                        workout_id: workoutId,
                        exercise_level_id: "level-3",
                        level: "Level 3",
                        sets: 5,
                        reps: 15,
                        duration: 30,
                        calories_burned: 150,
                        points: 70
                    }
                ]
            })

            // Expected result
            const expectedExercises: Exercise[] = [
                new Exercise("exercise-1", "Exercise 1", "media-1", workoutId, [
                    new ExerciseLevel({
                        id: "level-1",
                        exerciseId: "exercise-1",
                        level: "Level 1",
                        sets: 3,
                        repetition: 10,
                        duration: 60,
                        caloriesBurned: 100,
                        points: 50
                    }),
                    new ExerciseLevel({
                        id: "level-2",
                        exerciseId: "exercise-1",
                        level: "Level 2",
                        sets: 4,
                        repetition: 12,
                        duration: 45,
                        caloriesBurned: 120,
                        points: 60
                    })
                ]),
                new Exercise("exercise-2", "Exercise 2", "media-2", workoutId, [
                    new ExerciseLevel({
                        id: "level-3",
                        exerciseId: "exercise-2",
                        level: "Level 3",
                        sets: 5,
                        repetition: 15,
                        duration: 30,
                        caloriesBurned: 150,
                        points: 70
                    })
                ])
            ]

            // Act
            const result = await exerciseRepository.findByWorkoutId(workoutId)

            // Assert
            expect(result).toEqual(expectedExercises)
        })

        it("should return null if no exercises found", async () => {
            // Arrange
            const workoutId = "workout-123"

            // Mock this.pool.query untuk mengembalikan hasil kosong
            mockPool.query = jest.fn().mockResolvedValue({
                rowCount: 0,
                rows: []
            })

            // Act
            const result = await exerciseRepository.findByWorkoutId(workoutId)

            // Assert
            expect(result).toBeNull()
        })
    })
    describe("create", () => {
        it("should create an exercise", async () => {
            // Mock the query result
            const exerciseId = "exercise-123"
            const exerciseName = "Sit Up"
            const exerciseMedia = "sit-up.jpg"
            // ID.idGenerator.mockResolvedValue(exerciseId)
            jest.spyOn(ID, "idGenerator").mockReturnValueOnce(exerciseId)

            const mockQueryResult = {
                rows: [
                    {
                        id: exerciseId,
                        name: exerciseName,
                        media: exerciseMedia
                    }
                ],
                command: "",
                rowCount: 1,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            // Create a new exercise
            const newExercise: Exercise = {
                id: "",
                name: "Sit Up",
                media: "sit-up.jpg",
                exerciseLevels: []
            }

            // Invoke the method being tested
            const createdExercise = await exerciseRepository.create(
                newExercise
            )

            // Assert the result
            expect(createdExercise).toBeDefined()
            expect(createdExercise.id).toBe(exerciseId)
            expect(createdExercise.name).toBe(exerciseName)
            expect(createdExercise.media).toBe(exerciseMedia)
        })
    })
})
