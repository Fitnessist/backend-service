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
                        I.total_calories_burned
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
        const myInventory = new MyInventory(
            row.inventory_id,
            row.user_id,
            row.total_points,
            row.total_calories_burned
        )
        myInventory.user = user

        return myInventory
    }
}
