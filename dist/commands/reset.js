"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const base_command_1 = __importDefault(require("../classes/base-command"));
const calendar_1 = __importDefault(require("../classes/entities/calendar"));
class default_1 extends base_command_1.default {
    constructor() {
        super(...arguments);
        this.name = "reset-calendars";
        this.description = "Reset everyone's advent calendar.";
        this.defaultMemberPermissions = discord_js_1.PermissionsBitField.Flags.Administrator;
    }
    async run(interaction) {
        const calendars = await calendar_1.default.find();
        for (const calendar of calendars) {
            await calendar.reset();
        }
        await interaction.reply({
            content: "Reset everyone's advent calendar.",
            ephemeral: true,
        });
    }
}
exports.default = default_1;
