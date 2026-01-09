module.exports = {
    name: 'find',
    admin: false,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        if (args.length < 1) {
            return context.send('❌ | Используйте: /find @username или /find [ID пользователя]');
        }
        
        let targetId;
        const input = args[0];
        
        if (input.startsWith('@') || input.startsWith('[id')) {
            const screenName = input.replace('@', '').replace('[id', '').replace('|', '').replace(']', '');
            
            try {
                const users = await vk.api.users.get({
                    user_ids: [screenName],
                    fields: ['online', 'last_seen', 'photo_100']
                });
                
                if (users.length > 0) {
                    targetId = users[0].id;
                } else {
                    return context.send('❌ | Пользователь не найден.');
                }
            } catch (error) {
                return context.send('❌ | Ошибка при поиске пользователя.');
            }
        } else {
            targetId = parseInt(input);
            if (isNaN(targetId)) {
                return context.send('❌ | Неверный формат ID.');
            }
        }
        
        try {
            const [vkUser, dbUser] = await Promise.all([
                vk.api.users.get({
                    user_ids: [targetId],
                    fields: ['online', 'last_seen', 'photo_100', 'city', 'country', 'bdate']
                }),
                db.getUser(targetId)
            ]);
            
            if (vkUser.length === 0) {
                return context.send('❌ | Пользователь не найден.');
            }
            
            const userData = vkUser[0];
            const userLevel = await permissions.getLevel(targetId);
            const levelName = permissions.getLevelName(userLevel);
            
            let message = `🔍 | Информация о пользователе:\n\n`;
            message += `👤 | Имя: ${userData.first_name} ${userData.last_name}\n`;
            message += `🆔 | ID: ${userData.id}\n`;
            message += `🎮 | Ник в чате: ${dbUser.nickname || 'Не установлен'}\n`;
            message += `👑 | Уровень прав: ${levelName}\n`;
            message += `⚠️ | Варнов: ${dbUser.warns || 0}/3\n`;
            
            if (userData.online) {
                message += `🟢 | Статус: В сети\n`;
            } else if (userData.last_seen) {
                const lastSeen = new Date(userData.last_seen.time * 1000);
                message += `🔴 | Был в сети: ${lastSeen.toLocaleString()}\n`;
            }
            
            if (userData.city) {
                message += `🏙️ | Город: ${userData.city.title}\n`;
            }
            
            if (userData.bdate) {
                message += `🎂 | Дата рождения: ${userData.bdate}\n`;
            }
            
            await context.send(message);
            
        } catch (error) {
            console.error(error);
            await context.send('❌ | Ошибка при получении информации.');
        }
    }
};