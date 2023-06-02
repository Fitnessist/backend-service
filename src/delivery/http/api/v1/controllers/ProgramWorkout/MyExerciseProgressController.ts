import { type NextFunction, type Request, type Response } from "express"
import { MyExerciseProgressDTO } from "@domain/my_progress/dto/MyExerciseProgressDTO"
import { type MyExerciseProgressUseCase } from "@application/usecase/my_progress/MyExerciseProgressUseCase"
import { sendSuccess } from "../ApiResponseHelper"
import { HTTP_STATUS } from "@common/constants/HTTP_code"

export class MyExerciseProgressController {
    private readonly myExerciseProgressUseCase: MyExerciseProgressUseCase

    constructor (myExerciseProgressUseCase: MyExerciseProgressUseCase) {
        this.myExerciseProgressUseCase = myExerciseProgressUseCase

        this.findByUser = this.findByUser.bind(this)
        this.create = this.create.bind(this)
    }

    public findByUser (req: Request, res: Response, next: NextFunction): void {
        const { userId } = req.params

        this.myExerciseProgressUseCase
            .findByUser(userId)
            .then((myExerciseProgress) => {
                sendSuccess(res, HTTP_STATUS.OK, myExerciseProgress, "OK")
            })
            .catch((error: any) => {
                next(error)
            })
    }

    public create (req: Request, res: Response, next: NextFunction): void {
        const myExerciseProgressDTO = new MyExerciseProgressDTO(req.body)

        this.myExerciseProgressUseCase
            .create(myExerciseProgressDTO)
            .then((myExerciseProgress) => {
                sendSuccess(
                    res,
                    HTTP_STATUS.CREATED,
                    myExerciseProgress,
                    "CREATED"
                )
            })
            .catch((error: any) => {
                next(error)
            })
    }

    // public update(req: Request, res: Response): void {
    //     const { id } = req.params;

    //     try {
    //         const myExerciseProgressDTO = new MyExerciseProgressDTO(req.body);

    //         this.myExerciseProgressUseCase
    //             .update(id, myExerciseProgressDTO)
    //             .then((myExerciseProgress) => {
    //                 res.json(myExerciseProgress);
    //             })
    //             .catch((error) => {
    //                 res.status(500).json({ error: error.message });
    //             });
    //     } catch (error) {
    //         res.status(400).json({ error: error.message });
    //     }
    // }
}
