"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.deactivatePoll = deactivatePoll;
exports.checkExpiredPolls = checkExpiredPolls;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
exports.db = new better_sqlite3_1.default('data.db');
exports.db.pragma('journal_mode = WAL');
// Luodaan taulut jos niitä ei ole olemassa
exports.db.exec(`
  CREATE TABLE IF NOT EXISTS polls (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    question TEXT NOT NULL,
    options_json TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    active INTEGER DEFAULT 1
  );
`);
exports.db.exec(`
  CREATE TABLE IF NOT EXISTS votes (
    poll_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    option_index INTEGER NOT NULL,
    PRIMARY KEY (poll_id, user_id)
  );
`);
function deactivatePoll(id) {
    exports.db.prepare('UPDATE polls SET active = 0 WHERE id = ?').run(id);
}
async function checkExpiredPolls(client) {
    const now = Date.now();
    const expiredPolls = exports.db.prepare('SELECT * FROM polls WHERE active = 1 AND expires_at <= ?').all(now);
    for (const poll of expiredPolls) {
        deactivatePoll(poll.id);
        try {
            const channel = await client.channels.fetch(poll.channel_id);
            if (channel) {
                const message = await channel.messages.fetch(poll.message_id);
                if (message) {
                    const votes = exports.db.prepare('SELECT option_index, COUNT(*) as count FROM votes WHERE poll_id = ? GROUP BY option_index').all(poll.id);
                    const options = JSON.parse(poll.options_json);
                    const totalVotes = votes.reduce((acc, v) => acc + v.count, 0);
                    let resultText = `**Äänestys on päättynyt!**\nKysymys: ${poll.question}\n\n**Tulokset:**\n`;
                    for (let i = 0; i < options.length; i++) {
                        const count = votes.find(v => v.option_index === i)?.count || 0;
                        const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
                        resultText += `${options[i]}: ${count} ääntä (${percentage}%)\n`;
                    }
                    resultText += `\nYhteensä ääniä: ${totalVotes}`;
                    await message.edit({ components: [] });
                    await message.reply(resultText);
                }
            }
        }
        catch (e) {
            console.error(`Vanhentuneen äänestyksen päättäminen epäonnistui (poll id: ${poll.id})`, e);
        }
    }
}
