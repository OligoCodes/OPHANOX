async function autoReact(sock, msg, emoji) {
    const from = msg.key.remoteJid;
    try {
        await sock.sendMessage(from, {
            react: {
                text: emoji,
                key: msg.key
            }
        });
    } catch (error) {
        console.log("Error in autoReact:", error);
    }
}

module.exports =  autoReact ;