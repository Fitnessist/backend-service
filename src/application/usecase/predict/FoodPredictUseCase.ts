import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { NotFoundException } from "@common/exceptions/NotFoundException"
import { ValidationException } from "@common/exceptions/ValidationException"
import { type ApiResponse } from "@delivery/http/api/v1/controllers/ApiResponseHelper"
import { type UserFoodHistoryRequestDTO } from "@domain/foods/dto/UserFoodHistoryRequestDTO"
import { UserFoodHistoryResponseDTO } from "@domain/foods/dto/UserFoodHistoryResponseDTO"
import { UserFoodHistory } from "@domain/foods/entity/UserFoodHistory"
import { type FoodRepository } from "@domain/foods/repository/FoodRepository"
import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"
import { type CloudStorageService } from "@infrastructure/storage/CloudStorageService"
import { type AxiosInstance } from "axios"
import isBase64 from "is-base64"
import moment from "moment"

export class FoodPredictUseCase {
    private readonly foodRepo: FoodRepository
    private readonly userRepo: UserRepository
    private readonly axios: AxiosInstance
    private readonly storageService: CloudStorageService
    private readonly logger: Logger

    constructor (
        foodRepo: FoodRepository,
        axios: AxiosInstance,
        cloudService: CloudStorageService,
        userRepo: UserRepository,
        logger: Logger
    ) {
        this.foodRepo = foodRepo
        this.axios = axios
        this.storageService = cloudService
        this.userRepo = userRepo
        this.logger = logger
    }

    public async predictFoodImage (
        foodImage: string,
        userId: string
    ): Promise<any> {
        try {
            // Validasi MIME type
            if (!isBase64(foodImage)) {
                throw new ValidationException([{
                    field: "food_image",
                    message: "food image not valid base64 string"
                }])
            }
            const buffer = Buffer.from(foodImage, "base64")

            // Validasi ukuran file
            const maxSizeInBytes = 1024 * 1024 // Ukuran maksimal 2 MB
            if (buffer.length > maxSizeInBytes) {
                throw new ValidationException([{
                    field: "food_image",
                    message: "food image not valid, max dim 2mb"
                }])
            }
            // const publicUrlUploadedImage = await this.storageService.uploadFile(foodImage, "users_foods")

            const predictModelServiceURL =
                process.env.FOOD_PREDICT_MODEL_SERVICE_URL

            if (
                predictModelServiceURL === null ||
                predictModelServiceURL === undefined ||
                predictModelServiceURL === ""
            ) {
                throw new Error("FOOD_PREDICT_MODEL_SERVICE_URL is undefined.")
            }

            const httpJsonBody: any = {
                image: foodImage
            }

            // const uploadPromise = this.storageService.uploadFile(foodImage, "users_foods")
            const predictionResult = await this.axios.post(
                "/predict",
                httpJsonBody
            )

            const data = predictionResult.data as ApiResponse<any>
            if (
                predictionResult === null ||
                data.status.code !== HTTP_STATUS.OK
            ) {
                throw new NotFoundException()
            }

            return data
        } catch (error: any) {
            this.logger.error(error?.stack)
            throw error
        }
    }

    public async addFoodForUser (
        payload: UserFoodHistoryRequestDTO
    ): Promise<UserFoodHistoryResponseDTO> {
        try {
            if (
                payload.total_calories === undefined &&
                payload.total_grams !== undefined &&
                payload.calories_per_100gr !== undefined
            ) {
                payload.total_calories = Math.round(
                    (payload.total_grams / 100) * payload.calories_per_100gr
                )
            }
            const userFoodHistory = new UserFoodHistory({
                id: "",
                userId: payload.user_id,
                foodName: payload.food_name,
                imageUrl: payload.image_url,
                foodId: payload.food_id,
                totalGrams: payload.total_grams,
                caloriesPer100gr: payload.calories_per_100gr,
                totalCalories: payload.total_calories
            })
            const data = await this.foodRepo.addUserFoodHistory(
                userFoodHistory
            )

            const response = new UserFoodHistoryResponseDTO(data)
            return response
        } catch (error: any) {
            this.logger.error(error?.stack)
            throw error
        }
    }

    public async getUserFoodHistory (
        userId: string,
        date?: string
    ): Promise<UserFoodHistoryResponseDTO[]> {
        if (date === undefined || date == null) {
            const errors = []
            const error = {
                type: "required",
                field: "date",
                message: "date is required and should be dd-MM-YYYY"
            }
            errors.push(error)
            throw new ValidationException(errors)
        }
        const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD")
        try {
            const results = await this.foodRepo.getFoodHistoryByUserId(
                userId,
                formattedDate
            )
            if (results === null) {
                throw new NotFoundException()
            }
            const response = results.map((data) => {
                return new UserFoodHistoryResponseDTO(data)
            })

            return response
        } catch (error: any) {
            this.logger.error(error?.stack)
            throw error
        }
    }
}
