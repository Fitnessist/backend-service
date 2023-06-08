module.exports = {
    up: (pgm) => {
        pgm.addColumns("user_food_histories", {
            food_id: {
                type: "varchar(40)",
                references: "foods(id)",
                notNull: false,
                onDelete: "CASCADE"
            }
        })
        pgm.sql(`
        CREATE OR REPLACE FUNCTION validate_food_id() RETURNS TRIGGER AS $$
        BEGIN
          IF NEW.food_id IS NOT NULL THEN
            IF NOT EXISTS (SELECT 1 FROM foods WHERE id = NEW.food_id) THEN
              RAISE EXCEPTION 'Invalid food_id';
            END IF;
          END IF;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `)
        pgm.createTrigger("user_food_histories", "validate_food_id_trigger", {
            when: "BEFORE",
            operation: ["INSERT", "UPDATE"],
            function: "validate_food_id",
            language: "plpgsql"
        })
    },

    down: (pgm) => {
        pgm.dropTrigger("user_food_histories", "validate_food_id_trigger")
        pgm.dropFunction("validate_food_id", [], { ifExists: true })
        pgm.dropColumns("user_food_histories", ["food_id"])
    }
}
