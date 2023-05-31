import { type NextFunction, type Request, type Response } from "express"
import { sendSuccess } from "../ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"
import type WorkoutUseCase from "@application/workout/usecase/WorkoutUseCase"

export default class WorkoutController {
    private readonly workoutUseCase: WorkoutUseCase

    constructor (workoutUseCase: WorkoutUseCase) {
        this.workoutUseCase = workoutUseCase

        // binding this context for each function
        this.getWorkoutById = this.getWorkoutById.bind(this)
        this.getAllWorkouts = this.getAllWorkouts.bind(this)
    }

    getWorkoutById (req: Request, res: Response, next: NextFunction): void {
        const { workoutId } = req.params

        // Panggil use case untuk mencari program berdasarkan ID
        this.workoutUseCase
            .findWorkoutById(workoutId)
            .then((program) => {
                sendSuccess(res, HTTP_STATUS.OK, program, "OK")
            })
            .catch((error: any) => {
                next(error)
            })
    }

    getAllWorkouts (req: Request, res: Response, next: NextFunction): void {
        const { workoutId, page, perPage } = req.query
        const workoutIdString = String(workoutId)
        const pageNumber = Number(page ?? 1)
        const perPageNumber = Number(perPage ?? 10)

        this.workoutUseCase
            .getAllWorkouts(workoutIdString, pageNumber, perPageNumber)
            .then((datas) => {
                sendSuccess(res, HTTP_STATUS.OK, datas, "OK")
            })
            .catch((error: any) => {
                next(error)
            })
    }
}
