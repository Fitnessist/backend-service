import request from "supertest"
import server from "@test/App"
import { ProgramsTableTestHelper } from "@test/ProgramsTableTestHelper"
// import ProgramController from "@delivery/http/api/v1/controllers/ProgramWorkout/ProgramController";
// import ProgramUseCase from "@application/workout/usecase/ProgramUseCase";
import Program from "@domain/workout/entity/Program"

const app = server.getApp()
const programsTable = new ProgramsTableTestHelper()

beforeEach(async () => {
    await programsTable.cleanTable()
})

afterAll(async () => {
    await programsTable.cleanTable()
    server.closeServer()
    await programsTable.closePool()
})

describe("Program Routes", () => {
    describe("GET /programs/:programId", () => {
        it("should return program details", async () => {
            // Persiapan data
            const programId = "program-123"
            const programTitle = "Sample Program"
            const programWorkouts: any[] | undefined = []

            // Menambahkan program ke dalam tabel
            const program = new Program(
                programId,
                programTitle,
                programWorkouts
            )
            await programsTable.addProgram(program)

            // Melakukan request ke API
            const response = await request(app).get(
                `/api/v1/programs/${programId}`
            )

            // Memastikan respon berhasil dan sesuai dengan yang diharapkan
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("data")
            expect(response.body.data).toHaveProperty("id", programId)
            expect(response.body.data).toHaveProperty("title", programTitle)
            expect(response.body.data).toHaveProperty(
                "workouts",
                programWorkouts
            )
        })

        it("should return 404 if program is not found", async () => {
            // Melakukan request ke API dengan ID program yang tidak ada
            const response = await request(app).get(
                "/api/v1/programs/nonexistent-program"
            )

            // Memastikan respon adalah 404 (Not Found)
            expect(response.status).toBe(404)
        })
    })

    describe("GET /programs", () => {
        it("should return programs with pagination details", async () => {
            // Prepare data
            const program = new Program("program-123", "Sample Program", [])
            await programsTable.addProgram(program)

            // Send request to API
            const response = await request(app).get("/api/v1/programs")

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
            expect(items[0]).toHaveProperty("id", program.id)
            expect(items[0]).toHaveProperty("title", program.title)
        })
    })
})
