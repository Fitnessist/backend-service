class ExerciseLevel {
    public id: string
    public exerciseId: string
    public level: string
    public repetition: number
    public duration: number
    public sets?: number
    public caloriesBurned?: number
    public points?: number

    constructor (payload: {
        id: string
        exerciseId: string
        level: string
        repetition: number
        duration: number
        sets?: number
        caloriesBurned?: number
        points?: number
    }) {
        this.id = payload.id
        this.exerciseId = payload.exerciseId
        this.level = payload.level
        this.repetition = payload.repetition
        this.duration = payload.duration
        this.sets = payload.sets
        this.caloriesBurned = payload.caloriesBurned
        this.points = payload.points
    }
}

export default ExerciseLevel
