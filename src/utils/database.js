const fs = require('fs-extra');
const path = require('path');

class Database {
    constructor() {
        this.basePath = path.join(__dirname, '../../DataBase');
        this.usersPath = path.join(this.basePath, 'Users');
        this.chatsPath = path.join(this.basePath, 'Chats');
        this.adminsPath = path.join(this.basePath, 'Admins.json');
    }

    async initialize() {
        await fs.ensureDir(this.basePath);
        await fs.ensureDir(this.usersPath);
        await fs.ensureDir(this.chatsPath);
        
        if (!await fs.pathExists(this.adminsPath)) {
            await fs.writeJSON(this.adminsPath, {});
        }
    }

    async getUser(userId) {
        const filePath = path.join(this.usersPath, `${userId}.json`);
        if (await fs.pathExists(filePath)) {
            return await fs.readJSON(filePath);
        }
        return { id: userId, nickname: null, warns: 0 };
    }

    async saveUser(userId, data) {
        const filePath = path.join(this.usersPath, `${userId}.json`);
        await fs.writeJSON(filePath, data);
    }

    async getChat(chatId) {
        const filePath = path.join(this.chatsPath, `${chatId}.json`);
        if (await fs.pathExists(filePath)) {
            return await fs.readJSON(filePath);
        }
        return { id: chatId, setup: false, admins: {}, settings: {} };
    }

    async saveChat(chatId, data) {
        const filePath = path.join(this.chatsPath, `${chatId}.json`);
        await fs.writeJSON(filePath, data);
    }

    async getAdmins() {
        return await fs.readJSON(this.adminsPath);
    }

    async saveAdmins(data) {
        await fs.writeJSON(this.adminsPath, data);
    }

    async setAdmin(userId, level, chatId = null) {
        const admins = await this.getAdmins();
        admins[userId] = { level, chatId };
        await this.saveAdmins(admins);
    }

    async removeAdmin(userId) {
        const admins = await this.getAdmins();
        delete admins[userId];
        await this.saveAdmins(admins);
    }
}

module.exports = new Database();