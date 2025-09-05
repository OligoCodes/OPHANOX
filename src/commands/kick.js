const isAdmin = require('../../lib/isAdmin');

module.exports = {
    name: 'kick',
    description: 'Remove a user from the group (admin only).',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo || !msg.message.extendedTextMessage.contextInfo.participant) {
            return sock.sendMessage(from, { text: '❌ Please reply to the user you want to kick.' }, { quoted: msg });
        }
        const userToKick = msg.message.extendedTextMessage.contextInfo.participant;
        try {
            await sock.groupParticipantsUpdate(from, [userToKick], 'remove');
            await sock.sendMessage(from, { text: `✅ User, ${userToKick} removed from the group!` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to remove user.' }, { quoted: msg });
        }
    }
};