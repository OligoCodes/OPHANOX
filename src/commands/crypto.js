const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Fetches and displays cryptocurrency information',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: `❌ Please provide a cryptocurrency symbol. Usage: *${prefix}crypto <coin>*` }, { quoted: msg });
        }
        const coin = args[0].toLowerCase();
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`);
            const data = response.data;
            const imageUrl = data.image.large;
            const message = `*${data.name} (${data.symbol.toUpperCase()})*\n\n` +
                            `💰 Price: $${data.market_data.current_price.usd}\n` +
                            `📈 24h Change: ${data.market_data.price_change_percentage_24h}%\n` +
                            `💹 Market Cap: $${data.market_data.market_cap.usd}\n` +
                            `🔗 More Info: ${data.links.homepage[0]}` + `\n\n> *Powered by OligoTech 🇬🇭*`;
            await sock.sendMessage(from, { image: { url: imageUrl }, caption: message }, { quoted: msg });
        }catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: `❌ Could not fetch data for "${coin}". Please ensure the coin name is correct.` }, { quoted: msg });
        }
    }
}