module.exports = {
    name: 'remind',
    description: 'Set a reminder. Usage: .remind 10m Take a break!',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length < 2) {
            return sock.sendMessage(from, { text: 'Usage: .remind <time> <message>\nExample: .remind 10m Drink water!' }, { quoted: msg });
        }
        const timeMatch = args[0].match(/^(\d+)([smhd])$/);
        if (!timeMatch) {
            return sock.sendMessage(from, { text: '⚠ Invalid time format! Use s, m, h, or d (e.g., 10m for 10 minutes).' }, { quoted: msg });
        }
        const num = parseInt(timeMatch[1]);
        const unit = timeMatch[2];
        let ms = 0;
        if (unit === 's') ms = num * 1000;
        if (unit === 'm') ms = num * 60 * 1000;
        if (unit === 'h') ms = num * 60 * 60 * 1000;
        if (unit === 'd') ms = num * 24 * 60 * 60 * 1000;
        const reminderMsg = args.slice(1).join(' ');
        sock.sendMessage(from, { text: `⏰ Reminder set for ${args[0]}: "${reminderMsg}"` }, { quoted: msg });
        setTimeout(() => {
            sock.sendMessage(from, { text: `⏰ Reminder: ${reminderMsg}` });
        }, ms);
    }
};