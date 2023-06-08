import { validateSchema } from "@domain/validator/UserValidator"

export interface AddMyProgramPayload {
    userId: string
    program_id: string
}

export class AddMyProgramRequestDTO {
    public userId: string
    public programId: string

    constructor (payload: AddMyProgramPayload) {
        this._validatePayload(payload)
        this.userId = payload.userId
        this.programId = payload.program_id
    }

    private _validatePayload (payload: AddMyProgramPayload): void {
        const registerSchema: any = {
            userId: { type: "string", optional: false },
            program_id: { type: "string", optional: false }
        }

        validateSchema(payload, registerSchema)
    }
}
