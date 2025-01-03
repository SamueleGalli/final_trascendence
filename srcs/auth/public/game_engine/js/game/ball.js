export class Ball {
    constructor(canvas, ctx, x, y) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.speedX = this.canvas.width * 0.005;
        this.speedY = this.canvas.width * 0.005;
        this.maxSpeed = this.canvas.width * 0.01;
        this.speedIncreaseFactor = this.canvas.width * 0.0001;
        this.radius = this.canvas.width * 0.006;
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

        // Wall down
        if (this.y + this.radius > this.canvas.height - pong.wallThickness) {
            this.y = this.canvas.height - pong.wallThickness - this.radius;
            this.speedY *= -1;
            pong.addParticles(this.x, this.y, 30);
        }

        // Wall up
        else if (this.y - this.radius < pong.wallThickness) {
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
            this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX);
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
            this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX);
            pong.addParticles(this.x, this.y, 20);
            if (Math.abs(this.speedX) < this.maxSpeed) {
                this.speedX *= (1 + this.speedIncreaseFactor);
                this.speedY *= (1 + this.speedIncreaseFactor);
            }
        }
    }

    resize() {
        // Reposition ball based on new canvas size
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;

        // Calculate new speed
        this.speedX = this.canvas.width * 0.005;
        this.speedY = this.canvas.width * 0.005;

        // Calculate new radius
        this.radius = this.canvas.width * 0.006;

        // Calculate new trail length
        this.trailLength = Math.max(8, Math.floor(this.canvas.width * 0.01));
    }

    render() {
        for (let i = 0; i < this.trail.length; i++) {
            const pos = this.trail[i];
            const alpha = (i + 1) / this.trail.length * 0.5;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#014C4A';
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    
        this.ctx.globalAlpha = 1;
    
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
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
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;

        bounceAngle = Math.random() * 1.6 - 0.8;
    
        this.speedX = (Math.abs(this.canvas.width * 0.005) * (scorer === 1 ? 1 : -1));

        //this.speedY = (Math.random() * - 1);
        this.speedY = Math.sin(bounceAngle) * Math.abs(this.speedX);
    }
}