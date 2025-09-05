module.exports = {
    name: 'ping',
    description : 'Responds with Pong and latency',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const start = Date.now();
        await sock.sendMessage(from, { text: '🏓 Pong!' });
        const end = Date.now();
        const difference = end - start;
        const seconds = (difference / 1000);
        await sock.sendMessage(from, { text: `> ⚡ *${botName}* responds in *${seconds} seconds!*`});
    }
}