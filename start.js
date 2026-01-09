require('dotenv').config();

if (!process.env.VK_GROUP_TOKEN) {
    console.error('❌ | VK_GROUP_TOKEN не установлен в .env файле');
    process.exit(1);
}

if (!process.env.VK_GROUP_ID) {
    console.error('❌ | VK_GROUP_ID не установлен в .env файле');
    process.exit(1);
}

const { VK } = require('vk-io');

const vk = new VK({
    token: process.env.VK_GROUP_TOKEN,
    apiVersion: '5.199',
    pollingGroupId: parseInt(process.env.VK_GROUP_ID)
});

async function startBot() {
    try {
        console.log('🚀 | Запуск SAMP Chat Manager...');
        console.log(`👤 | Разработчик: Memphis`);
        console.log(`📅 | Дата: ${new Date().toLocaleString()}`);
        console.log(`👥 | ID группы: ${process.env.VK_GROUP_ID}`);
        
        const main = require('./main.js');
        
        await main(vk);
        
        console.log('✅ | Бот успешно запущен!');
        console.log(`🔧 | Префикс команд: / (пользователь), ! (админ)`);
        console.log(`👑 | Уровни админки: 1-Модератор, 2-Админ, 3-Главный`);
        
    } catch (error) {
        console.error('❌ | Ошибка при запуске:', error.message);
        if (error.code === 'EACCES') {
            console.error('⚠️  | Проверьте права доступа к файлам');
        } else if (error.code === 'ENOENT') {
            console.error('⚠️  | Отсутствуют необходимые файлы');
        } else if (error.message.includes('token')) {
            console.error('⚠️  | Проверьте токен в .env файле');
        }
        process.exit(1);
    }
}

startBot();