import { Client, GatewayIntentBits, REST, Routes, Events } from 'discord.js';
import * as dotenv from 'dotenv';
import { handleAnonyymi, anonyymiCommandData } from './commands/anonyymi';
import { handlePolli, polliCommandData, handlePollButtonInteraction } from './commands/polli';
import { handleOhje, ohjeCommandData } from './commands/ohje';
import { handleLog, logCommandData } from './commands/log';
import { checkExpiredPolls } from './db';

// Ladataan .env paikallisessa testauksessa. Railwayssa käytetään suoraan environment variables.
dotenv.config();

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    console.error("TOKEN puuttuu. Varmista että se on asetettu.");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Botti käynnistynyt: ${readyClient.user.tag}`);
    
    const rest = new REST().setToken(TOKEN);
    try {
        console.log('Päivitetään kauttaviivakomennot (slash commands)...');
        await rest.put(
            Routes.applicationCommands(readyClient.user.id),
            { body: [anonyymiCommandData, polliCommandData, ohjeCommandData, logCommandData] },
        );
        console.log('Komennot päivitetty onnistuneesti.');
    } catch (error) {
        console.error("Virhe komentojen päivityksessä:", error);
    }
    
    // Tarkistetaan vanhentuneet äänestykset minuutin välein
    setInterval(() => checkExpiredPolls(client), 60000);
});

client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'anonyymi') {
                await handleAnonyymi(interaction);
            } else if (interaction.commandName === 'polli') {
                await handlePolli(interaction);
            } else if (interaction.commandName === 'ohje') {
                await handleOhje(interaction);
            } else if (interaction.commandName === 'log') {
                await handleLog(interaction);
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('poll:vote:')) {
                await handlePollButtonInteraction(interaction);
            }
        }
    } catch (e) {
        console.error("Virhe interaktion käsittelyssä:", e);
        if (interaction.isRepliable()) {
            await interaction.reply({ content: 'Tapahtui virhe komennon käsittelyssä.', ephemeral: true }).catch(console.error);
        }
    }
});

client.login(TOKEN);
