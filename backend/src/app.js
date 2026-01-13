import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import HealthRoutes from "./routes/healthMap.routes.js";
import { logger, requestLogger } from "./utils/logger.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import healthRouter from './routes/health.routes.js';
import { metricsRouter } from "./routes/metrics.routes.js";
import { metricsMiddleware } from "./middleware/metricsMiddleware.js";
import doctorRouter from './routes/doctor.routes.js';
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';
import doctorAuthRouter from './routes/doctorAuth.routes.js';
import appointmentRouter from './routes/appointment.routes.js';


dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);
app.use(requestIdMiddleware);
app.use(requestLogger); // logs incoming requests
// app.get("/api/healthCheck", (req, res) => {
//     res.status(200).json({ message: "It is working" });
// });

// APIs
app.use('/api/health', healthRouter);
app.use("/metrics", metricsRouter);
app.use("/api/healthmap", HealthRoutes);
app.use("/api/doctors", doctorRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor-auth", doctorAuthRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

// Global Error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

export default app;
