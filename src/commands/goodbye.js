const { getGroup, updateGroup } = require("../../database/db");
const isAdmin = require("../../lib/isAdmin");

module.exports = {
    name: "goodbye",
    description: "Enable or disable goodbye messages (admin only, group only).",
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;

        if (!from.endsWith("@g.us")) {
            return sock.sendMessage(from, { text: "❌ This command can only be used in groups." }, { quoted: msg });
        }

        // ✅ Check admin
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: "❌ Only group admins can use this command." }, { quoted: msg });
        }

        const option = args[0]?.toLowerCase();
        if (!option || !["on", "off"].includes(option)) {
            return sock.sendMessage(from, { 
                text: `✨ Usage: \n${prefix}goodbye on\n${prefix}goodbye off` 
            }, { quoted: msg });
        }

        // Save setting
        updateGroup(from, { goodbye: option === "on" });
        await sock.sendMessage(from, { 
            text: option === "on" 
                ? "👋 Goodbye messages *enabled* 🥳" 
                : "❌ Goodbye messages *disabled* 🚫" 
        }, { quoted: msg });
    }
};
