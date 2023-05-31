import type Program from "../entity/Program"

export interface IProgramRepository {
    findById: (id: string) => Promise<Program | null>
    create: (program: Program) => Promise<Program>
    getAll: (page: number, offset: number) => Promise<Program[]>
    countTotalItems: () => Promise<number>
}
