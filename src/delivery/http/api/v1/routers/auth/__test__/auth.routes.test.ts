import request from "supertest"
import server from "@test/App" // assuming your Express app is exported from 'app.ts'
import { UsersTableTestHelper } from "@test/UsersTableTestHelper"

const app = server.getApp()
const userTable = new UsersTableTestHelper()

beforeAll(async () => {
    await userTable.cleanTable()
})

afterAll(async () => {
    await userTable.cleanTable()
    server.closeServer()
    await userTable.closePool()
})

describe("Auth Routes", () => {
    // Test the POST /register endpoint
    describe("POST /register", () => {
        it("should register a new user", async () => {
            const response = await request(app).post("/api/v1/auth/register").send({
                email: "user@example.com",
                username: "exampleusername",
                name: "username",
                password: "examplepassword",
                passwordConfirmation: "examplepassword"
            })

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("data")
            expect(response.body.data).toHaveProperty("lastInsertedID")
        })

        it("should return validation errors for invalid input", async () => {
            const response = await request(app).post("/api/v1/auth/register").send({
                email: "user@example.com",
                username: "exampleusername",
                name: 111, // invalid data type for 'name'
                password: "examplepassword",
                passwordConfirmation: "examplepassword"
            })

            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("error")
            expect(response.body.error).toHaveProperty(
                "message",
                "Validation failed"
            )
            expect(response.body.error).toHaveProperty(
                "code",
                "VALIDATION_ERROR"
            )
            expect(response.body.error).toHaveProperty("details")
            expect(response.body.error.details).toHaveLength(1)
            expect(response.body.error.details[0]).toHaveProperty(
                "type",
                "string"
            )
            expect(response.body.error.details[0]).toHaveProperty(
                "message",
                "The 'name' field must be a string."
            )
            expect(response.body.error.details[0]).toHaveProperty(
                "field",
                "name"
            )
            expect(response.body.error.details[0]).toHaveProperty(
                "actual",
                111
            )
        })
    })

    // Test the POST /login endpoint
    describe("POST /login", () => {
        it("should log in a user", async () => {
            const response = await request(app).post("/api/v1/auth/login").send({
                email: "user@example.com",
                password: "examplepassword"
            })

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("data")
            expect(response.body.data).toHaveProperty("accessToken")
            expect(response.body.data).toHaveProperty("refreshToken")
        })

        it("should return unauthorized error for invalid credentials", async () => {
            const response = await request(app).post("/api/v1/auth/login").send({
                email: "user@example.com",
                password: "wrongpassword"
            })

            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("error")
            expect(response.body.error).toHaveProperty(
                "message",
                "Invalid credentials"
            )
            expect(response.body.error).toHaveProperty("code", "UNAUTHORIZED")
        })
    })
})
