import { Food } from "@domain/foods/entity/Food"
import { type FoodRepository } from "@domain/foods/repository/FoodRepository"
import { type QueryConfig, type Pool } from "pg"

export class FoodRepositoryPostgre implements FoodRepository {
    private readonly idGenerator: any
    private readonly pool: Pool

    constructor (pool: Pool, idGenerator: any) {
        this.pool = pool
        this.idGenerator = idGenerator
    }

    public async findByFoodName (name: string): Promise<Food | null> {
        const q: QueryConfig = {
            text: `
                    SELECT *
                    FROM foods I
                    WHERE foods.food_name LIKE %$1%
                    LIMIT 1
                `,
            values: [name]
        }
        const result = await this.pool.query(q)

        if (result.rowCount <= 0) {
            return null
        }

        const row = result.rows[0]

        const food = new Food(row.id, row.food_name, row.calories_per_100gr)
        return food
    }

    public async addUserFoodHistory (payload: {
        userId: string
        imageUrl?: string
        foodId?: string
    }): Promise<any> {
        const q: QueryConfig = {
            text: `
                INSERT INTO user_food_histories(user_id, image_url, food_id)
                VALUES ($1, $2, $3)
            `,
            values: [payload.userId, payload.imageUrl ?? null, payload.foodId ?? null]
        }
        const result = await this.pool.query(q)
        const data = result.rows[0]
        return data
    }
}
