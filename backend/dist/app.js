"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const health_routes_1 = require("./routes/health.routes");
const tasks_routes_1 = require("./routes/tasks.routes");
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)((tokens, req, res) => {
        const method = tokens.method(req, res);
        const url = tokens.url(req, res);
        const responseTime = tokens["response-time"](req, res);
        return `[${method}] ${url} - Execution time: ${responseTime}ms`;
    }));
    app.use(express_1.default.json());
    app.use("/health", health_routes_1.router);
    app.use("/tasks", tasks_routes_1.router);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
