const axios = require('axios');

module.exports = {
    name: 'meme',
    description: 'Get a random meme from Reddit.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        try {
            const res = await axios.get('https://meme-api.com/gimme');
            const meme = res.data;
            await sock.sendMessage(
                from,
                { image: { url: meme.url }, caption: `*${meme.title}*\n\n👍 ${meme.ups} | r/${meme.subreddit}` },
                { quoted: msg }
            );
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not fetch a meme right now.' }, { quoted: msg });
        }
    }
};