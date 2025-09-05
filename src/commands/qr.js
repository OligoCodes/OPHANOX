const axios = require("axios");

module.exports = {
    name: 'qr',
    description: 'Generates a QR code from the provided text or URL. Usage: .qr <text or URL>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: '❗ Please provide text or a URL to generate a QR code. Usage: .qr <text or URL>' }, { quoted: msg });
        }
        const text = args.join(' ');
        try {
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=250x250`;
            const response = await axios.get(qrApiUrl, { responseType: 'arraybuffer' });
            const qrImageBuffer = Buffer.from(response.data, 'binary');
            await sock.sendMessage(from, { image: qrImageBuffer, caption: `🔲 Here is your QR code for:\n\n${text}` }, { quoted: msg });
        }catch (error) {
            console.error('Error generating QR code:', error);
            await sock.sendMessage(from, { text: '☹ Sorry, I couldn\'t generate a QR code at the moment.\n ❌ Please try again later.' }, { quoted: msg });
    }
}
}