module.exports = {
    name: 'мут',
    admin: true,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        const reply = context.replyMessage;
        if (!reply && args.length < 2) {
            return context.send('❌ | Ответьте на сообщение или укажите ID: !мут [время] [причина]');
        }
        
        const targetId = reply ? reply.senderId : parseInt(args[0]);
        const time = reply ? args[0] : args[1];
        const reason = (reply ? args.slice(1) : args.slice(2)).join(' ') || 'Не указана';
        
        if (!await permissions.check(context.senderId, context.peerId, 1)) {
            return context.send('❌ | У вас нет прав для мута.');
        }
        
        await context.send(`🔇 | Пользователь [id${targetId}|замучен] на ${time}\n📝 | Причина: ${reason}`);
    }
};