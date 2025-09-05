const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'owner',
    description : 'Sends owner contact information',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const ownerPhoto = path.join(__dirname, '../../assets/images/oligo.jpeg');
        const ownerAvatar = fs.readFileSync(ownerPhoto);
        const ownerContact = `👑 The Owner of *OPHANOX* is Joseph Bonsu 🇬🇭 a.k.a OligoCodes\n\n *🎵 Tiktok* : https://www.tiktok.com/@OligoCodes/  \n *🐈 Github* : https://www.github.com/OligoCodes/  \n\n> You can contact him at : *+${ownerNumber}*`;
        await sock.sendMessage(from, { image: ownerAvatar, caption: ownerContact }, { quoted: msg });
    }
}