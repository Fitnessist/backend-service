import { type MyInventory } from "../entity/MyInventory"

export interface MyInventoryRepository {
    GetUserInventory: (userId: string) => Promise<MyInventory | null>
}
