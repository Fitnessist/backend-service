import { Food } from "@domain/foods/entity/Food"
import { UserFoodHistory } from "@domain/foods/entity/UserFoodHistory"
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

    public async findById (id: string): Promise<Food | null> {
        const q: QueryConfig = {
            text: `
                    SELECT *
                    FROM foods
                    WHERE foods.id = $1
                    LIMIT 1
                `,
            values: [id]
        }
        const result = await this.pool.query(q)

        if (result.rowCount <= 0) {
            return null
        }

        const row = result.rows[0]

        const food = new Food(row.id, row.food_name, row.calories_per_100gr)
        return food
    }

    public async getFoodHistoryByUserId (userId: string, date?: string): Promise<UserFoodHistory[] | null> {
        const query: QueryConfig = {
            text: `
            SELECT 
                H.id,
                H.user_id,
                H.image_url,
                H.created_at,
                H.updated_at,
                H.food_id,
                H.food_name,
                H.calories_per_100gr,
                H.total_grams,
                H.total_calories
            FROM user_food_histories H
            JOIN users U ON U.id = H.user_id
            WHERE H.user_id = $1 
            ${date !== undefined ? "AND DATE(H.created_at) = $2" : ""}
            `,
            values: [userId, date]
        }

        const result = await this.pool.query(query)
        if (result.rowCount <= 0) {
            return null
        }

        const foodHistories = result.rows.map((data) => {
            const foodHistory = new UserFoodHistory({
                id: data.id,
                userId: data.user_id,
                caloriesPer100gr: data.calories_per_100gr,
                foodName: data.food_name,
                foodId: data.food_id,
                imageUrl: data.image_url,
                totalCalories: data.total_calories,
                totalGrams: data.total_grams,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
            })
            return foodHistory
        })

        return foodHistories
    }

    public async addUserFoodHistory (payload: UserFoodHistory): Promise<UserFoodHistory> {
        const q: QueryConfig = {
            text: `
                INSERT INTO user_food_histories (
                    id,
                    user_id, 
                    image_url, 
                    food_id, 
                    food_name, 
                    total_grams, 
                    calories_per_100gr,
                    total_calories
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `,
            values: [
                this.idGenerator(),
                payload.userId,
                payload.imageUrl,
                payload.foodId ?? null,
                payload.foodName,
                payload.totalGrams,
                payload.caloriesPer100gr,
                payload.totalCalories
            ]
        }
        const result = await this.pool.query(q)
        const data = new UserFoodHistory({
            id: result.rows[0].id,
            userId: result.rows[0].user_id,
            foodId: result.rows[0].food_id,
            foodName: result.rows[0].food_name,
            imageUrl: result.rows[0].image_url,
            caloriesPer100gr: result.rows[0].calories_per_100gr,
            totalGrams: result.rows[0].total_grams,
            totalCalories: result.rows[0].total_calories,
            createdAt: new Date(result.rows[0].created_at),
            updatedAt: new Date(result.rows[0].updated_at)
        })
        return data
    }
}
