const mafiaGames = new Map();

class MafiaGame {
    constructor(chatId, creatorId) {
        this.chatId = chatId;
        this.creatorId = creatorId;
        this.players = new Map();
        this.phase = 'registration';
        this.roles = [];
    }
    
    addPlayer(userId, username) {
        if (this.players.has(userId)) return false;
        this.players.set(userId, { id: userId, name: username, role: null, alive: true });
        return true;
    }
    
    startGame() {
        if (this.players.size < 4) return false;
        
        const playerCount = this.players.size;
        const mafiaCount = Math.max(1, Math.floor(playerCount / 3));
        const doctorCount = playerCount >= 8 ? 1 : 0;
        const detectiveCount = playerCount >= 6 ? 1 : 0;
        
        let roles = [];
        roles = roles.concat(Array(mafiaCount).fill('mafia'));
        roles = roles.concat(Array(doctorCount).fill('doctor'));
        roles = roles.concat(Array(detectiveCount).fill('detective'));
        roles = roles.concat(Array(playerCount - roles.length).fill('civilian'));
        
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }
        
        let i = 0;
        for (const player of this.players.values()) {
            player.role = roles[i];
            i++;
        }
        
        this.phase = 'night';
        return true;
    }
}

module.exports = {
    MafiaGame,
    mafiaGames
};