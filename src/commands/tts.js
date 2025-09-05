const gTTS = require('gtts');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'tts',
    description: 'Convert text to speech and send as audio.',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? msg.key.participant : from;

        if (args.length === 0) {
            return await sock.sendMessage(
                from,
                { text: `Please provide the text to convert to speech.\nUsage: ${prefix}tts <text>` },
                { quoted: msg }
            );
        }

        const text = args.join(' ');
        const audioDir = path.join(__dirname, '..', 'data', 'audio');
        const fileName = `tts-${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);

        // Ensure the audio directory exists
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }

        const gtts = new gTTS(text, 'en');
        gtts.save(filePath, async function (err) {
            if (err) {
                console.error('Error generating TTS:', err);
                return await sock.sendMessage(
                    from,
                    { text: 'Sorry, there was an error generating the speech.' },
                    { quoted: msg }
                );
            }

            try {
                await sock.sendMessage(
                    from,
                    { audio: fs.readFileSync(filePath), mimetype: 'audio/mpeg' },
                    { quoted: msg }
                );
            } catch (sendErr) {
                console.error('Error sending audio:', sendErr);
            } finally {
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting audio file:', unlinkErr);
                });
            }
        });
    }
};