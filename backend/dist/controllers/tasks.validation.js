"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePayload = exports.validateCreatePayload = exports.sanitizeText = exports.parseDueDate = exports.isValidPriority = exports.isValidStatus = void 0;
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;
const isValidStatus = (status) => {
    return status === "todo" || status === "in_progress" || status === "done";
};
exports.isValidStatus = isValidStatus;
const isValidPriority = (priority) => {
    return priority === "low" || priority === "medium" || priority === "high";
};
exports.isValidPriority = isValidPriority;
const parseDueDate = (value) => {
    if (value === undefined || value === null || value === "") {
        return { valid: true, iso: undefined };
    }
    if (typeof value !== "string") {
        return {
            valid: false,
            error: "'dueDate' must be a string in ISO format (YYYY-MM-DD or full timestamp)",
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
exports.parseDueDate = parseDueDate;
const sanitizeText = (value) => {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
};
exports.sanitizeText = sanitizeText;
const validateCreatePayload = (body) => {
    const errors = [];
    const rawTitle = body?.title;
    const rawDescription = body?.description;
    const status = body?.status;
    const priority = body?.priority;
    const rawDueDate = body?.dueDate;
    const title = (0, exports.sanitizeText)(rawTitle);
    const description = (0, exports.sanitizeText)(rawDescription);
    if (!title) {
        errors.push("'title' is required and must be a non-empty string");
    }
    else {
        if (title.length < MIN_TITLE_LENGTH) {
            errors.push(`'title' must be at least ${MIN_TITLE_LENGTH} characters long`);
        }
        if (title.length > MAX_TITLE_LENGTH) {
            errors.push(`'title' must be at most ${MAX_TITLE_LENGTH} characters long`);
        }
    }
    if (status !== undefined && !(0, exports.isValidStatus)(status)) {
        errors.push("'status' must be one of: 'todo', 'in_progress', 'done'");
    }
    if (priority !== undefined && !(0, exports.isValidPriority)(priority)) {
        errors.push("'priority' must be one of: 'low', 'medium', 'high'");
    }
    const dueDateResult = (0, exports.parseDueDate)(rawDueDate);
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
    const value = {
        title: title,
        description,
        status,
        priority,
        dueDate: dueDateResult.iso,
    };
    return { valid: true, value };
};
exports.validateCreatePayload = validateCreatePayload;
const validateUpdatePayload = (body) => {
    const errors = [];
    const rawTitle = body?.title;
    const rawDescription = body?.description;
    const status = body?.status;
    const priority = body?.priority;
    const rawDueDate = body?.dueDate;
    let title;
    if (rawTitle !== undefined) {
        title = (0, exports.sanitizeText)(rawTitle);
        if (!title) {
            errors.push("'title' must be a non-empty string when provided");
        }
        else {
            if (title.length < MIN_TITLE_LENGTH) {
                errors.push(`'title' must be at least ${MIN_TITLE_LENGTH} characters long when provided`);
            }
            if (title.length > MAX_TITLE_LENGTH) {
                errors.push(`'title' must be at most ${MAX_TITLE_LENGTH} characters long when provided`);
            }
        }
    }
    const description = (0, exports.sanitizeText)(rawDescription);
    if (status !== undefined && !(0, exports.isValidStatus)(status)) {
        errors.push("'status' must be one of: 'todo', 'in_progress', 'done'");
    }
    if (priority !== undefined && !(0, exports.isValidPriority)(priority)) {
        errors.push("'priority' must be one of: 'low', 'medium', 'high'");
    }
    const dueDateResult = (0, exports.parseDueDate)(rawDueDate);
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
    const value = {
        title,
        description,
        status,
        priority,
        dueDate: dueDateResult.iso,
    };
    return { valid: true, value };
};
exports.validateUpdatePayload = validateUpdatePayload;
