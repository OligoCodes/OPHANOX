const axios = require("axios");

module.exports = {
    name: 'weather',
    description: 'Fetches current weather information for a specified city. Usage: .weather <city>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: '❗ Please provide a city name to fetch the weather for. Usage: .weather <city>' }, { quoted: msg });
        }
        const city = args.join(' ');
        try {
            const weatherApi = `http://wttr.in/${encodeURIComponent(city)}?format=3`;
            const response = await axios.get(weatherApi);
            const weatherInfo = response.data;
            await sock.sendMessage(from, { text: `🌤️ Current weather in *${city}*:\n*${weatherInfo}*\n\n> Powered by OligoTech 🇬🇭` }, { quoted: msg });
        }catch (error) {
            console.error('Error fetching weather information:', error);
            await sock.sendMessage(from, { text: '☹ Sorry, I couldn\'t fetch the weather information at the moment.\n ❌ Please ensure the city name is correct and try again later.' }, { quoted: msg }); 
        }
    }
};