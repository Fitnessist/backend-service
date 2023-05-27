module.exports = {
    up: (pgm) => {
        pgm.createTable("exercises", {
            id: { type: "varchar(40)", notNull: true, primaryKey: true },
            workout_id: {
                type: "varchar(40)",
                notNull: true,
                references: "workouts(id)",
                onDelete: "CASCADE"
            },
            name: {
                type: "varchar(60)"
            },
            media: {
                type: "varchar(255)"
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
        pgm.dropTable("exercises")
    }
}
