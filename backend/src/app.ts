import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import customerRoutes from "./routes/customerRoutes"
import accountRoutes from "./routes/accountRoutes"
import transactionRoutes from "./routes/transactionRoutes"
import reportingRoutes from "./routes/reportingRoutes"
import { authMiddleware } from "./middleware/authMiddleware"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swaggerOptions"

dotenv.config()

const app = express()

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

app.use(express.json())

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
  console.log("Received request on root route")
  res.json({ message: "Welcome to Bluesoft Bank API" })
})

app.get("/api/test", (req, res) => {
  console.log("Received request on test route")
  res.json({ message: "API is working correctly" })
})

app.use("/api/customers", customerRoutes)
app.use("/api/reporting", reportingRoutes)
app.use("/api/accounts", authMiddleware, accountRoutes)
app.use("/api/transactions", authMiddleware, transactionRoutes)

console.log("Attempting to connect to MongoDB...")
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

export default app
