const axios = require('axios');

module.exports = {
    name: 'catpic',
    description: 'Get a random cute cat picture.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        try {
            const res = await axios.get('https://api.thecatapi.com/v1/images/search');
            const catUrl = res.data[0].url;
            await sock.sendMessage(from, { image: { url: catUrl }, caption: '*🐱 Here is a cute cat!*' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not fetch a cat picture right now.' }, { quoted: msg });
        }
    }
};