"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const nhandler_1 = require("nhandler");
const base_component_1 = __importDefault(require("../classes/base-component"));
const calendar_1 = __importDefault(require("../classes/entities/calendar"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
class default_1 extends base_component_1.default {
    constructor() {
        super(...arguments);
        this.customId = "open";
    }
    async run(interaction) {
        if (!interaction.guild)
            throw new nhandler_1.ComponentError("This button can only be used in a server.");
        const idx = parseInt(interaction.customId.split("-")[1]);

        // Check if it's time to open the door
        const now = (0, dayjs_1.default)().tz("Europe/Helsinki");
        // Month is 0-indexed, so 11 is December
        const unlockDate = (0, dayjs_1.default)().tz("Europe/Helsinki").month(11).date(idx + 1).startOf('day').add(1, 'minute');

        if (now.isBefore(unlockDate)) {
            throw new nhandler_1.ComponentError(`Tämä luukku aukeaa joulukuun ${idx + 1}. päivä kello 00:01!`);
        }

        const day = this.client.config.calendar.find((c) => c.day === idx + 1);
        if (!day) {
            throw new nhandler_1.ComponentError(`No reward is configured for day ${idx + 1}.`);
        }
        const calendar = await calendar_1.default.getOrCreate(interaction.user.id);
        if (calendar.isDayOpen(idx))
            throw new nhandler_1.ComponentError("You have already claimed this reward.");
        const reward = day.rewards[Math.floor(Math.random() * day.rewards.length)];
        const rewardContent = await this.grantReward(day, reward, interaction);
        const embed = new discord_js_1.EmbedBuilder();
        embed.setAuthor({
            name: "Luukku avattu!",
            iconURL: this.client.user.displayAvatarURL({ size: 256 }),
        });

        let description = `Olet avannut luukun ${idx + 1}!\n`;
        if (rewardContent) {
            description += `\n${rewardContent}`;
        } else {
            description += `**Sait: ${reward.label}!**`;
        }

        embed.setDescription(description);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        calendar.setClaimed(idx);
    }
    async grantReward(day, reward, interaction) {
        let guild = interaction.guild;
        // random reward from day.rewards
        if (reward.type === "role") {
            let role = await guild.roles.fetch(reward.roleId).catch(() => null);
            if (!role) {
                throw new nhandler_1.ComponentError(`Role ${reward.roleId} could not be found.`);
            }
            let member = await guild.members.fetch(interaction.user.id).catch(() => null);
            if (!member) {
                throw new nhandler_1.ComponentError("Member not found.");
            }
            await member.roles.add(role).catch((err) => {
                throw new nhandler_1.ComponentError(`Failed to add role: ${err.message}`);
            });
        }
        else if (reward.type === "channel_log") {
            let contentWithPlaceholders = reward.content
                .replace(new RegExp("{user}", "gi"), `<@${interaction.user.id}>`)
                .replace(new RegExp("{username}", "gi"), `${interaction.user.username}`)
                .replace(new RegExp("{userid}", "gi"), `${interaction.user.id}`)
                .replace(new RegExp("{day}", "gi"), day.day.toString())
                .replace(new RegExp("{label}", "gi"), reward.label);

            return contentWithPlaceholders;
        }
        else {
            throw new nhandler_1.ComponentError("Invalid reward type.");
        }
    }
}
exports.default = default_1;
