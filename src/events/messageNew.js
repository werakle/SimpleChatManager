const helpers = require('../utils/helpers');

module.exports = async (context, vk, commands, db, permissions) => {
    if (!context.text) return;
    
    const groupId = parseInt(process.env.VK_GROUP_ID);
    if (context.senderId === -groupId) return;
    
    helpers.logMessage(context);
    
    const text = context.text.trim();
    
    if (text.includes('[club' + groupId)) {
        return;
    }
    
    let prefix = null;
    
    if (text.startsWith('/')) {
        prefix = '/';
    } else if (text.startsWith('!')) {
        prefix = '!';
    } else {
        return;
    }
    
    const args = text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    console.log(`🔧 | Команда: ${commandName}, Аргументы:`, args);
    
    const command = commands[commandName];
    if (!command) {
        console.log(`❌ | Команда не найдена: ${commandName}`);
        return;
    }
    
    const user = await db.getUser(context.senderId);
    const chat = await db.getChat(context.peerId);
    
    if (command.admin && !await permissions.check(context.senderId, context.peerId, 1)) {
        console.log(`🚫 | Недостаточно прав для команды ${commandName}`);
        return context.send('❌ | У вас нет прав для выполнения этой команды.');
    }
    
    try {
        console.log(`▶️ | Выполнение команды: ${commandName}`);
        await command.execute(context, vk, args, db, permissions, user, chat);
        console.log(`✅ | Команда выполнена: ${commandName}`);
    } catch (error) {
        console.error(`❌ | Ошибка выполнения ${commandName}:`, error);
        await context.send('⚠️ | Произошла ошибка при выполнении команды.');
    }
};