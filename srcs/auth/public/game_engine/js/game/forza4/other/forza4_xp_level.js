export function calculateXpF4Players(data, winner, loser) {
    // Calculate XP Winner (Gains XP)
    if (data.players[winner].level >= data.players[loser].level)
       data.players[winner].xp += 20;
   else  //level of winner is lower than loser (beats a higher player) gains more XP 
       data.players[winner].xp += 20 * (data.players[loser].level - data.players[winner].level + 1);

   // Calculate XP Loser (Lose XP)
   if (data.players[loser].level <= data.players[winner].level)
       data.players[loser].xp -= 20;
   else  //if loser level is higher than winner lose more XP
       data.players[loser].xp -= 20 * (data.players[loser].level - data.players[winner].level + 1);

   // Prevent negative XP
   if (data.players[loser].xp < 0)
       data.players[loser].xp = 0;
}


export function calculateLevelF4Players(data, winner, loser) {
   if(data.players[winner].xp >= data.players[winner].pointsToNextLevel) {
       data.players[winner].level += 1;
       data.players[winner].pointsToLoseLevel = data.players[winner].pointsToNextLevel;
       data.players[winner].pointsToNextLevel *= 2;
   }

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