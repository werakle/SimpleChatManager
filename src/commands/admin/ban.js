module.exports = {
    name: 'бан',
    admin: true,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        const reply = context.replyMessage;
        if (!reply && args.length < 1) {
            return context.send('❌ | Ответьте на сообщение или укажите ID: !бан [причина]');
        }
        
        const targetId = reply ? reply.senderId : parseInt(args[0]);
        const reason = (reply ? args : args.slice(1)).join(' ') || 'Не указана';
        
        if (!await permissions.check(context.senderId, context.peerId, 2)) {
            return context.send('❌ | Только администратор может банить.');
        }
        
        await context.send(`🚫 | Пользователь [id${targetId}|забанен]\n📝 | Причина: ${reason}\n⏰ | Срок: навсегда`);
    }
};