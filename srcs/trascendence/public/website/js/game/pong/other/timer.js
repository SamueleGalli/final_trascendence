import { matchData } from '../data/game_global.js';

//Format seconds in MM:SS
export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


export function updateTimer() {
    if (!this.gameEnd && !this.gamePaused)
        matchData.seconds++;
    else
        clearInterval(matchData.timer);
    console.log(matchData.seconds);        
}