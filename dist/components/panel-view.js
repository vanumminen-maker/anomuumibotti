"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const nhandler_1 = require("nhandler");
const base_component_1 = __importDefault(require("../classes/base-component"));
const calendar_1 = __importDefault(require("../classes/entities/calendar"));
class default_1 extends base_component_1.default {
    constructor() {
        super(...arguments);
        this.customId = "panel-view";
    }
    async run(interaction) {
        if (!interaction.guild)
            throw new nhandler_1.ComponentError("This button can only be used in a server.");
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
