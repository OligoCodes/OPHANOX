const settings = require('../settings');

/**
 * Checks if the sender is a bot owner.
 * @param {object} msg - The message object from WhatsApp.
 * @returns {boolean}
 */
function isOwner(msg) {
    let senderId = msg.key.participant || msg.participant || msg.key.remoteJid;
    // Remove :number from group JIDs if present
    if (senderId.includes(':')) senderId = senderId.split(':')[0];
    // Extract just the number part from senderId
    const senderNum = senderId.replace(/\D/g, '');

    // Support multiple owners (array or comma-separated string)
    let ownerNumbers = settings.ownerNumber;
    if (typeof ownerNumbers === 'string') {
        ownerNumbers = ownerNumbers.split(',').map(num => num.replace(/\D/g, ''));
    } else if (Array.isArray(ownerNumbers)) {
        ownerNumbers = ownerNumbers.map(num => num.replace(/\D/g, ''));
    } else {
        ownerNumbers = [];
    }

    return ownerNumbers.includes(senderNum);
}

module.exports = isOwner;