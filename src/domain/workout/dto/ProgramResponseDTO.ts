import type Program from "../entity/Program"

export default class ProgramResponseDTO {
    public id: string
    public title: string

    constructor (payload: Program) {
        this.id = payload.id
        this.title = payload.title
    }
}
