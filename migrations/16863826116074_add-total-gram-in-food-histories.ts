module.exports = {
    up: (pgm) => {
        pgm.addColumns("user_food_histories", {
            food_name: {
                type: "varchar(255)",
                notNull: false
            },
            total_grams: {
                type: "integer",
                notNull: false
            },
            calories_per_100gr: {
                type: "integer",
                notNull: false
            },
            total_calories: {
                type: "integer",
                notNull: false
            }
        })
    },

    down: (pgm) => {
        pgm.dropColumns("user_food_histories", [
            "food_name",
            "total_grams",
            "total_calories_per_100gr",
            "total_calories"
        ])
    }
}
