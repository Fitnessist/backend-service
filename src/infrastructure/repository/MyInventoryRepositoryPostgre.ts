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

    public async GetUserInventory (userId: string): Promise<MyInventory | null> {
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
                        I.total_calories_burned,
                        I.created_at as inventory_created_at,
                        I.updated_at as inventory_updated_at,
                    FROM user_inventories I
                    JOIN users U ON I.user_id = U.id
                    WHERE U.id = $1 LIMIT 1
                `,
            values: [userId]
        }
        const result = await this.pool.query(q)

        if (result.rowCount <= 0) {
            return null
        }

        const row = result.rows[0]

        const user = new User(
            row.user_id,
            row.username,
            row.password,
            row.email,
            row.name
        )
        const myInventory = new MyInventory({
            id: row.inventory_id,
            userId: row.user_id,
            totalPoints: row.total_points,
            totalCaloriesBurned: row.total_calories_burned,
            createdAt: new Date(row.inventory_created_at),
            updatedAt: new Date(row.inventory_updated_at)
        })
        myInventory.user = user

        return myInventory
    }
}
