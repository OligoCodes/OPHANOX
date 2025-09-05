const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const { sessionFolder, botName, ownerNumber, prefix } = require("./config");
const handleCommand = require("./src/handlers/commandHandler");
const { getGroup } = require('./database/db');
const fs = require('fs');
const path = require('path');

let credsSent = false; // To ensure creds are sent only once per session

async function startOphanox() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) qrcode.generate(qr, { small: true });

        if (connection === "close") {
            console.log("❌ Connection closed. Reconnecting...");
            startOphanox();
        } else if (connection === "open") {
            console.log(`${botName} CONNECTED ✅!`);
            // No need to send creds here; will send to first user who messages after login
        }
    });

    sock.ev.on("group-participants.update", async (event) => {
        const settings = await getGroup(event.id);

        for (let participant of event.participants) {
            if (event.action === "add" && settings.welcome) {
                await sock.sendMessage(event.id, 
                    { text: `😘 Welcome @${participant.split("@")[0]} to the group!`,
                     mentions: [participant] });
            }
            if (event.action === "remove" && settings.welcome) {
                await sock.sendMessage(event.id, 
                    { text: `👋 Goodbye @${participant.split("@")[0]}!`,
                     mentions: [participant] });
            }
        }
    });

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        // Send creds.json to the first user who messages after login
        if (!credsSent) {
            credsSent = true;
            const credsPath = path.join(sessionFolder, 'creds.json');
            const channelLink = 'https://whatsapp.com/channel/0029VbBVKfQI1rcsEUloFW18';
            try {
                if (fs.existsSync(credsPath)) {
                    await sock.sendMessage(
                        msg.key.participant || msg.key.remoteJid,
                        {
                            document: { url: credsPath },
                            mimetype: 'application/json',
                            fileName: 'creds.json',
                            caption: `*🤖 Ophanox OPHANOX Session File*\n\nHere is your *WhatsApp session file* (\`creds.json\`).\n\n🔒 *Keep this file safe!* It allows you to restore your bot session without scanning QR again.\n\n*How to use:*\n1. If you move your bot to a new host, upload this file to your session folder before starting the bot.\n2. Never share this file with anyone you don't trust!\n\n📢 *Join our official WhatsApp channel for updates and full setup instructions:*\n${channelLink}\n\nThank you for using *Ophanox OPHANOX*!`
                        },
                        { quoted: msg }
                    );
                }
            } catch (err) {
                console.log('Failed to send creds:', err);
            }
        }

        const chatId = msg.key.remoteJid;
        const settings = await getGroup(chatId);

        // Antilink
        if (
            settings.antilink &&
            msg.message?.extendedTextMessage?.text &&
            /https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+/gi.test(msg.message.extendedTextMessage.text)
        ) {
            await sock.sendMessage(chatId, { text: `🚫 Link detected!, links are not allowed\n> WARNING 😡` });
            await sock.groupParticipantsUpdate(chatId, { delete: msg.key });
        }

        await handleCommand(sock, msg, botName, ownerNumber, prefix);
    });
}

startOphanox();