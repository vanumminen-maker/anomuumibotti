"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const zod_1 = require("zod");
const logger_1 = __importDefault(require("./classes/logger"));
const roleReward = zod_1.z.object({
    type: zod_1.z.literal("role"),
    label: zod_1.z.string({ required_error: "The label is required for each calendar day." }),
    roleId: zod_1.z.string({ required_error: 'The role ID ("roleId") is required for "role" type reward.' }),
});
const logReward = zod_1.z.object({
    type: zod_1.z.literal("channel_log"),
    label: zod_1.z.string({ required_error: "The label is required for each calendar day." }),
    channelId: zod_1.z.string({ required_error: 'The channel ID ("channelId") is required for "channel_log" type reward.' }),
    content: zod_1.z.string({ required_error: 'The content ("content") is required for "channel_log" type reward.' }),
    mentionUser: zod_1.z.boolean().default(false),
    regularContent: zod_1.z.string().optional(),
});
let rewardsUnion = zod_1.z.discriminatedUnion("type", [roleReward, logReward]);
const calendarDay = zod_1.z.object({
    day: zod_1.z.number({ required_error: "The day is required for each calendar day." }),
    rewards: zod_1.z.array(rewardsUnion).min(1, { message: "Each calendar day must have at least one reward." }),
});
const calendar = zod_1.z
    .array(calendarDay)
    .min(24, "You have to define all 24 days of the calendar.")
    .max(24, "You can define at most 24 days of the calendar.")
    .refine((days) => {
    const dayNumbers = days.map((day) => day.day);
    const sortedDayNumbers = [...dayNumbers].sort((a, b) => a - b);
    return JSON.stringify(dayNumbers) === JSON.stringify(sortedDayNumbers);
}, "The days of the calendar must be in order, starting from 1 and ending at 25.");
const sqliteDatabase = zod_1.z.object({
    type: zod_1.z.literal("sqlite"),
    file: zod_1.z.string({ required_error: 'The file path ("file") is required for "sqlite" type database.' }),
});
const mysqlDatabase = zod_1.z.object({
    type: zod_1.z.literal("mysql"),
    host: zod_1.z.string({ required_error: 'The host ("host") is required for "mysql" type database.' }),
    port: zod_1.z.number({ required_error: 'The port ("port") is required for "mysql" type database.' }),
    username: zod_1.z.string({ required_error: 'The username ("username") is required for "mysql" type database.' }),
    password: zod_1.z.string({ required_error: 'The password ("password") is required for "mysql" type database.' }),
    database: zod_1.z.string({ required_error: 'The database ("database") is required for "mysql" type database.' }),
});
const postgresDatabase = zod_1.z.object({
    type: zod_1.z.literal("postgres"),
    host: zod_1.z.string({ required_error: 'The host ("host") is required for "postgres" type database.' }),
    port: zod_1.z.number({ required_error: 'The port ("port") is required for "postgres" type database.' }),
    username: zod_1.z.string({ required_error: 'The username ("username") is required for "postgres" type database.' }),
    password: zod_1.z.string({ required_error: 'The password ("password") is required for "postgres" type database.' }),
    database: zod_1.z.string({ required_error: 'The database ("database") is required for "mysql" type database.' }),
});
const configSchema = zod_1.z.object({
    token: zod_1.z.string(),
    database: zod_1.z.union([sqliteDatabase, mysqlDatabase, postgresDatabase], {
        invalid_type_error: "Database is misconfigured. Must match shape of either sqlite, mysql or postgres config.",
    }),
    panel: zod_1.z.object({
        embed_title: zod_1.z.string(),
        embed_description: zod_1.z.string().optional(),
        image_url: zod_1.z.string().optional(),
        button_label: zod_1.z.string(),
    }),
    status: zod_1.z.string().optional(),
    owners: zod_1.z.array(zod_1.z.string()),
    calendar: calendar,
    allowRedeemalOfPastDays: zod_1.z.boolean().default(false),
});
exports.default = configSchema;
const validateConfig = (config) => {
    const configValidation = configSchema.safeParse(config);
    if (!configValidation.success) {
        logger_1.default.error("Config validation failed.");
        const lines = [ansi_colors_1.default.bold("Validation of config.yml failed."), "Please resolve the following issues before running the bot:"];
        lines.push(configValidation.error.issues
            .map((issue, idx) => {
            return `${ansi_colors_1.default.bold(`${idx + 1}.`)} [${ansi_colors_1.default.blue(issue.path.join("."))}]: ${issue.message} (${ansi_colors_1.default.dim(issue.code)})`;
        })
            .join("\n"));
        console.log(lines.join("\n"));
        process.exit(1);
    }
    return configValidation.data;
};
exports.validateConfig = validateConfig;
