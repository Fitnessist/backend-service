import { type PasswordEncryptorInterface } from "@application/security/PasswordEncoderInterface"

export class BcryptPasswordEncryptor implements PasswordEncryptorInterface {
    private readonly bcrypt: any
    private readonly saltRounds: number

    constructor (bcrypt: any, saltRounds = 10) {
        this.bcrypt = bcrypt
        this.saltRounds = saltRounds
    }

    public async encrypt (password: string): Promise<string> {
        const hashedPassword = await this.bcrypt.hash(password, this.saltRounds)
        return hashedPassword
    }

    public async validate (password: string, encryptedPassword: string): Promise<boolean> {
        const isValid = await this.bcrypt.compare(password, encryptedPassword)
        return isValid
    }
}
