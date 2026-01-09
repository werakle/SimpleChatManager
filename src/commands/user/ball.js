module.exports = {
    name: 'шар',
    admin: false,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        if (args.length < 1) {
            return context.send('❌ | Задайте вопрос! Пример: /шар Я буду богатым?');
        }
        
        const answers = [
            '✅ | Да',
            '❌ | Нет',
            '🤔 | Возможно',
            '🌀 | Ответа не будет',
            '👨‍💻 | Ответит только Давыдов'
        ];
        
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        const question = args.join(' ');
        
        await context.send(`🎱 | Вопрос: ${question}\n💭 | Ответ: ${randomAnswer}`);
    }
};