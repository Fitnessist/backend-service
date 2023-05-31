class ExerciseLevel {
    public id: string
    public exerciseId: string
    public level: string
    public repetition: number
    public duration: number
    public sets?: number
    public caloriesBurned?: number
    public points?: number

    constructor (
        id: string,
        exerciseId: string,
        level: string,
        repetition: number,
        duration: number,
        sets?: number,
        caloriesBurned?: number,
        points?: number
    ) {
        this.id = id
        this.exerciseId = exerciseId
        this.level = level
        this.repetition = repetition
        this.duration = duration
        this.sets = sets
        this.caloriesBurned = caloriesBurned
        this.points = points
    }
}

export default ExerciseLevel
