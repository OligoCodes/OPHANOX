const isAdmin = require('../../lib/isAdmin');

module.exports = {
    name: 'demote',
    description: 'Demote a group admin to member (admin only).',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo || !msg.message.extendedTextMessage.contextInfo.participant) {
            return sock.sendMessage(from, { text: '❌ Please reply to the admin you want to demote.' }, { quoted: msg });
        }
        const userToDemote = msg.message.extendedTextMessage.contextInfo.participant;
        try {
            await sock.groupParticipantsUpdate(from, [userToDemote], 'demote');
            await sock.sendMessage(from, { text: `✅ User, ${userToDemote} demoted from admin!` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to demote user.' }, { quoted: msg });
        }
    }
};