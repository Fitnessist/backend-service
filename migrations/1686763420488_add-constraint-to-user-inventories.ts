module.exports = {
    up: (pgm) => {
        pgm.addConstraint("user_properties", "unique_user_id_user_properties", {
            unique: ["user_id"]
        })
    },

    down: (pgm) => {
        pgm.dropConstraint("user_properties", "unique_user_id_user_properties")
    }
}
