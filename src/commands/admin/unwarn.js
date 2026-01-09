module.exports = {
    name: 'разварн',
    admin: true,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        const reply = context.replyMessage;
        if (!reply && args.length < 1) {
            return context.send('❌ | Ответьте на сообщение или укажите ID: !разварн');
        }
        
        const targetId = reply ? reply.senderId : parseInt(args[0]);
        
        const targetUser = await db.getUser(targetId);
        targetUser.warns = Math.max(0, (targetUser.warns || 0) - 1);
        await db.saveUser(targetId, targetUser);
        
        await context.send(`✅ | Снято предупреждение у [id${targetId}|пользователя]\n🔢 | Осталось варнов: ${targetUser.warns}/3`);
    }
};