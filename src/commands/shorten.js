const axios = require('axios');
const isPaired = require('../../lib/isPaired');


module.exports = {
    name: 'shorten',
    description: 'Shorten a URL using TinyURL.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return sock.sendMessage(from, { text: 'Please provide a URL to shorten.\nUsage: .shorten <url>' }, { quoted: msg });
        }

        if (!isPaired(msg)) {
        return sock.sendMessage(from, { text: '❌ You are not paired with this bot. Use .pair <number> to pair.' }, { quoted: msg });
       }

        const url = args[0];
        try {
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
            await sock.sendMessage(from, { text: `🔗 Shortened URL: ${res.data}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not shorten the URL.' }, { quoted: msg });
        }
    }
};