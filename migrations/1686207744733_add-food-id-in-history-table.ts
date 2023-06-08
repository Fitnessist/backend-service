module.exports = {
    up: (pgm) => {
        pgm.addColumns("user_food_histories", {
            food_id: {
                type: "varchar(40)",
                notNull: false
            }
        })

        pgm.createConstraint("user_food_histories", "valid_food_id", {
            check: "food_id IS NULL OR food_id IN (SELECT id FROM foods)"
        })

        pgm.createForeignKey("user_food_histories", "food_id", "foods", "id", {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        })
    },

    down: (pgm) => {
        pgm.dropConstraint("user_food_histories", "valid_food_id")
        pgm.dropForeignKey("user_food_histories", "food_id")
        pgm.dropColumns("user_food_histories", ["food_id"])
    }
}
