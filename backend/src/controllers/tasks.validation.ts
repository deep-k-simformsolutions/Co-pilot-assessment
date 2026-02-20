import {
  CreateTaskInput,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from "../models/task";

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;

export const isValidStatus = (status: any): status is TaskStatus => {
  return status === "todo" || status === "in_progress" || status === "done";
};

export const isValidPriority = (priority: any): priority is TaskPriority => {
  return priority === "low" || priority === "medium" || priority === "high";
};

export const parseDueDate = (
  value: any,
): { valid: boolean; error?: string; iso?: string } => {
  if (value === undefined || value === null || value === "") {
    return { valid: true, iso: undefined };
  }

  if (typeof value !== "string") {
    return {
      valid: false,
      error:
        "'dueDate' must be a string in ISO format (YYYY-MM-DD or full timestamp)",
    };
  }

  const trimmed = value.trim();
  const date = new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    return { valid: false, error: "'dueDate' must be a valid date" };
  }

  const now = new Date();
  if (date.getTime() < now.getTime()) {
    return { valid: false, error: "'dueDate' cannot be in the past" };
  }

  return { valid: true, iso: date.toISOString() };
};

export const sanitizeText = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const validateCreatePayload = (
  body: any,
): { valid: boolean; errors?: string[]; value?: CreateTaskInput } => {
  const errors: string[] = [];

  const rawTitle = body?.title;
  const rawDescription = body?.description;
  const status = body?.status;
  const priority = body?.priority;
  const rawDueDate = body?.dueDate;

  const title = sanitizeText(rawTitle);
  const description = sanitizeText(rawDescription);

  if (!title) {
    errors.push("'title' is required and must be a non-empty string");
  } else {
    if (title.length < MIN_TITLE_LENGTH) {
      errors.push(
        `'title' must be at least ${MIN_TITLE_LENGTH} characters long`,
      );
    }
    if (title.length > MAX_TITLE_LENGTH) {
      errors.push(
        `'title' must be at most ${MAX_TITLE_LENGTH} characters long`,
      );
    }
  }

  if (status !== undefined && !isValidStatus(status)) {
    errors.push("'status' must be one of: 'todo', 'in_progress', 'done'");
  }

  if (priority !== undefined && !isValidPriority(priority)) {
    errors.push("'priority' must be one of: 'low', 'medium', 'high'");
  }

  const dueDateResult = parseDueDate(rawDueDate);
  if (!dueDateResult.valid && dueDateResult.error) {
    errors.push(dueDateResult.error);
  }

  // Business rule: high-priority tasks must have a due date
  if (priority === "high" && !dueDateResult.iso) {
    errors.push("'dueDate' is required when 'priority' is 'high'");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const value: CreateTaskInput = {
    title: title!,
    description,
    status,
    priority,
    dueDate: dueDateResult.iso,
  };

  return { valid: true, value };
};

export const validateUpdatePayload = (
  body: any,
): { valid: boolean; errors?: string[]; value?: UpdateTaskInput } => {
  const errors: string[] = [];

  const rawTitle = body?.title;
  const rawDescription = body?.description;
  const status = body?.status;
  const priority = body?.priority;
  const rawDueDate = body?.dueDate;

  let title: string | undefined;
  if (rawTitle !== undefined) {
    title = sanitizeText(rawTitle);
    if (!title) {
      errors.push("'title' must be a non-empty string when provided");
    } else {
      if (title.length < MIN_TITLE_LENGTH) {
        errors.push(
          `'title' must be at least ${MIN_TITLE_LENGTH} characters long when provided`,
        );
      }
      if (title.length > MAX_TITLE_LENGTH) {
        errors.push(
          `'title' must be at most ${MAX_TITLE_LENGTH} characters long when provided`,
        );
      }
    }
  }

  const description = sanitizeText(rawDescription);

  if (status !== undefined && !isValidStatus(status)) {
    errors.push("'status' must be one of: 'todo', 'in_progress', 'done'");
  }

  if (priority !== undefined && !isValidPriority(priority)) {
    errors.push("'priority' must be one of: 'low', 'medium', 'high'");
  }

  const dueDateResult = parseDueDate(rawDueDate);
  if (!dueDateResult.valid && dueDateResult.error) {
    errors.push(dueDateResult.error);
  }

  // Business rule: high-priority tasks must have a due date when updating
  if (priority === "high" && !dueDateResult.iso) {
    errors.push("'dueDate' is required when 'priority' is 'high'");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const value: UpdateTaskInput = {
    title,
    description,
    status,
    priority,
    dueDate: dueDateResult.iso,
  };

  return { valid: true, value };
};
