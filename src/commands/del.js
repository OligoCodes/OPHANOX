const isOwner = require('../../lib/isOwner');

module.exports = {
    name: 'del',
    description: 'Delete a message (for everyone). Only the bot owner can use this. Usage: reply to a message with .del',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        // Restrict to bot owner
        if (!isOwner(msg)) {
            return sock.sendMessage(from, { text: '❌ Only the bot owner can use this command.' }, { quoted: msg });
        }
        // Check if the command is a reply
        if (
            !msg.message.extendedTextMessage ||
            !msg.message.extendedTextMessage.contextInfo ||
            !msg.message.extendedTextMessage.contextInfo.stanzaId
        ) {
            return sock.sendMessage(from, { text: '❌ Please reply to the message you want to delete.' }, { quoted: msg });
        }
        const { stanzaId, participant } = msg.message.extendedTextMessage.contextInfo;
        try {
            await sock.sendMessage(from, {
                delete: {
                    remoteJid: from,
                    fromMe: false,
                    id: stanzaId,
                    participant: participant || from
                }
            });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to delete the message.' }, { quoted: msg });
        }

    }
}