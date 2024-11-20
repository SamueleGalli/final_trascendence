import { canvas, ctx } from './globals.js';
import { game } from '../app.js'
;

export class UI {
    constructor(p1, p2) {
        this.player1Name = p1;
        this.player2Name = p2;
        this.originalFontSize = 50;
        this.fontSize = (this.originalFontSize / 1600) * canvas.width;
        this.isCountingDown = false;
    }

    updateFontSize() {
        this.fontSize = (this.originalFontSize / 1600) * canvas.width;
        ctx.font = `${this.fontSize}px Liberty`;
    }

    render(scoreP1, scoreP2) {
        this.updateFontSize();
        ctx.fillStyle = 'white';

        const player1X = canvas.width * 0.05; // 5% from left
        const player2X = canvas.width * 0.95 - (ctx.measureText(this.player2Name).width); // 5% from right
        const scoreY = canvas.height * 0.08 + 10; // 10% from top

        // Disegna i punteggi
        ctx.fillText(scoreP1, canvas.width * 0.4, scoreY); 
        ctx.fillText(scoreP2, canvas.width * 0.6, scoreY);

        // Disegna i nomi dei giocatori
        ctx.fillText(this.player1Name, player1X, scoreY);
        ctx.fillText(this.player2Name, player2X, scoreY);

        ctx.fillStyle = '#02BFB9';
        // Disegna il messaggio di pausa
        if (game.gamePaused && !game.gameEnd && !game.backToGameTimer) {
            ctx.fillText("GAME PAUSED", canvas.width / 2 - (this.fontSize * 3.4), canvas.height / 2);
        }
        else if (game.backToGameTimer && !game.gameEnd) {
            ctx.fillText(this.countdownValue, canvas.width / 2, canvas.height / 2);
        }
        else if (game.gameEnd) {
            if (game.scoreP1 > game.scoreP2) {
                ctx.fillText(game.p1Name + " WIN!", canvas.width / 2 - (this.fontSize * 3.4), canvas.height / 2);
            }
            else {
                ctx.fillText(game.p2Name + " WIN!", canvas.width / 2 - (this.fontSize * 3.4), canvas.height / 2);
            }
        }

    }

    startCountdown() {
        /*if (game.backToGameTimer || !game.gamePaused) {
            return;
        }*/
        game.backToGameTimer = true;
        this.countdownValue = 3;
        
        //ctx.fillText("a", 50, canvas.height / 2);

        const countdownInterval = setInterval(() => {
            this.countdownValue -= 1;

            if (this.countdownValue <= 0) {
                console.log("end countdown");
                clearInterval(countdownInterval);
                //this.ball.reset(1);
                game.gamePaused = false;
                game.backToGameTimer = false;
            }
        }, 500);
    }

    resize(scoreP1, scoreP2) {
        this.render(scoreP1, scoreP2);
    }
}