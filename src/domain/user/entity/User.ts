import { type MyExerciseProgress } from "@domain/my_progress/entity/MyExerciseProgress"
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
    public myExerciseProgress?: MyExerciseProgress | undefined

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
