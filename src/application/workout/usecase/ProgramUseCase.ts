import { NotFoundException } from "@common/exceptions/NotFoundException"
import { type IProgramRepository } from "@domain/workout/repository/IProgramRepository"
import { type Logger } from "@infrastructure/log/Logger"
import {
    type IPagination,
    createPaginatedResponse
} from "@helpers/PaginationHelper"
import ProgramResponseDTO from "@domain/workout/dto/ProgramResponseDTO"

export default class ProgramUseCase {
    private readonly logger: Logger
    private readonly programRepository: IProgramRepository

    constructor (programRepository: IProgramRepository, logger: Logger) {
        this.programRepository = programRepository
        this.logger = logger

        this.findProgramById = this.findProgramById.bind(this)
        this.getProgramsByPage = this.getProgramsByPage.bind(this)
    }

    async findProgramById (programId: string): Promise<ProgramResponseDTO> {
        // Panggil method findById pada programRepository
        const program = await this.programRepository.findById(programId)

        if (program === null) {
            throw new NotFoundException()
        }
        const programResult = new ProgramResponseDTO(program)
        return programResult
    }

    async getProgramsByPage (
        pageNumber: number = 1,
        pageSize: number = 10
    ): Promise<IPagination> {
        const offset = (pageNumber - 1) * pageSize
        const baseUrl = process.env.APP_HOST ?? "http://localhost"

        try {
            const totalProgramPromise =
                this.programRepository.countTotalItems()
            const programsPromise = this.programRepository.getAll(
                pageSize,
                offset
            )
            const [totalProgram, programs] = await Promise.all([
                totalProgramPromise,
                programsPromise
            ])

            const dataS = programs.map((program) => {
                return {
                    ...program,
                    links: {
                        self: `${baseUrl}/api/v1/programs/${program.id}`
                    }
                }
            })
            const response = createPaginatedResponse(
                dataS,
                totalProgram,
                pageNumber,
                pageSize,
                baseUrl
            )
            return response
        } catch (error: any) {
            this.logger.error(error?.message)
            throw error
        }
    }
}
