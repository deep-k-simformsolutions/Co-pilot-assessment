import { randomUUID } from "crypto";
import {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from "./task";

// In-memory task storage. This will be reset on server restart.
const tasks = new Map<string, Task>();

const DEFAULT_STATUS: TaskStatus = "todo";
const DEFAULT_PRIORITY: TaskPriority = "medium";

export const listTasks = (): Task[] => {
  const all = Array.from(tasks.values());

  const withDueDateAndHighPriority = all
    .filter((task) => task.priority === "high" && task.dueDate)
    .sort((a, b) => {
      const timeA = new Date(a.dueDate as string).getTime();
      const timeB = new Date(b.dueDate as string).getTime();
      return timeA - timeB;
    });

  const others = all.filter(
    (task) => !(task.priority === "high" && task.dueDate),
  );

  return [...withDueDateAndHighPriority, ...others];
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.get(id);
};

export const createTask = (input: CreateTaskInput): Task => {
  const now = new Date().toISOString();
  const id = randomUUID();

  const task: Task = {
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

export const updateTask = (
  id: string,
  updates: UpdateTaskInput,
): Task | undefined => {
  const existing = tasks.get(id);
  if (!existing) {
    return undefined;
  }

  const now = new Date().toISOString();

  const updated: Task = {
    ...existing,
    title: updates.title !== undefined ? updates.title.trim() : existing.title,
    description:
      updates.description !== undefined
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

export const replaceTask = (
  id: string,
  input: CreateTaskInput,
): Task | undefined => {
  const existing = tasks.get(id);
  if (!existing) {
    return undefined;
  }

  const now = new Date().toISOString();

  const task: Task = {
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

export const deleteTask = (id: string): boolean => {
  return tasks.delete(id);
};
