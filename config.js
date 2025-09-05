require("dotenv").config();

module.exports = {
  ownerNumber: process.env.OWNER_NUMBER || "233xxxxxxxxx",
  botName: process.env.BOT_NAME || "OPHANOX",
  prefix: process.env.PREFIX || "!",
  sessionFolder: process.env.SESSION_FOLDER || "./session",
};
