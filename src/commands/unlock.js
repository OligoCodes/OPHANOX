const isAdmin = require('../../lib/isAdmin');

module.exports = {
    name: 'unlock',
    description: 'Unlock the group (new members can join).',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        try {
            await sock.groupSettingUpdate(from, 'unlocked');
            await sock.sendMessage(from, { text: '🔓 Group is now unlocked. New members can join.' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to unlock the group.' }, { quoted: msg });
        }
    }
};