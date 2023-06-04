exports.up = (pgm) => {
    pgm.createTable("user_inventories", {
        id: {
            type: "serial",
            primaryKey: true
        },
        user_id: {
            type: "varchar(40)",
            notNull: true,
            references: "users(id)",
            onDelete: "cascade",
            unique: true
        },
        total_points: {
            type: "integer",
            default: 0
        },
        total_calories_burned: {
            type: "integer",
            default: 0
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
