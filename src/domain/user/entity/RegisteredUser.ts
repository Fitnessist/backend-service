interface RegisteredUserPayload {
    id: string
    username: string
    email: string
    name: string
}

export default class RegisteredUser {
    private readonly id: string
    private readonly username: string
    private readonly email: string
    private readonly name: string

    constructor (payload: RegisteredUserPayload) {
        this._verifyPayload(payload)

        const { id, username, name, email } = payload
        this.id = id
        this.username = username
        this.name = name
        this.email = email
    }

    private _verifyPayload (payload: RegisteredUserPayload): void {
        const { id, username, name, email } = payload

        if (typeof id !== "string" || id === undefined ||
            typeof username !== "string" || username === undefined ||
            typeof name !== "string" || name === undefined ||
            typeof email !== "string" || email === undefined) {
            throw new Error("REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY")
        }
    }
}
