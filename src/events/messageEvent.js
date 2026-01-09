const helpers = require('../utils/helpers');
const { mafiaGames } = require('../../games/mafia');

module.exports = async (context, vk, commands, db) => {
    helpers.logEvent(context);
    
    if (!context.eventPayload) return;
    
    let payload;
    try {
        payload = typeof context.eventPayload === 'string' 
            ? JSON.parse(context.eventPayload) 
            : context.eventPayload;
    } catch (error) {
        console.error('❌ | Ошибка парсинга payload:', error);
        return;
    }
    
    if (payload.type === 'rps') {
        const userChoice = payload.choice;
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * 3)];
        
        let result = 'Ничья!';
        if ((userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')) {
            result = 'Ты победил!';
        } else if (userChoice !== botChoice) {
            result = 'Бот победил!';
        }
        
        const emoji = { rock: '✊', paper: '✋', scissors: '✌️' };
        
        await context.send({
            message: `🔄 | Твой выбор: ${emoji[userChoice]}\n🤖 | Выбор бота: ${emoji[botChoice]}\n🎯 | Результат: ${result}`
        });
        
        return context.answer({
            type: 'show_snackbar',
            text: `Результат: ${result}`
        });
    }
    
    if (payload.type === 'ttt') {
        const cell = payload.cell;
        const row = Math.floor(cell / 3);
        const col = cell % 3;
        
        let board = [
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜']
        ];
        
        board[row][col] = '❌';
        
        let botCell;
        do {
            botCell = Math.floor(Math.random() * 9);
        } while (botCell === cell);
        
        const botRow = Math.floor(botCell / 3);
        const botCol = botCell % 3;
        board[botRow][botCol] = '⭕';
        
        const boardText = board.map(row => row.join('')).join('\n');
        
        const keyboard = JSON.stringify({
            inline: true,
            buttons: [
                [
                    { action: { type: 'callback', label: '1', payload: JSON.stringify({type: "ttt", cell: 0}) } },
                    { action: { type: 'callback', label: '2', payload: JSON.stringify({type: "ttt", cell: 1}) } },
                    { action: { type: 'callback', label: '3', payload: JSON.stringify({type: "ttt", cell: 2}) } }
                ],
                [
                    { action: { type: 'callback', label: '4', payload: JSON.stringify({type: "ttt", cell: 3}) } },
                    { action: { type: 'callback', label: '5', payload: JSON.stringify({type: "ttt", cell: 4}) } },
                    { action: { type: 'callback', label: '6', payload: JSON.stringify({type: "ttt", cell: 5}) } }
                ],
                [
                    { action: { type: 'callback', label: '7', payload: JSON.stringify({type: "ttt", cell: 6}) } },
                    { action: { type: 'callback', label: '8', payload: JSON.stringify({type: "ttt", cell: 7}) } },
                    { action: { type: 'callback', label: '9', payload: JSON.stringify({type: "ttt", cell: 8}) } }
                ]
            ]
        });
        
        await context.send({
            message: `❌⭕ | Крестики-нолики\n\n${boardText}\n\nХод игрока: ❌`,
            keyboard: keyboard
        });
        
        return context.answer({
            type: 'show_snackbar',
            text: 'Ход сделан!'
        });
    }
    
    if (payload.type === 'mafia_join') {
        const chatId = context.peerId;
        const game = mafiaGames.get(chatId);
        
        if (game && game.phase === 'registration') {
            const userInfo = await vk.api.users.get({
                user_ids: [context.userId]
            });
            
            const username = `${userInfo[0].first_name} ${userInfo[0].last_name}`;
            
            if (game.addPlayer(context.userId, username)) {
                await context.send(`➕ | [id${context.userId}|${username}] присоединился к игре!\n👥 | Игроков: ${game.players.size}`);
            } else {
                await context.send(`⚠️  | [id${context.userId}|${username}] уже в игре!`);
            }
        }
        
        return context.answer({
            type: 'show_snackbar',
            text: 'Присоединение обработано'
        });
    }
    
    if (payload.type === 'mafia_start') {
        const chatId = context.peerId;
        const game = mafiaGames.get(chatId);
        
        if (game && game.creatorId === context.userId) {
            if (game.startGame()) {
                await context.send('🎮 | Игра начинается! Роли розданы.');
            } else {
                await context.send('❌ | Недостаточно игроков (минимум 4)');
            }
        }
        
        return context.answer({
            type: 'show_snackbar',
            text: 'Запуск игры'
        });
    }
};