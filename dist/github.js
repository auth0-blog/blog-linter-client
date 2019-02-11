"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("@octokit/app"));
var rest_1 = __importDefault(require("@octokit/rest"));
var request_1 = __importDefault(require("@octokit/request"));
var webhooks_1 = __importDefault(require("@octokit/webhooks"));
var fs = require('fs');
var path = require('path');
if (!process.env.GITHUB_APP_IDENTIFIER) {
    throw 'No GitHub app identifier specified';
}
if (!process.env.GITHUB_WEBHOOK_SECRET) {
    throw 'No Webhook secret key specified';
}
var appId = parseInt(process.env.GITHUB_APP_IDENTIFIER);
var privateKey = process.env.GITHUB_PRIVATE_KEY;
var webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
if (!privateKey) {
    privateKey = fs.readFileSync(path.join(__dirname, 'private-key.pem'), 'utf-8');
}
var webhooks = new webhooks_1.default({
    secret: process.env.GITHUB_WEBHOOK_SECRET
});
var app = new app_1.default({
    id: appId,
    privateKey: privateKey
});
exports.default = {
    webhooks: webhooks,
    createRestClient: function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getInstallationToken()];
                    case 1:
                        token = _a.sent();
                        rest = new rest_1.default({
                            accept: 'application/vnd.github.v3+json, application/vnd.github.antiope-preview+json',
                            'user-agent': 'octokit/rest.js v16.1.0'
                        });
                        console.log(token);
                        rest.authenticate({
                            type: 'app',
                            token: token.token
                        });
                        return [2 /*return*/, rest];
                }
            });
        });
    },
    getInstallationId: function () {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jwt = app.getSignedJsonWebToken();
                        return [4 /*yield*/, request_1.default('GET /repos/:owner/:repo/installation', {
                                owner: 'elkdanger',
                                repo: 'blog-1',
                                headers: {
                                    authorization: "Bearer " + jwt,
                                    accept: 'application/vnd.github.machine-man-preview+json'
                                }
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.data.id];
                }
            });
        });
    },
    getInstallationToken: function () {
        return __awaiter(this, void 0, void 0, function () {
            var installationId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getInstallationId()];
                    case 1:
                        installationId = _a.sent();
                        return [4 /*yield*/, app.getInstallationAccesToken({ installationId: installationId })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    /**
     * Creates a new check run from a 'check run requested' event object
     * @param {The GitHub client} client
     * @param {The checkrun request object} request
     * @param {The name of the check} name
     * @param {The initial status} status
     */
    createCheckFromRequest: function (client, payload, name, status) {
        if (status === void 0) { status = 'in_progress'; }
        return __awaiter(this, void 0, void 0, function () {
            var checkRunResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.checks.create({
                            repo: payload.repository.name,
                            owner: payload.repository.owner.login,
                            name: name,
                            head_sha: payload.check_suite.head_sha,
                            status: status,
                            started_at: new Date().toISOString()
                        })];
                    case 1:
                        checkRunResult = _a.sent();
                        return [2 /*return*/, checkRunResult];
                }
            });
        });
    }
};
