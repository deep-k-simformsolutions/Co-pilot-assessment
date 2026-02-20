import { Request, Response, NextFunction } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  replaceTask,
  updateTask,
} from "../models/taskStore";
import {
  validateCreatePayload,
  validateUpdatePayload,
} from "./tasks.validation";

export const getTasks = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const tasks = listTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTask = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { id } = req.params;
    const task = getTaskById(id);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const createTaskHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const validation = validateCreatePayload(req.body);

    if (!validation.valid || !validation.value) {
      res
        .status(400)
        .json({ error: "Invalid payload", details: validation.errors });
      return;
    }

    const task = createTask(validation.value);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const replaceTaskHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { id } = req.params;

    const existing = getTaskById(id);
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    if (existing.status === "done") {
      res.status(400).json({
        error:
          "Task is done and cannot be edited. Please update the status of the task first.",
      });
      return;
    }

    const validation = validateCreatePayload(req.body);

    if (!validation.valid || !validation.value) {
      res
        .status(400)
        .json({ error: "Invalid payload", details: validation.errors });
      return;
    }

    const task = replaceTask(id, validation.value);

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTaskHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { id } = req.params;
    const validation = validateUpdatePayload(req.body);

    if (!validation.valid || !validation.value) {
      res
        .status(400)
        .json({ error: "Invalid payload", details: validation.errors });
      return;
    }

    const existing = getTaskById(id);
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Allow updating status TO done, but once done, other edits are blocked
    const isChangingStatusToDone =
      validation.value.status === "done" && existing.status !== "done";

    if (existing.status === "done" && !isChangingStatusToDone) {
      res.status(400).json({
        error:
          "Task is done and cannot be edited. Please update the status of the task first.",
      });
      return;
    }

    const task = updateTask(id, validation.value);

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTaskHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { id } = req.params;

    const deleted = deleteTask(id);

    if (!deleted) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
