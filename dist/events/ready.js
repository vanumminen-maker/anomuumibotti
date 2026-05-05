"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = __importDefault(require("../classes/client"));
const logger_1 = __importDefault(require("../classes/logger"));
class default_1 {
    constructor() {
        this.name = "ready";
    }
    async run() {
        let message = `The bot is ready in ${Date.now() - this.client.initDate}ms as ${this.client.user?.tag}.`;
        logger_1.default.startup(message);
        if (this.client.config.status) {
            this.client.user.setPresence({
                status: "idle",
                activities: [{ name: this.client.config.status, type: discord_js_1.ActivityType.Watching }],
            });
        }
        client_1.default.commandHandler.updateApplicationCommands();
        logger_1.default.startup("Updated application commands.");
    }
}
exports.default = default_1;
