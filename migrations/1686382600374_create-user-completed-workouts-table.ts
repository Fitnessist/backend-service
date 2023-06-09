exports.up = (pgm) => {
    pgm.createTable("user_completed_workouts", {
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
        my_program_id: {
            type: "varchar(40)",
            notNull: true,
            references: "user_programs(id)",
            onDelete: "cascade"
        },
        workout_id: {
            type: "varchar(40)",
            notNull: true,
            references: "workouts(id)",
            onDelete: "cascade"
        },
        completed_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    })
    pgm.addConstraint("user_completed_workouts", "unique_user_workouts", {
        unique: ["user_id", "workout_id"]
    })
}

exports.down = (pgm) => {
    pgm.dropConstraint("user_completed_workouts", "unique_user_workouts")
    pgm.dropTable("user_completed_workouts")
}
