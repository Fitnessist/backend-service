/* istanbul ignore file */
import type Program from "@domain/workout/entity/Program"
import TableTestHelper from "./TableTestHelper"

export class ProgramsTableTestHelper extends TableTestHelper {
    constructor () {
        super("programs")
    }

    public async addProgram (program: Program): Promise<void> {
        const { id, title } = program
        const data = { id, title }
        await this.addRow(data)
    }
}
