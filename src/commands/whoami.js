module.exports = {
    name: 'whoami',
    description: 'Show your WhatsApp info.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        await sock.sendMessage(from, { text: `👤 Your JID: ${sender}` }, { quoted: msg });
    }
};