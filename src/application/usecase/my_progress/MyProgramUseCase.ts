import { NotFoundException } from "@common/exceptions/NotFoundException"
import { AddMyProgramRequestDTO } from "@domain/my_progress/dto/AddMyProgramRequestDTO"
import { MyProgramResponseDTO } from "@domain/my_progress/dto/MyProgramResponseDTO"
import { MyProgram } from "@domain/my_progress/entity/MyProgram"
import { type MyProgramRepository } from "@domain/my_progress/repository/MyProgramRepository"
import { type IProgramRepository } from "@domain/workout/repository/IProgramRepository"
import { type Logger } from "@infrastructure/log/Logger"

export class MyProgramUseCase {
    private readonly myProgramRepo: MyProgramRepository
    private readonly programRepo: IProgramRepository
    private readonly logger: Logger

    constructor (
        myProgramRepo: MyProgramRepository,
        programRepo: IProgramRepository,
        logger: Logger
    ) {
        this.myProgramRepo = myProgramRepo
        this.programRepo = programRepo
        this.logger = logger
    }

    public async addMyProgram (payload: any): Promise<MyProgramResponseDTO> {
        try {
            const request = new AddMyProgramRequestDTO({ ...payload })
            const program = await this.programRepo.findById(request.programId)
            if (program === null) {
                throw new NotFoundException(`program with id: ${request.programId} not found`)
            }
            const myProgram = new MyProgram("", request.userId, request.programId)
            myProgram.user = payload?.user
            const insertedProgram = await this.myProgramRepo.create(myProgram)

            const response = new MyProgramResponseDTO(insertedProgram)
            if (response.user !== undefined) {
                response.user.my_inventory = undefined
            }

            return response
        } catch (error: any) {
            this.logger.error(error?.stack)
            throw error
        }
    }

    public async getMyProgramWithIdByUserId (userId: string, programId?: string): Promise<MyProgramResponseDTO> {
        try {
            let myProgram: MyProgram | null
            console.log("program ID", programId)

            if (programId !== undefined) {
                myProgram = await this.myProgramRepo.findByUserIdAndProgramId(userId, programId)
                if (myProgram === null) {
                    throw new NotFoundException("program not found for this id")
                }
            } else {
                myProgram = await this.myProgramRepo.findByUserId(userId)
            }

            if (myProgram === null) {
                throw new NotFoundException("program not found for this id")
            }

            const myProgramResponse = new MyProgramResponseDTO(myProgram)
            return myProgramResponse
        } catch (error: any) {
            this.logger.error(error?.stack)
            throw error
        }
    }
}
