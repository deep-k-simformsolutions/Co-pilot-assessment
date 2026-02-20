import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

export const router = Router();

router.get("/", getHealth);
