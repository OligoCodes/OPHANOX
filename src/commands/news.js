const axios = require('axios');

module.exports = {
    name: 'news',
    description: 'Get the latest news headlines.',
    async execute (sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? msg.key.participant : from;
        const userName = sender.split('@')[0];
        const apiKey = '98cd7fac6ba04a61aa7a936a89a37514'; // Replace with your actual NewsAPI key

        try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
            const articles = response.data.articles.slice(0, 5); // Get top 5 headlines
            let newsMessage = `🗞 *Latest News Headlines:*\n\n`;
            articles.forEach((article, index) => {
                newsMessage += `🔴 *${index + 1}. ${article.title}*\n${article.url}\n\n`;
            });
            newsMessage += `_${botName}_ News Service\n\n> Powered by OligoTech 🇬🇭`;

            await sock.sendMessage(from, { text: newsMessage }, { quoted: msg });
        }catch (error) {
            console.error('Error fetching news:', error);
            await sock.sendMessage(from, { text: 'Sorry, I could not fetch the news at this time. Please try again later.' }, { quoted: msg });
        }

    }
}
