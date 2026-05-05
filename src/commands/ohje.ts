import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const ohjeCommandData = new SlashCommandBuilder()
    .setName('ohje')
    .setDescription('Näyttää ohjeet botin käyttöön');

export async function handleOhje(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🛠️ Anonyymiäänestys-botin Ohje')
        .setDescription('Tämä ohje näkyy vain sinulle.')
        .setColor('#0099ff')
        .addFields(
            { name: '/anonyymi', value: 'Kirjoita kenttään julkaistava teksti. Botti julkaisee sen kanavalla siten, ettei lähettäjää näy.' },
            { name: '/polli', value: 'Luo anonyymi äänestys. Voit määrittää kysymyksen, keston tunteina sekä vaihtoehdot (4 pakollista, yhteensä max 10). Äänet pidetään täydellisen anonyymeinä. Tulokset julkaistaan automaattisesti äänestyksen päätyttyä.' }
        );

    await interaction.reply({ embeds: [embed], ephemeral: true });
}
