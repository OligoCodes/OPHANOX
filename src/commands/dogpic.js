const axios = require('axios');

module.exports = {
    name: 'dogpic',
    description: 'Get a random cute dog picture.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        try {
            const res = await axios.get('https://dog.ceo/api/breeds/image/random');
            const dogUrl = res.data.message;
            await sock.sendMessage(from, { image: { url: dogUrl }, caption: '🐶 Here is a cute dog!' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not fetch a dog picture right now.' }, { quoted: msg });
        }
    }
};