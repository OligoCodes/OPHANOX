module.exports = {
    name: 'tagadmins',
    description: 'Mention all admins in the group.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }

        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }

        try {
            const metadata = await sock.groupMetadata(from);
            const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
            if (admins.length === 0) {
                return sock.sendMessage(from, { text: 'No admins found in this group.' }, { quoted: msg });
            }
            await sock.sendMessage(
                from,
                {
                    text: '👮‍♂️ Admins:\n' + admins.map(a => `@${a.split('@')[0]}`).join(' '),
                    mentions: admins
                },
                { quoted: msg }
            );
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Failed to tag admins.' }, { quoted: msg });
        }
    }
};