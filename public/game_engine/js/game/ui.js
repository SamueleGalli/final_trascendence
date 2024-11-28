import { canvas, ctx } from './globals.js';

export class UI {
    constructor(p1, p2) {
        this.player1Name = p1;
        this.player2Name = p2;
        this.originalFontSize = 50;
        this.fontSize = (this.originalFontSize / 1600) * canvas.width;
        this.isCountingDown = false;
        this.countdownValue = 3;
    }

    updateFontSize() {
        this.fontSize = (this.originalFontSize / 1600) * canvas.width;
        ctx.font = `${this.fontSize}px Liberty`;
    }

    render(pong, scoreP1, scoreP2) {
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
        if (pong.gamePaused && !pong.gameEnd && !pong.backToGameTimer) {
            ctx.fillText("GAME PAUSED", canvas.width / 2 - (this.fontSize * 3.4), canvas.height / 2);
        }
        else if (pong.backToGameTimer && !pong.gameEnd) {
            // Mostra il countdown
                ctx.fillText(this.countdownValue, canvas.width / 2, canvas.height / 2);
        }
        else if (pong.gameEnd) {
            if (scoreP1 > scoreP2) {
                ctx.fillText(this.player1Name + " WIN!", canvas.width / 2 - (this.fontSize * 3.4), canvas.height / 2);
            } else {
                ctx.fillText(this.player2Name + " WIN!", canvas.width / 2 - (this.fontSize * 3.4), canvas.height / 2);
            }
        }
    }     

    startCountdown(pong) {
        if (pong.backToGameTimer || !pong.gamePaused) {
            return;
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval); // Rimuovi qualsiasi intervallo attivo precedente
        }
        this.countdownValue = 3; // Ripristina il valore del countdown a 3
        pong.backToGameTimer = true;  // Imposta `backToGameTimer` su true
        this.countdownInterval = setInterval(() => {
            this.countdownValue -= 1;
    
            if (this.countdownValue <= 0) {
                clearInterval(this.countdownInterval); // Cancella l'interval
                this.countdownInterval = null; // Resetta la proprietà
                pong.gamePaused = false; // Sospendi la pausa
                pong.backToGameTimer = false; // Disattiva il timer del countdown
            }
        }, 1000); // 1 secondo di intervallo
    }
    resize(pong, scoreP1, scoreP2) {
        this.render(pong, scoreP1, scoreP2);
    }
}