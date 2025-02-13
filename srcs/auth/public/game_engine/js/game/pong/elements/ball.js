import { matchData } from "../data/game_global.js";
import { addParticles } from "../elements/particle.js";
export class Ball {
    constructor(canvas, ctx, x, y, color, trailColor) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.ctx = ctx;
        this.speedPercentage = 0.2;
        this.speedX = canvas.width * this.speedPercentage;
        this.speedY = canvas.width * this.speedPercentage;
        this.prevSpeedX = 0;
        this.prevSpeedY = 0;
        this.maxSpeedPercentage = 0.6;
        this.maxSpeed = canvas.width * this.maxSpeedPercentage;
        this.speedIncreaseFactor = canvas.width * 0.0001;
        this.radius = canvas.width * 0.006;
        this.color = color;
        this.trailColor = trailColor;
        this.maxAngle = Math.PI / 4;
        this.trail = [];
        this.trailLength = 1;
        this.hits = 0;
        this.hide = false;
        this.out = false;
    }

    checkPosition(game) {
        if (this.out && this.hits > matchData.longestRally)
            matchData.longestRally = this.hits; 

        // Ball goes out of screen (left side) -> set score
        if (this.x <= -10 && !this.out) {
            this.out = true;
            game.screenShake.start(20, 40);
            // Remove power-up if present
            if (game.powerup[0]) {
                game.powerup.splice(0, 1);
                game.powerUpTimerStarted = false;
            }    
            game.scoreP2++;
            //AI paddle is paused
            game.paddle2Paused = true;
           

            // Reposition ball to center
            setTimeout(() => {
                if (!this.gameEnd && game.scoreP2 < game.maxScore)
                    this.reset(2);
                this.out = false;
                 //AI paddle is unpaused
                game.paddle2Paused = false;
            }, 2000);
        } 
        // Ball goes out of screen (right side) -> set score
        else if (this.x >= game.canvas.width + 10 && !this.out) {
            this.out = true;
            game.screenShake.start(20, 40);
            if (game.powerup[0]) {
                game.powerup.splice(0, 1);
                game.powerUpTimerStarted = false;
            }
            game.scoreP1++;
            //AI paddle is paused
            game.paddle2Paused = true;
            

            // Reposition ball to center
            setTimeout(() => {
                if (!this.gameEnd && game.scoreP1 < game.maxScore)
                    this.reset(1);
                this.out = false;
                //AI paddle is unpaused
                game.paddle2Paused = false;
            }, 2000);
        }
    }
    
    update(game, paddle1, paddle2, powerup, wallThickness) {
        let relativeY;
        let bounceAngle;

       
        if (game.deltaTime > 0.1) return;
        
        this.x += this.speedX * game.deltaTime;
        this.y += this.speedY * game.deltaTime;

        //this.trail.push({ x: this.x, y: this.y }); // Save ball trail position
        //if (this.trail.length > this.trailLength) this.trail.shift(); // Remove old trail positions
        
        // Wall collisions

        //Wall down
        if (this.y + this.radius > this.canvas.height - wallThickness) {
            this.y = this.canvas.height - wallThickness - this.radius;
            this.speedY *= -1;
            addParticles(game, this.x, this.y, 30);
        }

        //Wall up
        else if(this.y - this.radius < wallThickness) {
            this.y = wallThickness + this.radius;
            this.speedY *= -1;
            addParticles(game, this.x, this.y, 30);
        }
            
         // Left Paddle collision
        if (this.collidesWith(paddle1)) {
            this.x = paddle1.x + paddle1.width + this.radius;
            this.speedX *= -1;
            this.hits++;
            relativeY = (this.y - (paddle1.y + paddle1.height / 2)) / (paddle1.height / 2)
            bounceAngle = relativeY * this.maxAngle;
            this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX)
            addParticles(game, this.x, this.y, 20); 
            if (Math.abs(this.speedX) < this.maxSpeed) {
                this.speedX *= (1 + this.speedIncreaseFactor);
                this.speedY *= (1 + this.speedIncreaseFactor);
            }
        }

        // Right Paddle collision
        else if (this.collidesWith(paddle2)) {
            this.x = paddle2.x - this.radius;
            this.speedX *= -1;
            this.hits++;
            relativeY = (this.y - (paddle2.y + paddle2.height / 2)) / (paddle2.height / 2)
            bounceAngle = relativeY * this.maxAngle;
            console.log("bounceAngle: " + bounceAngle);
            this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX)
            addParticles(game, this.x, this.y, 20);
            if (Math.abs(this.speedX) < this.maxSpeed) {
                this.speedX *= (1 + this.speedIncreaseFactor);
                this.speedY *= (1 + this.speedIncreaseFactor);
            }
        }

        if (powerup) {
            if (this.collidesWith(powerup)) {
                game.powerup.splice(0, 1);
                game.powerUpTimerStarted = false;
                if (powerup.type === "shrinker") {
                    if (this.speedX < 0)
                        paddle1.shrink();
                    else
                        paddle2.shrink();
                    setTimeout(() => {
                        paddle1.reset();
                        paddle2.reset();
                    }, 5000);
                } else if (powerup.type === "invisible") {
                    this.hide = true;
                    setTimeout(() => {
                        this.hide = false;
                    }, 1500);
                } else if (powerup.type === "teleport") {
                    this.prevSpeedX = this.speedX;
                    this.prevSpeedY = this.speedY;
                    this.y = this.respawnToRandomPos(50, this.canvas.height - 50);
                    if (this.speedX > 0) 
                        this.x = this.respawnToRandomPos(this.canvas.width / 1.5, this.canvas.width / 1.3);
                    else 
                        this.x = this.respawnToRandomPos(this.canvas.width / 3, this.canvas.width / 3.3);

                    this.speedX = 0;
                    this.speedY = 0;
            
                    setTimeout(() => {
                        this.speedX = this.prevSpeedX;
                        this.speedY = this.prevSpeedY;
                    }, 1500);
                }
            }
        }


    }

    respawnToRandomPos(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    resize(game) {

        const ballRelativeX = this.x / game.oldCanvasWidth;
        const ballRelativeY = this.y / game.oldCanvasHeight;
        const ballRelativeSpeedX = this.speedX /  game.oldCanvasWidth;
        const ballRelativeSpeedY = this.speedY / game.oldCanvasHeight;

        this.x = ballRelativeX * game.canvas.width;
        this.y = ballRelativeY * game.canvas.height;
    
        // Ricalcola la velocità della palla
        this.speedX = ballRelativeSpeedX * game.canvas.width;
        this.speedY = ballRelativeSpeedY * game.canvas.height;
        // Calculate new radius
        this.radius = game.canvas.width * 0.006;

        // Calculate new trail length
        //this.trailLength = Math.max(8, Math.floor(this.canvas.width * 0.01));
    }

    render(game) {
        if (!this.hide) {
            this.ctx.fillStyle = this.trailColor;
            for (let i = 0; i < this.trail.length; i++) {
                const pos = this.trail[i];
                const alpha = (i + 1) / this.trail.length * 0.5;
                this.ctx.globalAlpha = alpha;
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.globalAlpha = 1;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            this.ctx.closePath();
        }   
    }

    collidesWith(object) {
            return (
                this.x - this.radius < object.x + object.width &&
                this.x + this.radius > object.x &&
                this.y + this.radius > object.y &&
                this.y - this.radius < object.y + object.height
            );
    }

    reset(scorer) {
        let bounceAngle;
        this.x = this.canvas.width / 2; 
        this.y = this.canvas.height / 2; 
        this.hits = 0;
        bounceAngle = Math.random() * 0.5;
        console.log("scorer: " + scorer);
        
        this.speedX = (Math.abs(this.canvas.width * this.speedPercentage) * (scorer === 1 ? 1 : -1));
        this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX);
        //this.speedY = (Math.random() * - 1);
    }   
}