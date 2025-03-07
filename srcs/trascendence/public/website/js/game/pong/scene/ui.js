import { updateTimer } from '../other/timer.js';
import { matchData } from '../data/game_global.js';

export class UI {
    constructor(p1, p2, canvas, ctx) {
        this.player1Name = p1;
        this.player2Name = p2;
        this.canvas = canvas;
        this.ctx = ctx;
        this.originalFontSize = 80;
        // Usa il minimo tra larghezza e altezza per il calcolo del font size
        this.fontSize = (this.originalFontSize / 1600) * Math.min(this.canvas.width, this.canvas.height);
        this.isCountingDown = false;
        this.countdownValue = 3;
    }

    updateFontSize() {
        // Usa il minimo tra larghezza e altezza per il calcolo del font size
        this.fontSize = (this.originalFontSize / 1600) * Math.min(this.canvas.width, this.canvas.height);
        this.ctx.font = `${this.fontSize}px Liberty`;
    }

    getTextHeight() {
        return this.fontSize * 1.2; 
    }

    render(pong, scoreP1, scoreP2) {
        this.updateFontSize();
        this.ctx.fillStyle = 'white';
    
        const player1X = this.canvas.width * 0.05; // 5% from left
        const player2X = this.canvas.width * 0.95 - (this.ctx.measureText(this.player2Name).width); // 5% from right
        const scoreY = (this.canvas.height * 0.07) + this.getTextHeight() / 2; // 10% from top
    
        // Draw scores
        this.ctx.fillText(scoreP1, this.canvas.width * 0.4, scoreY); 
        this.ctx.fillText(scoreP2, this.canvas.width * 0.6, scoreY);
    
        // Draw player names
        this.ctx.fillText(this.player1Name, player1X, scoreY);
        this.ctx.fillText(this.player2Name, player2X, scoreY);
    
        this.ctx.fillStyle = '#02BFB9';
        // Draw pause message
        if (pong.gamePaused && !pong.gameEnd && !pong.backToGameTimer) {
            const pauseText = "GAME PAUSED";
            const pauseTextWidth = this.ctx.measureText(pauseText).width;
            const pauseTextY = this.canvas.height / 2 + this.getTextHeight() / 2; // Centred
            this.ctx.fillText(pauseText, (this.canvas.width - pauseTextWidth) / 2, pauseTextY);
        }
        else if (pong.backToGameTimer && !pong.gameEnd) {
            // Show countdown
            const countdownText = this.countdownValue.toString();
            const countdownTextWidth = this.ctx.measureText(countdownText).width;
            const countdownTextY = this.canvas.height / 2 + this.getTextHeight() / 2; // Centred
            this.ctx.fillText(countdownText, (this.canvas.width - countdownTextWidth) / 2, countdownTextY);
        }
        else if (pong.gameEnd) {
            const winnerText = scoreP1 > scoreP2 ? this.player1Name + " WIN!" : this.player2Name + " WIN!";
            const winnerTextWidth = this.ctx.measureText(winnerText).width;
            const winnerTextY = this.canvas.height / 2 + this.getTextHeight() / 2; // Centred
            this.ctx.fillText(winnerText, (this.canvas.width - winnerTextWidth) / 2, winnerTextY);
        }
    }     

    startCountdown(pong) {
        if (pong.backToGameTimer || !pong.gamePaused) {
            return;
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval); // Remove any active intervals
        }
        this.countdownValue = 3; // Reset countdown value to 3
        pong.backToGameTimer = true;  // Set `backToGameTimer` to true
        this.countdownInterval = setInterval(() => {
            this.countdownValue -= 1;
    
            if (this.countdownValue <= 0) {
                clearInterval(this.countdownInterval); // Clear the interval

                this.countdownInterval = null; // Reset the interval property
                pong.gamePaused = false; // Resume the game
                pong.backToGameTimer = false; // Disable countdown timer

                // Restart the timer
                if (matchData.timer){
                    clearInterval(matchData.timer);
                    matchData.timer = null;
                    matchData.timer = setInterval(updateTimer.bind(pong), 1000);
                }
                
            }
        }, 1000); // 1 second interval
    }

    resize(pong, scoreP1, scoreP2) {
        this.render(pong, scoreP1, scoreP2);
    }
}