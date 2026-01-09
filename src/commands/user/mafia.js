const { MafiaGame, mafiaGames } = require('../../../games/mafia');

module.exports = {
    name: 'мафия',
    admin: false,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        if (!context.isChat) {
            return context.send('❌ | Игра доступна только в беседах!');
        }
        
        const chatId = context.peerId;
        
        if (mafiaGames.has(chatId)) {
            return context.send('❌ | Игра уже идет в этой беседе!');
        }
        
        const game = new MafiaGame(chatId, context.senderId);
        mafiaGames.set(chatId, game);
        
        const keyboard = JSON.stringify({
            inline: true,
            buttons: [
                [
                    {
                        action: {
                            type: 'callback',
                            label: '➕ Присоединиться',
                            payload: JSON.stringify({type: "mafia_join"})
                        },
                        color: 'positive'
                    },
                    {
                        action: {
                            type: 'callback',
                            label: '❌ Выйти',
                            payload: JSON.stringify({type: "mafia_leave"})
                        },
                        color: 'negative'
                    }
                ],
                [
                    {
                        action: {
                            type: 'callback',
                            label: '▶️ Начать игру',
                            payload: JSON.stringify({type: "mafia_start"})
                        },
                        color: 'primary'
                    }
                ]
            ]
        });

        await context.send({
            message: `🕵️  | Игра "Мафия" началась!\n\n👥 | Для участия нажмите кнопку "Присоединиться"\n⏰ | Регистрация: 60 секунд\n\n📋 | Правила:\n🌃 Ночь - мафия убивает, доктор лечит, детектив проверяет\n🌅 День - обсуждение и голосование`,
            keyboard: keyboard
        });
        
        setTimeout(async () => {
            if (mafiaGames.has(chatId)) {
                const game = mafiaGames.get(chatId);
                if (game.phase === 'registration' && game.players.size >= 4) {
                    game.startGame();
                    await context.send('🎮 | Регистрация окончена! Игра начинается...');
                } else {
                    mafiaGames.delete(chatId);
                    await context.send('❌ | Недостаточно игроков для начала игры (минимум 4).');
                }
            }
        }, 60000);
    }
};