const fs = require('fs');
const path = require('path');
const isOwner = require('../../lib/isOwner');
const pairedPath = path.join(__dirname, '../../database/paired.json');

module.exports = {
    name: 'pair',
    description: 'Pair a user with the bot. Only the bot owner can use this. Usage: .pair <number>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        // Only allow the owner to pair
        if (!isOwner(msg)) {
            return sock.sendMessage(from, { text: '❌ Only the bot owner can pair numbers.' }, { quoted: msg });
        }
        if (args.length === 0 || !args[0].match(/^\+?\d{8,15}$/)) {
            return sock.sendMessage(from, { text: 'Usage: .pair <number>\nExample: .pair +233551234567' }, { quoted: msg });
        }
        const number = args[0].replace(/\D/g, '');
        let paired = [];
        if (fs.existsSync(pairedPath)) {
            paired = JSON.parse(fs.readFileSync(pairedPath));
        }
        if (paired.includes(number)) {
            return sock.sendMessage(from, { text: `This number is already paired.` }, { quoted: msg });
        }
        paired.push(number);
        fs.writeFileSync(pairedPath, JSON.stringify(paired, null, 2));
        await sock.sendMessage(from, { text: `✅ Number +${number} has been paired with the bot!` }, { quoted: msg });
    }
};