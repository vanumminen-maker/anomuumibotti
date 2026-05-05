"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ohjeCommandData = void 0;
exports.handleOhje = handleOhje;
const discord_js_1 = require("discord.js");
exports.ohjeCommandData = new discord_js_1.SlashCommandBuilder()
    .setName('ohje')
    .setDescription('Näyttää ohjeet botin käyttöön');
async function handleOhje(interaction) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('🛠️ Anonyymiäänestys-botin Ohje')
        .setDescription('Tämä ohje näkyy vain sinulle.')
        .setColor('#0099ff')
        .addFields({ name: '/anonyymi', value: 'Kirjoita kenttään julkaistava teksti. Botti julkaisee sen kanavalla siten, ettei lähettäjää näy.' }, { name: '/polli', value: 'Luo anonyymi äänestys. Voit määrittää kysymyksen, keston tunteina sekä vaihtoehdot (4 pakollista, yhteensä max 10). Äänet pidetään täydellisen anonyymeinä. Tulokset julkaistaan automaattisesti äänestyksen päätyttyä.' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
}
