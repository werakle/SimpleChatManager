module.exports = {
    name: 'done',
    admin: false,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        if (!context.isChat) {
            return context.send('❌ | Эта команда работает только в беседах!');
        }
        
        const chatData = await db.getChat(context.peerId);
        
        if (chatData.setup) {
            return context.send('❌ | Настройка для этого чата уже завершена!');
        }
        
        try {
            const chatMembers = await vk.api.messages.getConversationMembers({
                peer_id: context.peerId
            });
            
            const botId = -parseInt(process.env.VK_GROUP_ID);
            const botMember = chatMembers.items.find(member => member.member_id === botId);
            
            if (!botMember) {
                return context.send('❌ | Бот не найден в списке участников беседы!');
            }
            
            const isBotAdmin = botMember.is_admin || botMember.is_owner;
            
            if (!isBotAdmin) {
                return context.send('❌ | Сначала выдайте мне права администратора в беседе!');
            }
            
            await db.setAdmin(context.senderId, 3, context.peerId);
            
            chatData.setup = true;
            chatData.owner = context.senderId;
            await db.saveChat(context.peerId, chatData);
            
            await context.send(`👑 | Поздравляю! [id${context.senderId}|Вы] стали главным администратором этого чата!\n\n📋 | Теперь вам доступны:\n🛠️ !мут, !варн, !кик - модерация\n👑 !админ - назначение других админов\n\n🔧 | Используйте /help для просмотра всех команд`);
            
        } catch (error) {
            console.error(error);
            if (error.code === 917) {
                await context.send('❌ | У меня нет прав для просмотра участников беседы. Выдайте мне админ права!');
            } else {
                await context.send('❌ | Ошибка при проверке прав.');
            }
        }
    }
};