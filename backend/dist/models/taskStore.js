"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.replaceTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.listTasks = void 0;
const crypto_1 = require("crypto");
// In-memory task storage. This will be reset on server restart.
const tasks = new Map();
const DEFAULT_STATUS = "todo";
const DEFAULT_PRIORITY = "medium";
const listTasks = () => {
    const all = Array.from(tasks.values());
    const withDueDateAndHighPriority = all
        .filter((task) => task.priority === "high" && task.dueDate)
        .sort((a, b) => {
        const timeA = new Date(a.dueDate).getTime();
        const timeB = new Date(b.dueDate).getTime();
        return timeA - timeB;
    });
    const others = all.filter((task) => !(task.priority === "high" && task.dueDate));
    return [...withDueDateAndHighPriority, ...others];
};
exports.listTasks = listTasks;
const getTaskById = (id) => {
    return tasks.get(id);
};
exports.getTaskById = getTaskById;
const createTask = (input) => {
    const now = new Date().toISOString();
    const id = (0, crypto_1.randomUUID)();
    const task = {
        id,
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        status: input.status ?? DEFAULT_STATUS,
        priority: input.priority ?? DEFAULT_PRIORITY,
        dueDate: input.dueDate,
        createdAt: now,
        updatedAt: now,
    };
    tasks.set(id, task);
    return task;
};
exports.createTask = createTask;
const updateTask = (id, updates) => {
    const existing = tasks.get(id);
    if (!existing) {
        return undefined;
    }
    const now = new Date().toISOString();
    const updated = {
        ...existing,
        title: updates.title !== undefined ? updates.title.trim() : existing.title,
        description: updates.description !== undefined
            ? updates.description.trim() || undefined
            : existing.description,
        status: updates.status ?? existing.status,
        priority: updates.priority ?? existing.priority,
        dueDate: updates.dueDate ?? existing.dueDate,
        updatedAt: now,
    };
    tasks.set(id, updated);
    return updated;
};
exports.updateTask = updateTask;
const replaceTask = (id, input) => {
    const existing = tasks.get(id);
    if (!existing) {
        return undefined;
    }
    const now = new Date().toISOString();
    const task = {
        id: existing.id,
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        status: input.status ?? DEFAULT_STATUS,
        priority: input.priority ?? DEFAULT_PRIORITY,
        dueDate: input.dueDate,
        createdAt: existing.createdAt,
        updatedAt: now,
    };
    tasks.set(id, task);
    return task;
};
exports.replaceTask = replaceTask;
const deleteTask = (id) => {
    return tasks.delete(id);
};
exports.deleteTask = deleteTask;
