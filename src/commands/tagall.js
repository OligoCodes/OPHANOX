const isAdmin = require('../../lib/isAdmin');
const { getGroup, updateGroup } = require('../../database/db');  // import db functions

module.exports = {
    name: 'tagall',
    description: 'Tag all group members (group only, admin only).',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;

        if (!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
        }

        // Admin check
        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }

        // Load group settings
        const groupSettings = getGroup(from);

        // If tagall is disabled in this group
        if (groupSettings.tagallEnabled === false) {
            return sock.sendMessage(from, { text: '🚫 The tagall command is disabled in this group.' }, { quoted: msg });
        }

        try {
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const mentions = participants.map(p => p.id);

            let messageText = '👥📢 Tagging all members:\n\n';
            for (let member of mentions) {
                messageText += `@${member.split('@')[0]}\n`;
            }

            await sock.sendMessage(from, { text: messageText, mentions: mentions }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(from, { text: '❌ Failed to tag all members.' }, { quoted: msg });
        }
    }
}
