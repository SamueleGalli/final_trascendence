import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { UI } from './ui.js';
import { Star } from './star.js';
import { Particle } from './particle.js';
import { Powerup } from './powerup.js';
import { matchData } from './game_global.js';
import { ballColor, paddleColor, ballTrailColor, wallsColor, powerUpActive, background } from './game_global.js';

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export class Game {
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

        // Impostiamo le dimensioni del canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Inizializzazione del resto del gioco
        this.wallThickness = this.canvas.width * 0.008;
        this.wallsColor = wallsColor;
        this.ball = new Ball(this.canvas, this.ctx,this.canvas.width / 2, this.canvas.height / 2, ballColor, ballTrailColor);
        this.paddle1 = new Paddle(this.canvas, this.wallThickness + 20, 'w', 's', paddleColor);
        this.paddle2 = new Paddle(this.canvas ,this.canvas.width - this.wallThickness - 20, 'ArrowUp', 'ArrowDown', paddleColor);
        this.p1Name = "Player1";
        this.p2Name = "Player2";
        this.ui = new UI(this.p1Name, this.p2Name, this.canvas, this.ctx);
        this.stars = [];
        this.createStarsBackground(100);
        this.scoreP1 = 0;
        this.scoreP2 = 0;
        this.running = false;
        this.particles = [];
        this.gamePaused = false;
        this.gameEnd = false;
        this.backToGameTimer = false;
        this.renderBackground();
        this.addEventListeners();
        this.powerUpTimerStarted = false;
        this.powerup = [];
    }

    addEventListeners() {
        // Aggiungiamo i listener per gli eventi della tastiera
        document.addEventListener('keydown', (event) => {
            this.paddle1.handleInput(event.key, true);
            this.paddle2.handleInput(event.key, true);
            if (event.key === 'p' || event.key === 'P') {
                this.togglePause();
            }
        });
        document.addEventListener('keyup', (event) => {
            this.paddle1.handleInput(event.key, false);
            this.paddle2.handleInput(event.key, false);
        });
        /*matchStatisticsButton.addEventListener('click', (event) => {
            gameCanvas.style.display = "none";
            matchStatsPopup.style.display = "flex";
            matchStatsPopup.style.marginTop = window.innerHeight * 0.4 + "px";
            matchStatisticsButton.style.display = "none";
            if (mode === "knockout") 
                backToBracketButton.hidden = false;
            else if (mode === "roundrobin")
                backToRobinButton.hidden = false;
            this.saveMatchStatsData();
            const playersColumn = document.getElementById('playersColumn');
            const matchTimeColumn = document.getElementById('matchTimeColumn');
            const scoreColumn = document.getElementById('scoreColumn');
            const longestRallyColumn = document.getElementById('longestRallyColumn');
            playersColumn.textContent = matchData.player1 + " vs " + matchData.player2;
            matchTimeColumn.textContent = matchData.matchTime;
            scoreColumn.textContent = `${matchData.scorep1} - ${matchData.scorep2}`;
            longestRallyColumn.textContent = matchData.longestRally + " hits";
        })*/
        window.addEventListener('resize', () => this.resize());
    }

    start() {
        // Avviamo il loop del gioco
        this.running = true;
        this.loop();
        matchData.timer = setInterval(this.updateTimer.bind(this), 1000);
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
        // Aggiorniamo lo stato del gioco
        if (!this.gamePaused && !this.gameEnd) {
            this.ball.update(this, this.paddle1, this.paddle2, this.powerup[0], this.wallThickness);
            this.paddle1.update();
            this.paddle2.update();
            this.updateParticles();
            this.checkBallPosition();
            if (powerUpActive) 
                this.handlePowerups();
            this.checkScore();
        }
        if (background == "space")
        {
            for (let i = 0; i < 100; i++) {
                this.stars[i].update();
            }
        }
    }

    updateTimer() {
        if (!this.gameEnd && !this.gamePaused)
            matchData.seconds++;
        else
            clearInterval(matchData.timer);
        //console.log(matchData.seconds);        
    }

    saveMatchStatsData() {
        matchData.player1 = this.p1Name;
        matchData.player2 = this.p2Name;
        matchData.scorep1 = this.scoreP1;
        matchData.scorep2 = this.scoreP2;
        matchData.matchTime = this.formatTime(matchData.seconds);

        
        localStorage.setItem('match_data', JSON.stringify(matchData)); // Da sostituire con salvataggio in db postgres
        this.saveUserStatsData(matchData.player1, matchData.player2, matchData.scorep1, matchData.scorep2); // Match 1
        
    }

    resetMatchStatsData() {
        matchData.player1 = '';
        matchData.player2 = '';
        matchData.scorep1 = 0;
        matchData.scorep2 = 0;
        matchData.matchTime = '';
        matchData.seconds = 0;
        matchData.longestRally = 0;
    }

    checkBallPosition() {
        if (this.ball.out && this.ball.hits > matchData.longestRally) {
                matchData.longestRally = this.ball.hits; 
        }
        if (this.ball.x <= 0 && !this.ball.out) {
            this.ball.out = true;
            if (this.powerup[0]) {
                this.powerup.splice(0, 1);
                this.powerUpTimerStarted = false;
            }    
            this.scoreP2++;
            //this.screenShake(300, 15);
            setTimeout(() => {
                if (!this.gameEnd)
                    this.ball.reset(2); // Reposition ball to center
                this.ball.out = false;
            }, 2000);
        } else if (this.ball.x >= this.canvas.width && !this.ball.out) {
            this.ball.out = true;
            if (this.powerup[0]) {
                this.powerup.splice(0, 1);
                this.powerUpTimerStarted = false;
            }
            this.scoreP1++;
            //this.screenShake(500, 25);
            setTimeout(() => {
                if (!this.gameEnd)
                    this.ball.reset(1); // Reposition ball to center
                this.ball.out = false;
            }, 2000);
        }
    }

    checkScore() {
        // Controlliamo il punteggio
        if (this.scoreP1 >= 5 || this.scoreP2 >= 5) {
            this.gameEnd = true;
            this.ui.render(this, this.scoreP1, this.scoreP2);
        }
    }

    handlePowerups() {
        if (!this.powerUpTimerStarted) {
            this.powerUpTimerStarted = true;
            setTimeout(() => {
                if (!this.gameEnd)
                {
                    let powerup = new Powerup(this.canvas, this.ctx);
                    this.powerup.push(powerup)
                }
                
            }, 5000);
        }
    }

    togglePause() {
        // Mettiamo in pausa o riprendiamo il gioco
        if (this.gamePaused) {
            if (!this.backToGameTimer) {
                this.ui.startCountdown(this); // Avviamo il conto alla rovescia
            }
        } else {
            this.gamePaused = true;
        }
    }

    getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    render() {
        // Renderizziamo il gioco
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderBackground();
        this.ball.render();
        this.paddle1.render(this.ctx);
        this.paddle2.render(this.ctx);
        if (this.powerup[0])
            this.powerup[0].render();
        if (background == "space")
        {
            for (let i = 0; i < 100; i++) {
                this.stars[i].render();
            }
        }
        this.ui.render(this, this.scoreP1, this.scoreP2);
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

    renderBackground() {
        // Walls
        if (background == "space")
            this.ctx.fillStyle = this.wallsColor;
        else 
            this.ctx.fillStyle = "white";

        if (background == "pingpong") {
            // Background
            this.ctx.fillStyle = "#1d8819";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(this.wallThickness, this.canvas.height / 2, this.canvas.width - this.wallThickness, this.wallThickness);
            this.ctx.fillRect(this.canvas.width / 2, this.wallThickness, this.wallThickness, this.canvas.height - this.wallThickness);
        }

        if (background == "classic") {
            // Draw vertical dashed line
            for (let y = this.wallThickness; y < this.canvas.height - this.wallThickness; y += 50) {
                this.ctx.fillRect(this.canvas.width / 2, y, this.wallThickness, 30);
            }
        }
        this.ctx.shadowColor = this.wallsColor;
        this.ctx.shadowBlur = 20;
        this.ctx.fillRect(this.wallThickness, 0, this.canvas.width - this.wallThickness, this.wallThickness);
        this.ctx.fillRect(this.wallThickness, this.canvas.height - this.wallThickness, this.canvas.width - this.wallThickness, this.wallThickness);
        this.ctx.fillRect(0, 0, this.wallThickness, this.canvas.height);
        this.ctx.fillRect(this.canvas.width - this.wallThickness, 0, this.wallThickness, this.canvas.height);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.wallThickness = this.canvas.width * 0.008;
        this.renderBackground();

        this.ball.resize();
        this.paddle1.resize(this.wallThickness + 20);
        this.paddle2.resize(this.canvas.width - this.wallThickness - 20);
        this.ui.resize(this, this.ui.scoreP1, this.ui.scoreP2);
        this.ball.reset(1);
        this.paddle1.y = this.canvas.height / 2 - this.paddle1.height / 2;
        this.paddle2.y = this.canvas.height / 2 - this.paddle2.height / 2;
        this.stars = [];
        this.createStarsBackground(100);
        this.ui.render(this, this.scoreP1, this.scoreP2);
    }

    stop() {
        // Fermiamo il gioco
        this.running = false;
    }
}

export let game = new Game();