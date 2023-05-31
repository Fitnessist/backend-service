import request from "supertest"
import server from "@test/App"
import { WorkoutsTableTestHelper } from "@test/WorkoutsTableTestHelper"
import { ProgramsTableTestHelper } from "@test/ProgramsTableTestHelper"
import Workout from "@domain/workout/entity/Workout"
import Program from "@domain/workout/entity/Program"

const app = server.getApp()
const workoutsTable = new WorkoutsTableTestHelper()
const programTable = new ProgramsTableTestHelper()

beforeEach(async () => {
    await workoutsTable.cleanTable()
})

afterAll(async () => {
    await workoutsTable.cleanTable()
    server.closeServer()
    await workoutsTable.closePool()
})

describe("Workout Routes", () => {
    describe("GET /workouts", () => {
        it("should return workouts with pagination details", async () => {
            // Prepare data
            const programId = "program-123"
            const programTitle = "program 123"
            const program = new Program(programId, programTitle, [])
            await programTable.addProgram(program)
            const workout = new Workout("workout-1", program.id, 1, [])
            await workoutsTable.addWorkout(workout)

            // Send request to API
            const response = await request(app).get("/api/v1/workouts")

            // Ensure response is successful and matches the expected data
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("data")

            const {
                currentPage,
                perPage,
                totalPages,
                totalItems,
                items
            } = response.body.data

            expect(currentPage).toBe(1)
            expect(perPage).toBe(10)
            expect(totalPages).toBe(1)
            expect(totalItems).toBe("1")
            expect(items).toHaveLength(1)
            expect(items[0]).toHaveProperty("id", workout.id)
            expect(items[0]).toHaveProperty("programId", workout.programId)
            expect(items[0]).toHaveProperty("day", workout.day)
            expect(items[0]).toHaveProperty("links")
            expect(items[0].links).toHaveProperty("self")
        })
    })

    describe("GET /workouts/:workoutId", () => {
        it("should return workout details", async () => {
            // Prepare data
            const workoutId = "workout-1"
            const programId = "program-3"
            const programTitle = "program 123"
            const day = 1

            const program = new Program(programId, programTitle, [])
            await programTable.addProgram(program)
            // Add workout to the database
            const workout = new Workout(workoutId, programId, day, [])
            await workoutsTable.addWorkout(workout)

            // Send request to API
            const response = await request(app).get(
                `/api/v1/workouts/${workoutId}`
            )

            // Ensure response is successful and matches the expected data
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("data")
            expect(response.body.data).toHaveProperty("id", workoutId)
            expect(response.body.data).toHaveProperty("programId", programId)
            expect(response.body.data).toHaveProperty("day", day)
        })

        it("should return 404 if workout is not found", async () => {
            // Send request to API with a non-existent workout ID
            const response = await request(app).get(
                "/api/v1/workouts/nonexistent-workout"
            )

            // Ensure response is 404 (Not Found)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("error")
            expect(response.body.status).toHaveProperty("code", 404)
            expect(response.body.status).toHaveProperty("message", "NotFound")
            expect(response.body.error).toHaveProperty("message", "Not Found")
            expect(response.body.error).toHaveProperty("code", "NOT_FOUND")
        })
    })
})
