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
            const foundWorkout = await workoutRepository.findById(workoutId)

            // Assert the result
            expect(foundWorkout).toBeDefined()
            expect(foundWorkout.id).toBe(workoutId)
            expect(foundWorkout.programId).toBe(programId)
            expect(foundWorkout.day).toBe(workoutDay)

            // Verify that the pool.query method was called with the correct query and values
            const expectedQuery: QueryConfig = {
                text: "SELECT * FROM workouts WHERE id=$1 LIMIT 1",
                values: [workoutId]
            }

            expect(mockPool.query).toHaveBeenCalledTimes(1)
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
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
            const workout = new Workout(
                workoutId,
                programId,
                workoutDay
            )
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
