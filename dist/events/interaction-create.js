"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nhandler_1 = require("nhandler");
const client_1 = __importDefault(require("../classes/client"));
class default_1 {
    constructor() {
        this.name = "interactionCreate";
    }
    async run(interaction) {
        if ((0, nhandler_1.isComponentInteraction)(interaction)) {
            client_1.default.componentHandler.runComponent(interaction);
        }
        else if ((0, nhandler_1.isCommandInteraction)(interaction)) {
            client_1.default.commandHandler.runCommand(interaction);
        }
        else if ((0, nhandler_1.isAutocompleteInteraction)(interaction)) {
            client_1.default.commandHandler.runAutocomplete(interaction);
        }
    }
}
exports.default = default_1;
