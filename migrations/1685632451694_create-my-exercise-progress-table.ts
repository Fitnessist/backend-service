exports.up = (pgm) => {
    pgm.createTable("my_exercise_progress", {
        id: {
            type: "varchar(40)",
            primaryKey: true
        },
        user_id: {
            type: "varchar(40)",
            notNull: true,
            references: "users(id)",
            onDelete: "cascade"
        },
        program_id: {
            type: "varchar(40)",
            notNull: true,
            references: "programs(id)",
            onDelete: "cascade"
        },
        workout_id: {
            type: "varchar(40)",
            notNull: true,
            references: "workouts(id)",
            onDelete: "cascade"
        },
        exercise_id: {
            type: "varchar(40)",
            notNull: true,
            references: "exercises(id)",
            onDelete: "cascade"
        },
        exercise_level_id: {
            type: "varchar(40)",
            notNull: true,
            references: "exercise_levels(id)",
            onDelete: "cascade"
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
        updated_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    })
    pgm.addConstraint("my_exercise_progress", "unique_user_exercise_level", {
        unique: ["user_id", "exercise_level_id"]
    })
}

exports.down = (pgm) => {
    pgm.dropConstraint("my_exercise_progress", "unique_user_exercise_level")
    pgm.dropTable("my_exercise_progress")
}
