"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseComponent {
    constructor() {
        this.findFn = (event) => event.customId.startsWith(this.customId);
    }
    async error(interaction, error) {
        interaction.reply({ content: error.message, ephemeral: true });
        return;
    }
}
exports.default = BaseComponent;
