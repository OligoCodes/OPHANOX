module.exports = {
    name: 'time',
    description: 'Get the current date and time.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const now = new Date();
        const timeString = now.toLocaleString();
        await sock.sendMessage(from, { text: `🕒 Current date and time: *${timeString}*` }, { quoted: msg });
    }
};