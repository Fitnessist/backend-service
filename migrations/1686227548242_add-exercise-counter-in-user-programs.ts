exports.up = (pgm) => {
    pgm.addColumns("user_programs", {
        exercise_completed_counter: {
            type: "integer",
            default: 0
        },
        total_exercises: {
            type: "integer"
        },
        workout_completed_counter: {
            type: "integer",
            default: 0
        },
        total_workouts: {
            type: "integer"
        },
        progress_percent: {
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
            SELECT COUNT(DISTINCT MYEP.exercise_id)
            INTO total_count
            FROM my_exercise_progress MYEP
            WHERE user_id = NEW.user_id AND program_id = NEW.program_id;
        
            UPDATE user_programs
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
            operation: ["INSERT", "UPDATE", "DELETE"],
            level: "ROW",
            function: "increment_exercise_counter_function"
        }
    )

    pgm.createFunction(
        "increment_workout_counter_function",
        [],
        {
            language: "plpgsql",
            returns: "TRIGGER"
        },
        `DECLARE
            total_count INTEGER;
            workout_completed_uuid UUID;
        BEGIN
            SELECT COUNT(*)
            INTO total_count
            FROM exercises
            WHERE workout_id = NEW.workout_id;
    
            IF total_count = (SELECT COUNT(DISTINCT exercise_id) FROM my_exercise_progress WHERE workout_id = NEW.workout_id) THEN
                workout_completed_uuid := uuid_generate_v4();
                INSERT INTO user_completed_workouts(id, user_id, my_program_id, workout_id)
                VALUES (workout_completed_uuid, NEW.user_id, NEW.program_id, NEW.workout_id);
            END IF;
    
            RETURN NEW;
        END;`
    )

    pgm.createTrigger(
        "my_exercise_progress",
        "increment_workout_counter_trigger",
        {
            when: "AFTER",
            operation: ["INSERT", "UPDATE", "DELETE"],
            level: "ROW",
            function: "increment_workout_counter_function"
        }
    )
}

exports.down = (pgm) => {
    pgm.dropTrigger(
        "my_exercise_progress",
        "increment_exercise_counter_trigger"
    )
    pgm.dropTrigger(
        "my_exercise_progress",
        "increment_workout_counter_trigger"
    )
    pgm.dropFunction("increment_exercise_counter_function", [])
    pgm.dropFunction("increment_workout_counter_function", [])
    pgm.dropColumns("user_programs", [
        "exercise_completed_counter",
        "total_exercises",
        "workout_completed_counter",
        "total_workouts",
        "progress_percent"
    ])
}
