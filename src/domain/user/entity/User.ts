import { type MyExerciseProgress } from "@domain/my_progress/entity/MyExerciseProgress"
import { type MyInventory } from "@domain/my_progress/entity/MyInventory"
import type Program from "@domain/workout/entity/Program"
import { Entity, Column } from "typeorm"

@Entity()
export class User {
    @Column()
    public id: string

    @Column()
    public username: string

    @Column()
    public email: string

    @Column()
    public name: string

    @Column()
    public password: string

    @Column()
    public createdAt: string | undefined

    @Column()
    public updatedAt: string | undefined

    @Column()
    public program: Program | undefined

    @Column()
    public myExerciseProgress?: MyExerciseProgress | undefined

    public myInventory?: MyInventory

    constructor (
        id: string,
        username: string,
        password: string,
        email: string,
        name: string,
        createdAt?: string,
        updatedAt?: string
    ) {
        this.id = id
        this.username = username
        this.email = email
        this.name = name
        this.password = password
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}
