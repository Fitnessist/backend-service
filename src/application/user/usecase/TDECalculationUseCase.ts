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

        let caloryEachDay = 0

        // Lakukan logika perhitungan TDE berdasarkan data yang diberikan
        // Contoh: menggunakan rumus Harris-Benedict
        if (gender === "male") {
            caloryEachDay = 66.5 + (13.75 * weight) + (5.003 * height) - (6.755 * age)
        } else if (gender === "female") {
            caloryEachDay = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age)
        }
        // Menyesuaikan TDE berdasarkan tingkat aktivitas
        if (activity === "sedentary") {
            caloryEachDay *= 1.2
        } else if (activity === "lightly_active") {
            caloryEachDay *= 1.375
        } else if (activity === "moderately_active") {
            caloryEachDay *= 1.55
        } else if (activity === "very_active") {
            caloryEachDay *= 1.725
        } else if (activity === "extra_active") {
            caloryEachDay *= 1.9
        }
        // Menyesuaikan TDE berdasarkan persentase lemak tubuh (jika ada)
        if (fat !== undefined) {
            caloryEachDay += fat * 500
        }

        caloryEachDay = Math.round(caloryEachDay)

        let caloriesEachDayTarget = caloryEachDay
        if (program.title.toLowerCase().trim().includes("menurunkan berat badan")) {
            caloriesEachDayTarget -= 300
        } else {
            caloriesEachDayTarget += 500
        }

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
}
