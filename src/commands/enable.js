const { updateGroup } = require("../../database/db");
const isAdmin = require("../../lib/isAdmin");

module.exports = {
    name: "enable",
    description: "Enable a feature in this group",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // ✅ Only admins can enable
        const isUserAdmin = await isAdmin(sock, msg, from);
        if (!isUserAdmin) {
            return sock.sendMessage(from, { text: "❌ Only admins can enable features." });
        }

        if (!args[0]) {
            return sock.sendMessage(from, { text: "⚙️ Usage: .enable <feature>\nAvailable: tagall" });
        }

        const feature = args[0].toLowerCase();
        if (feature === "tagall") {
            updateGroup(from, { tagall: true });
            return sock.sendMessage(from, { text: "✅ Tagall has been enabled in this group." });
        }

        return sock.sendMessage(from, { text: `❌ Unknown feature: ${feature}` });
    }
};
