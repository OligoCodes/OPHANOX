const axios = require('axios');

module.exports = {
    name: 'numf',
    description: 'Fetches a random number fact',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {  
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? msg.key.participant : from;
        const userName = sender.split('@')[0];

       if (args.length === 0) {
            return await sock.sendMessage(from, { text: '❗ Please provide a number to fetch a fact about. Usage: .numf <number>' }, { quoted: msg });
        }

        try {
            const number = args[0];
            if (isNaN(number)) {
                return await sock.sendMessage(from, { text: '❗ Please provide a valid number. Usage: .numf <number>' }, { quoted: msg });
            }
            const response = await axios.get(`http://numbersapi.com/${number}/trivia`);
            const fact = response.data;
            const factMessage = `🔢 Here's a fun fact about the number *${number}*, ${userName}:\n\n*${fact}*\n\n> *Powered by OligoTech* 🇬🇭`;
            await sock.sendMessage(from, { text: factMessage }, { quoted: msg });
        }catch (error) {
            console.error('Error fetching number fact:', error);
            await sock.sendMessage(from, { text: '☹ Sorry, I couldn\'t fetch a number fact at the moment.\n ❌ Please try again later.' }, { quoted: msg });
        }
    }
}