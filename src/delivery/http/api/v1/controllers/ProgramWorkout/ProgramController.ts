import type ProgramUseCase from "@application/workout/usecase/ProgramUseCase"
import { type NextFunction, type Request, type Response } from "express"
import { sendSuccess } from "../ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"

export default class ProgramController {
    private readonly programUseCase: ProgramUseCase

    constructor (programUseCase: ProgramUseCase) {
        this.programUseCase = programUseCase

        // binding this context for each function
        this.getProgramById = this.getProgramById.bind(this)
        this.getAllPrograms = this.getAllPrograms.bind(this)
    }

    getProgramById (req: Request, res: Response, next: NextFunction): void {
        const { programId } = req.params

        // Panggil use case untuk mencari program berdasarkan ID
        this.programUseCase
            .findProgramById(programId)
            .then((program) => {
                sendSuccess(res, HTTP_STATUS.OK, program, "OK")
            })
            .catch((error: any) => {
                next(error)
            })
    }

    getAllPrograms (req: Request, res: Response, next: NextFunction): void {
        const { page, perPage } = req.query
        const pageNumber = Number(page ?? 1)
        const perPageNumber = Number(perPage ?? 10)

        this.programUseCase
            .getProgramsByPage(pageNumber, perPageNumber)
            .then((datas) => {
                sendSuccess(res, HTTP_STATUS.OK, datas, "OK")
            })
            .catch((error: any) => {
                next(error)
            })
    }
}
