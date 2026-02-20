"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
exports.router = (0, express_1.Router)();
exports.router.get("/", health_controller_1.getHealth);
