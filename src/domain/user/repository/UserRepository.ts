import { type User } from "@domain/user/entity/User"

export interface UserRepository {
    findById: (id: string) => Promise<User | null>
    findByEmail: (email: string) => Promise<User | null>
    create: (user: User) => Promise<string | boolean>
    // Metode lain yang sesuai dengan kebutuhan bisnis
}
