module.exports = {
    name: 'кик',
    admin: true,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        const reply = context.replyMessage;
        if (!reply && args.length < 1) {
            return context.send('❌ | Ответьте на сообщение или укажите ID: !кик [причина]');
        }
        
        const targetId = reply ? reply.senderId : parseInt(args[0]);
        const reason = (reply ? args : args.slice(1)).join(' ') || 'Не указана';
        
        if (!await permissions.check(context.senderId, context.peerId, 1)) {
            return context.send('❌ | У вас нет прав для кика.');
        }
        
        try {
            await vk.api.messages.removeChatUser({
                chat_id: context.peerId - 2000000000,
                user_id: targetId
            });
            
            await context.send(`👢 | Пользователь [id${targetId}|исключен]\n📝 | Причина: ${reason}`);
        } catch (error) {
            await context.send('❌ | Не удалось исключить пользователя.');
        }
    }
};