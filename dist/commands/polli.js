"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polliCommandData = void 0;
exports.handlePolli = handlePolli;
exports.handlePollButtonInteraction = handlePollButtonInteraction;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const nanoid_1 = require("nanoid");
exports.polliCommandData = new discord_js_1.SlashCommandBuilder()
    .setName('polli')
    .setDescription('Luo anonyymi äänestys')
    .addStringOption(option => option.setName('kysymys').setDescription('Äänestyksen kysymys').setRequired(true))
    .addStringOption(option => option.setName('vaihtoehto1').setDescription('Vaihtoehto 1').setRequired(true))
    .addStringOption(option => option.setName('vaihtoehto2').setDescription('Vaihtoehto 2').setRequired(true))
    .addStringOption(option => option.setName('vaihtoehto3').setDescription('Vaihtoehto 3').setRequired(true))
    .addStringOption(option => option.setName('vaihtoehto4').setDescription('Vaihtoehto 4').setRequired(true))
    .addNumberOption(option => option.setName('kesto_tunteina').setDescription('Äänestyksen kesto tunteina (oletus 24h)').setRequired(false));
for (let i = 5; i <= 10; i++) {
    exports.polliCommandData.addStringOption(option => option.setName(`vaihtoehto${i}`).setDescription(`Vaihtoehto ${i}`));
}
async function handlePolli(interaction) {
    const kysymys = interaction.options.getString('kysymys');
    const kesto = interaction.options.getNumber('kesto_tunteina') || 24;
    const expiration = Date.now() + Math.floor(kesto * 3600 * 1000);
    const options = [];
    for (let i = 1; i <= 10; i++) {
        const val = interaction.options.getString(`vaihtoehto${i}`);
        if (val)
            options.push(val);
    }
    const pollId = (0, nanoid_1.nanoid)(10);
    // Jos olemme palvelimella tuetussa viestissä, hankitaan viestin kanavatiedot ja lähetetään poll erillisenä, 
    // tai vastataan interaktioon
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📊 ' + kysymys)
        .setDescription(`Anonyymi äänestys.\nAikaa äänestää: **${kesto} tuntia**`)
        .setColor('#0099ff');
    let optionsText = '';
    options.forEach((opt, idx) => {
        optionsText += `**${idx + 1}.** ${opt} - 0 ääntä\n`;
    });
    embed.addFields({ name: 'Vaihtoehdot:', value: optionsText });
    const rows = [];
    for (let i = 0; i < options.length; i += 5) {
        const chunk = options.slice(i, i + 5);
        const row = new discord_js_1.ActionRowBuilder();
        chunk.forEach((_, index) => {
            const actualIndex = i + index;
            row.addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(`poll:vote:${pollId}:${actualIndex}`)
                .setLabel(`${actualIndex + 1}`)
                .setStyle(discord_js_1.ButtonStyle.Primary));
        });
        rows.push(row);
    }
    const message = await interaction.reply({ embeds: [embed], components: rows, fetchReply: true });
    db_1.db.prepare('INSERT INTO logs (user_id, action, content, timestamp) VALUES (?, ?, ?, ?)').run(interaction.user.id, 'polli', kysymys || '', Date.now());
    try {
        db_1.db.prepare('INSERT INTO polls (id, message_id, channel_id, question, options_json, expires_at) VALUES (?, ?, ?, ?, ?, ?)').run(pollId, message.id, interaction.channelId, kysymys, JSON.stringify(options), expiration);
    }
    catch (e) {
        console.error("Virhe tallennuksessa:", e);
        await interaction.followUp({ content: "Varoitus: Äänestyksen tallentaminen tietokantaan epäonnistui. Tämä johtuu todennäköisesti luku/kirjoitusoikeuksista.", ephemeral: true });
    }
}
async function handlePollButtonInteraction(interaction) {
    const parts = interaction.customId.split(':');
    const pollId = parts[2];
    const optionIndex = parseInt(parts[3], 10);
    const poll = db_1.db.prepare('SELECT * FROM polls WHERE id = ? AND active = 1').get(pollId);
    if (!poll) {
        await interaction.reply({ content: 'Tämä äänestys on jo päättynyt.', ephemeral: true });
        return;
    }
    db_1.db.prepare(`
        INSERT INTO votes (poll_id, user_id, option_index) 
        VALUES (?, ?, ?) 
        ON CONFLICT(poll_id, user_id) DO UPDATE SET option_index=excluded.option_index
    `).run(pollId, interaction.user.id, optionIndex);
    const votes = db_1.db.prepare('SELECT option_index, COUNT(*) as count FROM votes WHERE poll_id = ? GROUP BY option_index').all(pollId);
    const options = JSON.parse(poll.options_json);
    let optionsText = '';
    options.forEach((opt, idx) => {
        const count = votes.find(v => v.option_index === idx)?.count || 0;
        optionsText += `**${idx + 1}.** ${opt} - ${count} ääntä\n`;
    });
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📊 ' + poll.question)
        .setDescription(`Anonyymi äänestys.\nVoit muuttaa ääntäsi painamalla eri painiketta.`)
        .setColor('#0099ff')
        .addFields({ name: 'Vaihtoehdot:', value: optionsText });
    await interaction.update({ embeds: [embed] });
}
