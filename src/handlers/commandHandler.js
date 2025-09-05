const fs = require('fs');
const path = require("path");
const axios = require("axios");
const { prefix, botName, ownerNumber } = require("../../config");

let commands = new Map();

// 🔹 Load all commands from src/commands
const commandFiles = fs.readdirSync(path.join(__dirname, "../commands"))
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.set(command.name, command);
}

async function handleCommand(sock, msg, botName, ownerNumber, prefix) {
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    
    
    if (!text.startsWith(prefix)) return;

    const args = text.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const command = commands.get(cmdName);
    if (!command) return;

    try {
        await command.execute(sock, msg, args, botName, ownerNumber, prefix);
    } catch (error) {
        console.error(error);
        await sock.sendMessage(from, { text: "❌ Error while executing command!" });
    }
}

module.exports = handleCommand;
