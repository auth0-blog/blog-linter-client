"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint no-console: off */
var github_1 = __importDefault(require("./github"));
// Register all hooks here
github_1.default.webhooks.on('check_suite.requested', require('./hooks/check-suite-request'));
module.exports = require('http').createServer(github_1.default.webhooks.middleware);
