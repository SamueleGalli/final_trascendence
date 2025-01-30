export function calculateXpPlayers(data, winner, loser) {
        // Calculate XP Winner (Gains XP)
        if (data.players[loser].level <= data.players[winner].level)
            data.players[winner].xp += 20;
        else if (data.players[loser].level > data.players[winner].level)
            data.players[winner].xp += 20 * (data.players[loser].level - data.players[winner].level + 1);
        data.players[winner].xpHistory.push(data.players[winner].xp);

        // Calculate XP Loser (Lose XP)
        if (data.players[loser].level >= data.players[winner].level)
            data.players[loser].xp -= 20;
        else if (data.players[loser].level < data.players[winner].level)
            data.players[loser].xp -= 20 * (data.players[winner].level - data.players[loser].level + 1);

        // Prevent negative XP
        if (data.players[loser].xp < 0)
            data.players[loser].xp = 0;
        data.players[loser].xpHistory.push(data.players[loser].xp);
    }


export function calculateLevelPlayers(data, winner, loser) {
    // If player has enough XP to level up
    if(data.players[winner].xp >= data.players[winner].pointsToNextLevel) {
        data.players[winner].level += 1;
        data.players[winner].pointsToLoseLevel = data.players[winner].pointsToNextLevel;
        data.players[winner].pointsToNextLevel *= 2;
    }
    // If player lost enough XP to level down    
    if (data.players[loser].xp <= data.players[loser].pointsToLoseLevel) {
        if (data.players[loser].pointsToLoseLevel > 0) {
            data.players[loser].level -= 1;
            data.players[loser].pointsToNextLevel = data.players[winner].pointsToLoseLevel;
            if (data.players[loser].level == 1)
                data.players[loser].pointsToLoseLevel = 0;
            else 
                data.players[loser].pointsToLoseLevel /= 2; 
        }
    }      
}