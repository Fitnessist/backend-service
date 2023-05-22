import { BcryptPasswordEncryptor } from "../BcryptPasswordEncryptor"

describe("PasswordEncoder", () => {
    const bcryptMock = {
        hash: jest.fn(),
        compare: jest.fn()
    }
    const salt: number = 10

    it("it should encrypt the password", async () => {
        const password = "password123"
        const hashedPassword = "hashedPasswordwithlongencrypt"

        bcryptMock.hash.mockResolvedValue(hashedPassword)

        const passwordEncoder = new BcryptPasswordEncryptor(bcryptMock, salt)
        const result = await passwordEncoder.encrypt(password)
        expect(bcryptMock.hash).toHaveBeenCalledWith(password, salt)
        expect(result).toBe(hashedPassword)
    })

    it("should validate a password", async () => {
        const password = "password123"
        const encryptedPassword = "hashedPassword"
        const isValid = true

        bcryptMock.compare.mockResolvedValue(isValid)

        const passwordEncryptor = new BcryptPasswordEncryptor(bcryptMock, salt)
        const result = await passwordEncryptor.validate(password, encryptedPassword)

        expect(bcryptMock.compare).toHaveBeenCalledWith(password, encryptedPassword)
        expect(result).toBe(isValid)
    })
})
