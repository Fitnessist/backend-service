# Clean RESTful API TypeScript Boilerplate

## Table of Contents

- [Project Description](#project-description)
- [Clean Architecture](#clean-architecture)
- [Workflow](#workflow)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [Technologies and Libraries](#technologies-and-libraries)

## Project Description

This project is a boilerplate for clean architecture of rest api using typescript language.

## Clean Architecture

Clean Architecture is a software design philosophy that aims to create scalable and maintainable applications by separating concerns and dependencies into distinct layers. It promotes a modular and testable codebase, making it easier to develop and evolve the application over time.

The key layers in Clean Architecture are:

1. **Domain Layer**: Contains the core business logic, entities, and use cases of the application. It represents the unique behaviors and business rules.

2. **Application Layer**: Implements the use cases by orchestrating the interactions between the domain layer and the delivery layer. It contains application-specific business rules and workflows.

3. **Delivery Layer**: Handles the input and output of the application, such as REST API controllers, GraphQL resolvers, or CLI interfaces. It is responsible for translating external requests into a format suitable for the application layer and returning responses to the external clients.

4. **Infrastructure Layer**: Deals with external dependencies, such as databases, third-party services, or external APIs. It provides concrete implementations of repositories, data access, and other infrastructure-related concerns.

The flow of data and control within the Clean Architecture follows a strict dependency rule, where dependencies flow inward. The inner layers have no knowledge of the outer layers, ensuring high-level modules remain decoupled from low-level implementation details.

## Workflow

The workflow of this project can be summarized as follows:

1. **Input Validation**: Incoming requests are validated using the Fastest Validator library, ensuring the data meets the defined schemas and constraints.

2. **Delivery Layer**: The REST API routes/controllers receive the validated requests and invoke the corresponding use cases from the application layer.

3. **Application Layer**: The use cases interact with the domain layer to execute the business logic and apply the necessary transformations.

4. **Domain Layer**: The core business logic is executed, applying the defined rules and constraints. It operates on domain entities and uses domain-specific services or repositories.

5. **Infrastructure Layer**: The infrastructure layer provides concrete implementations of repositories, data access, and external services required by the application.

6. **Persistence**: The data is stored/retrieved from the database using the PostgreSQL database driver and relevant infrastructure components.

7. **Response**: The response is formulated and returned through the delivery layer, providing the appropriate HTTP status codes and response payloads.

By following the principles of Clean Architecture, this project promotes modularity, testability, and maintainability. It enables you to focus on the business logic and easily replace or update components without affecting other parts of the system.

For more details on how to install and use this boilerplate, refer to the [Installation](#installation) and [Usage](#usage) sections above.

## Prerequesite
If you don't want to use the Docker. You have to install
1. [NodeJS ^18.x](https://nodejs.org/en)
2. [PostgreSQL ^12.x](https://www.postgresql.org/)

## Installation

### Without Docker

1. Clone the repository:

   ```shell
   $ git clone https://github.com/bangyadiii/clean-rest-typescript-boilerplate.git
   $ cd clean-rest-typescript-boilerplate
   ```

2. Install the dependencies:

   ```shell
   $ npm install
   ```

3. Rename the `.env.example` file to `.env`:

   ```shell
   $ mv .env.example .env
   ```

4. Open the `.env` file and fill in the necessary environment variables with your configuration.

5. Run the migrations
   ```shell
   $ npm run migrate
   ```

### With Docker

1. Clone the repository:

    ```shell
   $ git clone https://github.com/bangyadiii/clean-rest-typescript-boilerplate.git
   $ cd clean-rest-typescript-boilerplate
   ```

2. Rename the `.env.example` file to `.env` 
   ```shell
   $ mv .env.example .env
   ```

3. Open the .env file and fill in the necessary environment variables with your configuration.

4. Build and run the Docker containers:

   ```shell
   $ docker-compose up -d
   ```

   This will start the server and the PostgreSQL database container.

5. Access the container
   ```shell
   $ docker exec -it app bash
   ```

6. Run migration
   ```shell
   $ npm run migrate
   ```

## Usage

### Without Docker

1. Start the server:

   ```shell
   $ npm start
   ```

   This will start the server and make it accessible at `http://localhost:8000`. You can then make API requests using tools like `curl` or `Postman`.

### With Docker

1. Build and run the Docker container:

   ```shell
   $ docker-compose up -d
   ```

   This will start the server and the PostgreSQL database container. The server will be accessible at http://localhost:8000. You can then make API requests using tools like `curl` or `Postman`.

Make sure to choose the appropriate installation method (with or without Docker) based on your preference and requirements. Customize the instructions as needed to match the specific configurations and commands used in your project.

## Testing

```shell
$ npm test
```

This will run the test suite and display the results in the console.

## Contributing

We welcome contributions to enhance the functionality and quality of this project. If you would like to contribute, please follow our guidelines for submitting issues, feature requests, or pull requests, and adhere to our coding conventions and branch structure. Together, we can make this project even better!

## Technologies and Libraries

- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
- [Express.js](https://expressjs.com/): A fast and minimalist web framework for Node.js.
- [Node.js](https://nodejs.org/): A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [PostgreSQL](https://www.postgresql.org/): A powerful, open-source relational database system.
- [bcrypt](https://www.npmjs.com/package/bcrypt): A library for hashing passwords.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): A library for generating and verifying JSON Web Tokens (JWT).
- [winston](https://www.npmjs.com/package/winston): A versatile logging library for Node.js.
- [fastest-validator](https://www.npmjs.com/package/fastest-validator): A library for data validation.
- [uuid](https://www.npmjs.com/package/uuid): A library for generating universally unique identifiers (UUIDs).
- [module-alias](https://www.npmjs.com/package/module-alias): A library for creating aliases for directories.

Feel free to customize this template to fit your specific project requirements. Make sure to include all the necessary information that will help users understand and interact with your project.