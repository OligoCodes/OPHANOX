const fs = require('fs');
const path = require('path');
const pairedPath = path.join(__dirname, '../database/paired.json');

function isPaired(msg) {
    let senderId = msg.key.participant || msg.participant || msg.key.remoteJid;
    if (senderId.includes(':')) senderId = senderId.split(':')[0];
    const senderNum = senderId.replace(/\D/g, '');
    if (fs.existsSync(pairedPath)) {
        const paired = JSON.parse(fs.readFileSync(pairedPath));
        return paired.includes(senderNum);
    }
    return false;
}

module.exports = isPaired;