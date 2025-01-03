import { mainPageCanvas } from './MainPageEffect.js';

export class MainPageMovingStar { // Rinominato MovingStar a MainPageMovingStar
    constructor() {
        this.x = Math.random() * mainPageCanvas.width;
        this.y = Math.random() * mainPageCanvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.alpha = Math.random() * 0.5 + 0.5;
        this.color = `rgba(255, 255, 255, ${this.alpha})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > mainPageCanvas.width) this.x = 0;
        if (this.x < 0) this.x = mainPageCanvas.width;
        if (this.y > mainPageCanvas.height) this.y = 0;
        if (this.y < 0) this.y = mainPageCanvas.height;
    }

    render(mainPageCtx) {
        mainPageCtx.fillStyle = this.color;
        mainPageCtx.beginPath();
        mainPageCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        mainPageCtx.fill();
    }
}