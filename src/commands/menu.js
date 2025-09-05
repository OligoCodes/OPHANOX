const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'menu',
    description: 'Display the menu options.',
    async execute (sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? msg.key.participant : from;
        const userName = sender.split('@')[0];

        botImage = path.join(__dirname, '../../assets/images/OPHANOX.png');
        const botAvatar = fs.readFileSync(botImage);
        const menuMessage = `*🤖 ${botName} BOT MENU*\n\n╭━━━━━[ 🧩 DEV PROFILE ]━━━━━━╮\n┃ ◆ *Name*        :   Joseph Bonsu 🇬🇭\n┃ ◆ *Status*      :   🆓\n┃ ◆ *Device*      :   Desktop 💻\n┃ ◆ *Commands*    :   4️⃣5️⃣\n┃ ◆ *Last Deployed* :   some minutes ago\n╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n‼ *INFO* Bot is running locally in developer mode.\n\n╭━━━━━━[🔧 COMMANDS]━━━━━━╮\n⚙\n┏▣ ◈ *📌 BASIC MENU* ◈\n│➽ .owner\n│➽ .menu\n│➽ .ping\n│➽ .alive\n│➽ .whoami\n┗▣\n\n┏▣ ◈ *🤓 OWNER MENU* ◈\n│➽ .pair┗▣\n\n┏▣ ◈ *👤 ADMIN MENU* ◈\n│➽ .kick\n│➽ .lock\n│➽ .unlock\n│➽ .promote\n│➽ .demote\n│➽ .mute\n│➽ .unmute\n│➽ .tagadmins\n┗▣\n\n┏▣ ◈ *👥 GROUP MENU* ◈\n│➽ .enable\n│➽ .disable\n│➽ .tagall\n│➽ .welcome\n│➽ .goodbye\n│➽ .groupinfo\n┗▣\n\n┏▣ ◈ *⚙ FUNCTIONAL MENU* ◈\n│➽ .crypto\n│➽ .currency\n│➽ .define\n│➽ .exrate\n│➽ .news\n│➽ .weather\n│➽ .wiki\n│➽ .time\n┗▣\n\n┏▣ ◈ *🎉 FUN MENU* ◈\n│➽ .anime\n│➽ .joke\n│➽ .numf\n│➽ .tictactoe\n│➽ .meme\n│➽ .quote\n│➽ .fact\n│➽ .8ball\n│➽ .dogpic\n│➽ .catpic\n┗▣\n\n┏▣ ◈ *🛠 UTILITY MENU* ◈\n│➽ .del\n│➽ .remind\n│➽ .calc\n│➽ .qr\n│➽ .shorten\n│➽ .translate\n│➽ .tts\n│➽ .pfp\n┗▣\n\n┏▣ ◈ *🎬 MEDIA MENU* ◈\n│➽ .song\n│➽ .gif\n┗▣\n⚙\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n> *Powered by OligoTech GH* 🇬🇭\n\n🔗 *Join Channel* :  \nhttps://whatsapp.com/channel/0029VbBVKfQI1rcsEUloFW18/`;
        await sock.sendMessage(from, {image: botAvatar, caption: menuMessage }, { quoted: msg });
    }
   
}