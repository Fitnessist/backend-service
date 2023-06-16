import { type Pool, type QueryConfig, type QueryResult } from "pg"
import WorkoutRepositoryPostgre from "../WorkoutRepositoryPostgre"
import Workout from "@domain/workout/entity/Workout"

describe("WorkoutRepositoryPostgre", () => {
    let workoutRepository: WorkoutRepositoryPostgre
    let mockPool: Partial<Pool>
    const ID = {
        idGenerator: jest.fn()
    }

    beforeEach(() => {
        mockPool = {
            query: jest.fn(),
            connect: jest.fn()
        }

        workoutRepository = new WorkoutRepositoryPostgre(
            mockPool as Pool,
            ID.idGenerator as any
        )
    })
    describe("countTotalItems", () => {
        it("should return the total number of workouts", async () => {
            // Mock the query result
            const total = 10
            const mockQueryResult: QueryResult = {
                rows: [{ total }],
                command: "",
                rowCount: 1,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            // Invoke the method being tested
            const result = await workoutRepository.countTotalItems()

            // Assert the result
            expect(result).toBe(total)

            // Verify that the pool.query method was called with the correct query
            const expectedQuery: QueryConfig = {
                text: "SELECT COUNT(*) AS total FROM workouts"
            }

            expect(mockPool.query).toHaveBeenCalledTimes(1)
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })
    })

    describe("getAll", () => {
        it("should return all workouts", async () => {
            // Mock the query result
            const limit = 10
            const offset = 0
            const programId = "program-123"
            const mockQueryResult: QueryResult = {
                rows: [
                    {
                        id: "workout-1",
                        program_id: programId,
                        day: 1
                    },
                    {
                        id: "workout-2",
                        program_id: programId,
                        day: 2
                    }
                ],
                command: "",
                rowCount: 2,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            // Invoke the method being tested
            const result = await workoutRepository.getAll(programId, limit, offset)

            // Assert the result
            expect(result).toHaveLength(mockQueryResult.rowCount)
            expect(result[0].id).toBe(mockQueryResult.rows[0].id)
            expect(result[0].programId).toBe(
                mockQueryResult.rows[0].program_id
            )
            expect(result[0].day).toBe(mockQueryResult.rows[0].day)
            expect(result[1].id).toBe(mockQueryResult.rows[1].id)
            expect(result[1].programId).toBe(
                mockQueryResult.rows[1].program_id
            )
            expect(result[1].day).toBe(mockQueryResult.rows[1].day)
        })
    })

    describe("findById", () => {
        it("should find a workout by id", async () => {
            // Mock the query result
            const workoutId = "workout-123"
            const programId = "program-123"
            const workoutDay = 1

            const mockQueryResult: QueryResult = {
                rows: [
                    {
                        id: workoutId,
                        program_id: programId,
                        day: workoutDay,
                        exercise_id: "exer-1",
                        exercise_name: "exer 1",
                        exercise_media: "url://somewhere",
                        workout_id: workoutId
                    },
                    {
                        id: workoutId,
                        program_id: programId,
                        day: workoutDay,
                        exercise_id: "exer-2",
                        exercise_name: "exer 2",
                        exercise_media: "url://somewhere",
                        workout_id: workoutId
                    },
                    {
                        id: workoutId,
                        program_id: programId,
                        day: workoutDay,
                        exercise_id: "exer-3",
                        exercise_name: "exer 3",
                        exercise_media: "url://somewhere",
                        workout_id: workoutId
                    },
                    {
                        id: workoutId,
                        program_id: programId,
                        day: workoutDay,
                        exercise_id: "exer-4",
                        exercise_name: "exer 4",
                        exercise_media: "url://somewhere",
                        workout_id: workoutId
                    }
                ],
                command: "",
                rowCount: 4,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(
                mockQueryResult
            )

            // Invoke the method being tested
            const foundWorkout = await workoutRepository.findById(workoutId)

            // Assert the result
            expect(foundWorkout).toBeDefined()
            expect(foundWorkout?.id).toBe(workoutId)
            expect(foundWorkout?.programId).toBe(programId)
            expect(foundWorkout?.day).toBe(workoutDay)
            expect(foundWorkout?.exercises).toBeDefined()
            expect(foundWorkout?.exercises).toHaveLength(4)
            expect(foundWorkout?.exercises?.at(0)?.id).toBe("exer-1")
            expect(foundWorkout?.exercises?.at(0)?.name).toBe("exer 1")
            expect(foundWorkout?.exercises?.at(0)?.media).toBe("url://somewhere")
            expect(foundWorkout?.exercises?.at(0)?.workoutId).toBe(workoutId)
        })

        it("should return null if not found", async () => {
            // Mock the query result
            const workoutId = "unknown"

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
            const foundWorkout = await workoutRepository.findById(workoutId)

            // Assert the result
            expect(foundWorkout).toBeNull()
        })
    })

    describe("create", () => {
        it("should create a workout successfully", async () => {
            // Mock the query result
            const programId = "program-123"
            const workoutId = "workout-123"
            const workoutDay = 1

            jest.spyOn(ID, "idGenerator").mockReturnValueOnce(workoutId)

            const mockQueryResult: QueryResult = {
                rows: [
                    {
                        id: workoutId,
                        program_id: programId,
                        day: workoutDay
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
            const workout = new Workout(workoutId, programId, workoutDay)
            const createdWorkout = await workoutRepository.create(
                programId,
                workout
            )

            // Assert the result
            expect(createdWorkout).toBeDefined()
            expect(createdWorkout.id).toBe(workoutId)
            expect(createdWorkout.programId).toBe(programId)
            expect(createdWorkout.day).toBe(workoutDay)

            const expectedQuery: QueryConfig = {
                text: "INSERT INTO workouts (id, program_id, day) VALUES ($1, $2) RETURNING *",
                values: [workoutId, programId, workoutDay]
            }

            expect(mockPool.query).toHaveBeenCalledTimes(1)
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })
    })
})
