exports.up = (pgm) => {
    pgm.createFunction(
        "update_user_points_and_calories_burned",
        [],
        {
            language: "plpgsql",
            returns: "TRIGGER"
        },
        `BEGIN
            UPDATE user_inventories
            SET total_points = COALESCE(total_points, 0) + ( 
                        SELECT EL.points 
                        FROM exercise_levels EL
                        WHERE EL.id = NEW.exercise_level_id
                    ), 
                total_calories_burned = COALESCE(total_calories_burned, 0) + ( 
                    SELECT EL.calories_burned 
                    FROM exercise_levels EL
                    WHERE EL.id = NEW.exercise_level_id
                )
                WHERE user_inventories.user_id = NEW.user_id;

                RETURN NEW;
        END;`
    )

    pgm.createTrigger(
        "my_exercise_progress",
        "update_user_points_and_calories_burned_trigger",
        {
            when: "AFTER",
            operation: ["INSERT", "UPDATE", "DELETE"],
            level: "ROW",
            function: "update_user_points_and_calories_burned"
        }
    )
}

exports.down = (pgm) => {
    pgm.dropTrigger(
        "my_exercise_progress",
        "update_user_points_and_calories_burned_trigger"
    )

    pgm.dropFunction("update_user_points_and_calories_burned", [])
}
