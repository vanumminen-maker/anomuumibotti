"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const base_command_1 = __importDefault(require("../classes/base-command"));
class default_1 extends base_command_1.default {
    constructor() {
        super(...arguments);
        this.name = "panel";
        this.description = "Create a panel for the advent calendar.";
        this.defaultMemberPermissions = discord_js_1.PermissionsBitField.Flags.Administrator;
    }
    async run(interaction) {
        const embed = new discord_js_1.EmbedBuilder();
        embed.setAuthor({
            name: this.client.config.panel.embed_title,
            iconURL: this.client.user.displayAvatarURL({ size: 256 }),
        });
        if (this.client.config.panel.embed_description) {
            embed.setDescription(this.client.config.panel.embed_description);
        }
        if (this.client.config.panel.image_url) {
            embed.setImage(this.client.config.panel.image_url);
        }
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setStyle(discord_js_1.ButtonStyle.Secondary).setLabel(this.client.config.panel.button_label).setCustomId("panel-view"));
        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: "Panel created.", ephemeral: true });
    }
}
exports.default = default_1;
