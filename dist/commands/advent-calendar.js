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
        this.name = "advent-calendar";
        this.description = "Show your advent calendar!";
    }
    async run(interaction) {
        const embed = new discord_js_1.EmbedBuilder();
        embed.setAuthor({
            name: `@${interaction.user.username}'s Advent Calendar`,
            iconURL: this.client.user.displayAvatarURL({ size: 256 }),
        });
        const calendar = await calendar_1.default.getOrCreate(interaction.user.id);
        await interaction.reply({ embeds: [embed], components: calendar.getRows(), ephemeral: true });
    }
}
exports.default = default_1;
