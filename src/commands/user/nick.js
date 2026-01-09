module.exports = {
    name: 'ник',
    admin: false,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        if (args.length < 1) {
            return context.send('❌ | Используйте: /ник [ваш никнейм]');
        }
        
        const nickname = args.join(' ').trim();
        if (nickname.length > 20) {
            return context.send('❌ | Никнейм слишком длинный (макс. 20 символов)');
        }
        
        user.nickname = nickname;
        await db.saveUser(context.senderId, user);
        
        await context.send(`✅ | Ваш никнейм установлен: ${nickname}`);
    }
};