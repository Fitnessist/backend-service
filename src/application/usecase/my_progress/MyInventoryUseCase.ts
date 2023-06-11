import { NotFoundException } from "@common/exceptions/NotFoundException"
import { MyInventoryResponseDTO } from "@domain/my_progress/dto/MyInventoryResponseDTO"
import { type MyInventoryRepository } from "@domain/my_progress/repository/MyInventoryRepository"
import { type User } from "@domain/user/entity/User"
import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"
import moment from "moment"

export class MyInventoryUseCase {
    private readonly myInventoryRepo: MyInventoryRepository
    private readonly userRepo: UserRepository
    private readonly logger: Logger

    constructor (
        myInventoryRepo: MyInventoryRepository,
        userRepo: UserRepository,
        logger: Logger
    ) {
        this.myInventoryRepo = myInventoryRepo
        this.userRepo = userRepo
        this.logger = logger
    }

    public async getInventory (user: User, date?: string): Promise<MyInventoryResponseDTO> {
        try {
            if (date !== undefined) {
                date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD")
            }
            const myInventory = await this.myInventoryRepo.GetUserInventory(
                user.id,
                date
            )
            if (myInventory === null) {
                throw new NotFoundException()
            }
            user.myInventory = undefined
            myInventory.user = user
            const response = new MyInventoryResponseDTO(myInventory)

            return response
        } catch (error: any) {
            this.logger.error(error?.stack)
            throw error
        }
    }
}
