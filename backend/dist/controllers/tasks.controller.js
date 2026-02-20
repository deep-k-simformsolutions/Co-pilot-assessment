"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskHandler = exports.updateTaskHandler = exports.replaceTaskHandler = exports.createTaskHandler = exports.getTask = exports.getTasks = void 0;
const taskStore_1 = require("../models/taskStore");
const tasks_validation_1 = require("./tasks.validation");
const getTasks = (req, res, next) => {
    try {
        const tasks = (0, taskStore_1.listTasks)();
        res.json(tasks);
    }
    catch (err) {
        next(err);
    }
};
exports.getTasks = getTasks;
const getTask = (req, res, next) => {
    try {
        const { id } = req.params;
        const task = (0, taskStore_1.getTaskById)(id);
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (err) {
        next(err);
    }
};
exports.getTask = getTask;
const createTaskHandler = (req, res, next) => {
    try {
        const validation = (0, tasks_validation_1.validateCreatePayload)(req.body);
        if (!validation.valid || !validation.value) {
            res
                .status(400)
                .json({ error: "Invalid payload", details: validation.errors });
            return;
        }
        const task = (0, taskStore_1.createTask)(validation.value);
        res.status(201).json(task);
    }
    catch (err) {
        next(err);
    }
};
exports.createTaskHandler = createTaskHandler;
const replaceTaskHandler = (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = (0, taskStore_1.getTaskById)(id);
        if (!existing) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        if (existing.status === "done") {
            res.status(400).json({
                error: "Task is done and cannot be edited. Please update the status of the task first.",
            });
            return;
        }
        const validation = (0, tasks_validation_1.validateCreatePayload)(req.body);
        if (!validation.valid || !validation.value) {
            res
                .status(400)
                .json({ error: "Invalid payload", details: validation.errors });
            return;
        }
        const task = (0, taskStore_1.replaceTask)(id, validation.value);
        res.json(task);
    }
    catch (err) {
        next(err);
    }
};
exports.replaceTaskHandler = replaceTaskHandler;
const updateTaskHandler = (req, res, next) => {
    try {
        const { id } = req.params;
        const validation = (0, tasks_validation_1.validateUpdatePayload)(req.body);
        if (!validation.valid || !validation.value) {
            res
                .status(400)
                .json({ error: "Invalid payload", details: validation.errors });
            return;
        }
        const existing = (0, taskStore_1.getTaskById)(id);
        if (!existing) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        // Allow updating status TO done, but once done, other edits are blocked
        const isChangingStatusToDone = validation.value.status === "done" && existing.status !== "done";
        if (existing.status === "done" && !isChangingStatusToDone) {
            res.status(400).json({
                error: "Task is done and cannot be edited. Please update the status of the task first.",
            });
            return;
        }
        const task = (0, taskStore_1.updateTask)(id, validation.value);
        res.json(task);
    }
    catch (err) {
        next(err);
    }
};
exports.updateTaskHandler = updateTaskHandler;
const deleteTaskHandler = (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = (0, taskStore_1.deleteTask)(id);
        if (!deleted) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTaskHandler = deleteTaskHandler;
