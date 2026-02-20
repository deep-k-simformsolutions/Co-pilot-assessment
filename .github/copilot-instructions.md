# GitHub Copilot Instructions for `ai-dev-eval-backend`

These instructions tell Copilot how to behave in this workspace. The project contains:

- A **Node.js + Express + TypeScript backend** for an AI-Assisted Developer Evaluation Test.
- A **minimal Angular frontend** that consumes either a mock API or the real backend.

## Backend Project Overview

- Runtime: **Node.js 18+**
- Framework: **Express** with **TypeScript**
- Entry point (dev): `src/server.ts`
- Express app factory: `src/app.ts`
- Health check endpoint: `GET /health` → returns `{ "status": "ok" }`
- Environment config: `.env` (see `.env.example`)
- Build output: `dist/`
- Package manager: `npm`

Backend project structure (intended):

```text
backend/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── controllers/        # Request handlers
│   │   └── health.controller.ts
│   ├── routes/             # API routes
│   │   └── health.routes.ts
│   ├── middleware/         # Custom middleware
│   │   └── errorHandler.ts
│   └── models/             # Data models (empty - for user implementation)
├── .env                    # Environment variables (local, ignored from VCS)
├── .env.example            # Example env template
├── package.json
├── tsconfig.json           # TypeScript configuration
└── nodemon.json            # Nodemon configuration
```

## Environment & Scripts

Environment variables (from `.env`):

- `PORT` (default `3000`)

Expected `npm` scripts:

- `npm run dev` – Start development server with Nodemon & ts-node
- `npm run build` – Compile TypeScript → JavaScript into `dist/`
- `npm start` – Run production build from `dist/server.js`

## How Copilot Should Help (Backend)

### General Behavior

- Prefer **TypeScript** (`.ts`) for all new source files.
- Use **Express 4 style** routing (`Router`, `app.use`, etc.).
- Use **async/await** for any asynchronous logic.
- Keep responses **JSON-based** for API endpoints.
- Keep implementations **simple and explicit**, favoring readability over cleverness.

### Backend Task Focus

This backend is for a **task management API**. Copilot should assist with:

1. **Routes (`src/routes/`)**
   - Define RESTful routes under `/tasks` (e.g. `/tasks`, `/tasks/:id`).
   - Use a dedicated router file per resource, e.g. `tasks.routes.ts`.
   - Mount routes in `app.ts` using `app.use('/tasks', tasksRouter)`.

2. **Controllers (`src/controllers/`)**
   - Implement route handlers in controller files (e.g. `tasks.controller.ts`).
   - Keep controllers **thin**: parse/validate request, call service/logic layer (if present), send response.
   - Return appropriate HTTP status codes: `200/201/204/400/404/500`.

3. **Models (`src/models/`)**
   - Define TypeScript interfaces/types for domain objects (e.g. `Task`, `TaskStatus`).
   - Use in-memory arrays/maps for storage (no database).
   - Keep all in-memory state in a dedicated module (e.g. `taskStore.ts` or `tasks.repository.ts`).

4. **Middleware (`src/middleware/`)**
   - Use `errorHandler.ts` as the global error handler (`app.use(errorHandler)`).
   - For validation, prefer small, focused middleware functions (e.g. `validateTaskPayload`).

5. **Validation and Error Handling**
   - Validate request bodies and params before using them.
   - On validation failure, respond with `400` and a JSON error like `{ "error": "message" }`.
   - For unexpected errors, pass errors to `next(err)` so `errorHandler` can respond.

### Coding Style & Conventions

- Use **named exports** for controllers, routers, and models.
- Use **camelCase** for variables and functions, **PascalCase** for types and interfaces.
- Prefer **immutable patterns** where simple (e.g. avoid mutating parameters).
- Include **minimal JSDoc** or comments only when behavior is non-obvious.

### Example Patterns for Copilot

#### Health Route

- File: `src/controllers/health.controller.ts`
- Behavior: return a static JSON object to confirm the server is running.

```ts
import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response): void => {
  res.json({ status: 'ok' });
};
```

- File: `src/routes/health.routes.ts`

```ts
import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';

export const router = Router();

router.get('/', getHealth);
```

#### Error Handler

- File: `src/middleware/errorHandler.ts`

```ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
};
```

### Task Management API (Guidance for Copilot)

When the user asks Copilot to implement the task management API, it should:

1. **Create models in `src/models/`**

   - `Task` interface with fields like `id`, `title`, `description?`, `status`, `createdAt`, `updatedAt`.
   - `TaskStatus` union type (e.g. `'todo' | 'in_progress' | 'done'`).

2. **Create an in-memory store**

   - A module that maintains an array or map of `Task` objects.
   - Functions like `createTask`, `getTaskById`, `updateTask`, `deleteTask`, `listTasks`.

3. **Create controllers (`tasks.controller.ts`)**

   - Implement handlers that call the store functions and respond with JSON.
   - Use proper status codes:
     - `201` for created
     - `200` for successful fetch/update
     - `204` for successful delete without body
     - `404` when task not found

4. **Create routes (`tasks.routes.ts`)**

   - `GET /tasks` – list all tasks
   - `GET /tasks/:id` – get a single task
   - `POST /tasks` – create a task
   - `PUT /tasks/:id` – replace/update a task
   - `PATCH /tasks/:id` – partial update (optional)
   - `DELETE /tasks/:id` – delete a task

5. **Add validation middleware**

   - Ensure `title` is a non-empty string.
   - Ensure `status` is one of the allowed values if provided.
   - Respond with `400` and helpful error messages when validation fails.

### Testing and Verification

Copilot should help with **basic tests** or test harnesses, for example:

- A simple script or test that starts the server and calls `GET /health`.
- Optionally, tests for error paths and invalid payloads.

When asked, Copilot should:

- Prefer using a lightweight test setup (e.g. Jest + supertest) if tests are needed.
- Or provide a simple `curl` example:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{"status":"ok"}
```

## How to Extend These Instructions

The user may refine or extend these instructions. Copilot should:

- Follow any **more specific instructions** in this file over general behaviors.
- Keep new code **consistent** with established patterns and file structure.
- Avoid introducing new major dependencies without being explicitly asked.

If something is ambiguous, Copilot should prefer **simpler, more explicit** solutions that are easy for a human developer to understand and modify.

---

## Frontend Project Overview (Angular)

The workspace also contains a **minimal Angular application** used for the same AI-Assisted Developer Evaluation Test.

- Runtime: **Node.js 18+**
- Framework: **Angular** (generated/managed via Angular CLI)
- Dev server: `npm start` (proxied to Angular CLI `ng serve`)
- Default dev URL: `http://localhost:4200`

Frontend project structure (intended):

```text
frontend/
├── src/
│   ├── app/
│   │   ├── app.module.ts           # Main module
│   │   ├── app-routing.module.ts   # Routing configuration
│   │   ├── app.component.ts        # Root component
│   │   ├── app.component.html      # Root template
│   │   └── components/             # Feature components
│   │       ├── home/               # Home component
│   │       └── health/             # Health component
│   ├── index.html                  # Main HTML
│   ├── main.ts                     # Application entry point
│   └── styles.css                  # Global styles
├── angular.json                    # Angular configuration
├── package.json
└── tsconfig.json                   # TypeScript configuration
```

Expected frontend scripts (from `frontend/package.json`):

- `npm start` – Start the Angular development server.
- `npm run build` – Build the project for production.
- `npm test` – Run unit tests (if implemented).

Copilot should assume:

- Dev server runs on `http://localhost:4200`.
- Backend runs on either:
   - **Mock API:** `http://localhost:3001` (frontend-only candidates), or
   - **Real backend:** `http://localhost:3000` (full-stack candidates).

---

## How Copilot Should Help (Frontend)

### General Behavior

- Prefer **Angular best practices**:
   - Use **TypeScript** across the frontend.
   - Use **Angular modules**, **components**, **services**, and **routing** idiomatically.
   - Use **Reactive Forms** for complex forms (create/edit task forms).
   - Use **HttpClient** for API calls.
- Keep components **presentational and focused**; move HTTP logic into **services**.
- Avoid adding heavy UI libraries unless explicitly requested; use simple CSS/Angular templates.

### API Integration Modes

Copilot must respect two possible API backends:

1. **Frontend-only candidates – Mock API**

    - Mock API lives under `mock-api/` and runs at `http://localhost:3001`.
    - Workflow:
       - Start mock API:

          ```bash
          cd mock-api
          npm install
          npm start
          ```

       - Start frontend:

          ```bash
          cd frontend
          npm start
          ```

    - Configure task service base URL: `http://localhost:3001`.
    - Documentation is in `../mock-api/README.md`; Copilot should follow any endpoint contracts defined there when known.

2. **Full-stack candidates – Real backend**

    - Backend lives under `backend/` and runs at `http://localhost:3000` via `npm run dev`.
    - Workflow:
       - Start backend:

          ```bash
          cd backend
          npm run dev
          ```

       - Start frontend:

          ```bash
          cd frontend
          npm start
          ```

    - Configure task service base URL: `http://localhost:3000`.

Copilot should ideally centralize the base URL in a single place (e.g. environment configuration or a constant) to make switching between mock and real backend easy.

---

## Frontend Task Management UI Focus

The frontend should present and manage tasks using the backend or mock API.

Copilot should help with:

1. **Task Interfaces and Types**

    - Mirror backend `Task` and `TaskStatus` shapes in the frontend, e.g.:

    ```ts
    // frontend/src/app/models/task.model.ts
    export type TaskStatus = 'todo' | 'in_progress' | 'done';

    export interface Task {
       id: string;
       title: string;
       description?: string;
       status: TaskStatus;
       createdAt: string; // ISO string
       updatedAt: string; // ISO string
    }
    ```

2. **Task Service for HTTP Calls**

    - Create a dedicated service file, e.g. `frontend/src/app/services/task.service.ts`:

    - Use `HttpClient` injected via constructor.
    - Expose methods like:
       - `getTasks()` → `Observable<Task[]>`
       - `getTask(id: string)` → `Observable<Task>`
       - `createTask(payload: Partial<Task>)` → `Observable<Task>`
       - `updateTask(id: string, payload: Partial<Task>)` → `Observable<Task>`
       - `deleteTask(id: string)` → `Observable<void>` or `Observable<unknown>`
    - Use a centralized `API_BASE_URL` constant or environment variable to point to `http://localhost:3001` or `http://localhost:3000`.

3. **Components and Routing**

    - Use `app-routing.module.ts` to configure routes, e.g.:
       - `/` → Home component.
       - `/health` → Health component (pings backend `/health`).
       - `/tasks` → Task list component.
       - `/tasks/new` → Task create component (or reuse a form component).
       - `/tasks/:id` → Task details/edit component.

    - Place feature components under `src/app/components/`, e.g.:
       - `components/home/`
       - `components/health/`
       - `components/tasks/` (list, detail, form subcomponents as needed).

4. **Forms and Validation**

    - Prefer Angular **Reactive Forms** for task create/edit.
    - Validate fields consistent with backend requirements:
       - `title` required, non-empty string.
       - `status` must be one of the allowed `TaskStatus` values.
    - Display simple validation messages near form controls (e.g. "Title is required").

5. **Loading and Error States**

    - In components that call APIs, maintain flags like:
       - `isLoading: boolean`.
       - `error: string | null`.
    - Show loading spinners or simple text (e.g. "Loading tasks...") while requests are in progress.
    - Show error messages if an HTTP call fails, using friendly text derived from backend error responses where possible.

6. **Display and UX**

    - Display tasks in a clear, user-friendly way (tables or cards are both acceptable):
       - Show title, status, and optionally description and timestamps.
       - Include controls for edit/delete where relevant.
    - Keep global styles minimal; prefer component-level templates and CSS for layout.

---

## Frontend Coding Style & Conventions

- Use **Angular style guide** conventions where practical:
   - Suffix components with `Component` (e.g. `TaskListComponent`).
   - Suffix services with `Service` (e.g. `TaskService`).
   - Keep modules cohesive (e.g. a feature module for tasks if the project grows).
- Use **RxJS** observables returned by `HttpClient` and subscribe in components (or use `async` pipe where appropriate).
- Use **TypeScript interfaces** instead of `any`.
- Prefer smaller, reusable components over large, monolithic ones.
- Avoid global state management libraries unless explicitly requested; local component and service state is enough for this exercise.

---

## Full-Stack Workflows

When both backend and frontend are in use, Copilot should:

- Keep **contract alignment** between backend and frontend models:
   - If backend `Task` changes, update frontend `Task` interface accordingly.
- Ensure **CORS** is enabled on the backend (`app.use(cors())` is already present in `backend/src/app.ts`).
- Encourage simple end-to-end checks:
   - Use `/health` endpoint from the frontend `Health` component to verify connectivity.
   - Use `/tasks` endpoints from the task service to list/create/update/delete tasks.
- Prefer explicit error handling and logging to make debugging easier for the candidate.

If something is ambiguous, Copilot should again prefer **simpler, more explicit** implementations that are easy to read and modify, following the patterns described for both backend and frontend.
