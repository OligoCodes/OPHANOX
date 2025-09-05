const isAdmin = require('../../lib/isAdmin');

module.exports = {
    name: 'unmute',
    description: 'Unmute the group (everyone can send messages).',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        try {
            await sock.groupSettingUpdate(from, 'not_announcement');
            await sock.sendMessage(from, { text: '🔊 Group has been unmuted (everyone can send messages).' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to unmute the group.' }, { quoted: msg });
        } 
    }
};