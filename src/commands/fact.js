const axios = require('axios');

module.exports = {
    name: 'fact',
    description: 'Get a random interesting fact.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        try {
            const res = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
            await sock.sendMessage(from, { text: `🤔 ${res.data.text}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not fetch a fact right now.' }, { quoted: msg });
        }
    }
};