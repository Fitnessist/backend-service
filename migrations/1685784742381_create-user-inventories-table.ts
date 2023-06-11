exports.up = (pgm) => {
    pgm.createTable("user_inventories", {
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
        total_points: {
            type: "integer"
        },
        total_calories_burned: {
            type: "integer"
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
}

exports.down = (pgm) => {
    pgm.dropTable("user_inventories")
}
