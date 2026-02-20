import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { router as healthRouter } from "./routes/health.routes";
import { router as tasksRouter } from "./routes/tasks.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(
    morgan((tokens, req, res) => {
      const method = tokens.method(req, res);
      const url = tokens.url(req, res);
      const responseTime = tokens["response-time"](req, res);

      return `[${method}] ${url} - Execution time: ${responseTime}ms`;
    }),
  );
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/tasks", tasksRouter);

  app.use(errorHandler);

  return app;
};
