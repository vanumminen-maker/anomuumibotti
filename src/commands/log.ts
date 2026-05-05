import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { db } from '../db';
import dayjs from 'dayjs';

export const logCommandData = new SlashCommandBuilder()
    .setName('log')
    .setDescription('Näyttää anonyymibotin salaisen käyttölokin (Vain ylläpitäjille)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function handleLog(interaction: ChatInputCommandInteraction) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({ content: 'Sinulla ei ole oikeuksia tähän komentoon.', ephemeral: true });
        return;
    }

    const logs = db.prepare('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 25').all() as any[];

    if (logs.length === 0) {
        await interaction.reply({ content: 'Ei lokitapahtumia vielä.', ephemeral: true });
        return;
    }

    let logText = '';
    for (const log of logs) {
        const time = dayjs(log.timestamp).format('DD.MM. HH:mm');
        const snippet = log.content.length > 50 ? log.content.substring(0, 50) + '...' : log.content;
        logText += `**[${time}]** <@${log.user_id}> (${log.action}): ${snippet}\n`;
    }

    const embed = new EmbedBuilder()
        .setTitle('🔒 Salainen käyttöloki')
        .setDescription(logText)
        .setColor('#FF0000');

    await interaction.reply({ embeds: [embed], ephemeral: true });
}
