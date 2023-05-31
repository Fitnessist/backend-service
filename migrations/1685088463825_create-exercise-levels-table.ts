exports.up = (pgm) => {
    pgm.createTable("exercise_levels", {
        id: {
            type: "varchar(40)",
            primaryKey: true
        },
        exercise_id: {
            type: "varchar(40)",
            notNull: true,
            references: "exercises(id)",
            onDelete: "cascade"
        },
        level: {
            type: "varchar(255)",
            notNull: true
        },
        sets: {
            type: "smallint"
        },
        reps: {
            type: "smallint"
        },
        duration: {
            type: "smallint"
        },
        calories_burned: {
            type: "integer"
        },
        points: {
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
    pgm.dropTable("exercise_levels")
}
