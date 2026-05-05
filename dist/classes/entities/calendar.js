"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Calendar_1;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const typeorm_1 = require("typeorm");
const with_id_and_timestamps_1 = require("../../util/with-id-and-timestamps");
const client_1 = require("../client");
const emojis = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
    "<:11:1309934703427588106>",
    "<:12:1309934706820911204>",
    "<:13:1309935079614713916>",
    "<:14:1309934687875108916>",
    "<:15:1309934694695047281>",
    "<:16:1309934714450087976>",
    "<:17:1309934701602930799>",
    "<:18:1309934696183890011>",
    "<:19:1309934700260884532>",
    "<:20:1309934693273043076>",
    "<:21:1309934697463152741>",
    "<:22:1309934911804805161>",
    "<:23:1309934709542883368>",
    "<:24:1309935143619657769>"
];
let Calendar = Calendar_1 = class Calendar extends with_id_and_timestamps_1.WithIdAndTimestamps {
    constructor() {
        super(...arguments);
        this.client = client_1.CLIENT_INSTANCE;
    }
    static async getOrCreate(userId) {
        let calendar = await Calendar_1.findOne({ where: { userId: userId } });
        if (calendar)
            return calendar;
        return Calendar_1.create({ userId }).save();
    }
    getOpenedDays() {
        return this.openedDays.split(",").map((day) => parseInt(day));
    }
    isDayOpen(day) {
        return this.getOpenedDays().includes(day);
    }
    setDayToOpen(day) {
        const openedDays = this.getOpenedDays();
        if (openedDays.includes(day))
            return;
        openedDays.push(day);
        this.openedDays = openedDays.join(",");
    }
    getRows() {
        // Fix: Use Europe/Helsinki time to ensure correct day separation even when server is in UTC
        const currentDay = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Helsinki" })).getDate();
        let rows = [];
        for (let rowOffset = 0; rowOffset < 24; rowOffset += 5) {
            const row = new discord_js_1.ActionRowBuilder();
            const components = [];
            for (let colIdx = 0; colIdx < 5; colIdx++) {
                const idx = rowOffset + colIdx;
                if (idx >= 24) break; // Stop if we exceed 24 doors
                let emoji = this.getOpenedDays().includes(idx) ? "🔓" : emojis[idx];
                if (!this.client.config.allowRedeemalOfPastDays && idx < currentDay - 1) {
                    emoji = "⛔";
                }
                components.push(new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setEmoji(emoji)
                    .setDisabled(idx >= currentDay)
                    .setCustomId(`open-${idx}`));
            }
            row.addComponents(components);
            rows.push(row);
        }
        return rows;
    }
    setClaimed(idx) {
        this.setDayToOpen(idx);
        this.save();
    }
    async reset() {
        this.openedDays = "";
        await this.save();
    }
};
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 30 }),
    __metadata("design:type", String)
], Calendar.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "" }),
    __metadata("design:type", String)
], Calendar.prototype, "openedDays", void 0);
Calendar = Calendar_1 = __decorate([
    (0, typeorm_1.Entity)({ name: "calendar" })
], Calendar);
exports.default = Calendar;
