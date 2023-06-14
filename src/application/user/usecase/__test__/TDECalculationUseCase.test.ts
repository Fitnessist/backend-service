import { type IUserProperti } from "@domain/user/repository/IUserPropertiRepository"
import { type IProgramRepository } from "@domain/workout/repository/IProgramRepository"
import { type Logger } from "@infrastructure/log/Logger"
import { TdeUserRequestDTO } from "@domain/user/dto/TdeUserRequestDTO"
import { NotFoundException } from "@common/exceptions/NotFoundException"
import type Program from "@domain/workout/entity/Program"
import { TDECalculationUseCase } from "../TDECalculationUseCase"
import type UserProperti from "@domain/user/entity/UserProperti"

describe("TDECalculationUseCase", () => {
    let userPropertiesRepository: IUserProperti
    let programRepo: IProgramRepository
    let logger: Logger
    let tdeCalculationUseCase: TDECalculationUseCase

    beforeEach(() => {
        userPropertiesRepository = {
            findById: jest.fn(),
            create: jest.fn(),
            getAll: jest.fn(),
            findByUserId: jest.fn()
        }
        programRepo = {
            findById: jest.fn(),
            create: jest.fn(),
            getAll: jest.fn(),
            countTotalItems: jest.fn()
        }
        logger = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        }

        tdeCalculationUseCase = new TDECalculationUseCase(
            userPropertiesRepository,
            programRepo,
            logger
        )
    })

    it("should calculate TDE correctly for male user with sedentary activity and fat percentage", async () => {
    // Create a mock TdeUserRequestDTO
        const requestData = new TdeUserRequestDTO({
            gender: "male",
            age: 30,
            weight: 80,
            height: 180,
            user_id: "user-123",
            activity: "sedentary",
            fat: 0.2,
            weight_target: 75,
            program_id: "program-123"
        })

        // Create a mock Program
        const program: Program = {
            id: "program-123",
            title: "Weight Loss Program"
            // ... other properties
        };

        // Mock the programRepo.findById method to return the mock Program
        (programRepo.findById as jest.Mock).mockResolvedValueOnce(program);

        (userPropertiesRepository.create as jest.Mock).mockImplementation(async (userProperties: UserProperti) =>
            await Promise.resolve({
                ...userProperties,
                id: "user-properti-123"
            })
        )
        // Call the calculateTDE method
        const result = await tdeCalculationUseCase.calculateTDE(requestData)

        // Verify the calculations and data
        expect(result.calories_each_day).toEqual(2337) // Expected calculated TDE value
        expect(result.calories_each_day_target).toEqual(2837) // Expected calculated TDE target value

        // Verify that the programRepo.findById method was called with the correct program_id
        expect(programRepo.findById).toHaveBeenCalledWith("program-123")

        // Verify that the userPropertiesRepository.create method was called with the correct UserProperties object
        expect(userPropertiesRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                age: 30,
                gender: "male",
                height: 180,
                weight: 80,
                activity: "sedentary",
                fat: 0.2,
                caloriesEachDay: 2337,
                weightTarget: 75,
                caloriesEachDayTarget: 2837,
                userId: "user-123"
            })
        )
    })

    it("should throw NotFoundException if program_id is not found", async () => {
    // Create a mock TdeUserRequestDTO
        const requestData = new TdeUserRequestDTO({
            gender: "female",
            age: 25,
            weight: 60,
            height: 160,
            user_id: "user-456",
            activity: "moderately_active",
            fat: 0.15,
            weight_target: 55,
            program_id: "non-existing-program"
        });

        // Mock the programRepo.findById method to return null
        (programRepo.findById as jest.Mock).mockResolvedValueOnce(null)

        // Call the calculateTDE method and expect it to throw NotFoundException
        await expect(
            tdeCalculationUseCase.calculateTDE(requestData)
        ).rejects.toThrowError(NotFoundException)

        // Verify that the programRepo.findById method was called with the correct program_id
        expect(programRepo.findById).toHaveBeenCalledWith("non-existing-program")

        // Verify that the userPropertiesRepository.create method was not called
        expect(userPropertiesRepository.create).not.toHaveBeenCalled()
    })
})
