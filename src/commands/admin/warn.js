module.exports = {
    name: 'варн',
    admin: true,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        const reply = context.replyMessage;
        if (!reply && args.length < 1) {
            return context.send('❌ | Ответьте на сообщение или укажите ID: !варн [причина]');
        }
        
        const targetId = reply ? reply.senderId : parseInt(args[0]);
        const reason = (reply ? args : args.slice(1)).join(' ') || 'Не указана';
        
        const targetUser = await db.getUser(targetId);
        targetUser.warns = (targetUser.warns || 0) + 1;
        await db.saveUser(targetId, targetUser);
        
        let message = `⚠️ | Пользователь [id${targetId}|получил предупреждение]\n`;
        message += `📝 | Причина: ${reason}\n`;
        message += `🔢 | Количество варнов: ${targetUser.warns}/3`;
        
        if (targetUser.warns >= 3) {
            message += `\n🚨 | Достигнут лимит варнов!`;
        }
        
        await context.send(message);
    }
};