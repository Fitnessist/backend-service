module.exports = {
    up: (pgm) => {
        pgm.createTable("user_food_histories", {
            id: {
                type: "serial",
                notNull: true,
                primaryKey: true
            },
            user_id: {
                type: "varchar(40)",
                notNull: true,
                references: "users(id)"
            },
            image_url: {
                type: "varchar(255)",
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
        pgm.dropTable("user_food_histories")
    }
}
