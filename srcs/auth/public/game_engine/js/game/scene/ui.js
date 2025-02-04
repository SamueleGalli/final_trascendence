import { updateTimer } from '../other/timer.js';
import { matchData } from '../data/game_global.js';
export class UI {
    constructor(p1, p2, canvas, ctx) {
        this.player1Name = p1;
        this.player2Name = p2;
        this.canvas = canvas;
        this.ctx = ctx;
        this.originalFontSize = 50;
        this.fontSize = (this.originalFontSize / 1600) * this.canvas.width;
        this.isCountingDown = false;
        this.countdownValue = 3;
    }

    updateFontSize() {
        this.fontSize = (this.originalFontSize / 1600) * this.canvas.width;
        this.ctx.font = `${this.fontSize}px Liberty`;
    }

    render(pong, scoreP1, scoreP2) {
        this.updateFontSize();
        this.ctx.fillStyle = 'white';
    
        const player1X = this.canvas.width * 0.05; // 5% from left
        const player2X = this.canvas.width * 0.95 - (this.ctx.measureText(this.player2Name).width); // 5% from right
        const scoreY = this.canvas.height * 0.08 + 10; // 10% from top
    
        // Draw scores
        this.ctx.fillText(scoreP1, this.canvas.width * 0.4, scoreY); 
        this.ctx.fillText(scoreP2, this.canvas.width * 0.6, scoreY);
    
        // Draw player names
        this.ctx.fillText(this.player1Name, player1X, scoreY);
        this.ctx.fillText(this.player2Name, player2X, scoreY);
    
        this.ctx.fillStyle = '#02BFB9';
        // Draw pause message
        if (pong.gamePaused && !pong.gameEnd && !pong.backToGameTimer) {
            this.ctx.fillText("GAME PAUSED", this.canvas.width / 2 - (this.fontSize * 3.4), this.canvas.height / 2);
        }
        else if (pong.backToGameTimer && !pong.gameEnd) {
            // Show countdown
            this.ctx.fillText(this.countdownValue, this.canvas.width / 2, this.canvas.height / 2);
        }
        else if (pong.gameEnd) {
            if (scoreP1 > scoreP2) {
                this.ctx.fillText(this.player1Name + " WIN!", this.canvas.width / 2 - (this.fontSize * 3.4), this.canvas.height / 2);
            } else {
                this.ctx.fillText(this.player2Name + " WIN!", this.canvas.width / 2 - (this.fontSize * 3.4), this.canvas.height / 2);
            }
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