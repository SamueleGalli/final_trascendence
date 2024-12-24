import { MainPageBall } from './MainPageBall.js';
import { MainPageParticle } from './MainPageParticle.js';
import { MainPageMovingStar } from './MainPageMovingStar.js';

export const mainPageCanvas = document.getElementById('main_pageCanvas');
export const mainPageCtx = mainPageCanvas.getContext('2d');

export class MainPageEffect {
    constructor() {
        this.mainPageCanvas = document.getElementById('main_pageCanvas');
        if (!this.mainPageCanvas) {
            console.error('Canvas not found');
            return;
        }
        this.mainPageCtx = this.mainPageCanvas.getContext('2d');
        if (!this.mainPageCtx) {
            console.error('Canvas context not found');
            return;
        }

        this.mainPageCanvas.width = window.innerWidth;
        this.mainPageCanvas.height = window.innerHeight;

        this.particles = [];
        this.maxParticles = 100;
        this.stars = [];
        this.ball = new MainPageBall(this.mainPageCanvas, this.mainPageCtx, this);
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
            this.animationFrame = requestAnimationFrame(() => this.loop());
        }
    }

    clearResources() {
        this.particles = [];
        this.stars = [];
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
        if (this.particles.length > 1000) return;
        for (let i = 0; i < count; i++) {
            const particle = new MainPageParticle(x, y);
            particle.size = Math.random() * 2 + 2;
            particle.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
            particle.spreadX = (Math.random() - 0.5) * 5;
            particle.spreadY = (Math.random() - 0.5) * 5;
            this.particles.push(particle);
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
        this.wallThickness = 15;

        this.mainPageCtx.fillStyle = "#014C4A";
        this.mainPageCtx.shadowColor = "#014C4A";
        this.mainPageCtx.shadowBlur = 20;

        this.mainPageCtx.fillRect(10, 0, mainPageCanvas.width - 20, this.wallThickness);
        this.mainPageCtx.fillRect(10, mainPageCanvas.height - this.wallThickness, mainPageCanvas.width - 20, this.wallThickness);

        this.mainPageCtx.fillRect(0, 0, this.wallThickness, mainPageCanvas.height);
        this.mainPageCtx.fillRect(mainPageCanvas.width - this.wallThickness, 0, this.wallThickness, mainPageCanvas.height);
    }

    createStarsBackground(starCount) {
        for (let i = 0; i < starCount; i++) {
            this.stars.push(new MainPageMovingStar(this.mainPageCanvas, this.mainPageCtx));
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