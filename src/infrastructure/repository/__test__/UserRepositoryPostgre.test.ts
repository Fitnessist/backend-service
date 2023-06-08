import { UserRepositoryPostgre } from "../UserRepositoryPostgre"
import { User } from "@domain/user/entity/User"
import { type Logger } from "../../log/Logger"
import { WLogger } from "../../log/WinstoneLogger"
import { type QueryResult, type Pool } from "pg"

describe("UserRepositoryPostgre", () => {
    let userRepository: UserRepositoryPostgre
    let mockPool: Partial<Pool>

    const user = new User("user-123", "john_doe", "password", "john.doe@example.com", "John Doe")
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
        })
    })
})
