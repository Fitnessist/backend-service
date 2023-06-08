import { type IUserProperti } from "@domain/user/repository/IUserPropertiRepository"
import UserProperties from "@domain/user/entity/UserProperti"
import { type Logger } from "@infrastructure/log/Logger"
import { type TdeUserRequestDTO } from "@domain/user/dto/TdeUserRequestDTO"
import { NotFoundException } from "@common/exceptions/NotFoundException"
import { TdeUserResponseDTO } from "@domain/user/dto/TdeUserResponseDTO"

export class TDECalculationUseCase {
    private readonly userPropertiesRepository: IUserProperti
    private readonly logger: Logger

    constructor (
        userPropertiRepository: IUserProperti,
        logger: Logger
    ) {
        this.userPropertiesRepository = userPropertiRepository
        this.logger = logger
    }

    public async calculateTDE (dataTDE: TdeUserRequestDTO): Promise<TdeUserResponseDTO> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { gender, age, weight, height, user_id, activity, fat, weight_target } = dataTDE

        let tde = 0

        // Lakukan logika perhitungan TDE berdasarkan data yang diberikan
        // Contoh: menggunakan rumus Harris-Benedict
        if (gender === "male") {
            tde = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        } else if (gender === "female") {
            tde = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
        }
        // Menyesuaikan TDE berdasarkan tingkat aktivitas
        if (activity === "sedentary") {
            tde *= 1.2
        } else if (activity === "lightly_active") {
            tde *= 1.375
        } else if (activity === "moderately_active") {
            tde *= 1.55
        } else if (activity === "very_active") {
            tde *= 1.725
        } else if (activity === "extra_active") {
            tde *= 1.9
        }
        // Menyesuaikan TDE berdasarkan persentase lemak tubuh (jika ada)
        if (fat !== undefined) {
            tde += fat * 500
            console.log(tde)
        }
        tde = Math.round(tde)
        const userProperti = new UserProperties(
            {
                id: "",
                age,
                gender,
                height,
                weight,
                activity,
                fat,
                caloriesEachDay: tde,
                weightTarget: weight_target,
                caloriesEachDayTarget: tde + 500,
                userId: user_id
            }
        )
        const insertdata = await this.userPropertiesRepository.create(userProperti)
        console.log(insertdata)
        if (insertdata === null) {
            throw new NotFoundException()
        }
        const responseData = new TdeUserResponseDTO(insertdata)
        console.log(responseData)
        return responseData
    }
}
