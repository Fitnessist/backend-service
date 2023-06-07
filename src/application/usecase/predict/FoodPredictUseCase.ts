import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { InternalServerErrorException } from "@common/exceptions/InternalServerErrorException"
import { NotFoundException } from "@common/exceptions/NotFoundException"
import { ValidationException } from "@common/exceptions/ValidationException"
import { type ApiResponse } from "@delivery/http/api/v1/controllers/ApiResponseHelper"
import { type FoodRepository } from "@domain/foods/repository/FoodRepository"
import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"
import { type CloudStorageService } from "@infrastructure/storage/CloudStorageService"
import { type AxiosInstance } from "axios"
import fs from "fs"

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

    public async predictFoodImage (foodImage: Express.Multer.File, userId: string): Promise<any> {
        try {
            const file = foodImage?.path
            if (file === undefined) {
                const errors: any = [
                    {
                        type: "file",
                        field: "food_image",
                        message: "food image required"
                    }
                ]
                throw new ValidationException(errors)
            }

            const fileData = fs.readFileSync(file)

            // Mengonversi file menjadi base64 menggunakan Buffer
            const base64String = Buffer.from(fileData).toString("base64")
            if (fs.existsSync(file)) {
                fs.unlinkSync(file)
            }

            // Mengonversi file buffer menjadi base64 string
            if (base64String === undefined) {
                throw new InternalServerErrorException()
            }
            // await this.storageService.uploadFile(foodImage)
            const predictModelServiceURL = process.env.FOOD_PREDICT_MODEL_SERVICE_URL

            if (
                predictModelServiceURL === null ||
                predictModelServiceURL === undefined ||
                predictModelServiceURL === ""
            ) {
                throw new InternalServerErrorException("FOOD_PREDICT_MODEL_SERVICE_URL is undefined.")
            }

            const httpJsonBody: any = {
                image: base64String
            }

            // const uploadPromise = this.storageService.uploadFile(foodImage, "users_foods")
            const predictionResultPromise = this.axios.post("/predict", httpJsonBody)

            const [predictionResult] = await Promise.all([predictionResultPromise])
            // await this.foodRepo.addUserFoodHistory(uploadResult, userId)

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
}
