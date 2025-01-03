import { canvas, ctx } from './globals.js';
import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { UI } from './ui.js';
import { Star } from './star.js';
import { Particle } from './particle.js';

export class AI {
    constructor() {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.wallThickness = 10;
        this.ball = new Ball(canvas.width / 2, canvas.height / 2);
        this.paddle1 = new Paddle(this.wallThickness + 20, 'w', 's');
        this.paddle2 = new Paddle(canvas.width - this.wallThickness - 20, null, null);
        this.p1Name = "Player1"; 
        this.p2Name = "AI";
        this.ui = new UI(this.p1Name, this.p2Name);
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        for (let i = 0; i < count; i++) {
            const particle = new Particle(x, y);
            this.particles.push(particle);
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].size <= 0) {
                this.particles.splice(i, 1); // Remove dead particles
            }
        }
    }

    renderParticles() {
        for (const particle of this.particles) {
            particle.render();
        }
    }

    createStarsBackground(count) {
        for (let i = 0; i < count; i++) {
            const star = new Star();
            this.stars.push(star);
        }
    }

    renderWalls() {
        ctx.fillStyle = "#014C4A";
        ctx.shadowColor = "#014C4A";
        ctx.shadowBlur = 20;
        ctx.fillRect(10, 0, canvas.width - 20, this.wallThickness);
        ctx.fillRect(10, canvas.height - this.wallThickness, canvas.width - 20, this.wallThickness);
        ctx.fillRect(0, 0, this.wallThickness, canvas.height);
        ctx.fillRect(canvas.width - this.wallThickness, 0, this.wallThickness, canvas.height);
    }

    resize() {
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.paddle1 = new Paddle(this.wallThickness + 20, 'w', 's');
        this.paddle2 = new Paddle(canvas.width - this.wallThickness - 20, null, null);
        this.ball.resize();
        this.paddle1.resize(oldWidth, oldHeight, canvas.width, canvas.height);
        this.paddle2.resize(oldWidth, oldHeight, canvas.width, canvas.height);
        this.ui.resize(this, this.ui.scoreP1, this.ui.scoreP2);
        this.ball.reset(1);
        this.paddle1.y = canvas.height / 2 - this.paddle1.height / 2;
        this.paddle2.y = canvas.height / 2 - this.paddle2.height / 2;
        this.stars = [];
        this.createStarsBackground(100);
        this.ui.render(this, this.scoreP1, this.scoreP2);
    }
}

export let ai = new AI();
