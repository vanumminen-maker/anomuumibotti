"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCommand {
    async error(interaction, error) {
        interaction.reply({ content: error.message, ephemeral: true });
        return;
    }
}
exports.default = BaseCommand;
