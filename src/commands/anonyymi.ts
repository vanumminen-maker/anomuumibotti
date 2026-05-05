import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { db } from '../db';

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
    
    // Logitetaan viesti
    db.prepare('INSERT INTO logs (user_id, action, content, timestamp) VALUES (?, ?, ?, ?)').run(
        interaction.user.id, 'anonyymiviesti', viesti || '', Date.now()
    );

    // Vastataan käyttäjälle vain hänelle näkyvästi
    await interaction.reply({ content: 'Viestisi on lähetetty anonyymisti!', ephemeral: true });
    
    // Lähetetään viesti kanavalle ilman tietoa lähettäjästä
    if (interaction.channel) {
        await (interaction.channel as any).send(`**Anonyymi viesti:**\n${viesti}`);
    }
}
