const axios = require('axios');

module.exports = {
    name: 'currency',
    description: 'Convert between currencies. Usage: .currency <amount> <from> <to>\nExample: .currency 10 usd eur',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length < 3) {
            return sock.sendMessage(from, { text: 'Usage: .currency <amount> <from> <to>\nExample: .currency 10 usd eur' }, { quoted: msg });
        }
        const amount = parseFloat(args[0]);
        const fromCur = args[1].toUpperCase();
        const toCur = args[2].toUpperCase();
        try {
            const res = await axios.get(`https://api.exchangerate.host/convert?from=${fromCur}&to=${toCur}&amount=${amount}`);
            if (res.data.result) {
                await sock.sendMessage(from, { text: `💱 ${amount} ${fromCur} = ${res.data.result} ${toCur}` }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: '❌ Could not convert currency.' }, { quoted: msg });
            }
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not convert currency.' }, { quoted: msg });
        }
    }
};