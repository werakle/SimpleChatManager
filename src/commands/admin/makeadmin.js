module.exports = {
    name: 'админ',
    admin: true,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        if (args.length < 2) {
            return context.send('❌ | Используйте: !админ [уровень 1-3] [@username или ID]');
        }
        
        const level = parseInt(args[0]);
        const targetInput = args[1];
        
        if (level < 1 || level > 3) {
            return context.send('❌ | Уровень должен быть от 1 до 3');
        }
        
        const userLevel = await permissions.getLevel(context.senderId);
        if (userLevel < 3) {
            return context.send('❌ | Только главный администратор может назначать админов.');
        }
        
        let targetId;
        
        if (targetInput.startsWith('@')) {
            const screenName = targetInput.replace('@', '').trim();
            
            try {
                const users = await vk.api.users.get({
                    user_ids: [screenName]
                });
                
                if (users.length === 0) {
                    return context.send('❌ | Пользователь не найден.');
                }
                
                targetId = users[0].id;
            } catch (error) {
                return context.send('❌ | Ошибка поиска пользователя.');
            }
        } else if (targetInput.startsWith('[id')) {
            const idMatch = targetInput.match(/\[id(\d+)\|/);
            if (idMatch) {
                targetId = parseInt(idMatch[1]);
            } else {
                targetId = parseInt(targetInput.replace('[id', '').replace(']', ''));
            }
        } else if (targetInput.startsWith('https://vk.com/')) {
            const screenName = targetInput.split('/').pop();
            
            try {
                const users = await vk.api.users.get({
                    user_ids: [screenName]
                });
                
                if (users.length === 0) {
                    return context.send('❌ | Пользователь не найден.');
                }
                
                targetId = users[0].id;
            } catch (error) {
                return context.send('❌ | Ошибка поиска пользователя.');
            }
        } else {
            targetId = parseInt(targetInput);
            if (isNaN(targetId)) {
                return context.send('❌ | Неверный формат. Используйте: @username или ID');
            }
        }
        
        if (targetId === context.senderId) {
            return context.send('❌ | Нельзя изменить свои собственные права.');
        }
        
        await db.setAdmin(targetId, level, context.peerId);
        const levelName = permissions.getLevelName(level);
        
        try {
            const targetUser = await vk.api.users.get({
                user_ids: [targetId],
                name_case: 'gen'
            });
            
            await context.send(`👑 | Пользователю [id${targetId}|${targetUser[0].first_name} ${targetUser[0].last_name}] назначены права: ${levelName}`);
        } catch (error) {
            await context.send(`👑 | Пользователю [id${targetId}|ID:${targetId}] назначены права: ${levelName}`);
        }
    }
};