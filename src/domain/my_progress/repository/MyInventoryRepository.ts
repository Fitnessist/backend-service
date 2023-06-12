import { type MyInventory } from "../entity/MyInventory"

export interface MyInventoryRepository {
    GetUserInventory: (userId: string, date?: string) => Promise<MyInventory | null>
}
