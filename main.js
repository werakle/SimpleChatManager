const fs = require('fs-extra');
const path = require('path');

const db = require('./src/utils/database');
const permissions = require('./src/utils/permissions');
const messageNew = require('./src/events/messageNew');
const messageEvent = require('./src/events/messageEvent');

let commands = {};

async function loadCommands() {
    commands = {};
    const commandFolders = ['user', 'admin'];
    
    for (const folder of commandFolders) {
        const commandPath = path.join(__dirname, 'src/commands', folder);
        
        if (!fs.existsSync(commandPath)) {
            console.log(`⚠️  | Папка ${commandPath} не найдена`);
            continue;
        }
        
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandPath, file));
                commands[command.name] = command;
                console.log(`✅ | Загружена команда: ${command.name}`);
            } catch (error) {
                console.error(`❌ | Ошибка загрузки команды ${file}:`, error.message);
            }
        }
    }
    console.log(`📦 | Всего загружено команд: ${Object.keys(commands).length}`);
}

module.exports = async (vk) => {
    try {
        console.log('🔄 | Инициализация базы данных...');
        await db.initialize();
        
        console.log('🔄 | Загрузка команд...');
        await loadCommands();
        
        const groupId = parseInt(process.env.VK_GROUP_ID);
        
        vk.updates.on('message_new', async (context) => {
            try {
                if (context.senderId === -groupId) {
                    return;
                }
                
                if (context.isChat && context.eventType === 'chat_invite_user') {
                    const memberId = context.eventMemberId;
                    
                    if (memberId === -groupId) {
                        await context.send({
                            message: `✅ | Вы успешно добавили меня в чат!\n👑 | Выдайте мне админ-права (звездочку ★) в настройках беседы\n📝 | Затем пропишите /done чтобы стать главным администратором\n\n📋 | Доступные команды:\n✅ /help - список команд\n🎮 /кн, /кнб - мини-игры\n🛠️ !мут, !варн, !кик - модерация`
                        });
                        return;
                    }
                }
                
                await messageNew(context, vk, commands, db, permissions);
            } catch (error) {
                console.error('❌ | Ошибка обработки сообщения:', error);
            }
        });

        vk.updates.on('message_event', async (context) => {
            try {
                await messageEvent(context, vk, commands, db);
            } catch (error) {
                console.error('❌ | Ошибка обработки события:', error);
            }
        });

        vk.updates.on('error', (error) => {
            console.error('❌ | Ошибка Long Poll:', error);
        });

        await vk.updates.start();
        console.log('🌐 | Long Poll запущен');
        console.log('📊 | Ожидание сообщений...\n');
        
    } catch (error) {
        console.error('❌ | Ошибка инициализации бота:', error);
        throw error;
    }
};