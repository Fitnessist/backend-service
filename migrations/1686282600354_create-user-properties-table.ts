
module.exports = {
    up: (pgm) => {
        pgm.createTable("user_properties", {
            id: { type: "varchar(40)", primaryKey: true },
            gender: { type: "varchar(40)", notNull: true },
            age: { type: "smallint", notNull: true },
            weight: { type: "int", notNull: true },
            height: { type: "int", notNull: true },
            activity: { type: "varchar(255)" },
            fat: { type: "int" },
            calories_each_day: { type: "int", notNull: false, default: 0 },
            weight_target: { type: "int", notNull: false, default: 0 },
            calories_each_day_target: { type: "int", notNull: false, default: 0 },
            user_id: {
                type: "varchar(40)",
                notNull: true,
                references: "users(id)",
                onDelete: "CASCADE"
            }
        })
    },

    down: (pgm) => {
        pgm.dropTable("user_properties")
    }
}
