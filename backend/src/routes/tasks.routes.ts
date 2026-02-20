import { Router } from "express";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTask,
  getTasks,
  replaceTaskHandler,
  updateTaskHandler,
} from "../controllers/tasks.controller";

export const router = Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTaskHandler);
router.put("/:id", replaceTaskHandler);
router.patch("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);
