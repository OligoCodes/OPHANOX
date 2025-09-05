const axios = require('axios');

module.exports = {
    name: 'exrate',
    description: 'Fetches the latest exchange rates for a given currency code. Usage: .exrate <currency_code>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: `❌ Please provide a currency code. Usage: *${prefix}exrate <currency_code>*` }, { quoted: msg });
        }
        const currencyCode = args[0].toUpperCase();
        try {
            const response = await axios.get(`https://open.er-api.com/v6/latest/${currencyCode}`);  
            const data = response.data;
            if (data.result === "error") {
                throw new Error(data['error-type']);
            }
            let ratesMessage = `*Exchange Rates for ${data.base_code}*\n\n`;
            for (const [code, rate] of Object.entries(data.rates)) {
                ratesMessage += `💱 1 ${data.base_code} = ${rate} ${code}\n`;
            }
            ratesMessage += `\n\n> *Powered by OligoTech 🇬🇭*`;
            await sock.sendMessage(from, { text: ratesMessage }, { quoted: msg });
        }catch (error) {
            console.error(error);
            return await sock.sendMessage(from, { text: `❌ Could not fetch exchange rates for "${currencyCode}". Please ensure the currency code is correct.` }, { quoted: msg });
        }

    }
}