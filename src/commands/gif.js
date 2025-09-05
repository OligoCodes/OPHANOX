const axios = require('axios');

module.exports = {
    name: 'gif',
    description: 'Get a random trending GIF.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        try {
            const res = await axios.get('https://g.tenor.com/v1/random?q=funny&key=LIVDSRZULELA&limit=1');
            const gifUrl = res.data.results[0].media[0].gif.url;
            await sock.sendMessage(from, { video: { url: gifUrl }, caption: 'Here is a fun GIF!' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not fetch a GIF right now.' }, { quoted: msg });
        }
    }
};