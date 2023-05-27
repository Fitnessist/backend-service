import {
    type Pool,
    type QueryConfig,
    type QueryResult
} from "pg"
import ExerciseRepositoryPostgre from "../ExerciseRepositoryPostgre"
import type Exercise from "@domain/workout/entity/Exercise"

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
            expect(exercise?.exerciseLevels[0]).toEqual({
                id: "level-1",
                exerciseId,
                level: "Beginner",
                repetition: 10,
                duration: 60,
                caloriesBurned: 100,
                points: 50
            })

            // Verify that the pool.query method was called with the correct query and values
            const expectedQuery: QueryConfig = {
                text: "SELECT * FROM exercises AS E LEFT JOIN exercise_levels AS EL ON E.id = EL.exercise_id WHERE E.id = $1",
                values: [exerciseId]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
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

            // Verify that the pool.query method was called with the correct query and values
            const expectedQuery: QueryConfig = {
                text: "SELECT * FROM exercises AS E LEFT JOIN exercise_levels AS EL ON E.id = EL.exercise_id WHERE E.id = $1",
                values: [exerciseId]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
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

            // Verify that the pool.query method was called with the correct query and values
            const expectedQuery: QueryConfig = {
                text: "INSERT INTO workouts (id, name, media) VALUES ($1, $2, $3) RETURNING *",
                values: [exerciseId, newExercise.name, newExercise.media]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })
    })
})
