const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "groupSettings.json");

function loadDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, "{}");
    }
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function getGroup(id) {
    const db = loadDB();
    return db[id] || {};
}

function updateGroup(id, updates) {
    const db = loadDB();
    db[id] = { ...db[id], ...updates };
    saveDB(db);
}

function ensureGroup(id) {
    const db = loadDB();
    if (!db[id]) {
        db[id] = { welcome: false, goodbye: false };
        saveDB(db);
    }
    return db[id];
}

module.exports = { loadDB, saveDB, getGroup, updateGroup, ensureGroup };
