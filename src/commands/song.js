const yts = require('yt-search');

module.exports = {
    name: 'song',
    description: 'Play a song from YouTube.',
    async execute (sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0){
            return await sock.sendMessage(from, {text: '⚠ Please provide a song name, e.g.\n> `*.song Shape of you by Ed Sheeran`'}, {quote: msg});
        }
        const query = args.join(" ");
        try{
            const results = await yts(query);
            if (results.videos.length === 0) {
                return await sock.sendMessage(from, {text: `❌ No results found. Please try a different song!`} )
            }

            const video = results.videos[0];

            //Vido details
            const title = video.title;
            const views = video.views;
            const duration = video.timestamp;
            const author = video.author.name;
            const videoUrl = video.url;
            const thumbnail = video.thumbnail;

            const caption = `*🎵 OPHANOX MUSIC 🎵*\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Views:* ${views}\n*Uploaded by:* ${author}\n\n_Link:_ ${videoUrl}\n\n> Powered by OligoTech 🇬🇭`;
            await sock.sendMessage(from, {image: {url: thumbnail}, caption: caption}, {quoted: msg});
        }catch(error){
            console.error(error);
            await sock.sendMessage(from, {text: '❌ An error occurred while trying to play the song. Please try again later.'}, {quoted: msg});
        }
    }
}