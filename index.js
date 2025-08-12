const makeWASocket = require('@whiskeysockets/baileys').default;
const {
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, undefined)
        },
        printQRInTerminal: false,
        browser: ['Windows', 'Chrome', '127.0.6533.120'], // spoof desktop Chrome
        mobile: false,
        syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    // Generate pairing code if not registered
    if (!state.creds.registered) {
        try {
            const phoneNumber = '233591179690'; // your number without +
            console.log('📞 Requesting pairing code for:', phoneNumber);
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`📌 Pairing Code: ${code}`);
        } catch (err) {
            console.error('⚠️ Could not get pairing code:', err.message);
        }
    }

    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open') {
            console.log('✅ Bot connected!');
        } else if (connection === 'close') {
            console.log('❌ Connection closed. Restarting...');
            setTimeout(startBot, 3000);
        }
    });

    // 📩 Message listener
    sock.ev.on('messages.upsert', async (msg) => {
        const m = msg.messages[0];
        if (!m.key.fromMe && m.message?.conversation) {
            const text = m.message.conversation.trim().toLowerCase();

            if (text === '.test') {
                await sock.sendMessage(m.key.remoteJid, { text: 'Hello! 👋 Bot is working.' });
            } else if (text.startsWith('.echo ')) {
                const reply = text.slice(6);
                await sock.sendMessage(m.key.remoteJid, { text: reply });
            }
        }
    });
}

startBot();
