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
                references: "programs(id)",
                unique: true
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
    },

    down: (pgm) => {
        pgm.dropTable("user_programs")
    }
}
