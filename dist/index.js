"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv = __importStar(require("dotenv"));
const anonyymi_1 = require("./commands/anonyymi");
const polli_1 = require("./commands/polli");
const ohje_1 = require("./commands/ohje");
const db_1 = require("./db");
// Ladataan .env paikallisessa testauksessa. Railwayssa käytetään suoraan environment variables.
dotenv.config();
const TOKEN = process.env.TOKEN;
if (!TOKEN) {
    console.error("TOKEN puuttuu. Varmista että se on asetettu.");
    process.exit(1);
}
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
});
client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
    console.log(`Botti käynnistynyt: ${readyClient.user.tag}`);
    const rest = new discord_js_1.REST().setToken(TOKEN);
    try {
        console.log('Päivitetään kauttaviivakomennot (slash commands)...');
        await rest.put(discord_js_1.Routes.applicationCommands(readyClient.user.id), { body: [anonyymi_1.anonyymiCommandData, polli_1.polliCommandData, ohje_1.ohjeCommandData] });
        console.log('Komennot päivitetty onnistuneesti.');
    }
    catch (error) {
        console.error("Virhe komentojen päivityksessä:", error);
    }
    // Tarkistetaan vanhentuneet äänestykset minuutin välein
    setInterval(() => (0, db_1.checkExpiredPolls)(client), 60000);
});
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'anonyymi') {
                await (0, anonyymi_1.handleAnonyymi)(interaction);
            }
            else if (interaction.commandName === 'polli') {
                await (0, polli_1.handlePolli)(interaction);
            }
            else if (interaction.commandName === 'ohje') {
                await (0, ohje_1.handleOhje)(interaction);
            }
        }
        else if (interaction.isButton()) {
            if (interaction.customId.startsWith('poll_vote_')) {
                await (0, polli_1.handlePollButtonInteraction)(interaction);
            }
        }
    }
    catch (e) {
        console.error("Virhe interaktion käsittelyssä:", e);
        if (interaction.isRepliable()) {
            await interaction.reply({ content: 'Tapahtui virhe komennon käsittelyssä.', ephemeral: true }).catch(console.error);
        }
    }
});
client.login(TOKEN);
