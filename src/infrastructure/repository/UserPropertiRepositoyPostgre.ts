import { type IUserProperti } from "@domain/user/repository/IUserPropertiRepository"
import UserProperti from "@domain/user/entity/UserProperti"
import { type Logger } from "@infrastructure/log/Logger"
import { type Pool, type QueryConfig } from "pg"

export class UserPropertiesRepositoryPostgre implements IUserProperti {
    private readonly logger: Logger
    private readonly pool: Pool
    private readonly idGenerator: any

    constructor (pool: Pool, idGenerator: any, logger: Logger) {
        this.logger = logger
        this.idGenerator = idGenerator
        this.pool = pool
    }

    public async findById (id: string): Promise<UserProperti | null> {
        try {
            const query: QueryConfig = {
                text: "SELECT id, gender, age, weight, height, activity, fat, user_id FROM user_properties WHERE id = $1 LIMIT 1",
                values: [id]
            }
            const result = await this.pool.query(query)
            if (result.rowCount === 0) {
                return null
            }
            const userProperties: UserProperti = result.rows[0]
            return userProperties
        } catch (error: any) {
            this.logger.error(
                `Error during getting data: ${String(error.stack)}`
            )
            return null
        }
    }

    public async create (
        userProperties: UserProperti
    ): Promise<UserProperti> {
        const query: QueryConfig = {
            text: `
             INSERT INTO user_properties 
                ( id, 
                    gender, 
                    age, 
                    weight, 
                    height, 
                    user_id, 
                    calories_each_day, 
                    activity, 
                    fat, 
                    calories_each_day_target , 
                    weight_target
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            values: [
                this.idGenerator(),
                userProperties.gender,
                userProperties.age,
                userProperties.weight,
                userProperties.height,
                userProperties.userId,
                userProperties.caloriesEachDay,
                userProperties.activity,
                userProperties.fat,
                userProperties.caloriesEachDayTarget,
                userProperties.weightTarget
            ]
        }
        try {
            const result = await this.pool.query(query)

            const insertedUserProperties: UserProperti = new UserProperti({
                id: result.rows[0].id,
                gender: result.rows[0].gender,
                age: result.rows[0].age,
                weight: result.rows[0].weight,
                height: result.rows[0].height,
                userId: result.rows[0].user_id,
                caloriesEachDay: result.rows[0].calories_each_day,
                activity: result.rows[0].activity,
                fat: result.rows[0].fat,
                caloriesEachDayTarget: result.rows[0].calories_each_day_target,
                weightTarget: result.rows[0].weight_target
            })
            return insertedUserProperties
        } catch (error: any) {
            this.logger.error(
                `Error during creating data: ${String(error.stack)}`
            )
            throw error
        }
    }

    public async update (userProperties: UserProperti): Promise<UserProperti> {
        const query: QueryConfig = {
            text: `
            UPDATE user_properties
            SET gender = $2, age = $3, weight = $4, height = $5, activity = $6, fat = $7, calories_each_day = $8, calories_each_day_target = $9, weight_target = $10
            WHERE id = $1
            RETURNING *`,
            values: [
                userProperties.id,
                userProperties.gender,
                userProperties.age,
                userProperties.weight,
                userProperties.height,
                userProperties.activity,
                userProperties.fat,
                userProperties.caloriesEachDay,
                userProperties.caloriesEachDayTarget,
                userProperties.weightTarget
            ]
        }

        try {
            const result = await this.pool.query(query)

            const updatedUserProperties: UserProperti = new UserProperti({
                id: result.rows[0].id,
                gender: result.rows[0].gender,
                age: result.rows[0].age,
                weight: result.rows[0].weight,
                height: result.rows[0].height,
                userId: result.rows[0].user_id,
                caloriesEachDay: result.rows[0].calories_each_day,
                activity: result.rows[0].activity,
                fat: result.rows[0].fat,
                caloriesEachDayTarget: result.rows[0].calories_each_day_target,
                weightTarget: result.rows[0].weight_target
            })

            return updatedUserProperties
        } catch (error: any) {
            this.logger.error(
                `Error during updating data: ${String(error.stack)}`
            )
            throw error
        }
    }

    public async getAll (): Promise<UserProperti[]> {
        try {
            const query: QueryConfig = {
                text: "SELECT id, gender, age, weight, height, activity, fat, user_id FROM user_properties",
                values: []
            }
            const result = await this.pool.query(query)
            const userPropertiesList: UserProperti[] = result.rows
            return userPropertiesList
        } catch (error: any) {
            this.logger.error(
                `Error during getting data: ${String(error.stack)}`
            )
            return []
        }
    }

    public async findByUserId (userId: string): Promise<UserProperti | null> {
        try {
            const query: QueryConfig = {
                text: `SELECT 
                       *
                    FROM user_properties 
                    WHERE user_id = $1 
                    LIMIT 1`,
                values: [userId]
            }
            const result = await this.pool.query(query)

            if (result.rowCount === 0) {
                return null
            }
            const data = result.rows[0]

            const userProperties: UserProperti = new UserProperti({
                id: data.id,
                age: data.age,
                gender: data.gender,
                weight: data.weight,
                weightTarget: data.weight_target,
                height: data.height,
                fat: data.fat,
                caloriesEachDay: data.calories_each_day,
                caloriesEachDayTarget: data.calories_each_day_target,
                activity: data.activity,
                userId: data.user_id
            })
            return userProperties
        } catch (error: any) {
            this.logger.error(
                `Error during getting data: ${String(error.stack)}`
            )
            return null
        }
    }
}
