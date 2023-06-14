import { type MyInventory } from "@domain/my_progress/entity/MyInventory"
import { type User } from "./User"

export default class UserResponseDTO {
    public id: string
    public username: string
    public name: string
    public email: string
    public my_inventory?: MyInventory

    constructor (payload: User) {
        const { id, username, name, email, myInventory } = payload
        this.id = id
        this.username = username
        this.name = name
        this.email = email
        this.my_inventory = myInventory !== undefined ? myInventory : undefined
    }
}
