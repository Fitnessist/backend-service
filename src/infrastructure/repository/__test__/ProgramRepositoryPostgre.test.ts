import { type Pool, type QueryResult } from "pg"
import { ProgramRepositoryPostgre } from "../ProgramRepositoryPostgre"
import type Program from "@domain/workout/entity/Program"
import Workout from "@domain/workout/entity/Workout"

describe("ProgramRepositoryPostgre", () => {
    let programRepository: ProgramRepositoryPostgre
    let mockPool: Partial<Pool>
    const ID = {
        idGenerator: jest.fn()
    }

    beforeEach(() => {
        // Create a mock instance of the Pool
        mockPool = {
            query: jest.fn()
        }

        // Create an instance of the ProgramRepositoryPostgre
        programRepository = new ProgramRepositoryPostgre(mockPool as Pool, ID.idGenerator as any)
    })

    describe("create", () => {
        it("should create a program", async () => {
            // Mock the query result
            const programId: string = "program-123"
            const programTitle = "Beginner Program"
            const mockQueryResult: QueryResult = {
                rows: [{
                    id: programId,
                    title: programTitle
                }],
                command: "",
                rowCount: 1,
                oid: 0,
                fields: []
            }

            ID.idGenerator.mockReturnValueOnce(programId);

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            // Create a program object
            const program: Program = {
                id: "",
                title: programTitle
            }

            // Invoke the method being tested
            const createdProgram = await programRepository.create(program)

            // Assert the result
            expect(createdProgram).toBeDefined()
            expect(createdProgram.id).toBe(programId)
            expect(createdProgram.title).toBe(programTitle)
        })
    })

    describe("findById", () => {
        it("should return the program when found", async () => {
            // Mock the query result
            const programId = "program-123"
            const programTitle = "Beginner Program"
            const mockQueryResult: QueryResult = {
                rows: [
                    {
                        id: programId,
                        title: programTitle,
                        workout_id: "workout-1",
                        program_id: programId,
                        day: 1
                    },
                    {
                        id: programId,
                        title: programTitle,
                        workout_id: "workout-2",
                        program_id: programId,
                        day: 2
                    }
                ],
                command: "",
                rowCount: 2,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            // Invoke the method being tested
            const program = await programRepository.findById(programId)

            // Assert the result
            expect(program).toBeDefined()
            expect(program?.id).toBe(programId)
            expect(program?.title).toBe(programTitle)
            expect(program?.workouts).toHaveLength(2)
            expect(program?.workouts?.at(0)).toEqual(new Workout("workout-1", programId, 1))
        })

        it("should return null when program not found", async () => {
            // Mock the query result
            const programId = "unknown-program"
            const mockQueryResult: QueryResult = {
                rows: [],
                command: "",
                rowCount: 0,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            // Invoke the method being tested
            const program = await programRepository.findById(programId)

            // Assert the result
            expect(program).toBeNull()
        })
    })
})
