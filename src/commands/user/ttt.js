module.exports = {
    name: 'кн',
    admin: false,
    execute: async (context, vk, args, db, permissions, user, chat) => {
        const keyboard = JSON.stringify({
            inline: true,
            buttons: [
                [
                    { 
                        action: { 
                            type: 'callback', 
                            label: '1', 
                            payload: JSON.stringify({type: "ttt", cell: 0})
                        }
                    },
                    { 
                        action: { 
                            type: 'callback', 
                            label: '2', 
                            payload: JSON.stringify({type: "ttt", cell: 1})
                        }
                    },
                    { 
                        action: { 
                            type: 'callback', 
                            label: '3', 
                            payload: JSON.stringify({type: "ttt", cell: 2})
                        }
                    }
                ],
                [
                    { 
                        action: { 
                            type: 'callback', 
                            label: '4', 
                            payload: JSON.stringify({type: "ttt", cell: 3})
                        }
                    },
                    { 
                        action: { 
                            type: 'callback', 
                            label: '5', 
                            payload: JSON.stringify({type: "ttt", cell: 4})
                        }
                    },
                    { 
                        action: { 
                            type: 'callback', 
                            label: '6', 
                            payload: JSON.stringify({type: "ttt", cell: 5})
                        }
                    }
                ],
                [
                    { 
                        action: { 
                            type: 'callback', 
                            label: '7', 
                            payload: JSON.stringify({type: "ttt", cell: 6})
                        }
                    },
                    { 
                        action: { 
                            type: 'callback', 
                            label: '8', 
                            payload: JSON.stringify({type: "ttt", cell: 7})
                        }
                    },
                    { 
                        action: { 
                            type: 'callback', 
                            label: '9', 
                            payload: JSON.stringify({type: "ttt", cell: 8})
                        }
                    }
                ]
            ]
        });

        await context.send({
            message: '❌⭕ | Крестики-нолики\n\n⬜⬜⬜\n⬜⬜⬜\n⬜⬜⬜\n\nВаш ход: ❌',
            keyboard: keyboard
        });
    }
};