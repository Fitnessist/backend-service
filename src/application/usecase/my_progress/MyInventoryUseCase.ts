import { NotFoundException } from "@common/exceptions/NotFoundException"
import { MyInventoryResponseDTO } from "@domain/my_progress/dto/MyInventory"
import { type MyInventoryRepository } from "@domain/my_progress/repository/MyInventoryRepository"
import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"

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

    public async getInventory (userId: string): Promise<MyInventoryResponseDTO> {
        try {
            const myInventory = await this.myInventoryRepo.GetUserInventory(
                userId
            )
            if (myInventory === null) {
                throw new NotFoundException()
            }
            const response = new MyInventoryResponseDTO(myInventory)

            return response
        } catch (error: any) {
            this.logger.error(error?.stack)
            throw error
        }
    }
}
