"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = __importDefault(require("ansi-colors"));
class Logger {
    static getDate() {
        return `${ansi_colors_1.default.gray(`[${new Date().toLocaleDateString()}]`)}`;
    }
    static startup(...message) {
        console.log(`${Logger.getDate()} ${ansi_colors_1.default.bold.green("STARTUP")} ${" ".repeat(2)}`, ...message);
    }
    static log(...message) {
        console.log(`${Logger.getDate()} ${ansi_colors_1.default.bold.white("LOG")}  ${" ".repeat(5)}`, ...message);
    }
    static info(...message) {
        console.log(`${Logger.getDate()} ${ansi_colors_1.default.bold.blueBright("INFO")} ${" ".repeat(5)}`, ...message);
    }
    static error(...message) {
        console.log(`${Logger.getDate()} ${ansi_colors_1.default.bold.red("ERROR")}${" ".repeat(5)}`, ...message);
    }
}
exports.default = Logger;
