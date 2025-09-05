module.exports = {
    name: 'pfp',
    description: 'Get the WhatsApp profile picture of a user.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        let userJid;
        // If the command is a reply, get the replied user's JID
        if (
            msg.message.extendedTextMessage &&
            msg.message.extendedTextMessage.contextInfo &&
            msg.message.extendedTextMessage.contextInfo.participant
        ) {
            userJid = msg.message.extendedTextMessage.contextInfo.participant;
        } else {
            // Otherwise, get the sender's JID
            userJid = msg.key.participant || msg.key.remoteJid;
        }

        try {
            const pfpUrl = await sock.profilePictureUrl(userJid, 'image');
            await sock.sendMessage(
                msg.key.remoteJid,
                { image: { url: pfpUrl }, caption: 'Here is the profile picture 😈.' },
                { quoted: msg }
            );
        } catch (err) {
            await sock.sendMessage(
                msg.key.remoteJid,
                { text: '❌ Could not fetch profile picture. The user may not have one or privacy settings prevent access.' },
                { quoted: msg }
            );
        }
    }
};