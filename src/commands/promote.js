const isAdmin = require('../../lib/isAdmin');

module.exports = {
    name: 'promote',
    description: 'Promote a user to admin (group only, admin only).',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }
        // Admin check
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        if (
            !msg.message.extendedTextMessage ||
            !msg.message.extendedTextMessage.contextInfo ||
            !msg.message.extendedTextMessage.contextInfo.participant
        ) {
            return sock.sendMessage(from, { text: '❌ Please reply to the user you want to promote.' }, { quoted: msg });
        }
        const userToPromote = msg.message.extendedTextMessage.contextInfo.participant;
        try {
            await sock.groupParticipantsUpdate(from, [userToPromote], 'promote');
            await sock.sendMessage(from, { text: `✅ User promoted to admin!` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to promote user.' }, { quoted: msg})
        }
    }
};  