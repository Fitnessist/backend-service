module.exports = {
    up: (pgm) => {
        pgm.createTable("user_programs", {
            id: {
                type: "varchar(40)",
                notNull: true,
                primaryKey: true
            },
            user_id: {
                type: "varchar(40)",
                notNull: true,
                references: "users(id)"
            },
            program_id: {
                type: "varchar(40)",
                notNull: true,
                references: "programs(id)"
            },
            is_finished: {
                type: "boolean",
                default: false
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
        pgm.addConstraint("user_programs", "unique_user_program_id_in_user_programs", {
            unique: ["user_id", "program_id"]
        })
    },

    down: (pgm) => {
        pgm.dropConstraint("user_programs", "unique_user_program_id_in_user_programs")
        pgm.dropTable("user_programs")
    }
}
