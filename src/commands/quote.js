const axios = require('axios');

module.exports = {
    name: 'quote',
    description: 'Get a random inspirational quote from the internet.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        try {
            const response = await axios.get('https://zenquotes.io/api/random');
            const data = response.data && response.data[0];
            const quote = data ? `${data.q}\n— ${data.a}` : 'Could not fetch a quote at this time.';
            await sock.sendMessage(from, { text: quote }, { quoted: msg });
        } catch (error) {
            console.error('Quote API error:', error);
            await sock.sendMessage(from, { text: '❌ Failed to fetch a quote. Please try again later.' }, { quoted: msg });
        }
    }
};