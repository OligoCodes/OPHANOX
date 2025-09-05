module.exports = {
    name: 'groupinfo',
    description: 'Show group stats and info.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }
        try {
            const metadata = await sock.groupMetadata(from);
            const admins = metadata.participants.filter(p => p.admin).length;
            const members = metadata.participants.length;
            const groupInfo = `*Group Name:* ${metadata.subject}\n*Created:* ${new Date(metadata.creation * 1000).toLocaleString()}\n*Members:* ${members}\n*Admins:* ${admins}`;
            await sock.sendMessage(from, { text: groupInfo }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to fetch group info.' }, { quoted: msg });
        }
    }
};