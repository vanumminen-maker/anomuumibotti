"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anonyymiCommandData = void 0;
exports.handleAnonyymi = handleAnonyymi;
const discord_js_1 = require("discord.js");
exports.anonyymiCommandData = new discord_js_1.SlashCommandBuilder()
    .setName('anonyymi')
    .setDescription('Lähettää anonyymin viestin tai kysymyksen kanavalle')
    .addStringOption(option => option.setName('viesti')
    .setDescription('Viesti jonka haluat julkaista anonyymisti')
    .setRequired(true));
async function handleAnonyymi(interaction) {
    const viesti = interaction.options.getString('viesti');
    // Vastataan käyttäjälle vain hänelle näkyvästi
    await interaction.reply({ content: 'Viestisi on lähetetty anonyymisti!', ephemeral: true });
    // Lähetetään viesti kanavalle ilman tietoa lähettäjästä
    if (interaction.channel) {
        await interaction.channel.send(`**Anonyymi viesti:**\n${viesti}`);
    }
}
