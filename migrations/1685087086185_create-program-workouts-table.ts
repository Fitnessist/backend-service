module.exports = {
    up: (pgm) => {
        pgm.createTable("programs", {
            id: { type: "varchar(40)", notNull: true, primaryKey: true },
            title: { type: "varchar(100)", notNull: true },
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
        pgm.dropTable("programs")
    }
}
