import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { UI } from './ui.js';
import { Star } from './star.js';
import { Particle } from './particle.js';

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export class AI {
    constructor() {
        // Otteniamo il canvas e il contesto
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas non trovato');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Contesto del canvas non trovato');
            return;
        }

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.wallThickness = 10;
        this.ball = new Ball(this.canvas, this.ctx, this.canvas.width / 2, this.canvas.height / 2);
        this.paddle1 = new Paddle(this.wallThickness + 20, 'w', 's', this.canvas, this.ctx);
        this.paddle2 = new Paddle(this.canvas.width - this.wallThickness - 20, null, null, this.canvas, this.ctx);
        this.p1Name = "Player1"; 
        this.p2Name = "AI";
        this.ui = new UI(this.p1Name, this.p2Name, this.canvas, this.ctx);
        this.stars = [];
        this.createStarsBackground(100);
        this.scoreP1 = 0;
        this.scoreP2 = 0;
        this.lastMoveTime = 0;
        this.running = false;
        this.particles = [];
        this.gamePaused = false;
        this.gameEnd = false;
        this.backToGameTimer = false;
        this.paddle2Paused = false;  // Aggiungi questa variabile per tenere traccia dello stato del paddle2
        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.paddle1.handleInput(event.key, true);
            if (event.key === 'p' || event.key === 'P') {
                this.togglePause();
            }
        });
        document.addEventListener('keyup', (event) => {
            this.paddle1.handleInput(event.key, false);
        });
        window.addEventListener('resize', () => this.resize());
    }

    start() {
        this.running = true;
        this.loop();
    }

    loop() {
        // Ciclo principale del gioco
        if (this.running) {
            this.update();
            this.render();
            requestAnimationFrame(() => this.loop());
        }
    }

    update() {
        if (!this.gamePaused && !this.gameEnd) {
            this.ball.update(this);
            this.paddle1.update();
            if (this.ball.x > window.innerWidth / 2 && !this.paddle2Paused) {
                this.paddle2.move_ia(this.ball, this.lastMoveTime);
            }
            this.updateParticles();
            this.checkBallPosition();
            this.checkScore();
        }

        for (let i = 0; i < 100; i++) {
            this.stars[i].update();
        }
    }

    checkBallPosition() {
        if (this.ball.x <= 0 && !this.ball.out) {
            this.ball.out = true;
            this.scoreP2++;
            this.paddle2Paused = true; // Ferma l'IA quando la palla esce a sinistra
            setTimeout(() => {
                if (!this.gameEnd)
                    this.ball.reset(2); // Reposition ball to center
                this.ball.out = false;
                this.paddle2Paused = false; // Riprendi l'IA quando la palla ritorna
            }, 2000);
        } else if (this.ball.x >= canvas.width && !this.ball.out) {
            this.ball.out = true;
            this.scoreP1++;
            this.paddle2Paused = true; // Ferma l'IA quando la palla esce a destra
            setTimeout(() => {
                if (!this.gameEnd)
                    this.ball.reset(1); // Reposition ball to center
                this.ball.out = false;
                this.paddle2Paused = false; // Riprendi l'IA quando la palla ritorna
            }, 2000);
        }
    }

    checkScore() {
        if (this.scoreP1 >= 5 || this.scoreP2 >= 5) {
            this.gameEnd = true;
            this.ui.render(this, this.scoreP1, this.scoreP2);
        }
    }

    togglePause() {
        if (this.gamePaused) {
            // Se il gioco è in pausa e non c'è un countdown attivo
            if (!this.backToGameTimer) {
                this.ui.startCountdown(this);
            }
        } else {
            // Se il gioco non è in pausa, metti in pausa
            this.gamePaused = true;
        }
    }

    render() {
        // Renderizziamo il gioco
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.render();
        this.paddle1.render();
        this.paddle2.render();
        for (let i = 0; i < 100; i++) {
            this.stars[i].render();
        }
        this.ui.render(this, this.scoreP1, this.scoreP2);
        this.renderWalls();
        this.renderParticles();
    }

    addParticles(x, y, count) {
        // Aggiungiamo particelle
        for (let i = 0; i < count; i++) {
            const particle = new Particle(x, y, this.ctx);
            this.particles.push(particle);
        }
    }

    updateParticles() {
        // Aggiorniamo le particelle
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].size <= 0) {
                this.particles.splice(i, 1); // Rimuoviamo particelle terminate
            }
        }
    }

    renderParticles() {
        // Renderizziamo le particelle
        for (const particle of this.particles) {
            particle.render();
        }
    }

    createStarsBackground(count) {
        // Creiamo lo sfondo con stelle
        for (let i = 0; i < count; i++) {
            const star = new Star(this.canvas, this.ctx);
            this.stars.push(star);
        }
    }

    renderWalls() {
        // Renderizziamo i muri
        this.ctx.fillStyle = "#014C4A";
        this.ctx.shadowColor = "#014C4A";
        this.ctx.shadowBlur = 20;
        this.ctx.fillRect(10, 0, this.canvas.width - 20, this.wallThickness);
        this.ctx.fillRect(10, this.canvas.height - this.wallThickness, this.canvas.width - 20, this.wallThickness);
        this.ctx.fillRect(0, 0, this.wallThickness, this.canvas.height);
        this.ctx.fillRect(this.canvas.width - this.wallThickness, 0, this.wallThickness, this.canvas.height);
    }

    resize() {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.paddle1 = new Paddle(this.wallThickness + 20, 'w', 's', this.canvas, this.ctx);
        this.paddle2 = new Paddle(this.canvas.width - this.wallThickness - 20, null, null, this.canvas, this.ctx);
        this.ball.resize();
        this.paddle1.resize(oldWidth, oldHeight, this.canvas.width, this.canvas.height);
        this.paddle2.resize(oldWidth, oldHeight, this.canvas.width, this.canvas.height);
        this.ui.resize(this, this.ui.scoreP1, this.ui.scoreP2);
        this.ball.reset(1);
        this.paddle1.y = canvas.height / 2 - this.paddle1.height / 2;
        this.paddle2.y = canvas.height / 2 - this.paddle2.height / 2;
        this.stars = [];
        this.createStarsBackground(100);
        this.ui.render(this, this.scoreP1, this.scoreP2);
    }

    stop() {
        // Fermiamo il gioco
        this.running = false;
    }
}

export let ai = new AI();
