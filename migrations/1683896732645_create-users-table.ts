module.exports = {
    up: (pgm) => {
        pgm.createTable("users", {
            id: "id",
            name: { type: "varchar(100)", notNull: true },
            email: { type: "varchar(100)", notNull: true, unique: true },
            username: { type: "varchar(100)", notNull: true, unique: true },
            password: { type: "varchar(100)", notNull: true },
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
        pgm.dropTable("users")
    }
}
