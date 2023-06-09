exports.up = (pgm) => {
    pgm.addColumns("user_programs", {
        exercise_completed_counter: {
            type: "integer",
            default: 0
        }
    })

    /**
     *  TODO: buatkan function untuk menghitung total row yang ada di
     *  my_exercise_progress dengan user id NEW.user_id dan NEW.program_id
     *
     * */
    pgm.createFunction(
        "increment_exercise_counter_function",
        [],
        {
            language: "plpgsql",
            returns: "TRIGGER"
        },
        `DECLARE
            total_count INTEGER;
         BEGIN
            SELECT COUNT(*)
            INTO total_count
            FROM my_exercise_progress
            WHERE user_id = NEW.user_id AND program_id = NEW.program_id;
        
            UPDATE user_inventories
            SET exercise_completed_counter = total_count
            WHERE user_id = NEW.user_id;
  
            RETURN NEW;
        END;`
    )

    pgm.createTrigger(
        "my_exercise_progress",
        "increment_exercise_counter_trigger",
        {
            when: "AFTER",
            operation: ["INSERT", "UPDATE"],
            level: "ROW",
            function: "increment_exercise_counter_function"
        }
    )
}

exports.down = (pgm) => {
    pgm.dropTrigger(
        "my_exercise_progress",
        "increment_exercise_counter_trigger"
    )
    pgm.dropFunction("increment_exercise_counter_function", [])
    pgm.dropColumns("user_programs", ["exercise_completed_counter"])
}
