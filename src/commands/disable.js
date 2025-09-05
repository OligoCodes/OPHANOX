const { updateGroup } = require("../../database/db");
const isAdmin = require("../../lib/isAdmin");

module.exports = {
    name: "disable",
    description: "Disable a feature in this group",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // ✅ Only admins can disable
        const isUserAdmin = await isAdmin(sock, msg, from);
        if (!isUserAdmin) {
            return sock.sendMessage(from, { text: "❌ Only admins can disable features." });
        }

        if (!args[0]) {
            return sock.sendMessage(from, { text: "⚙️ Usage: .disable <feature>\nAvailable: tagall" });
        }

        const feature = args[0].toLowerCase();
        if (feature === "tagall") {
            updateGroup(from, { tagall: false });
            return sock.sendMessage(from, { text: "🚫 Tagall has been disabled in this group." });
        }

        return sock.sendMessage(from, { text: `❌ Unknown feature: ${feature}` });
    }
};
