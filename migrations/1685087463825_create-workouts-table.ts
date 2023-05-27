module.exports = {
    up: (pgm) => {
        pgm.createTable("workouts", {
            id: { type: "varchar(40)", notNull: true, primaryKey: true },
            program_id: {
                type: "varchar(40)",
                notNull: true,
                references: "programs(id)",
                onDelete: "CASCADE"
            },
            day: {
                type: "int"
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
        pgm.dropTable("workouts")
    }
}
