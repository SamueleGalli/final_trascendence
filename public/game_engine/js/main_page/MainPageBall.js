import { mainPageCanvas, mainPageCtx, mainPageEffect } from './MainPageEffect.js';
import { MainPageParticle } from './MainPageParticle.js';
export class MainPageBall { // Rinominato Ball a MainPageBall
    constructor() {
        this.x = mainPageCanvas.width / 2;
        this.y = mainPageCanvas.height / 2;
        this.radius = mainPageCanvas.width * 0.01;
        this.speedX = 3;
        this.speedY = 3;
        this.maxSpeed = 10;
        this.speedIncreaseFactor = 0.1;
        this.maxAngle = Math.PI / 4;
        this.trail = [];
        this.trailLength = Math.floor(mainPageCanvas.width * 0.01);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) this.trail.shift();
    
        if (this.y + this.radius > mainPageCanvas.height - 10) {
            this.y = mainPageCanvas.height - 10 - this.radius;
            this.speedY *= -1;
            this.addParticles(this.x, this.y, 30);
        } else if (this.y - this.radius < 10) {
            this.y = 10 + this.radius;
            this.speedY *= -1;
            this.addParticles(this.x, this.y, 30);
        }
    
        if (this.x + this.radius > mainPageCanvas.width - 10) {
            this.x = mainPageCanvas.width - 10 - this.radius;
            this.speedX *= -1;
            this.addParticles(this.x, this.y, 30);
        } else if (this.x - this.radius < 10) {
            this.x = 10 + this.radius;
            this.speedX *= -1;
            this.addParticles(this.x, this.y, 30);
        }
    }       

    addParticles(x, y, count) {
        for (let i = 0; i < count; i++) {
            const particle = new MainPageParticle(x, y);
            particle.size = Math.random() * 4 + 4;
            particle.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
            particle.spreadX = (Math.random() - 0.5) * 10;
            particle.spreadY = (Math.random() - 0.5) * 10;
            mainPageEffect.particles.push(particle);
        }
    }

    render() {
        for (let i = 0; i < this.trail.length; i++) {
            const pos = this.trail[i];
            const alpha = (i + 1) / this.trail.length * 0.5;
            mainPageCtx.globalAlpha = alpha;
    
            mainPageCtx.fillStyle = "#014C4A"; 
            mainPageCtx.shadowColor = "#014C4A";
            mainPageCtx.shadowBlur = 20;
    
            mainPageCtx.beginPath();
            mainPageCtx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
            mainPageCtx.fill();
        }
        mainPageCtx.globalAlpha = 1;
        
        mainPageCtx.fillStyle = 'white';
        mainPageCtx.shadowColor = 'white';
        mainPageCtx.shadowBlur = 20;
        mainPageCtx.beginPath();
        mainPageCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        mainPageCtx.fill();
        mainPageCtx.closePath();
    }

    resize() {
        this.radius = mainPageCanvas.width * 0.01;
        this.trailLength = Math.max(8, Math.floor(mainPageCanvas.width * 0.01));
    }

    reset() {
        this.x = mainPageCanvas.width / 2;
        this.y = mainPageCanvas.height / 2;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * 3;
        this.speedY = (Math.random() > 0.5 ? 1 : -1) * 3;
    }
}