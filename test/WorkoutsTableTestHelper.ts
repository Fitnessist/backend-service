/* istanbul ignore file */
import type Workout from "@domain/workout/entity/Workout"
import TableTestHelper from "./TableTestHelper"

export class WorkoutsTableTestHelper extends TableTestHelper {
    constructor () {
        super("workouts")
    }

    async addWorkout (workout: Workout): Promise<void> {
        const { id, programId, day } = workout
        const data = { id, program_id: programId, day }
        await this.addRow(data)
    }
}
