const isAdmin = require('../../lib/isAdmin');

module.exports = {
    name: 'mute',
    description: 'Mute the group (only admins can send messages).',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        try {
            await sock.groupSettingUpdate(from, 'announcement');
            await sock.sendMessage(from, { text: '🔇 Group has been muted (admins only).' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to mute the group.' }, { quoted: msg });
        }
    }
};