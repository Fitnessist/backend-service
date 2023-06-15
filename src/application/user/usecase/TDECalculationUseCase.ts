import { type IUserProperti } from "@domain/user/repository/IUserPropertiRepository"
import UserProperties from "@domain/user/entity/UserProperti"
import { type Logger } from "@infrastructure/log/Logger"
import { type TdeUserRequestDTO } from "@domain/user/dto/TdeUserRequestDTO"
import { NotFoundException } from "@common/exceptions/NotFoundException"
import { TdeUserResponseDTO } from "@domain/user/dto/TdeUserResponseDTO"
import { type IProgramRepository } from "@domain/workout/repository/IProgramRepository"
import { type User } from "@domain/user/entity/User"

export class TDECalculationUseCase {
    private readonly userPropertiesRepository: IUserProperti
    private readonly programRepo: IProgramRepository
    private readonly logger: Logger

    constructor (
        userPropertiRepository: IUserProperti,
        programRepo: IProgramRepository,
        logger: Logger
    ) {
        this.userPropertiesRepository = userPropertiRepository
        this.programRepo = programRepo
        this.logger = logger
    }

    public async calculateTDE (dataTDE: TdeUserRequestDTO): Promise<TdeUserResponseDTO> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { gender, age, weight, height, user_id, activity, fat, weight_target, program_id } = dataTDE

        const program = await this.programRepo.findById(program_id)
        if (program == null) {
            throw new NotFoundException("program id not found")
        }

        const caloryEachDay = this.calculateEachDay(dataTDE)
        const caloriesEachDayTarget = this.calculateTargetCaloryEachDay(caloryEachDay, program.title)

        const userProperti = new UserProperties(
            {
                id: "",
                age,
                gender,
                height,
                weight,
                activity,
                fat,
                caloriesEachDay: caloryEachDay,
                weightTarget: weight_target,
                caloriesEachDayTarget,
                userId: user_id
            }
        )
        const insertdata = await this.userPropertiesRepository.create(userProperti)
        if (insertdata === null) {
            throw new NotFoundException()
        }
        const responseData = new TdeUserResponseDTO(insertdata)
        return responseData
    }

    public async getUserProperties (user: User): Promise<TdeUserResponseDTO> {
        const userProperties = await this.userPropertiesRepository.findByUserId(user.id)

        if (userProperties === null) {
            throw new NotFoundException()
        }
        userProperties.user = user

        const responseData = new TdeUserResponseDTO(userProperties)
        return responseData
    }

    public async updateCalculateTDE (userId: string, dataTDE: TdeUserRequestDTO): Promise<TdeUserResponseDTO> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { gender, age, weight, height, user_id, activity, fat: fatInPercentage, weight_target, program_id } = dataTDE

        let userProperti = await this.userPropertiesRepository.findByUserId(userId)
        if (userProperti == null) {
            throw new NotFoundException()
        }

        const program = await this.programRepo.findById(program_id)
        if (program == null) {
            throw new NotFoundException("program id not found")
        }

        const caloryEachDay = this.calculateEachDay(dataTDE)
        const caloriesEachDayTarget = this.calculateTargetCaloryEachDay(caloryEachDay, program.title)

        userProperti = new UserProperties(
            {
                id: userProperti.id,
                age,
                gender,
                height,
                weight,
                activity,
                fat: fatInPercentage,
                caloriesEachDay: caloryEachDay,
                weightTarget: weight_target,
                caloriesEachDayTarget,
                userId: user_id
            }
        )
        const updatedData = await this.userPropertiesRepository.update(userProperti)
        if (updatedData === null) {
            throw new NotFoundException()
        }
        const responseData = new TdeUserResponseDTO(updatedData)
        return responseData
    }

    public calculateEachDay (payload: TdeUserRequestDTO): number {
        let caloryEachDay = 0
        // Lakukan logika perhitungan TDE berdasarkan data yang diberikan
        // Contoh: menggunakan rumus Harris-Benedict
        if (payload.gender === "male") {
            caloryEachDay = 66.5 + (13.75 * payload.weight) + (5.003 * payload.height) - (6.755 * payload.age)
        } else if (payload.gender === "female") {
            caloryEachDay = 655.1 + (9.563 * payload.weight) + (1.850 * payload.height) - (4.676 * payload.age)
        }
        // Menyesuaikan TDE berdasarkan tingkat aktivitas
        if (payload.activity === "sedentary") {
            caloryEachDay *= 1.2
        } else if (payload.activity === "lightly_active") {
            caloryEachDay *= 1.375
        } else if (payload.activity === "moderately_active") {
            caloryEachDay *= 1.55
        } else if (payload.activity === "very_active") {
            caloryEachDay *= 1.725
        } else if (payload.activity === "extra_active") {
            caloryEachDay *= 1.9
        }
        // Menyesuaikan TDE berdasarkan persentase lemak tubuh (jika ada)
        if (payload.fat !== undefined) {
            caloryEachDay += (payload.fat / 100) * 500
        }

        caloryEachDay = Math.round(caloryEachDay)
        return caloryEachDay
    }

    public calculateTargetCaloryEachDay (caloryEachDay: number, programName: string): number {
        let caloriesEachDayTarget = caloryEachDay
        if (programName.toLowerCase().includes("menurunkan berat badan")) {
            caloriesEachDayTarget -= 300
        } else {
            caloriesEachDayTarget += 500
        }
        return caloriesEachDayTarget
    }
}
