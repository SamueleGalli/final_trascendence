import { MainPageBall } from './MainPageBall.js';
import { MainPageParticle } from './MainPageParticle.js';
import { MainPageMovingStar } from './MainPageMovingStar.js';

export const mainPageCanvas = document.getElementById('main_pageCanvas');
export const mainPageCtx = mainPageCanvas.getContext('2d');

export class MainPageEffect { // Rinominato MainPageEffect a MainPageEffect
    constructor() {
        this.mainPageCanvas = mainPageCanvas;
        this.mainPageCtx = mainPageCtx;
        this.mainPageCanvas.width = window.innerWidth;
        this.mainPageCanvas.height = window.innerHeight;
        this.particles = [];
        this.stars = [];
        this.ball = new MainPageBall();
        this.mouseX = 0;
        this.mouseY = 0;
        this.running = false;

        this.createStarsBackground(100);
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.addParticles(this.mouseX, this.mouseY, 1);
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
        this.updateParticles();
        this.ball.update();
        this.stars.forEach(star => star.update());
    }

    render() {
        this.mainPageCtx.clearRect(0, 0, mainPageCanvas.width, mainPageCanvas.height);
        this.stars.forEach(star => star.render(this.mainPageCtx));
        this.ball.render(this.mainPageCtx);
        this.renderParticles();
        this.renderWalls();
    }

    addParticles(x, y, count) {
        for (let i = 0; i < count; i++) {
            const particle = new MainPageParticle(x, y);
            particle.speedX = (Math.random() - 0.5) * 6;
            particle.speedY = (Math.random() - 0.5) * 6;
            particle.hue = Math.random() * 360;
            mainPageEffect.particles.push(particle);
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update() || this.particles.splice(i, 1);
        }
    }

    renderParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].render(this.mainPageCtx);
        }
    }

    renderWalls() {
        this.wallThickness = 15; // Imposta lo spessore del muro
    
        this.mainPageCtx.fillStyle = "#014C4A";
        this.mainPageCtx.shadowColor = "#014C4A";
        this.mainPageCtx.shadowBlur = 20;
    
        // Muri superiori e inferiori con ombra
        this.mainPageCtx.fillRect(10, 0, mainPageCanvas.width - 20, this.wallThickness); // muro superiore
        this.mainPageCtx.fillRect(10, mainPageCanvas.height - this.wallThickness, mainPageCanvas.width - 20, this.wallThickness); // muro inferiore
        
        // Muri laterali con ombra
        this.mainPageCtx.fillRect(0, 0, this.wallThickness, mainPageCanvas.height); // muro sinistro
        this.mainPageCtx.fillRect(mainPageCanvas.width - this.wallThickness, 0, this.wallThickness, mainPageCanvas.height); // muro destro
    }    

    createStarsBackground(starCount) {
        for (let i = 0; i < starCount; i++) {
            this.stars.push(new MainPageMovingStar());
        }
    }

    resize() {
        this.mainPageCanvas.width = window.innerWidth;
        this.mainPageCanvas.height = window.innerHeight;
        this.ball.resize();
        this.stars = [];
        this.createStarsBackground(100);
    }

    stop() {
        this.running = false;
    }
}

export const mainPageEffect = new MainPageEffect();
mainPageEffect.start();