const isAdmin = require('../../lib/isAdmin');

module.exports = {
    name: 'lock',
    description: 'Lock the group (no new members can join).',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        try {
            await sock.groupSettingUpdate(from, 'locked');
            await sock.sendMessage(from, { text: '🔒 Group is now locked. No new members can join.' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to lock the group.' }, { quoted: msg });
        }
    }
};