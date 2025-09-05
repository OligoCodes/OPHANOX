const axios = require('axios');

module.exports = {
    name: 'define',
    description: 'Get the dictionary definition of a word.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return sock.sendMessage(from, { text: 'Usage: .define <word>' }, { quoted: msg });
        }
        const word = args[0];
        try {
            const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = res.data[0];
            const meaning = data.meanings[0].definitions[0].definition;
            await sock.sendMessage(from, { text: `📚 *${word}*: ${meaning}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not in the definition.' }, { quoted: msg });
        }
    }
};