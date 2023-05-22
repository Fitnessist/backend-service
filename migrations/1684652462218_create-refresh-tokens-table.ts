exports.up = (pgm) => {
    pgm.createTable("refresh_tokens", {
        id: {
            type: "serial",
            primaryKey: true
        },
        user_id: {
            type: "string",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE"
        },
        refresh_token: {
            type: "varchar(255)",
            notNull: true
        },
        expires_at: {
            type: "timestamp",
            notNull: true
        }
    })
}

exports.down = (pgm) => {
    pgm.dropTable("refresh_tokens")
}
