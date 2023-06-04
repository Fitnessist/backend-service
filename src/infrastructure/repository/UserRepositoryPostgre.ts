import { type UserRepository as UserRepositoryInterface } from "@domain/user/repository/UserRepository"
import { User } from "@domain/user/entity/User"
import { type Logger } from "@infrastructure/log/Logger"
import { type Pool, type QueryConfig } from "pg"
import { MyInventory } from "@domain/my_progress/entity/MyInventory"

export class UserRepositoryPostgre implements UserRepositoryInterface {
    private readonly logger: Logger
    private readonly _pool: Pool
    private readonly idGenerator: any

    constructor (logger: Logger, pool: Pool, idGenerator: any) {
        this.logger = logger
        this._pool = pool
        this.idGenerator = idGenerator
    }

    public async findById (id: string): Promise<User | null> {
        try {
            const q: QueryConfig = {
                text: `
                    SELECT 
                        U.id AS user_id, 
                        U.username, 
                        U.name, 
                        U.email, 
                        U.password,
                        I.id as inventory_id,
                        I.total_points,
                        I.total_calories_burned
                    FROM users  U
                    JOIN user_inventories I ON I.user_id = U.id
                    WHERE U.id = $1 LIMIT 1
                `,
                values: [id]
            }
            const result = await this._pool.query(q)
            if (result.rowCount === 0) {
                return null
            }
            const row = result.rows[0]

            const user = new User(row.user_id, row.username, row.password, row.email, row.name)
            user.myInventory = new MyInventory(row.inventory_id, row.user_id, row.total_points, row.total_calories_burned)

            return user
        } catch (error: any) {
            this.logger.error(`error during getting data ${String(error.stack)}`)
            throw error
        }
    }

    public async findByEmail (email: string): Promise<User | null> {
        try {
            const q: QueryConfig = {
                text: "SELECT id, username, name, email, password FROM users WHERE email = $1 LIMIT 1",
                values: [email]
            }
            const result = await this._pool.query(q)
            if (result.rowCount === 0) {
                return null
            }
            const user: User = result.rows[0]
            return user
        } catch (error: any) {
            this.logger.error(`error during getting data ${String(error.stack)}`)
            return null
        }
    }

    public async create (user: User): Promise<string | boolean> {
        user.id = this.idGenerator()
        const query: QueryConfig = {
            text: "INSERT INTO users (id, username, password, email, name) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            values: [user.id, user.username, user.password, user.email, user.name]
        }
        const result = await this._pool.query(query)
        return result.rows[0].id
    }
}
