import { navigate } from '../../../main.js';
import { Ball } from '../elements/ball.js'
import { Paddle } from '../elements/paddle.js';
import { UI } from '../scene/ui.js';
import { ScreenShake } from '../scene/screenshake.js';
import { createStarsBackground, renderBackground } from '../scene/background.js';
import { updateParticles, renderParticles } from '../elements/particle.js';
import { handlePowerups } from '../elements/powerup.js';
import { checkScore } from '../other/score.js';
import { matchData } from '../data/game_global.js';
import { saveMatchStatsData, resetMatchStatsData } from '../data/game_stats.js';
import { updateTimer } from '../other/timer.js';
import { ballColor, paddleColor, ballTrailColor, wallsColor, powerUpActive, background } from '../data/game_global.js';


export let gameContainer;

export let players;
export let game;
export let mode;

// Buttons
export let backToBracketButton;
export let backToRobinButton;
export let backToMenuButton;

export function startPongGame(matchPlayers, gameMode) {
    console.log("start pong game");
   
    
    resetMatchStatsData();
    // Set the game mode (classic, ai, knocknout, rondrobin)
    mode = gameMode;
    players = matchPlayers;
}

// Main class
export class PongGame {
    constructor() {
        // Create Canvas and Context
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

        backToBracketButton = document.getElementById('backToBracketButton');
        backToRobinButton = document.getElementById('backToRobinButton');
        backToMenuButton = document.getElementById('backToMenuButton');
        backToBracketButton.style.display = "none";
        backToRobinButton.style.display = "none";
        backToMenuButton.style.display = "none";
    
    
            // Hide the buttons when the game starts
        
        
        // Set canvas width and height as window dimensions
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Set game variables
        this.p1Name = players[0]; 
        this.p2Name = players[1];
        this.scoreP1 = 0;
        this.scoreP2 = 0;
        this.maxScore = 2;
        this.winner = '';
        this.wallThickness = this.canvas.width * 0.008;
        this.wallsColor = wallsColor;
       
        
        this.stars = [];
        this.particles = [];
        this.powerup = [];

        // Instantiate game objects
        this.ball = new Ball(this.canvas, this.ctx,this.canvas.width / 2, this.canvas.height / 2, ballColor, ballTrailColor);
        this.paddle1 = new Paddle(this.canvas, this.wallThickness + 20, 'w', 's', paddleColor);
        this.paddle2 = new Paddle(this.canvas ,this.canvas.width - this.wallThickness - 20, 'ArrowUp', 'ArrowDown', paddleColor);
        this.ui = new UI(this.p1Name, this.p2Name, this.canvas, this.ctx);
        this.screenShake = new ScreenShake();
        
        this.running = false;
        this.gamePaused = false;
        this.gameEnd = false;
        this.backToGameTimer = false;
        this.powerUpTimerStarted = false;

        //AI
        this.lastMoveTime = 0;
        this.paddle2Paused = false;

        createStarsBackground(this, 100);
        this.addEventListeners();
        //this.renderBackground();
    }
    
    start() {
        this.running = true;
        this.loop();
        matchData.timer = setInterval(updateTimer.bind(this), 1000);
    }

    loop() {
        if (this.running || (this.gameEnd && this.screenShake.shakeTimer > 0)) {
            this.update();
            this.render();
            requestAnimationFrame(() => this.loop());
        }
        
    }

    update() {
        if (!this.gamePaused && !this.gameEnd) {
            this.ball.update(this, this.paddle1, this.paddle2, this.powerup[0], this.wallThickness);
            this.paddle1.update();
            if (mode === "ai") {
                console.log("is AIII");
                if (this.ball.x > window.innerWidth / 6 && !this.paddle2Paused) {
                    this.paddle2.move_ia(this.ball, this.lastMoveTime);
                }
            }
            else
                this.paddle2.update();
            updateParticles(this);
            this.screenShake.update();
            this.ball.checkPosition(this);
            if (powerUpActive) 
                handlePowerups(this);
            checkScore(this, mode);
        }

        if (background == "space")
        {
            for (let i = 0; i < 100; i++) {
                this.stars[i].update();
            }
        }
        
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        renderBackground(this);
        this.ball.render();
        this.screenShake.update();
        this.screenShake.apply(this.ctx);
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
        renderParticles(this);
        this.screenShake.reset(this.ctx);
        if (this.gameEnd && this.screenShake.shakeTimer > 0) {
            requestAnimationFrame(() => this.render());
        }
        else if (this.gameEnd) {
            // Resetta lo screen shake quando l'effetto è terminato
            this.screenShake.reset(this.ctx);
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.wallThickness = this.canvas.width * 0.008;
        renderBackground(this);
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
        createStarsBackground(this, 100);
        this.ui.render(this, this.scoreP1, this.scoreP2); 
    }

    stop() {
        // Fermiamo il gioco
        this.running = false;
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.paddle1.handleInput(event.key, true);
            this.paddle2.handleInput(event.key, true);
            
            // Check if player pause the game
            if (event.key === 'p' || event.key === 'P') {
                if (this.gamePaused && !this.backToGameTimer) 
                    this.ui.startCountdown(this, this.gamePaused, this.backToGameTimer);
                else 
                    this.gamePaused = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            this.paddle1.handleInput(event.key, false);
            this.paddle2.handleInput(event.key, false);
        });

        backToBracketButton.addEventListener('click', (event) => {
            gameCanvas.style.display = "none";  
            backToBracketButton.hidden = true;
            sessionStorage.setItem("winner", this.winner);
            saveMatchStatsData(this.p1Name, this.p2Name, this.scoreP1, this.scoreP2);
            //resetMatchStatsData();
            navigate("/tournament/knockout/bracket", "Return from Match");
        })

        backToRobinButton.addEventListener('click', (event) => {
            gameCanvas.style.display = "none";  
            backToRobinButton.hidden = true;
            sessionStorage.setItem("winner", this.winner);
            saveMatchStatsData(this.p1Name, this.p2Name, this.scoreP1, this.scoreP2);
            //resetMatchStatsData();
            navigate("/tournament/roundrobin/robinranking", "Return from Match");
        })

        backToMenuButton.addEventListener('click', (event) => {
            gameCanvas.style.display = "none";  
            backToMenuButton.hidden = true;
            sessionStorage.setItem("winner", this.winner);
            if (mode === "classic")
                saveMatchStatsData(this.p1Name, this.p2Name, this.scoreP1, this.scoreP2);
            //resetMatchStatsData();
            navigate("/modes", "Return from Classic");
        })

        window.addEventListener('resize', () => this.resize());
        window.addEventListener("popstate", (event) => {
            clearInterval(matchData.timer);
         });
         
    } 
}

