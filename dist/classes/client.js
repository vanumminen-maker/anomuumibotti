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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_INSTANCE = void 0;
const path = __importStar(require("path"));
const discord_js_1 = require("discord.js");
const nhandler_1 = require("nhandler");
const typeorm_1 = require("typeorm");
const calendar_1 = __importDefault(require("./entities/calendar"));
const logger_1 = __importDefault(require("./logger"));
class Client extends discord_js_1.Client {
    constructor(config) {
        super({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
            partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message],
        });
        exports.CLIENT_INSTANCE = this;
        this.config = config;
        this.initDate = Date.now();
        logger_1.default.startup("Client initialized.");
        this.createHandlers();
        this.run();
        Client.dataSource = this.getDataSource();
        Client.dataSource
            .initialize()
            .then(() => {
            logger_1.default.startup(`Database initialized. Using ${this.config.database.type}.`);
        })
            .catch((err) => {
            logger_1.default.error("Can't connect to the database.", err);
        });
    }
    createHandlers() {
        Client.commandHandler = this.createCommandHandler();
        Client.componentHandler = this.createComponentHandler();
        Client.eventHandler = this.createEventHandler();
    }
    async run() {
        try {
            await super.login(this.config.token);
        }
        catch (err) {
            logger_1.default.error("Can't login as the bot.", err);
        }
    }
    createCommandHandler() {
        logger_1.default.startup("Loading commands...");
        return (0, nhandler_1.createCommands)({ client: this, debug: true }).registerFromDir(path.join(__dirname, "../commands"));
    }
    createEventHandler() {
        logger_1.default.startup("Loading events...");
        return (0, nhandler_1.createEvents)({ client: this }).registerFromDir(path.join(__dirname, "../events"));
    }
    createComponentHandler() {
        logger_1.default.startup("Loading components...");
        return (0, nhandler_1.createComponents)({ client: this }).registerFromDir(path.join(__dirname, "../components"));
    }
    getDataSource() {
        let entities = [calendar_1.default];
        if (this.config.database.type === "sqlite") {
            return new typeorm_1.DataSource({
                type: "better-sqlite3",
                database: this.config.database.file,
                entities: entities,
                synchronize: true,
            });
        }
        else if (this.config.database.type === "postgres") {
            return new typeorm_1.DataSource({
                type: "postgres",
                host: this.config.database.host,
                port: this.config.database.port,
                username: this.config.database.username,
                password: this.config.database.password,
                database: this.config.database.database,
                entities: entities,
                synchronize: true,
            });
        }
        else if (this.config.database.type === "mysql") {
            return new typeorm_1.DataSource({
                type: "mysql",
                host: this.config.database.host,
                port: this.config.database.port,
                username: this.config.database.username,
                password: this.config.database.password,
                database: this.config.database.database,
                entities: entities,
                synchronize: true,
            });
        }
    }
}
exports.default = Client;
