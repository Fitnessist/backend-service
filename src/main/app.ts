/* eslint-disable import/first */
require("module-alias/register")

import * as dotenv from "dotenv"
dotenv.config()

import Server from "@infrastructure/http/server"
import apiRouter from "@delivery/http/api/v1/routers/routes"
import pool from "@infrastructure/database/postgres"
import container from "@infrastructure/container"
import { type Logger } from "@infrastructure/log/Logger"

const port = Number(process.env.PORT ?? 8000)
const logger = container.getInstance("Logger") as Logger
const server = new Server(port, logger)
server.registerRoutes(apiRouter)
server.registerErrorHandler()
server.run()

// Handle SIGINT event to gracefully shutdown the server
process.on("SIGINT", () => {
    pool.end(() => {
        logger.info("Database connection pool closed.")
        logger.info("Server shutdown gracefully")
        server.closeServer()
        process.exit(0)
    })
})
