const db = require('./database');

class Permissions {
    levels = {
        0: 'Пользователь',
        1: 'Модератор',
        2: 'Администратор',
        3: 'Главный Администратор'
    };

    async check(userId, chatId, requiredLevel) {
        const admins = await db.getAdmins();
        const admin = admins[userId];
        
        if (!admin) return false;
        if (admin.level < requiredLevel) return false;
        if (admin.chatId && admin.chatId !== chatId) return false;
        
        return true;
    }

    async getLevel(userId) {
        const admins = await db.getAdmins();
        return admins[userId]?.level || 0;
    }

    getLevelName(level) {
        return this.levels[level] || 'Пользователь';
    }
}

module.exports = new Permissions();