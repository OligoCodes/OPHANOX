const axios = require('axios');

module.exports = {
    name: 'anime',
    description: 'Get an anime character image by name. Usage: .anime <character>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return sock.sendMessage(from, { text: 'Usage: .anime <character>\nExample: .anime goku' }, { quoted: msg });
        }
        const query = args.join(' ');
        const graphqlQuery = {
            query: `
                query ($search: String) {
                    Character(search: $search) {
                        name {
                            full
                        }
                        image {
                            large
                        }
                        siteUrl
                    }
                }
            `,
            variables: {
                search: query
            }
        };
        try {
            const res = await axios.post('https://graphql.anilist.co', graphqlQuery, {
                headers: { 'Content-Type': 'application/json' }
            });
            const char = res.data.data.Character;
            if (char && char.image && char.image.large) {
                await sock.sendMessage(
                    from,
                    {
                        image: { url: char.image.large },
                        caption: `*${char.name.full}*\n[View on AniList](${char.siteUrl})`
                    },
                    { quoted: msg }
                );
            } else {
                await sock.sendMessage(from, { text: `❌ No image found for "${query}".` }, { quoted: msg });
            }
        } catch (err) {
            await sock.sendMessage(from, { text: '❌ Could not fetch anime character right now.' }, { quoted: msg });
        }
    }
};