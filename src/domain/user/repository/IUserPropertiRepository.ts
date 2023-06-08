
import type UserProperti from "../entity/UserProperti"

export interface IUserProperti {
    findById: (id: string) => Promise<UserProperti | null>
    create: (userProperti: UserProperti) => Promise<UserProperti | null>
    getAll: () => Promise<UserProperti[]>
    findByUserId: (userId: string) => Promise<UserProperti | null>
}
