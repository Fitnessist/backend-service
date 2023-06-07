export class Food {
    public id: string
    public foodName: string
    public caloriesPer100gr?: number
    public imageUrl?: string

    constructor (
        id: string,
        foodName: string,
        caloriesPer100gr?: number,
        imageUrl?: string
    ) {
        this.id = id
        this.foodName = foodName
        this.caloriesPer100gr = caloriesPer100gr
        this.imageUrl = imageUrl
    }
}
