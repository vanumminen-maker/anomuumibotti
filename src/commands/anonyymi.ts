import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const anonyymiCommandData = new SlashCommandBuilder()
    .setName('anonyymi')
    .setDescription('Lähettää anonyymin viestin tai kysymyksen kanavalle')
    .addStringOption(option => 
        option.setName('viesti')
            .setDescription('Viesti jonka haluat julkaista anonyymisti')
            .setRequired(true)
    );

export async function handleAnonyymi(interaction: ChatInputCommandInteraction) {
    const viesti = interaction.options.getString('viesti');
    
    // Vastataan käyttäjälle vain hänelle näkyvästi
    await interaction.reply({ content: 'Viestisi on lähetetty anonyymisti!', ephemeral: true });
    
    // Lähetetään viesti kanavalle ilman tietoa lähettäjästä
    if (interaction.channel) {
        await (interaction.channel as any).send(`**Anonyymi viesti:**\n${viesti}`);
    }
}
