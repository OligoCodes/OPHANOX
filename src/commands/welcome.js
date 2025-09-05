const { getGroup, updateGroup } = require("../../database/db");
const isAdmin = require("../../lib/isAdmin");

module.exports = {
    name: "welcome",
    description: "Enable or disable welcome messages (admin only, group only).",
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
                text: `✨ Usage: \n${prefix}welcome on\n${prefix}welcome off` 
            }, { quoted: msg });
        }

        // Save setting
        updateGroup(from, { welcome: option === "on" });
        await sock.sendMessage(from, { 
            text: option === "on" 
                ? "✅ Welcome messages *enabled* 🎉" 
                : "❌ Welcome messages *disabled* 🚫" 
        }, { quoted: msg });
    }
};
