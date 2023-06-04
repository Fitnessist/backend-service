module.exports = {
    up: (pgm) => {
        pgm.createTable("foods", {
            id: {
                type: "varchar(40)",
                notNull: true,
                primaryKey: true
            },
            food_name: {
                type: "varchar(100)",
                notNull: true
            },
            calories_per_100gr: {
                type: "integer",
                notNull: false
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
        pgm.dropTable("foods")
    }
}
