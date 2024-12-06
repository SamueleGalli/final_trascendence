import { canvas, ctx } from './globals.js';

export class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = canvas.width * 0.005;
        this.speedY = canvas.width * 0.005;
        this.maxSpeed = canvas.width * 0.01;
        this.speedIncreaseFactor = canvas.width * 0.0001;
        this.radius = canvas.width * 0.006;
        this.maxAngle = Math.PI / 4;
        this.trail = [];
        this.trailLength = 8;
        this.out = false;
    }
    
    update(pong) {
        let relativeY;
        let bounceAngle;
        
        this.x += this.speedX;
        this.y += this.speedY;

        this.trail.push({ x: this.x, y: this.y }); // Save ball trail position
        if (this.trail.length > this.trailLength) this.trail.shift(); // Remove old trail positions
        
        // Wall collisions

        //Wall down
        if (this.y + this.radius > canvas.height - pong.wallThickness) {
            this.y = canvas.height - pong.wallThickness - this.radius;
            this.speedY *= -1;
            pong.addParticles(this.x, this.y, 30);
        }

        //Wall up
        else if(this.y - this.radius < pong.wallThickness) {
            this.y = pong.wallThickness + this.radius;
            this.speedY *= -1;
            pong.addParticles(this.x, this.y, 30);
        }
            
         // Left Paddle collision
        if (this.collidesWith(pong.paddle1)) {
            this.x = pong.paddle1.x + pong.paddle1.width + this.radius;
            this.speedX *= -1;
            relativeY = (this.y - (pong.paddle1.y + pong.paddle1.height / 2)) / (pong.paddle1.height / 2)
            bounceAngle = relativeY * this.maxAngle;
            this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX)
            pong.addParticles(this.x, this.y, 20); 
            if (Math.abs(this.speedX) < this.maxSpeed) {
                this.speedX *= (1 + this.speedIncreaseFactor);
                this.speedY *= (1 + this.speedIncreaseFactor);
            }
          
        }

        // Right Paddle collision
        else if (this.collidesWith(pong.paddle2)) {
            this.x = pong.paddle2.x - this.radius;
            this.speedX *= -1;
            relativeY = (this.y - (pong.paddle2.y + pong.paddle2.height / 2)) / (pong.paddle2.height / 2)
            bounceAngle = relativeY * this.maxAngle;
            console.log("bounceAngle: " + bounceAngle);
            this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX)
            pong.addParticles(this.x, this.y, 20);
            if (Math.abs(this.speedX) < this.maxSpeed) {
                this.speedX *= (1 + this.speedIncreaseFactor);
                this.speedY *= (1 + this.speedIncreaseFactor);
            }
        }

    }

    resize() {

        // Reposition ball based on new canvas size
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        // Calculate new speed
        this.speedX = canvas.width * 0.005;
        this.speedY = canvas.width * 0.005;
        // Calculate new radius
        this.radius = canvas.width * 0.006;

        // Calculate new trail length
        this.trailLength = Math.max(8, Math.floor(canvas.width * 0.01));
    }

    render() {
        for (let i = 0; i < this.trail.length; i++) {
        const pos = this.trail[i];
        const alpha = (i + 1) / this.trail.length * 0.5;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    collidesWith(paddle) {
        return (
            this.x - this.radius < paddle.x + paddle.width &&
            this.x + this.radius > paddle.x &&
            this.y + this.radius > paddle.y &&
            this.y - this.radius < paddle.y + paddle.height
        );
    }

    reset(scorer) {
        let bounceAngle;
        this.x = canvas.width / 2; 
        this.y = canvas.height / 2; 
        
        bounceAngle = Math.random() * 1.6 - 0.8;
        //console.log("scorer: " + scorer);
        
        this.speedX = (Math.abs(canvas.width * 0.005) * (scorer === 1 ? 1 : -1));
       
        //this.speedY = (Math.random() * - 1);
        this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX);
    }
}