export class User {
    public id: string
    public username: string
    public email: string
    public name: string
    public password: string

    constructor (id: string, username: string, password: string, email: string, name: string) {
        this.id = id
        this.username = username
        this.email = email
        this.name = name
        this.password = password
    }
}
