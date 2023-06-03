exports.up = (pgm) => {
    pgm.createFunction(
        "insert_user_inventory_after_register_function",
        [],
        {
            language: "plpgsql",
            returns: "TRIGGER"
        },
        `BEGIN
            INSERT INTO user_inventories(user_id, total_points, total_calories_burned)
            VALUES (NEW.id, 0, 0);
            
            RETURN NEW;
        END;`
    )

    pgm.createTrigger(
        "users",
        "insert_user_inventory_after_register_trigger",
        {
            when: "AFTER",
            operation: ["INSERT"],
            level: "ROW",
            function: "insert_user_inventory_after_register_function"
        }
    )
}

exports.down = (pgm) => {
    pgm.dropTrigger(
        "users",
        "insert_user_inventory_after_register_trigger"
    )

    pgm.dropFunction("insert_user_inventory_after_register_function", [])
}
