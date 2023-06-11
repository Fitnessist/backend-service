import { MyInventory } from "@domain/my_progress/entity/MyInventory"
import { type MyInventoryRepository } from "@domain/my_progress/repository/MyInventoryRepository"
import { User } from "@domain/user/entity/User"
import { type QueryConfig, type Pool } from "pg"

export class MyInventoryRepositoryPostgre implements MyInventoryRepository {
    private readonly idGenerator: any
    private readonly pool: Pool

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    public async GetUserInventory (userId: string, date?: string): Promise<MyInventory | null> {
        const q: QueryConfig = {
            text: `
                    SELECT 
                        I.user_id,
                        SUM(I.total_points) AS total_points,
                        SUM(I.total_calories_burned) AS total_calories_burned
                    FROM user_inventories I
                    WHERE I.user_id = $1
                `,
            values: [userId]
        }

        if (date !== undefined && date !== "") {
            q.text += "AND DATE(created_at) = $2"
            q.values?.push(date)
        }

        q.text += "GROUP BY I.user_id"

        const result = await this.pool.query(q)

        if (result.rowCount <= 0) {
            return null
        }

        const queryUser: QueryConfig = {
            text: `
                    SELECT 
                        users.id,
                        users.name,
                        users.username,
                        users.email
                    FROM users 
                    WHERE users.id = $1
                    LIMIT 1
                `,
            values: [userId]
        }

        const userResult = await this.pool.query(queryUser)
        const user = new User(userResult.rows[0].id, userResult.rows[0].username, "", userResult.rows[0].email, userResult.rows[0].name)

        const myInventory = new MyInventory({
            userId: result.rows[0].user_id,
            totalPoints: result.rows[0].total_points,
            totalCaloriesBurned: result.rows[0].total_calories_burned,
            user
        })

        return myInventory
    }
}
