/**
 * Checks if the user is an admin in the group.
 * @param {object} sock - The Baileys socket/client.
 * @param {object} msg - The message object from WhatsApp.
 * @returns {Promise<boolean>}
 */
async function isAdmin(sock, msg) {
    const from = msg.key.remoteJid;
    let senderId = msg.key.participant || msg.participant || msg.key.remoteJid;
    if (senderId.includes(':')) senderId = senderId.split(':')[0];
    // Only check admin in groups
    if (!from.endsWith('@g.us')) return false;

    // Get group metadata using Baileys
    const metadata = await sock.groupMetadata(from);
    // All admin JIDs in the group
    const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id.split(':')[0]); // Remove device suffix if present

    // Compare full JID (e.g., 233551448745@s.whatsapp.net)
    return admins.includes(senderId);
}

module.exports = isAdmin;