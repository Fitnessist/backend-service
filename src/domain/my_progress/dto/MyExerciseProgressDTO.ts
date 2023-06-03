import { ValidationException } from "@common/exceptions/ValidationException"
import { type User } from "@domain/user/entity/User"
import type Exercise from "@domain/workout/entity/Exercise"
import type ExerciseLevel from "@domain/workout/entity/ExerciseLevel"
import type Program from "@domain/workout/entity/Program"
import type Workout from "@domain/workout/entity/Workout"
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
    public user?: User
    public programId: string
    public program?: Program
    public workoutId: string
    public workout?: Workout
    public exerciseId: string
    public exercise?: Exercise
    public exerciseLevelId: string
    public exerciseLevel?: ExerciseLevel

    constructor (payload: {
        user_id: string
        program_id: string
        workout_id: string
        exercise_id: string
        exercise_level_id: string
        program?: Program
        user?: User
        workout?: Workout
        exercise?: Exercise
        exerciseLevel?: ExerciseLevel
    }) {
        this.verifyData(payload)
        this.userId = payload.user_id
        this.programId = payload.program_id
        this.workoutId = payload.workout_id
        this.exerciseId = payload.exercise_id
        this.exerciseLevelId = payload.exercise_level_id
        this.program = payload.program
        this.user = payload.user
        this.workout = payload.workout
        this.exercise = payload.exercise
        this.exerciseLevel = payload.exerciseLevel
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
