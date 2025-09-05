const axios = require('axios');

module.exports = {
    name: 'wiki',
    description: 'Get a summary from Wikipedia. Usage: .wiki <search>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return sock.sendMessage(from, { text: 'Usage: .wiki <search>' }, { quoted: msg });
        }
        const query = args.join(' ');
        try {
            const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            if (res.data.extract) {
                await sock.sendMessage(from, { text: `🌐 *${res.data.title}*\n\n${res.data.extract}` }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: '❌ No summary found.' }, { quoted: msg });
            }
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not fetch Wikipedia summary.' }, { quoted: msg });
        }
    }
};