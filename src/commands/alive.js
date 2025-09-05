const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'alive',
    description: 'Check if the bot is alive',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const musics = ['alive.mp3', 'aliveOne.mp3', 'aliveTwo.mp3'];
        const factor = Math.floor(Math.random() * musics.length);
        const musicSuffix = musics[factor];
        const audioPath = path.join(__dirname, `../../assets/audio/${musicSuffix}`);
        const botAudio = fs.readFileSync(audioPath);
        const response = `🤖 *${botName} is alive and kicking!* 💥\n\nType *${prefix}menu* to see what I can do!`;
        await sock.sendMessage(from, { text: response }, { quoted: msg });
        await sock.sendMessage(from, { audio: botAudio, mimetype: 'audio/mpeg' });
    }
}