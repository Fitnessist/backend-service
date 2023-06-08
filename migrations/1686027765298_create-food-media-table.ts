exports.up = (pgm) => {
    pgm.addColumn("foods", {
        image_url: {
            type: "varchar(255)",
            notNull: true,
            unique: true
        }
    })
}

exports.down = (pgm) => {
    pgm.dropColumn("foods", "image_url")
}
