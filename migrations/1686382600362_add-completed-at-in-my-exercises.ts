exports.up = (pgm) => {
    pgm.addColumns("my_exercise_progress", {
        completed_at: {
            type: "timestamp",
            notNull: false,
            default: pgm.func("current_timestamp")
        }
    })
}

exports.down = (pgm) => {
    pgm.dropColumns("my_exercise_progress", ["completed_at"])
}
