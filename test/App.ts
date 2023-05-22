import Server from "@infrastructure/http/server"
import apiRouter from "@delivery/http/api/v1/routers/routes"
import container from "@infrastructure/container"

const port = Number(process.env.TEST_PORT ?? 3000) // Port yang berbeda untuk pengujian
const logger = container.getInstance("Logger") // Mendapatkan instance logger dari kontainer

const server = new Server(port, logger)
server.registerRoutes(apiRouter)
server.registerErrorHandler()
server.run()

export default server // Mengambil instance objek Express app dari instance server
