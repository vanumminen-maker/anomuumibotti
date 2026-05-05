"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCommandData = void 0;
exports.handleLog = handleLog;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const dayjs_1 = __importDefault(require("dayjs"));
exports.logCommandData = new discord_js_1.SlashCommandBuilder()
    .setName('log')
    .setDescription('Näyttää anonyymibotin salaisen käyttölokin (Vain ylläpitäjille)')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function handleLog(interaction) {
    if (!interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
        await interaction.reply({ content: 'Sinulla ei ole oikeuksia tähän komentoon.', ephemeral: true });
        return;
    }
    const logs = db_1.db.prepare('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 25').all();
    if (logs.length === 0) {
        await interaction.reply({ content: 'Ei lokitapahtumia vielä.', ephemeral: true });
        return;
    }
    let logText = '';
    for (const log of logs) {
        const time = (0, dayjs_1.default)(log.timestamp).format('DD.MM. HH:mm');
        const snippet = log.content.length > 50 ? log.content.substring(0, 50) + '...' : log.content;
        logText += `**[${time}]** <@${log.user_id}> (${log.action}): ${snippet}\n`;
    }
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('🔒 Salainen käyttöloki')
        .setDescription(logText)
        .setColor('#FF0000');
    await interaction.reply({ embeds: [embed], ephemeral: true });
}
