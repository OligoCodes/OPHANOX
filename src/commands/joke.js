const axios = require('axios');
const autoReact  = require('../utils/react.js')

module.exports = {
    name: 'joke',
    description: 'Tells a random joke',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? msg.key.participant : from;
        const userName = sender.split('@')[0];

        const jokeApiUrl = 'https://official-joke-api.appspot.com/random_joke';
        try {
            const response = await axios.get(jokeApiUrl);
            const joke = response.data;
            const emojiList = ['😂', '🪀', '🤣',  '🎃', '😎' , '😁', '😆', '😹', '😄', '😜', '🃏',  '💦'];
            const index = Math.floor(Math.random() * emojiList.length);
            const randomEmoji = emojiList[index];
            const jokeMessage = `Here's a joke for you, ${userName}:\n\n*${joke.setup}*\n\n*${joke.punchline}*`;
            const jokeContent = await sock.sendMessage(from, { text: jokeMessage }, { quoted: msg });
            await autoReact(sock, jokeContent, randomEmoji);
        }catch (error) {
            console.error('Error fetching joke:', error);
            await sock.sendMessage(from, { text: '☹ Sorry, I couldn\'t fetch a joke at the moment.\n ❌ Please try again later.' }, { quoted: msg });
        }
    }
}