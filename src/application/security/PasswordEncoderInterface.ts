export interface PasswordEncryptorInterface {
    encrypt: (password: string) => Promise<string>
    validate: (password: string, encryptedPassword: string) => Promise<boolean>
}
