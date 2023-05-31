/* istanbul ignore file */
import { type User } from "@domain/user/entity/User"
import TableTestHelper from "./TableTestHelper"

export class UsersTableTestHelper extends TableTestHelper {
    constructor () {
        super("users")
    }

    public async addUser ({
        id = "user-123",
        username = "username11",
        password = "secret",
        name = "Example User"
    }): Promise<void> {
        const data = { id, username, password, name }
        await this.addRow(data)
    }

    public async findUsersById (id: string): Promise<User | null> {
        const user = await this.findRowsById(id)
        return user
    }
}
