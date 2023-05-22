import { UserRepositoryPostgre } from "../UserRepositoryPostgre"
import { type User } from "@domain/user/entity/User"
import { type Logger } from "../../log/Logger"
import { WLogger } from "../../log/WinstoneLogger"
import { type QueryResult, type Pool, type QueryConfig } from "pg"

describe("UserRepositoryPostgre", () => {
    let userRepository: UserRepositoryPostgre
    let mockPool: Partial<Pool>

    const user: User = {
        id: "user-123",
        username: "john_doe",
        password: "password",
        email: "john.doe@example.com",
        name: "John Doe",
        createdAt: undefined,
        updatedAt: undefined
    }
    const ID = {
        idGenerator: jest.fn()
    }

    ID.idGenerator.mockResolvedValue(user.id)

    beforeEach(() => {
        // Create a mock logger
        const logger: Logger = new WLogger()
        // Create a partial mock pool object with the necessary methods
        mockPool = {
            query: jest.fn()
        }

        userRepository = new UserRepositoryPostgre(logger, mockPool as Pool, ID.idGenerator)
    })

    describe("findById function", () => {
        it("should return user by its ID when found", async () => {
            // Create a mock query result
            const mockQueryResult: QueryResult = {
                rows: [{ ...user }],
                command: "",
                rowCount: 1,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)
            const res = await userRepository.findById(user.id)
            expect(res).toMatchObject(user)

            // Verify that the pool.query method was called with the correct query and values
            const expectedQuery: QueryConfig = {
                text: "SELECT id, username, name, email, password FROM users WHERE id = $1 LIMIT 1",
                values: [user.id]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })
        it("should return null when user not found", async () => {
            // Mock the expected database query result
            const mockQueryResult: QueryResult = {
                rows: [],
                command: "",
                rowCount: 0,
                oid: 0,
                fields: []
            };
            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            // Invoke the method being tested
            const user = await userRepository.findById("user-123")

            // Assert the result
            expect(user).toBeNull()
            expect(mockPool.query).toHaveBeenCalledTimes(1)
        })
    })

    describe("findByEmail function", () => {
        it("should find user by email when found", async () => {
            // Create a mock query result
            const mockQueryResult: QueryResult = {
                rows: [{ ...user }],
                command: "",
                rowCount: 1,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)
            const res = await userRepository.findByEmail(user.email)
            expect(res).toMatchObject(user)

            const q: QueryConfig = {
                text: "SELECT id, username, name, email, password FROM users WHERE email = $1 LIMIT 1",
                values: [user.email]
            }
            expect(mockPool.query).toHaveBeenCalledWith(q)
            expect(mockPool.query).toHaveBeenCalledTimes(1)
        })

        it("should return null when user not found", async () => {
            // Mock the expected database query result
            const mockQueryResult: QueryResult = {
                rows: [],
                command: "",
                rowCount: 0,
                oid: 0,
                fields: []
            };
            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            // Invoke the method being tested
            const user = await userRepository.findByEmail("unknown-email")

            // Assert the result
            expect(user).toBeNull()
            expect(mockPool.query).toHaveBeenCalledTimes(1)
        })
    })

    describe("create function", () => {
        it("should create a new user", async () => {
            // Create a mock query result
            const mockQueryResult: QueryResult = {
                rows: [{ id: "user-123" }],
                command: "",
                rowCount: 1,
                oid: 0,
                fields: []
            };

            // Mock the pool.query method to return the mock query result
            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            // Call the create method and expect it to return the user ID
            const result = await userRepository.create(user)
            expect(result).toBe("user-123")

            // Verify that the pool.query method was called with the correct query and values
            const expectedQuery: QueryConfig = {
                text: "INSERT INTO users (id, username, password, email, name) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                values: [user.id, user.username, user.password, user.email, user.name]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })
    })
})
