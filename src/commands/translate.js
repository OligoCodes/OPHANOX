const axios = require('axios');

module.exports = {
    name: 'translate',
    description: 'Translate text to another language. Usage: .translate <lang> <text>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length < 2) {
            return sock.sendMessage(from, { text: 'Usage: .translate <lang> <text>\nExample: .translate es Hello' }, { quoted: msg });
        }
        const lang = args[0];
        const text = args.slice(1).join(' ');
        try {
            const res = await axios.post('https://translate.argosopentech.com/translate', {
                q: text,
                source: 'auto',
                target: lang,
                format: 'text'
            }, { headers: { accept: 'application/json' } });
            if (res.data && res.data.translatedText) {
                await sock.sendMessage(from, { text: `🌐 ${res.data.translatedText}` }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: '❌ Could not translate the text (no result).' }, { quoted: msg });
            }
        } catch (err) {
            await sock.sendMessage(from, { text: `❌ Could not translate the text. Error: ${err.message}` }, { quoted: msg });
        }
    }
};