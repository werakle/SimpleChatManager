module.exports = {
    logMessage(context) {
        console.log(`\n📨 | Новое сообщение:`);
        console.log(`   👤 | От: ${context.senderId}`);
        console.log(`   💬 | Текст: ${context.text || '(нет текста)'}`);
        console.log(`   🏠 | Чат: ${context.peerId}`);
        console.log(`   🏷️ | Тип: ${context.isChat ? 'беседа' : 'личка'}`);
    },
    
    logEvent(context) {
        console.log(`\n🎯 | Событие:`);
        console.log(`   👤 | От: ${context.userId}`);
        console.log(`   🔘 | Payload:`, context.eventPayload);
    }
};