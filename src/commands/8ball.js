module.exports = {
    name: '8ball',
    description: 'Ask the magic 8-ball a question.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return sock.sendMessage(from, { text: '🎱 Ask me a yes/no question!' }, { quoted: msg });
        }
        const responses = [
            "Yes!", "No.", "Maybe.", "Definitely!", "I don't think so.", "Absolutely!", "Ask again later.", "Not sure."
        ];
        const answer = responses[Math.floor(Math.random() * responses.length)];
        await sock.sendMessage(from, { text: `🎱 ${answer}` }, { quoted: msg });
    }
};