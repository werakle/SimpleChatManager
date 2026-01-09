module.exports = {
    name: 'кнб',
    admin: false,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        const keyboard = JSON.stringify({
            inline: true,
            buttons: [
                [
                    { 
                        action: { 
                            type: 'callback', 
                            label: '✊ Камень', 
                            payload: JSON.stringify({type: "rps", choice: "rock"})
                        }
                    },
                    { 
                        action: { 
                            type: 'callback', 
                            label: '✋ Бумага', 
                            payload: JSON.stringify({type: "rps", choice: "paper"})
                        }
                    }
                ],
                [
                    { 
                        action: { 
                            type: 'callback', 
                            label: '✌️ Ножницы', 
                            payload: JSON.stringify({type: "rps", choice: "scissors"})
                        }
                    }
                ]
            ]
        });

        await context.send({
            message: '✊✋✌️ | Камень-ножницы-бумага\n\nВыберите ваш вариант:',
            keyboard: keyboard
        });
    }
};