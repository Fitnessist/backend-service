import { ValidationException } from "@common/exceptions/ValidationException"
import Validator, { type ValidationError } from "fastest-validator"

const validator = new Validator()

const myExerciseProgressSchema = {
    user_id: { type: "string", min: 1 },
    program_id: { type: "string", min: 1 },
    workout_id: { type: "string", min: 1 },
    exercise_id: { type: "string", min: 1 },
    exercise_level_id: { type: "string", min: 1 }
}

export class MyExerciseProgressDTO {
    public userId: string
    public programId: string
    public workoutId: string
    public exerciseId: string
    public exerciseLevelId: string

    constructor (payload: {
        user_id: string
        program_id: string
        workout_id: string
        exercise_id: string
        exercise_level_id: string
    }) {
        this.verifyData(payload)
        this.userId = payload.user_id
        this.programId = payload.program_id
        this.workoutId = payload.workout_id
        this.exerciseId = payload.exercise_id
        this.exerciseLevelId = payload.exercise_level_id
    }

    public verifyData (data: any): void {
        const validationResult = validator.validate(
            data,
            myExerciseProgressSchema
        )

        if (validationResult !== true) {
            const errors: ValidationError[] =
                validationResult as ValidationError[]

            throw new ValidationException(errors)
        }
    }
}
