import { User } from "@domain/user/entity/User"
import type Exercise from "@domain/workout/entity/Exercise"
import type ExerciseLevel from "@domain/workout/entity/ExerciseLevel"
import Program from "@domain/workout/entity/Program"
import type Workout from "@domain/workout/entity/Workout"
import { Entity, Column, ManyToOne } from "typeorm"

@Entity()
export class MyExerciseProgress {
    @Column()
    public id!: string

    @Column()
    public userId!: string

    @Column()
    public programId!: string

    @Column()
    public workoutId!: string

    @Column()
    public exerciseId!: string

    @Column()
    public exerciseLevelId!: string

    @ManyToOne(() => User, (user: User) => user.myExerciseProgress)
    public user: User | null = null

    @ManyToOne(() => Program, (program: Program) => program)
    public program: Program | null = null

    public workout: Workout | null = null

    public exercise: Exercise | null = null

    public exerciseLevel: ExerciseLevel | null = null

    public static builder (): MyExerciseProgressBuilder {
        return new MyExerciseProgressBuilder()
    }
}

export class MyExerciseProgressBuilder {
    private readonly myProgress: MyExerciseProgress

    constructor () {
        this.myProgress = new MyExerciseProgress()
    }

    public setId (id: string): MyExerciseProgressBuilder {
        this.myProgress.id = id
        return this
    }

    public setUserId (userId: string): MyExerciseProgressBuilder {
        this.myProgress.userId = userId
        return this
    }

    public setProgramId (programId: string): MyExerciseProgressBuilder {
        this.myProgress.programId = programId
        return this
    }

    public setWorkoutId (workoutId: string): MyExerciseProgressBuilder {
        this.myProgress.workoutId = workoutId
        return this
    }

    public setExerciseId (exerciseId: string): MyExerciseProgressBuilder {
        this.myProgress.exerciseId = exerciseId
        return this
    }

    public setExerciseLevelId (exerciseLevelId: string): MyExerciseProgressBuilder {
        this.myProgress.exerciseLevelId = exerciseLevelId
        return this
    }

    public setUser (user: User | null): MyExerciseProgressBuilder {
        this.myProgress.user = user
        return this
    }

    public setProgram (program: Program | null): MyExerciseProgressBuilder {
        this.myProgress.program = program
        return this
    }

    public setWorkout (workout: Workout | null): MyExerciseProgressBuilder {
        this.myProgress.workout = workout
        return this
    }

    public setExercise (value: Exercise | null): MyExerciseProgressBuilder {
        this.myProgress.exercise = value
        return this
    }

    public setExerciseLevel (value: ExerciseLevel | null): MyExerciseProgressBuilder {
        this.myProgress.exerciseLevel = value
        return this
    }

    public build (): MyExerciseProgress {
        return this.myProgress
    }
}
