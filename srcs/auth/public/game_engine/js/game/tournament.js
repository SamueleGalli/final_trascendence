import { Ball } from './ball.js'
import { Paddle } from './paddle.js';
import { UI } from './ui.js';
import { Star } from './star.js';
import { Particle } from './particle.js';
import { Powerup } from './powerup.js';
import { navigate } from '../main.js';
import { matchData } from './game_global.js';
import { ballColor, paddleColor, ballTrailColor, wallsColor, powerUpActive, background } from './game_global.js';

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export let gameContainer;
export let players;
export let game;
export let backToBracketButton;
export let backToRobinButton;
export let matchStatisticsButton;
export let matchStatsPopup;
export let mode;

export function startPongGame(matchPlayers, tournamentMode) {
    mode = tournamentMode;
    players = matchPlayers;

    //if (background == "pingpong")
    //   canvas.style.background = "#1d8819";
    backToBracketButton = document.getElementById('backToBracketButton');
    backToRobinButton = document.getElementById('backToRobinButton');
    matchStatisticsButton = document.getElementById('matchStatisticsButton');
    matchStatsPopup = document.getElementById('matchStatsPopup');
    //matchStatsPopup.style.display = "none";
    backToBracketButton.hidden = true;
    backToRobinButton.hidden = true;
    matchStatisticsButton.hidden = true;
    console.log("power up = " + powerUpActive)
    
    //game = new TournamentGame(canvas);
    //game.start();
}

// Main class
export class TournamentGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas not found.');
            return;
        }
        this.ctx = this.canvas.getContext('2d'); 
        if (!this.ctx) {
            console.error('Canvas context not found.');
            return;
        }
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.wallThickness = this.canvas.width * 0.008;
        this.wallsColor = wallsColor;
        this.ball = new Ball(this.canvas, this.ctx,this.canvas.width / 2, this.canvas.height / 2, ballColor, ballTrailColor);
        this.paddle1 = new Paddle(this.canvas, this.wallThickness + 20, 'w', 's', paddleColor);
        this.paddle2 = new Paddle(this.canvas ,this.canvas.width - this.wallThickness - 20, 'ArrowUp', 'ArrowDown', paddleColor);
        this.p1Name = players[0]; 
        this.p2Name = players[1];
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
        this.powerUpTimerStarted = false;
        this.powerup = [];
        this.addEventListeners();
        this.renderBackground();
        this.winner = '';
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            //event.preventDefault();
            this.paddle1.handleInput(event.key, true);
            this.paddle2.handleInput(event.key, true);
            if (event.key === 'p' || event.key === 'P') {
                this.togglePause();
            }
        
        });
        document.addEventListener('keyup', (event) => {
            //event.preventDefault();
            this.paddle1.handleInput(event.key, false);
            this.paddle2.handleInput(event.key, false);
        });

        backToBracketButton.addEventListener('click', (event) => {
            gameCanvas.style.display = "none";  
            backToBracketButton.hidden = true;
            //window.history.pushState({}, path, window.location.origin + path);
            sessionStorage.setItem("winner", this.winner);
            this.resetMatchStatsData();
            navigate("/tournament/knockout/bracket", "Return from Match");
        })

        backToRobinButton.addEventListener('click', (event) => {
            gameCanvas.style.display = "none";  
            backToRobinButton.hidden = true;
            //window.history.pushState({}, path, window.location.origin + path);
            sessionStorage.setItem("winner", this.winner);
            this.resetMatchStatsData();
            navigate("/tournament/roundrobin/robinranking", "Return from Match");
        })

        matchStatisticsButton.addEventListener('click', (event) => {
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
        })
        window.addEventListener('resize', () => this.resize());
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

    saveUserStatsData(player1, player2, score1, score2) {
        // Recover existing data (if exists, otherwise create)
        const data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };
        
        // Initialize data if no players
        if (!data.players[player1]) {
            data.players[player1] = { wins: 0, losses: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100, matches: [] };
        }
        if (!data.players[player2]) {
            data.players[player2] = { wins: 0, losses: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100, matches: [] };
        }

        // Who wins?
        let winner;
        let loser;
        if (score1 > score2) {
            winner = player1;
            loser = player2;
            data.players[player1].wins += 1;
            data.players[player2].losses += 1;
        } else {
            winner = player2;
            loser = player1;
            data.players[player2].wins += 1;
            data.players[player1].losses += 1;
        }


        // Crea un oggetto per il match
        const matchDetails = {
            player1,
            player2,
            score1,
            score2,
            winner,
            date: new Date().toISOString() // Data del match
        };

        // Aggiungi il match al rispettivo array dei match giocati
        data.players[player1].matches.push(matchDetails);
        data.players[player2].matches.push(matchDetails);

        this.calculateXpPlayers(data, winner, loser);
        this.calculateLevelPlayers(data, winner, loser);
        // Salva i dati aggiornati
        localStorage.setItem('game_data', JSON.stringify(data));
        console.log("Dati aggiornati:", data);
        // Esempio d'uso
    }

    calculateXpPlayers(data, winner, loser) {
        // Winner gains xp
        if (data.players[loser].level <= data.players[winner].level)
            data.players[winner].xp += 20;
        else if (data.players[loser].level > data.players[winner].level)
            data.players[winner].xp += 20 * (data.players[loser].level - data.players[winner].level + 1);

        // Loser lost xp
        if (data.players[loser].level >= data.players[winner].level)
            data.players[loser].xp -= 20;
        else if (data.players[loser].level < data.players[winner].level)
            data.players[loser].xp -= 20 * (data.players[winner].level - data.players[loser].level + 1);

        if (data.players[loser].xp < 0)
            data.players[loser].xp = 0;
    }


    calculateLevelPlayers(data, winner, loser) {
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

    resetMatchStatsData() {
        matchData.player1 = '';
        matchData.player2 = '';
        matchData.scorep1 = 0;
        matchData.scorep2 = 0;
        matchData.matchTime = '';
        matchData.seconds = 0;
        matchData.longestRally = 0;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    start() {
        this.running = true;
        this.loop();
        matchData.timer = setInterval(this.updateTimer.bind(this), 1000);
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
        console.log(matchData.seconds);        
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

    screenShake(duration, intensity) {
        const startTime = performance.now();
    
        function shakeFrame(time) {
            const elapsedTime = time - startTime;
    
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const currentIntensity = intensity * (1 - progress);
    
                const offsetX = (Math.random() - 0.5) * currentIntensity;
                const offsetY = (Math.random() - 0.5) * currentIntensity;
    
                gameContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                requestAnimationFrame(shakeFrame);
            } else {
                gameContainer.style.transform = 'translate(0, 0)';
            }
        }
    
        requestAnimationFrame(shakeFrame);
    }

    checkScore() {
        if (this.scoreP1 >= 3 || this.scoreP2 >= 3) {
            this.gameEnd = true;
            if (this.scoreP1 > this.scoreP2) {
                this.winner = this.p1Name;
            } 
            else {
                this.winner = this.p2Name;
            }
            this.gameEnd = true;
            
            /*if (mode === "roundrobin")
                backToRobinButton.hidden = false;
            else
                backToBracketButton.hidden = false;*/
           
            matchStatisticsButton.hidden = false;
            this.ui.render(this, this.scoreP1, this.scoreP2);
            //this.ui.render(this.scoreP1, this.scoreP2, this.gameEnd, this.gamePaused, this.backToGameTimer);
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
         // If game paused, and no countdown active, start countdown
        if (this.gamePaused && !this.backToGameTimer) {
            this.ui.startCountdown(this, this.gamePaused, this.backToGameTimer);
        } else {
            this.gamePaused = true;
        }
    }

    getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    render() {
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
        //this.ui.render(this.scoreP1, this.scoreP2, this.gameEnd, this.gamePaused, this.backToGameTimer);
        this.ui.render(this, this.scoreP1, this.scoreP2);
        this.renderParticles();
    }

    addParticles(x, y, count) {
        for (let i = 0; i < count; i++) {
            const particle = new Particle(x, y, this.ctx);
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
        //this.paddle1 = new Paddle(this.wallThickness + 20, 'w', 's');
        //this.paddle2 = new Paddle(this.canvas.width - this.wallThickness - 20, 'ArrowUp', 'ArrowDown');
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
        //this.ui.render(this.scoreP1, this.scoreP2, this.gameEnd, this.gamePaused, this.backToGameTimer);  
    }

    stop() {
        // Fermiamo il gioco
        this.running = false;
    }
}

